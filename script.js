class DarVoo {
    constructor() {
        this.orders = [];
        this.businessWhatsApp = "+48517071489"; // Replace with your actual WhatsApp number
    }

    displayMenu() {
        const menuItems = document.getElementById('menu-items');
        const orderItems = document.getElementById('order-items');

        for (const [dish, price] of Object.entries(this.menu)) {
            const menuItem = document.createElement('div');
            menuItem.className = 'menu-item';
            menuItem.innerHTML = `
                <span>${dish}</span>
                <span>₦${price}</span>
            `;
            menuItems.appendChild(menuItem);

            const orderItem = document.createElement('div');
            orderItem.innerHTML = `
                <label for="${dish}">${dish} (₦${price}):</label>
                <input type="number" id="${dish}" name="${dish}" min="0" value="0">
            `;
            orderItems.appendChild(orderItem);
        }
    }

    placeOrder(customerName, customerEmail, customerPhone, dishes, contactMethod) {
        const order = {
            customerName,
            customerEmail,
            customerPhone,
            dishes: [],
            totalAmount: 0,
            contactMethod
        };

        for (const [dish, quantity] of Object.entries(dishes)) {
            if (this.menu.hasOwnProperty(dish) && quantity > 0) {
                order.dishes.push({ name: dish, quantity });
                order.totalAmount += this.menu[dish] * quantity;
            }
        }

        this.orders.push(order);
        return order;
    }

    sendOrderConfirmation(order) {
        let message = this.generateOrderMessage(order);

        if (order.contactMethod === 'email') {
            this.sendEmail(order.customerEmail, "Order Confirmation", message);
        } else if (order.contactMethod === 'whatsapp') {
            this.sendWhatsApp(message);
        }
    }

    generateOrderMessage(order) {
        let message = `New order from ${order.customerName}\n`;
        message += `Contact: ${order.customerEmail} / ${order.customerPhone}\n\n`;
        message += 'Order details:\n';
        for (const dish of order.dishes) {
            message += `- ${dish.name} (x${dish.quantity}): ₦${this.menu[dish.name] * dish.quantity}\n`;
        }
        message += `\nTotal amount: ₦${order.totalAmount}`;
        return message;
    }

    sendEmail(to, subject, body) {
        // In a real application, this would use a backend API to send an email
        console.log(`Sending email to: ${to}`);
        console.log(`Subject: ${subject}`);
        console.log(`Body: ${body}`);
        alert(`Email sent to ${to}. Check the console for details.`);
    }

    sendWhatsApp(message) {
        // Encode the message for use in a URL
        const encodedMessage = encodeURIComponent(message);
        
        // Create the WhatsApp URL
        const whatsappUrl = `https://wa.me/${this.businessWhatsApp}?text=${encodedMessage}`;

        // Open the WhatsApp chat in a new window/tab
        window.open(whatsappUrl, '_blank');

        console.log('WhatsApp chat opened for business number');
        alert('Order sent to business WhatsApp. Please check your WhatsApp to confirm the order.');
    }
}

const cateringService = new DarVoo();

document.addEventListener('DOMContentLoaded', () => {
    cateringService.displayMenu();

    const orderForm = document.getElementById('order');
    orderForm.addEventListener('submit', (e) => {
        e.preventDefault();

        if (validateForm()) {
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const contactMethod = document.getElementById('contact-method').value;

            const dishes = {};
            for (const dish of Object.keys(cateringService.menu)) {
                const quantity = parseInt(document.getElementById(dish).value);
                if (quantity > 0) {
                    dishes[dish] = quantity;
                }
            }

            const order = cateringService.placeOrder(name, email, phone, dishes, contactMethod);
            cateringService.sendOrderConfirmation(order);

            orderForm.reset();
        }
    });
});

function validateForm() {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const dishes = Object.keys(cateringService.menu).map(dish => parseInt(document.getElementById(dish).value));

    let isValid = true;
    let errorMessage = '';

    // Validate name
    if (name === '') {
        errorMessage += 'Please enter your name.\n';
        isValid = false;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        errorMessage += 'Please enter a valid email address.\n';
        isValid = false;
    }

    // Validate phone number (international format without spaces)
    const phoneRegex = /^\+[1-9]\d{1,14}$/;
    if (!phoneRegex.test(phone)) {
        errorMessage += 'Please enter a valid phone number in international format (e.g., +431234567890).\n';
        isValid = false;
    }

    // Validate at least one dish is ordered
    if (dishes.every(quantity => quantity === 0)) {
        errorMessage += 'Please select at least one dish to order.\n';
        isValid = false;
    }

    if (!isValid) {
        alert('Please correct the following errors:\n\n' + errorMessage);
    }

    return isValid;
}

document.getElementById('order-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const orderItems = document.querySelectorAll('input[name="order-item"]:checked');

    let orderMessage = `Hello, I'd like to place an order:\n\nName: ${name}\nPhone: ${phone}\n\nOrder Items:\n`;

    orderItems.forEach(item => {
        orderMessage += `- ${item.nextElementSibling.textContent}\n`;
    });

    orderMessage += "\nCould you please provide the prices for these items?";

    // Encode the message for URL
    const encodedMessage = encodeURIComponent(orderMessage);

    // Replace 'your-whatsapp-number' with the actual WhatsApp number
    const whatsappUrl = `https://wa.me/your-whatsapp-number?text=${encodedMessage}`;

    // Open WhatsApp in a new tab
    window.open(whatsappUrl, '_blank');
});
