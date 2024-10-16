class NigerianCateringService {
  constructor() {
    this.menu = {
      'Jollof Rice': 1500,
      'Pounded Yam and Egusi Soup': 2000,
      'Suya': 1000,
      'Pepper Soup': 1200,
      'Moi Moi': 800
    };
    this.orders = [];
  }

  displayMenu() {
    console.log('Nigerian Catering Service Menu:');
    for (const [dish, price] of Object.entries(this.menu)) {
      console.log(`${dish}: ₦${price}`);
    }
  }

  placeOrder(customerName, dishes) {
    const order = {
      customerName,
      dishes: [],
      totalAmount: 0
    };

    for (const dish of dishes) {
      if (this.menu.hasOwnProperty(dish)) {
        order.dishes.push(dish);
        order.totalAmount += this.menu[dish];
      } else {
        console.log(`Sorry, ${dish} is not on our menu.`);
      }
    }

    this.orders.push(order);
    return order;
  }

  sendOrderConfirmation(order, method) {
    let message = `Thank you for your order, ${order.customerName}!\n\n`;
    message += 'Your order details:\n';
    for (const dish of order.dishes) {
      message += `- ${dish}: ₦${this.menu[dish]}\n`;
    }
    message += `\nTotal amount: ₦${order.totalAmount}`;

    if (method === 'email') {
      this.sendEmail(order.customerName, message);
    } else if (method === 'whatsapp') {
      this.sendWhatsApp(order.customerName, message);
    }
  }

  sendEmail(customerName, message) {
    // This is a placeholder for email sending functionality
    console.log(`Sending email to ${customerName}:`);
    console.log(message);
    // In a real implementation, you would use a library like nodemailer to send emails
  }

  sendWhatsApp(customerName, message) {
    // This is a placeholder for WhatsApp sending functionality
    console.log(`Sending WhatsApp message to ${customerName}:`);
    console.log(message);
    // In a real implementation, you would use a WhatsApp Business API or a third-party service
  }
}

// Usage example
const cateringService = new NigerianCateringService();

cateringService.displayMenu();

const order = cateringService.placeOrder('Oluwaseun', ['Jollof Rice', 'Suya', 'Moi Moi']);
cateringService.sendOrderConfirmation(order, 'email');

const anotherOrder = cateringService.placeOrder('Chioma', ['Pounded Yam and Egusi Soup', 'Pepper Soup']);
cateringService.sendOrderConfirmation(anotherOrder, 'whatsapp');
