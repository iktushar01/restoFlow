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

let dbConnected = false;

// Local JSON File helper readers & writers for the hybrid fallback mechanism
function readLocalJson(filePath: string, defaultValue: any) {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
  }
  return defaultValue;
}

function writeLocalJson(filePath: string, data: any) {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
  }
}

// Establish Connection & trigger Seeding
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB successfully! All data operations are synchronized with remote Atlas database.");
    dbConnected = true;
    seedDatabase();
  })
  .catch((err: any) => {
    console.warn("==========================================================================");
    console.warn("⚠️  Failed to connect to MongoDB due to querySrv or DNS resolution errors.");
    console.warn("👉 System automatically activated high-speed local filesystem persistence fallback.");
    console.warn("👉 Real-time read & write actions are safe and will persist in local JSON databases.");
    console.warn("==========================================================================");
    dbConnected = false;
  });

// Seed data from JSON to MongoDB if the collection is empty and connected
async function seedDatabase() {
  if (!dbConnected) return;
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

// API Routes with dual MongoDB + Local JSON Fallback behavior

// 1. Get Menu list
app.get("/api/menu", async (req, res) => {
  try {
    if (dbConnected) {
      const menu = await MenuItem.find({}).sort({ id: 1 });
      return res.json(menu);
    } else {
      const menu = readLocalJson(menuPath, []);
      return res.json(menu);
    }
  } catch (error: any) {
    res.status(500).json({ error: "Failed to read menu items: " + error.message });
  }
});

// 1b. Create Menu item (Admin action)
app.post("/api/menu", async (req, res) => {
  try {
    const { name, price, category, description, image } = req.body;
    if (!name || !price || !category) {
      return res.status(400).json({ error: "Name, price, and category are required fields." });
    }

    const itemImage = image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80";

    if (dbConnected) {
      // Generate unique numerical ID sequential increment
      const lastItem = await MenuItem.findOne({}).sort({ id: -1 });
      const nextId = lastItem && typeof lastItem.id === "number" ? lastItem.id + 1 : 1;

      const newItem = new MenuItem({
        id: nextId,
        name,
        price: Number(price),
        category,
        description: description || "",
        image: itemImage
      });

      await newItem.save();
      return res.status(201).json(newItem);
    } else {
      // Local fallback
      const menu = readLocalJson(menuPath, []);
      const maxId = menu.reduce((max: number, item: any) => (item.id > max ? item.id : max), 0);
      const nextId = maxId + 1;

      const newItem = {
        id: nextId,
        name,
        price: Number(price),
        category,
        description: description || "",
        image: itemImage
      };

      menu.push(newItem);
      writeLocalJson(menuPath, menu);
      return res.status(201).json(newItem);
    }
  } catch (error: any) {
    res.status(500).json({ error: "Failed to create menu item: " + error.message });
  }
});

// 2. Get Tables list
app.get("/api/tables", async (req, res) => {
  try {
    if (dbConnected) {
      const tables = await TableItem.find({}).sort({ id: 1 });
      return res.json(tables);
    } else {
      const tables = readLocalJson(tablesPath, []);
      return res.json(tables);
    }
  } catch (error: any) {
    res.status(500).json({ error: "Failed to read tables layout: " + error.message });
  }
});

// 3. Get Orders list
app.get("/api/orders", async (req, res) => {
  try {
    if (dbConnected) {
      const orders = await OrderItem.find({}).sort({ createdAt: -1 });
      return res.json(orders);
    } else {
      const orders = readLocalJson(ordersPath, []);
      // Sort orders by createdAt descending (newest first)
      const sortedOrders = [...orders].sort((a: any, b: any) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      return res.json(sortedOrders);
    }
  } catch (error: any) {
    res.status(500).json({ error: "Failed to read orders repository: " + error.message });
  }
});

// 4. Create Order
app.post("/api/orders", async (req, res) => {
  try {
    const { tableId, items, total } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Invalid order ticket. Purchase Items are required." });
    }

    if (dbConnected) {
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
      return res.status(201).json(newOrder);
    } else {
      // Local fallback
      const orders = readLocalJson(ordersPath, []);
      let nextNum = 1001;
      if (orders.length > 0) {
        // Find highest ORD number
        const ordNums = orders
          .map((o: any) => {
            const match = String(o.orderId).match(/ORD-(\d+)/);
            return match ? parseInt(match[1], 10) : null;
          })
          .filter((n: any) => n !== null);
        if (ordNums.length > 0) {
          nextNum = Math.max(...ordNums) + 1;
        }
      }
      const orderId = `ORD-${nextNum}`;

      const newOrder = {
        orderId,
        tableId: tableId ? String(tableId) : "None",
        items,
        total: Number(total),
        status: "Pending",
        createdAt: new Date().toISOString()
      };

      orders.push(newOrder);
      writeLocalJson(ordersPath, orders);
      return res.status(201).json(newOrder);
    }
  } catch (error: any) {
    res.status(500).json({ error: "Failed to submit new Order transaction: " + error.message });
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

    if (dbConnected) {
      const updated = await OrderItem.findOneAndUpdate(
        { orderId: String(orderId) },
        { status },
        { new: true }
      );

      if (!updated) {
        return res.status(404).json({ error: `Order ticket matching ${orderId} is not registered.` });
      }

      return res.json(updated);
    } else {
      // Local fallback
      const orders = readLocalJson(ordersPath, []);
      const index = orders.findIndex((o: any) => String(o.orderId) === String(orderId));
      if (index === -1) {
        return res.status(404).json({ error: `Order ticket matching ${orderId} is not found.` });
      }

      orders[index].status = status;
      writeLocalJson(ordersPath, orders);
      return res.json(orders[index]);
    }
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
