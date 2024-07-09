AOS.init();

const menuData = {
  'Italian Bistro': [
    { name: 'Veg Pasta', description: 'Delicious veg pasta', calories: '200 Kcal', date: '2024-07-09', image: 'https://via.placeholder.com/100x100' },
    { name: 'Non-Veg Pizza', description: 'Delicious non-veg pizza', calories: '300 Kcal', date: '2024-07-09', image: 'https://via.placeholder.com/100x100' },
  ],
  'Chinese Delight': [
    { name: 'Veg Noodles', description: 'Delicious veg noodles', calories: '250 Kcal', date: '2024-07-09', image: 'https://via.placeholder.com/100x100' },
    { name: 'Non-Veg Manchurian', description: 'Delicious non-veg manchurian', calories: '350 Kcal', date: '2024-07-09', image: 'https://via.placeholder.com/100x100' },
  ],
  'Indian Spice': [
    { name: 'Paneer Butter Masala', description: 'Delicious paneer butter masala', calories: '400 Kcal', date: '2024-07-09', image: 'https://via.placeholder.com/100x100' },
    { name: 'Chicken Tikka', description: 'Delicious chicken tikka', calories: '450 Kcal', date: '2024-07-09', image: 'https://via.placeholder.com/100x100' },
  ],
  'Mexican Fiesta': [
    { name: 'Veg Tacos', description: 'Delicious veg tacos', calories: '300 Kcal', date: '2024-07-09', image: 'https://via.placeholder.com/100x100' },
    { name: 'Non-Veg Burritos', description: 'Delicious non-veg burritos', calories: '500 Kcal', date: '2024-07-09', image: 'https://via.placeholder.com/100x100' },
  ],
};

function filterByCuisine(cuisine) {
  const cards = document.querySelectorAll('.restaurant-card');
  cards.forEach(card => {
    if (cuisine === 'all' || card.dataset.cuisine === cuisine) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

function filterVegNonVeg(type) {
  const cards = document.querySelectorAll('.restaurant-card');
  cards.forEach(card => {
    if (card.dataset.veg === type) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}

function showRestaurantMenu(name, address, image, timings, distance, vegType) {
  const restaurantMenu = document.getElementById('restaurant-menu');
  const mainContent = document.getElementById('main-content');
  const restaurantName = document.getElementById('restaurant-name');
  const restaurantAddress = document.getElementById('restaurant-address');
  const restaurantImage = document.getElementById('restaurant-image');
  const restaurantTimings = document.getElementById('restaurant-timings');
  const restaurantDistance = document.getElementById('restaurant-distance');
  const menuItems = document.querySelector('.menu-items');

  mainContent.style.display = 'none';
  restaurantMenu.style.display = 'block';

  restaurantName.textContent = name;
  restaurantAddress.textContent = address;
  restaurantImage.src = image;
  restaurantTimings.textContent = timings;
  restaurantDistance.textContent = distance;

  menuItems.innerHTML = '';
  const menu = menuData[name];
  menu.forEach(item => {
    const menuItem = document.createElement('div');
    menuItem.className = 'menu-item';
    menuItem.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="menu-item-info">
        <h3>${item.name}</h3>
        <p>${item.description}</p>
        <p>${item.calories}</p>
      </div>
      <button class="add-to-cart" onclick="addToCart('${item.name}', '${item.description}', '${item.calories}', '${item.image}', '${item.date}')">Add to Cart</button>
    `;
    menuItems.appendChild(menuItem);
  });
}

function goBack() {
  const restaurantMenu = document.getElementById('restaurant-menu');
  const mainContent = document.getElementById('main-content');
  restaurantMenu.style.display = 'none';
  mainContent.style.display = 'block';
}

function addToCart(name, description, calories, image, date) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.push({ name, description, calories, image, date });
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  document.querySelector('.cart-count').textContent = cart.length;
}

function goToCart() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  alert(JSON.stringify(cart, null, 2));
}

window.onload = updateCartCount;
