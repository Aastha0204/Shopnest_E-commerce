const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dns = require("dns");
const path = require("path");

const User = require("./model/User");
const Product = require("./model/Product");
const Order = require("./model/Order");

dns.setServers(["8.8.8.8", "8.8.4.4"]);

dotenv.config({ path: path.join(__dirname, ".env") });

const placeholder = (text) =>
  `https://placehold.co/600x600?text=${encodeURIComponent(text)}`;

const products = [
  {
    name: "Wireless Noise Cancelling Headphones",
    description:
      "Comfortable over-ear headphones with deep bass, active noise cancellation, and 30 hours of battery life.",
    price: 3499,
    category: "Electronics",
    stock: 25,
    images: [placeholder("Headphones")],
    rating: 4.6,
    numReviews: 38,
  },
  {
    name: "Smart Fitness Watch",
    description:
      "Track steps, heart rate, workouts, sleep, and notifications with a bright waterproof display.",
    price: 2499,
    category: "Electronics",
    stock: 40,
    images: [placeholder("Smart Watch")],
    rating: 4.4,
    numReviews: 27,
  },
  {
    name: "Classic Cotton T-Shirt",
    description:
      "Soft breathable cotton tee with a regular fit for everyday comfort.",
    price: 599,
    category: "Fashion",
    stock: 80,
    images: [placeholder("T-Shirt")],
    rating: 4.2,
    numReviews: 19,
  },
  {
    name: "Minimal Desk Lamp",
    description:
      "Adjustable LED desk lamp with three brightness levels for work, study, and reading.",
    price: 1299,
    category: "Home",
    stock: 32,
    images: [placeholder("Desk Lamp")],
    rating: 4.5,
    numReviews: 16,
  },
  {
    name: "Stainless Steel Water Bottle",
    description:
      "Leak-proof insulated bottle that keeps drinks cold or hot for hours.",
    price: 799,
    category: "Lifestyle",
    stock: 65,
    images: [placeholder("Bottle")],
    rating: 4.7,
    numReviews: 44,
  },
  {
    name: "Everyday Backpack",
    description:
      "Durable backpack with padded laptop storage, organizer pockets, and water-resistant fabric.",
    price: 1799,
    category: "Accessories",
    stock: 22,
    images: [placeholder("Backpack")],
    rating: 4.3,
    numReviews: 21,
  },
];

const users = [
  {
    name: "Admin User",
    email: "admin@shopnest.com",
    role: "admin",
  },
  {
    name: "Aarav Sharma",
    email: "aarav@example.com",
    role: "user",
  },
  {
    name: "Priya Mehta",
    email: "priya@example.com",
    role: "user",
  },
];

const seedData = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing in your .env file");
    }

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 15000,
    });

    console.log("MongoDB connected for seeding");

    const sampleEmails = users.map((user) => user.email);
    const sampleProductNames = products.map((product) => product.name);

    await Order.deleteMany({});
    await User.deleteMany({ email: { $in: sampleEmails } });
    await Product.deleteMany({ name: { $in: sampleProductNames } });

    const hashedPassword = await bcrypt.hash("password123", 10);

    const createdUsers = await User.insertMany(
      users.map((user) => ({
        ...user,
        password: hashedPassword,
        verified: true,
      }))
    );

    const createdProducts = await Product.insertMany(products);

    const [, aarav, priya] = createdUsers;
    const [
      headphones,
      watch,
      tshirt,
      lamp,
      bottle,
      backpack,
    ] = createdProducts;

    await Order.insertMany([
      {
        user: aarav._id,
        products: [
          { product: headphones._id, quantity: 1 },
          { product: bottle._id, quantity: 2 },
        ],
        totalAmount: headphones.price + bottle.price * 2,
        address: {
          fullName: aarav.name,
          street: "12 MG Road",
          city: "Bengaluru",
          postalCode: "560001",
          country: "India",
        },
        paymentId: "pay_dummy_001",
        status: "delivered",
      },
      {
        user: priya._id,
        products: [
          { product: watch._id, quantity: 1 },
          { product: tshirt._id, quantity: 2 },
          { product: backpack._id, quantity: 1 },
        ],
        totalAmount: watch.price + tshirt.price * 2 + backpack.price,
        address: {
          fullName: priya.name,
          street: "45 Park Street",
          city: "Mumbai",
          postalCode: "400001",
          country: "India",
        },
        paymentId: "pay_dummy_002",
        status: "shipped",
      },
      {
        user: aarav._id,
        products: [{ product: lamp._id, quantity: 1 }],
        totalAmount: lamp.price,
        address: {
          fullName: aarav.name,
          street: "12 MG Road",
          city: "Bengaluru",
          postalCode: "560001",
          country: "India",
        },
        paymentId: "pay_dummy_003",
        status: "pending",
      },
    ]);

    console.log("Dummy data seeded successfully");
    console.log("Login emails: admin@shopnest.com, aarav@example.com, priya@example.com");
    console.log("Password for all seeded users: password123");

    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }
};

seedData();
