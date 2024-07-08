document.addEventListener('DOMContentLoaded', function () {
    AOS.init();
    VanillaTilt.init(document.querySelectorAll("[data-tilt]"), {
        max: 25,
        speed: 400
    });

    var firebaseConfig = {
//add
}
    firebase.initializeApp(firebaseConfig);
    var database = firebase.database();

    database.ref('listings').on('value', function (snapshot) {
        var listingsContainer = document.querySelector('.listings');
        listingsContainer.innerHTML = '';
        snapshot.forEach(function (childSnapshot) {
            var listing = childSnapshot.val();
            var listingCard = document.createElement('div');
            listingCard.classList.add('listing-card');
            listingCard.setAttribute('data-tilt', '');
            listingCard.innerHTML = `
                <img src="${listing.image}" alt="${listing.name}">
                <h3>${listing.name}</h3>
                <p>${listing.description}</p>
                <p>Restaurant: ${listing.restaurant}</p>
                <button>Order</button>
            `;
            listingsContainer.appendChild(listingCard);
        });
    });

    database.ref('orders').on('value', function (snapshot) {
        var ordersTable = document.getElementById('orders-table');
        ordersTable.innerHTML = '';
        snapshot.forEach(function (childSnapshot) {
            var order = childSnapshot.val();
            var orderRow = document.createElement('tr');
            orderRow.innerHTML = `
                <td>${order.orderId}</td>
                <td>${order.item}</td>
                <td>${order.status}</td>
                <td>${order.date}</td>
            `;
            ordersTable.appendChild(orderRow);
        });
    });

    var selectedBusiness = null;
    database.ref('businesses').on('value', function (snapshot) {
        var businessList = document.querySelector('.business-list');
        businessList.innerHTML = '';
        snapshot.forEach(function (childSnapshot) {
            var business = childSnapshot.val();
            var businessLogo = document.createElement('div');
            businessLogo.classList.add('business-logo');
            businessLogo.setAttribute('data-business-id', childSnapshot.key);
            businessLogo.setAttribute('data-tilt', '');
            businessLogo.innerHTML = `
                <img src="${business.logo}" alt="${business.name}">
                <p>${business.name}</p>
            `;
            businessLogo.addEventListener('click', function() {
                selectedBusiness = childSnapshot.key;
                loadMessages(selectedBusiness);
            });
            businessList.appendChild(businessLogo);
        });
    });

    function loadMessages(businessId) {
        database.ref('messages/' + businessId).on('value', function (snapshot) {
            var messageList = document.querySelector('.message-list');
            messageList.innerHTML = '';
            snapshot.forEach(function (childSnapshot) {
                var message = childSnapshot.val();
                var messageDiv = document.createElement('div');
                messageDiv.classList.add('message');
                messageDiv.setAttribute('data-tilt', '');
                messageDiv.innerHTML = `
                    <h4>From: ${message.sender}</h4>
                    <p>${message.text}</p>
                `;
                messageList.appendChild(messageDiv);
            });
        });
    }

    document.getElementById('message-form').addEventListener('submit', function (event) {
        event.preventDefault();
        var messageInput = document.getElementById('message-input');
        if (selectedBusiness) {
            var newMessage = {
                sender: 'Customer',
                text: messageInput.value
            };
            database.ref('messages/' + selectedBusiness).push(newMessage);
            messageInput.value = '';
        } else {
            alert("Please select a business to message.");
        }
    });
});
