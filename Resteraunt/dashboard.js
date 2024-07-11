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
const messaging = firebase.messaging();

document.addEventListener('DOMContentLoaded', () => {
  const onboardingForm = document.getElementById('onboardingForm');
  const dashboardSection = document.getElementById('dashboard');
  const addItemBtn = document.getElementById('addItemBtn');
  const itemModal = document.getElementById('itemModal');
  const closeModal = document.querySelector('.close');
  const itemForm = document.getElementById('itemForm');
  const menuItemsContainer = document.getElementById('menuItemsContainer');

  onboardingForm.addEventListener('submit', handleOnboarding);
  addItemBtn.addEventListener('click', showItemModal);
  closeModal.addEventListener('click', hideItemModal);
  itemForm.addEventListener('submit', saveItem);

  loadMenuItems();

  function handleOnboarding(event) {
    event.preventDefault();
    const restaurantName = onboardingForm.restaurantName.value;
    const restaurantAddress = onboardingForm.restaurantAddress.value;
    const restaurantImage = onboardingForm.restaurantImage.files[0];

    const storageRef = storage.ref(`restaurants/${restaurantImage.name}`);
    storageRef.put(restaurantImage).then(() => {
      storageRef.getDownloadURL().then((url) => {
        db.collection('restaurants').add({
          name: restaurantName,
          address: restaurantAddress,
          image: url
        }).then(() => {
          alert('Restaurant added successfully!');
          onboardingForm.reset();
          onboardingForm.style.display = 'none';
          dashboardSection.style.display = 'block';
        });
      });
    });
  }

  function showItemModal() {
    itemModal.style.display = 'block';
  }

  function hideItemModal() {
    itemModal.style.display = 'none';
    itemForm.reset();
  }

  function saveItem(event) {
    event.preventDefault();
    const itemId = itemForm.itemId.value;
    const itemName = itemForm.itemName.value;
    const itemDescription = itemForm.itemDescription.value;
    const itemCalories = itemForm.itemCalories.value;
    const itemPrice = itemForm.itemPrice.value;
    const itemImage = itemForm.itemImage.files[0];
    const itemVeg = itemForm.itemVeg.value;

    if (itemId) {
      db.collection('menuItems').doc(itemId).update({
        name: itemName,
        description: itemDescription,
        calories: itemCalories,
        price: itemPrice,
        veg: itemVeg
      }).then(() => {
        if (itemImage) {
          const storageRef = storage.ref(`menuItems/${itemImage.name}`);
          storageRef.put(itemImage).then(() => {
            storageRef.getDownloadURL().then((url) => {
              db.collection('menuItems').doc(itemId).update({ image: url }).then(() => {
                alert('Item updated successfully!');
                hideItemModal();
                loadMenuItems();
              });
            });
          });
        } else {
          alert('Item updated successfully!');
          hideItemModal();
          loadMenuItems();
        }
      });
    } else {
      const storageRef = storage.ref(`menuItems/${itemImage.name}`);
      storageRef.put(itemImage).then(() => {
        storageRef.getDownloadURL().then((url) => {
          db.collection('menuItems').add({
            name: itemName,
            description: itemDescription,
            calories: itemCalories,
            price: itemPrice,
            image: url,
            veg: itemVeg
          }).then(() => {
            alert('Item added successfully!');
            hideItemModal();
            loadMenuItems();
          });
        });
      });
    }
  }

  function loadMenuItems() {
    menuItemsContainer.innerHTML = '';
    db.collection('menuItems').get().then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const item = doc.data();
        const itemElement = document.createElement('div');
        itemElement.classList.add('menu-item');
        itemElement.innerHTML = `
          <div>
            <h3>${item.name}</h3>
            <p>${item.description}</p>
            <p>${item.calories} Calories</p>
            <p>$${item.price}</p>
            <span class="veg-indicator ${item.veg === 'veg' ? 'veg' : 'non-veg'}"></span>
          </div>
          <button onclick="editItem('${doc.id}', '${item.name}', '${item.description}', '${item.calories}', '${item.price}', '${item.veg}', '${item.image}')">Edit</button>
        `;
        menuItemsContainer.appendChild(itemElement);
      });
    });
  }

  window.editItem = (id, name, description, calories, price, veg, image) => {
    showItemModal();
    itemForm.itemId.value = id;
    itemForm.itemName.value = name;
    itemForm.itemDescription.value = description;
    itemForm.itemCalories.value = calories;
    itemForm.itemPrice.value = price;
    itemForm.itemVeg.value = veg;
  };

  messaging.onMessage((payload) => {
    console.log('Message received. ', payload);
    const notificationTitle = 'Restaurant Dashboard';
    const notificationOptions = {
      body: payload.notification.body,
      icon: payload.notification.icon
    };

    if (Notification.permission === 'granted') {
      navigator.serviceWorker.getRegistration().then((reg) => {
        reg.showNotification(notificationTitle, notificationOptions);
      });
    }
  });

  setInterval(() => {
    const now = new Date();
    if (now.getHours() === 16 && now.getMinutes() === 0) {
      messaging.getToken({ vapidKey: 'YOUR_VAPID_KEY' }).then((currentToken) => {
        if (currentToken) {
          db.collection('restaurants').get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              const restaurant = doc.data();
              const payload = {
                notification: {
                  title: 'Upload Food Items',
                  body: `Please upload your food items for the day, ${restaurant.name}!`,
                  icon: 'your-icon-url'
                }
              };

              fetch('https://fcm.googleapis.com/fcm/send', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `key=YOUR_SERVER_KEY`
                },
                body: JSON.stringify({
                  to: currentToken,
                  notification: payload.notification
                })
              }).then((response) => {
                if (response.ok) {
                  console.log('Notification sent successfully');
                } else {
                  console.log('Failed to send notification');
                }
              });
            });
          });
        } else {
          console.log('No registration token available. Request permission to generate one.');
        }
      }).catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
      });
    }
  }, 60000);
});
