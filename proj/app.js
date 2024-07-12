// Firebase configuration
var firebaseConfig = {
eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee}  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  const db = firebase.firestore();
  
  // DOM Elements
  const loginForm = document.getElementById('login-form');
  const addRestaurantForm = document.getElementById('add-restaurant-form');
  const addMenuItemForm = document.getElementById('add-menu-item-form');
  const loginSection = document.getElementById('login-section');
  const dashboardSection = document.getElementById('dashboard-section');
  const addRestaurantSection = document.getElementById('add-restaurant-section');
  const addMenuSection = document.getElementById('add-menu-section');
  const menuItemsList = document.getElementById('menu-items-list');
  const loginLink = document.getElementById('login-link');
  const dashboardLink = document.getElementById('dashboard-link');
  
  // Handle Login
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
  
    auth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        loginSection.style.display = 'none';
        dashboardSection.style.display = 'block';
        loginLink.style.display = 'none';
        dashboardLink.style.display = 'inline';
        console.log('Logged in');
      })
      .catch((error) => {
        console.error('Error logging in: ', error);
      });
  });
  
  // Add Restaurant
  addRestaurantForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('restaurant-name').value;
    const address = document.getElementById('restaurant-address').value;
    const cuisine = document.getElementById('restaurant-cuisine').value;
    const user = auth.currentUser;
  
    db.collection('restaurants').doc(user.uid).set({
      name,
      address,
      cuisine,
      owner: user.uid
    })
    .then(() => {
      console.log('Restaurant added');
      addRestaurantSection.style.display = 'none';
      addMenuSection.style.display = 'block';
    })
    .catch((error) => {
      console.error('Error adding restaurant: ', error);
    });
  });
  
  // Add Menu Item
  addMenuItemForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const itemName = document.getElementById('item-name').value;
    const itemDescription = document.getElementById('item-description').value;
    const itemCalories = document.getElementById('item-calories').value;
    const itemDate = document.getElementById('item-date').value;
    const itemVeg = document.getElementById('item-veg').value;
    const itemImage = document.getElementById('item-image').value;
    const user = auth.currentUser;
  
    db.collection('restaurants').doc(user.uid).collection('menuItems').add({
      name: itemName,
      description: itemDescription,
      calories: itemCalories,
      date: itemDate,
      veg: itemVeg,
      image: itemImage
    })
    .then((docRef) => {
      console.log('Menu item added with ID: ', docRef.id);
      renderMenuItem(docRef.id, {
        name: itemName,
        description: itemDescription,
        calories: itemCalories,
        date: itemDate,
        veg: itemVeg,
        image: itemImage
      });
    })
    .catch((error) => {
      console.error('Error adding menu item: ', error);
    });
  });
  
  // Render Menu Item
  function renderMenuItem(id, item) {
    const li = document.createElement('li');
    li.innerHTML = `
      <div class="tilt" data-tilt>
        <h4>${item.name}</h4>
        <p>${item.description}</p>
        <p>Calories: ${item.calories}</p>
        <p>Date: ${item.date}</p>
        <p>${item.veg === 'veg' ? '🌱' : '🍖'}</p>
        <img src="${item.image}" alt="${item.name}" width="100">
      </div>
    `;
    menuItemsList.appendChild(li);
  
    // Initialize Vanilla Tilt
    VanillaTilt.init(li.querySelector('.tilt'), {
      max: 25,
      speed: 400
    });
  }
  