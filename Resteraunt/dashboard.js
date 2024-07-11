const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
  };
  
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  const storage = firebase.storage();
  
  const restaurantForm = document.getElementById('restaurant-form');
  const menuForm = document.getElementById('menu-form');
  const restaurantsList = document.getElementById('restaurants');
  const menuRestaurantSelect = document.getElementById('menu-restaurant');
  
  let editRestaurantId = null;
  let editMenuItemId = null;
  
  restaurantForm.addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const name = document.getElementById('name').value;
    const cuisine = document.getElementById('cuisine').value;
    const rating = document.getElementById('rating').value;
    const reviews = document.getElementById('reviews').value;
    const image = document.getElementById('image').files[0];
    const vegIndicator = document.getElementById('veg-indicator').value;
  
    let imageUrl = '';
    if (image) {
      const storageRef = storage.ref(`restaurants/${image.name}`);
      await storageRef.put(image);
      imageUrl = await storageRef.getDownloadURL();
    }
  
    const restaurantData = {
      name,
      cuisine,
      rating: parseFloat(rating),
      reviews: parseInt(reviews),
      vegIndicator,
    };
  
    if (imageUrl) {
      restaurantData.imageUrl = imageUrl;
    }
  
    try {
      if (editRestaurantId) {
        await db.collection('restaurants').doc(editRestaurantId).update(restaurantData);
        editRestaurantId = null;
      } else {
        await db.collection('restaurants').add(restaurantData);
      }
  
      alert('Restaurant details saved successfully!');
      restaurantForm.reset();
      loadRestaurants();
    } catch (error) {
      console.error('Error saving restaurant details:', error);
      alert('Failed to save restaurant details. Please try again.');
    }
  });
  
  menuForm.addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const restaurantId = document.getElementById('menu-restaurant').value;
    const name = document.getElementById('menu-name').value;
    const description = document.getElementById('menu-description').value;
    const calories = document.getElementById('menu-calories').value;
    const price = document.getElementById('menu-price').value;
  
    const menuItemData = {
      name,
      description,
      calories: parseInt(calories),
      price: parseFloat(price),
    };
  
    try {
      if (editMenuItemId) {
        await db.collection('restaurants').doc(restaurantId).collection('menu').doc(editMenuItemId).update(menuItemData);
        editMenuItemId = null;
      } else {
        await db.collection('restaurants').doc(restaurantId).collection('menu').add(menuItemData);
      }
  
      alert('Menu item saved successfully!');
      menuForm.reset();
      loadRestaurants();
    } catch (error) {
      console.error('Error saving menu item:', error);
      alert('Failed to save menu item. Please try again.');
    }
  });
  
  async function loadRestaurants() {
    restaurantsList.innerHTML = '';
    menuRestaurantSelect.innerHTML = '';
  
    const snapshot = await db.collection('restaurants').get();
    snapshot.forEach(doc => {
      const restaurant = doc.data();
      const restaurantId = doc.id;
  
      const li = document.createElement('li');
      li.innerHTML = `
        <h3>${restaurant.name}</h3>
        <p>Cuisine: ${restaurant.cuisine}</p>
        <p>Rating: ${restaurant.rating}</p>
        <p>Reviews: ${restaurant.reviews}</p>
        <p>Veg/Non-Veg: ${restaurant.vegIndicator}</p>
        ${restaurant.imageUrl ? `<img src="${restaurant.imageUrl}" alt="${restaurant.name} image" style="width:100%;height:auto;">` : ''}
        <button onclick="editRestaurant('${restaurantId}', '${restaurant.name}', '${restaurant.cuisine}', '${restaurant.rating}', '${restaurant.reviews}', '${restaurant.vegIndicator}')">Edit</button>
        <button onclick="deleteRestaurant('${restaurantId}')">Delete</button>
        <ul id="menu-${restaurantId}"></ul>
      `;
      restaurantsList.appendChild(li);
  
      loadMenuItems(restaurantId);
  
      const option = document.createElement('option');
      option.value = restaurantId;
      option.textContent = restaurant.name;
      menuRestaurantSelect.appendChild(option);
    });
  }
  
  async function loadMenuItems(restaurantId) {
    const menuList = document.getElementById(`menu-${restaurantId}`);
    const snapshot = await db.collection('restaurants').doc(restaurantId).collection('menu').get();
    snapshot.forEach(doc => {
      const menuItem = doc.data();
      const menuItemId = doc.id;
  
      const li = document.createElement('li');
      li.innerHTML = `
        <p>${menuItem.name} - ${menuItem.description} - ${menuItem.calories} calories - $${menuItem.price}</p>
        <button onclick="editMenuItem('${restaurantId}', '${menuItemId}', '${menuItem.name}', '${menuItem.description}', '${menuItem.calories}', '${menuItem.price}')">Edit</button>
        <button onclick="deleteMenuItem('${restaurantId}', '${menuItemId}')">Delete</button>
      `;
      menuList.appendChild(li);
    });
  }
  
  function editRestaurant(id, name, cuisine, rating, reviews, vegIndicator) {
    document.getElementById('name').value = name;
    document.getElementById('cuisine').value = cuisine;
    document.getElementById('rating').value = rating;
    document.getElementById('reviews').value = reviews;
    document.getElementById('veg-indicator').value = vegIndicator;
    editRestaurantId = id;
  }
  
  function editMenuItem(restaurantId, menuItemId, name, description, calories, price) {
    document.getElementById('menu-restaurant').value = restaurantId;
    document.getElementById('menu-name').value = name;
    document.getElementById('menu-description').value = description;
    document.getElementById('menu-calories').value = calories;
    document.getElementById('menu-price').value = price;
    editMenuItemId = menuItemId;
  }
  
  async function deleteRestaurant(id) {
    if (confirm('Are you sure you want to delete this restaurant?')) {
      await db.collection('restaurants').doc(id).delete();
      loadRestaurants();
    }
  }
  
  async function deleteMenuItem(restaurantId, menuItemId) {
    if (confirm('Are you sure you want to delete this menu item?')) {
      await db.collection('restaurants').doc(restaurantId).collection('menu').doc(menuItemId).delete();
      loadRestaurants();
    }
  }
  
  loadRestaurants();
  