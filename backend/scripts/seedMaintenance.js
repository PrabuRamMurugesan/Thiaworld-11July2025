const mongoose = require('mongoose');
require('dotenv').config();
const Maintenance = require('../models/maintenanceModel');

async function seed() {
  try {
    await mongoose.connect(process.env.THIAWORLD_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to DB');
    await Maintenance.deleteMany({});
    const items = [
      {
        title: "Cleaning Gold Jewellery",
        description: "Learn how to safely clean your gold jewellery at home to maintain its shine.",
        image: "https://cdn.itshot.com/media/catalog/product/m/e/mens-iced-out-pave-diamond-bubble-bracelet-975ct-p-6170_ro_1.jpg?w=1",
      },
      {
        title: "Silver Jewellery Care",
        description: "Tips to prevent tarnish and keep your silver jewellery looking new.",
        image: "https://www.24diamonds.com/47840/14k-rose-gold-miami-cuban-link-mens-bracelet-10-5-mm-8-inches.jpg",
      },
      {
        title: "Diamond Maintenance",
        description: "Ensure your diamonds sparkle with these simple care tips.",
        image: "https://tse2.mm.bing.net/th/id/OIP.5mhKtF0qZUIG4inckR0uqQHaHa?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3",
      },
      {
        title: "Storage Tips",
        description: "How to properly store your jewellery to avoid damage and scratches.",
        image: "https://tse3.mm.bing.net/th/id/OIP.6T_Wxiw0WziSgkUtoeUJ0wHaE8?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3",
      },
    ];
    await Maintenance.insertMany(items);
    console.log('Seeded maintenance items');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
