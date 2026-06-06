import express from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { MongoClient, type Collection, type Db, type Document } from "mongodb";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

interface MenuItem extends Document {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
}

interface TableRecord extends Document {
  id: number;
}

interface OrderRecord extends Document {
  orderId: string;
  tableId: string;
  items: Array<{
    name: string;
    qty: number;
    price: number;
  }>;
  total: number;
  status: "Pending" | "Preparing" | "Served";
  createdAt: string;
  paymentMethod?: string;
}

// Seed data is kept in JSON for first-run MongoDB bootstrap only.
const dataDir = path.join(process.cwd(), "data");
const menuPath = path.join(dataDir, "menu.json");
const tablesPath = path.join(dataDir, "tables.json");
const ordersSeedPath = path.join(dataDir, "orders.json");

let mongoClient: MongoClient | null = null;
let mongoDb: Db | null = null;
let seedPromise: Promise<void> | null = null;

function readSeedFile<T>(filePath: string, fallback: T): T {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf-8")) as T;
  } catch {
    return fallback;
  }
}

async function getDb(): Promise<Db> {
  if (mongoDb) {
    return mongoDb;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not configured.");
  }

  mongoClient = new MongoClient(uri);
  await mongoClient.connect();
  mongoDb = mongoClient.db(process.env.MONGODB_DB || "restoflow");
  return mongoDb;
}

function withoutMongoId<T extends Document>(doc: T): Omit<T, "_id"> {
  const { _id, ...rest } = doc;
  return rest;
}

async function getCollection<T extends Document>(name: string): Promise<Collection<T>> {
  const db = await getDb();
  if (!seedPromise) {
    seedPromise = seedDatabase(db);
  }
  await seedPromise;
  return db.collection<T>(name);
}

async function seedDatabase(db: Db) {
  const menu = db.collection<MenuItem>("menu");
  const tables = db.collection<TableRecord>("tables");
  const orders = db.collection<OrderRecord>("orders");

  await Promise.all([
    menu.createIndex({ id: 1 }, { unique: true }),
    tables.createIndex({ id: 1 }, { unique: true }),
    orders.createIndex({ orderId: 1 }, { unique: true }),
    orders.createIndex({ createdAt: -1 }),
  ]);

  const [menuCount, tableCount, orderCount] = await Promise.all([
    menu.countDocuments(),
    tables.countDocuments(),
    orders.countDocuments(),
  ]);

  if (menuCount === 0) {
    const seedMenu = readSeedFile<MenuItem[]>(menuPath, []);
    if (seedMenu.length > 0) {
      await menu.insertMany(seedMenu);
    }
  }

  if (tableCount === 0) {
    const seedTables = readSeedFile<TableRecord[]>(tablesPath, []);
    if (seedTables.length > 0) {
      await tables.insertMany(seedTables);
    }
  }

  if (orderCount === 0) {
    const seedOrders = readSeedFile<OrderRecord[]>(ordersSeedPath, []);
    if (seedOrders.length > 0) {
      await orders.insertMany(seedOrders);
    }
  }
}

// API Routes

// 1. Get Menu list
app.get("/api/menu", async (req, res) => {
  try {
    const menu = await getCollection<MenuItem>("menu");
    const items = await menu.find({}, { projection: { _id: 0 } }).sort({ id: 1 }).toArray();
    res.json(items);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to read menu data from MongoDB: " + error.message });
  }
});

// 2. Get Tables list
app.get("/api/tables", async (req, res) => {
  try {
    const tables = await getCollection<TableRecord>("tables");
    const items = await tables.find({}, { projection: { _id: 0 } }).sort({ id: 1 }).toArray();
    res.json(items);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to read tables data from MongoDB: " + error.message });
  }
});

// 3. Get Orders list
app.get("/api/orders", async (req, res) => {
  try {
    const orders = await getCollection<OrderRecord>("orders");
    const items = await orders.find({}, { projection: { _id: 0 } }).sort({ createdAt: -1 }).toArray();
    res.json(items);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to read orders data from MongoDB: " + error.message });
  }
});

// 4. Create Order
app.post("/api/orders", async (req, res) => {
  try {
    const { tableId, items, total, paymentMethod } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Invalid order. Items are required." });
    }

    const orders = await getCollection<OrderRecord>("orders");

    // Generate high-quality sequential ID: ORD-1001, etc.
    let nextNum = 1001;
    const [latestOrder] = await orders
      .aggregate<{ orderNumber: number }>([
        { $match: { orderId: /^ORD-\d+$/ } },
        {
          $addFields: {
            orderNumber: {
              $toInt: { $arrayElemAt: [{ $split: ["$orderId", "-"] }, 1] },
            },
          },
        },
        { $sort: { orderNumber: -1 } },
        { $limit: 1 },
        { $project: { orderNumber: 1 } },
      ])
      .toArray();

    if (latestOrder) {
      nextNum = latestOrder.orderNumber + 1;
    }

    const orderId = `ORD-${nextNum}`;

    const newOrder: OrderRecord = {
      orderId,
      tableId: tableId ? String(tableId) : "None",
      items,
      total: Number(total),
      status: "Pending",
      createdAt: new Date().toISOString(),
      paymentMethod: paymentMethod ? String(paymentMethod) : undefined,
    };

    await orders.insertOne(newOrder);

    res.status(201).json(newOrder);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to create order: " + error.message });
  }
});

// 5. Update Order status
app.patch("/api/orders/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: "Status field is required." });
    }
    if (!["Pending", "Preparing", "Served"].includes(status)) {
      return res.status(400).json({ error: "Status must be Pending, Preparing, or Served." });
    }

    const orders = await getCollection<OrderRecord>("orders");
    const updatedOrder = await orders.findOneAndUpdate(
      { orderId },
      { $set: { status } },
      { returnDocument: "after", projection: { _id: 0 } }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: `Order with ID ${orderId} not found.` });
    }

    res.json(withoutMongoId(updatedOrder));
  } catch (error: any) {
    res.status(500).json({ error: "Failed to update order: " + error.message });
  }
});

// Vite full-stack integrations: Mount Vite middleware in dev or static asset server in production
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
    console.log(`RestoFlow Server running on port ${PORT}`);
  });
}

setupServer();
