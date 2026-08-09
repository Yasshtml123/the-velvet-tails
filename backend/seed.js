import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Product from './models/Product.js';
import TaxConfig from './models/TaxConfig.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for latency test seeding...');

    // Clean existing test entries
    await User.deleteMany({ email: /@test\.com$/ });
    await Product.deleteMany({ category: 'Pet Accessories' });
    await TaxConfig.deleteMany({});

    // 1. Tax Config
    await TaxConfig.create({
      name: 'GST 18%',
      rate: 18,
      inclusive: false,
      isActive: true
    });

    // 2. Users
    const user = await User.create({
      name: 'Test Customer',
      email: 'customer@test.com',
      passwordHash: 'Password123!',
      role: 'user'
    });

    // 3. Products Batch
    const productsData = Array.from({ length: 10 }).map((_, i) => ({
      title: `Leather Collar Premium ${i + 1}`,
      description: `Durable handcrafted pet accessory item #${i + 1} with high comfort rating.`,
      price: (299 + i * 100) * 100, // Prices in paise (₹299 to ₹1199)
      category: 'Pet Accessories',
      inventory: 500,
      images: [{ url: `https://via.placeholder.com/150?text=Item+${i + 1}`, publicId: `img_${i + 1}` }],
      dimensions: { length: 12, breadth: 8, height: 2, weight: 0.3 }
    }));

    const products = await Product.create(productsData);

    console.log('\n✅ Seeding Complete for Latency Testing');
    console.log(`- Created ${products.length} catalog items`);
    console.log(`- Test User ID:    ${user._id}`);
    console.log(`- Sample Product ID: ${products[0]._id}`);

    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
};

seedDatabase();