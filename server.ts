import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import mongoose from "mongoose";
import dotenv from "dotenv";

// Load Environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Path Helpers for the legacy JSON files to seed if database is blank
const dataDir = path.join(process.cwd(), "data");
const menuPath = path.join(dataDir, "menu.json");
const tablesPath = path.join(dataDir, "tables.json");
const ordersPath = path.join(dataDir, "orders.json");

// Define MongoDB schemas & models
const menuItemSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  description: { type: String, default: "" },
  image: { type: String, required: true }
});
const MenuItem = mongoose.model("MenuItem", menuItemSchema);

const tableSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true }
});
const TableItem = mongoose.model("TableItem", tableSchema);

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  tableId: { type: String, required: true },
  items: [
    {
      name: { type: String, required: true },
      price: { type: Number, required: true },
      qty: { type: Number, required: true }
    }
  ],
  total: { type: Number, required: true },
  status: { type: String, default: "Pending" },
  createdAt: { type: Date, default: Date.now }
});
const OrderItem = mongoose.model("OrderItem", orderSchema);

// Connection URI setup
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://iktushar01:tusharToa.123@learningproject.3djrvwy.mongodb.net/?appName=learningProject";

// Establish Connection & trigger Seeding
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB successfully!");
    seedDatabase();
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
  });

// Seed data from JSON to MongoDB if the collection is empty
async function seedDatabase() {
  try {
    // 1. Seed Menu Items
    const menuCount = await MenuItem.countDocuments();
    if (menuCount === 0) {
      console.log("Database contains 0 Menu Items. Attempting to seed from menu.json...");
      if (fs.existsSync(menuPath)) {
        const raw = fs.readFileSync(menuPath, "utf-8");
        const items = JSON.parse(raw);
        if (items && items.length > 0) {
          await MenuItem.insertMany(items);
          console.log(`Seeded ${items.length} menu items from JSON template to MongoDB!`);
        }
      }
    }

    // 2. Seed Tables
    const tablesCount = await TableItem.countDocuments();
    if (tablesCount === 0) {
      console.log("Database contains 0 Table spot entries. Seeding from tables.json...");
      if (fs.existsSync(tablesPath)) {
        const raw = fs.readFileSync(tablesPath, "utf-8");
        const items = JSON.parse(raw);
        if (items && items.length > 0) {
          await TableItem.insertMany(items);
          console.log(`Seeded ${items.length} table setups to MongoDB!`);
        }
      }
    }

    // 3. Seed Orders (if exist)
    const ordersCount = await OrderItem.countDocuments();
    if (ordersCount === 0) {
      console.log("Database contains 0 orders. Porting legacy order tickets...");
      if (fs.existsSync(ordersPath)) {
        const raw = fs.readFileSync(ordersPath, "utf-8");
        const items = JSON.parse(raw);
        if (items && items.length > 0) {
          await OrderItem.insertMany(items);
          console.log(`Seeded ${items.length} order history items to MongoDB!`);
        }
      }
    }
  } catch (err: any) {
    console.warn("MongoDB automatic initialization warning:", err.message);
  }
}

// API Routes (Updated to query MongoDB database)

// 1. Get Menu list
app.get("/api/menu", async (req, res) => {
  try {
    const menu = await MenuItem.find({}).sort({ id: 1 });
    res.json(menu);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to read menu from MongoDB: " + error.message });
  }
});

// 1b. Create Menu item (Admin action)
app.post("/api/menu", async (req, res) => {
  try {
    const { name, price, category, description, image } = req.body;
    if (!name || !price || !category) {
      return res.status(400).json({ error: "Name, price, and category are required fields." });
    }

    // Generate unique numerical ID sequential increment
    const lastItem = await MenuItem.findOne({}).sort({ id: -1 });
    const nextId = lastItem && typeof lastItem.id === "number" ? lastItem.id + 1 : 1;

    const newItem = new MenuItem({
      id: nextId,
      name,
      price: Number(price),
      category,
      description: description || "",
      image: image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80"
    });

    await newItem.save();
    res.status(201).json(newItem);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to create menu item on MongoDB: " + error.message });
  }
});

// 2. Get Tables list
app.get("/api/tables", async (req, res) => {
  try {
    const tables = await TableItem.find({}).sort({ id: 1 });
    res.json(tables);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to read tables listing from MongoDB: " + error.message });
  }
});

// 3. Get Orders list
app.get("/api/orders", async (req, res) => {
  try {
    const orders = await OrderItem.find({}).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to read orders logging from MongoDB: " + error.message });
  }
});

// 4. Create Order
app.post("/api/orders", async (req, res) => {
  try {
    const { tableId, items, total } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Invalid order ticket. Purchase Items are required." });
    }

    // Compute order sequence number with model query helper
    const lastOrder = await OrderItem.findOne({ orderId: /^ORD-/ }).sort({ orderId: -1 });
    let nextNum = 1001;
    if (lastOrder && lastOrder.orderId) {
      const match = String(lastOrder.orderId).match(/ORD-(\d+)/);
      if (match) {
        nextNum = parseInt(match[1], 10) + 1;
      }
    }
    const orderId = `ORD-${nextNum}`;

    const newOrder = new OrderItem({
      orderId,
      tableId: tableId ? String(tableId) : "None",
      items,
      total: Number(total),
      status: "Pending"
    });

    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to submit new Order to MongoDB: " + error.message });
  }
});

// 5. Update Order status
app.patch("/api/orders/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: "Status field parameter is required." });
    }

    const updated = await OrderItem.findOneAndUpdate(
      { orderId: String(orderId) },
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: `Order ticket matching ${orderId} is not registered.` });
    }

    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to update dynamic order state: " + error.message });
  }
});

// Vite full-stack dev server / static assets configuration
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`RestoFlow Live Server running on http://localhost:${PORT}`);
  });
}

setupServer();
