document.addEventListener('DOMContentLoaded', function () {
  AOS.init();

  const vegIcon = document.getElementById('veg-icon');
  const nonVegIcon = document.getElementById('nonveg-icon');
  const cuisineSelect = document.getElementById('cuisine');
  const restaurantCards = document.querySelectorAll('.restaurant-card');

  vegIcon.addEventListener('click', function () {
    toggleVegSelection('veg');
  });

  nonVegIcon.addEventListener('click', function () {
    toggleVegSelection('nonveg');
  });

  cuisineSelect.addEventListener('change', filterRestaurants);

  function toggleVegSelection(type) {
    if (type === 'veg') {
      vegIcon.classList.toggle('selected');
      nonVegIcon.classList.remove('selected');
    } else {
      nonVegIcon.classList.toggle('selected');
      vegIcon.classList.remove('selected');
    }
    filterRestaurants();
  }

  function filterRestaurants() {
    const selectedCuisine = cuisineSelect.value;
    const isVegSelected = vegIcon.classList.contains('selected');
    const isNonVegSelected = nonVegIcon.classList.contains('selected');

    restaurantCards.forEach(card => {
      const cuisine = card.getAttribute('data-cuisine');
      const veg = card.getAttribute('data-veg');

      let isVisible = true;

      if (selectedCuisine !== 'all' && cuisine !== selectedCuisine) {
        isVisible = false;
      }

      if (isVegSelected && veg !== 'veg') {
        isVisible = false;
      }

      if (isNonVegSelected && veg !== 'nonveg') {
        isVisible = false;
      }

      if (isVisible) {
        card.style.display = 'block';
      } else {
        card.style.display = 'none';
      }
    });
  }

  window.showRestaurantMenu = function (name, address, image, timings, distance) {
    document.getElementById('main-content').style.display = 'none';
    document.getElementById('restaurant-menu').style.display = 'block';
    document.getElementById('restaurant-name').innerText = name;
    document.getElementById('restaurant-address').innerText = address;
    document.getElementById('restaurant-timings').innerText = timings;
    document.getElementById('restaurant-distance').innerText = distance;
    document.getElementById('restaurant-image').src = image;

    // Dynamically add menu items
    const menuItems = [
      { name: 'Veg Dish 1', description: 'Delicious veg dish', calories: '200 Kcal', date: '2024-07-09', image: 'https://via.placeholder.com/100x100' },
      { name: 'Non-Veg Dish 1', description: 'Delicious non-veg dish', calories: '300 Kcal', date: '2024-07-09', image: 'https://via.placeholder.com/100x100' },
      // Add more items as needed
    ];

    const menuContainer = document.querySelector('.menu-items');
    menuContainer.innerHTML = '';

    menuItems.forEach(item => {
      const menuItem = document.createElement('div');
      menuItem.classList.add('menu-item');

      const itemInfo = `
        <img src="${item.image}" alt="${item.name}">
        <div class="menu-item-info">
          <h3>${item.name}</h3>
          <p>${item.description}</p>
          <p>${item.calories}</p>
          <p>Date made: ${item.date}</p>
        </div>
        <button class="add-to-cart" onclick="addToCart('${item.name}')">Add to Cart</button>
      `;

      menuItem.innerHTML = itemInfo;
      menuContainer.appendChild(menuItem);
    });
  };

  window.goBack = function () {
    document.getElementById('main-content').style.display = 'block';
    document.getElementById('restaurant-menu').style.display = 'none';
  };

  window.addToCart = function (itemName) {
    alert(`${itemName} added to cart!`);
  };
});
