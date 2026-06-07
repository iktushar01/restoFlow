import type { IncomingMessage, ServerResponse } from "http";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";

type MenuItemInput = {
  name?: string;
  price?: number | string;
  category?: string;
  description?: string;
  image?: string;
};

type OrderInput = {
  tableId?: string | number;
  items?: Array<{ name: string; price: number; qty: number }>;
  total?: number | string;
};

const dataDir = path.join(process.cwd(), "data");
const menuPath = path.join(dataDir, "menu.json");
const tablesPath = path.join(dataDir, "tables.json");
const ordersPath = path.join(dataDir, "orders.json");

const menuItemSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  description: { type: String, default: "" },
  image: { type: String, required: true },
});

const tableSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
});

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  tableId: { type: String, required: true },
  items: [
    {
      name: { type: String, required: true },
      price: { type: Number, required: true },
      qty: { type: Number, required: true },
    },
  ],
  total: { type: Number, required: true },
  status: { type: String, default: "Pending" },
  createdAt: { type: Date, default: Date.now },
});

const MenuItem: mongoose.Model<any> =
  mongoose.models.MenuItem || mongoose.model("MenuItem", menuItemSchema);
const TableItem: mongoose.Model<any> =
  mongoose.models.TableItem || mongoose.model("TableItem", tableSchema);
const OrderItem: mongoose.Model<any> =
  mongoose.models.OrderItem || mongoose.model("OrderItem", orderSchema);

let connectionPromise: Promise<typeof mongoose> | null = null;

function readLocalJson<T>(filePath: string, defaultValue: T): T {
  try {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, "utf-8")) as T;
    }
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
  }

  return defaultValue;
}

function sendJson(res: ServerResponse, statusCode: number, body: unknown) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(body));
}

async function readBody<T>(req: IncomingMessage): Promise<T> {
  const chunks: Buffer[] = [];

  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  const rawBody = Buffer.concat(chunks).toString("utf-8");
  return rawBody ? JSON.parse(rawBody) : ({} as T);
}

async function connectToDatabase() {
  const mongodbUri = process.env.MONGODB_URI;

  if (!mongodbUri) {
    return false;
  }

  if (mongoose.connection.readyState === 1) {
    return true;
  }

  try {
    connectionPromise ??= mongoose.connect(mongodbUri);
    await connectionPromise;
    return true;
  } catch (error) {
    console.warn("MongoDB connection failed. Falling back to bundled JSON data.", error);
    connectionPromise = null;
    return false;
  }
}

async function seedDatabase() {
  const [menuCount, tablesCount, ordersCount] = await Promise.all([
    MenuItem.countDocuments(),
    TableItem.countDocuments(),
    OrderItem.countDocuments(),
  ]);

  if (menuCount === 0) {
    const menu = readLocalJson(menuPath, []);
    if (menu.length > 0) {
      await MenuItem.insertMany(menu);
    }
  }

  if (tablesCount === 0) {
    const tables = readLocalJson(tablesPath, []);
    if (tables.length > 0) {
      await TableItem.insertMany(tables);
    }
  }

  if (ordersCount === 0) {
    const orders = readLocalJson(ordersPath, []);
    if (orders.length > 0) {
      await OrderItem.insertMany(orders);
    }
  }
}

function routePath(req: IncomingMessage) {
  const url = new URL(req.url || "/", "https://restoflow.local");
  return url.pathname.replace(/^\/api\/?/, "").replace(/^\//, "");
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  try {
    const dbConnected = await connectToDatabase();

    if (dbConnected) {
      await seedDatabase();
    }

    const method = req.method || "GET";
    const resourcePath = routePath(req);
    const orderStatusMatch = resourcePath.match(/^orders\/([^/]+)$/);

    if (method === "GET" && resourcePath === "menu") {
      const menu = dbConnected
        ? await MenuItem.find({}).sort({ id: 1 })
        : readLocalJson(menuPath, []);
      return sendJson(res, 200, menu);
    }

    if (method === "POST" && resourcePath === "menu") {
      if (!dbConnected) {
        return sendJson(res, 503, {
          error: "MONGODB_URI is required in Vercel for production menu writes.",
        });
      }

      const { name, price, category, description, image } = await readBody<MenuItemInput>(req);

      if (!name || !price || !category) {
        return sendJson(res, 400, { error: "Name, price, and category are required fields." });
      }

      const lastItem = await MenuItem.findOne({}).sort({ id: -1 });
      const nextId = lastItem && typeof lastItem.id === "number" ? lastItem.id + 1 : 1;
      const newItem = await MenuItem.create({
        id: nextId,
        name,
        price: Number(price),
        category,
        description: description || "",
        image:
          image ||
          "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80",
      });

      return sendJson(res, 201, newItem);
    }

    if (method === "GET" && resourcePath === "tables") {
      const tables = dbConnected
        ? await TableItem.find({}).sort({ id: 1 })
        : readLocalJson(tablesPath, []);
      return sendJson(res, 200, tables);
    }

    if (method === "GET" && resourcePath === "orders") {
      if (dbConnected) {
        const orders = await OrderItem.find({}).sort({ createdAt: -1 });
        return sendJson(res, 200, orders);
      }

      const orders = readLocalJson<any[]>(ordersPath, []);
      const sortedOrders = [...orders].sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      return sendJson(res, 200, sortedOrders);
    }

    if (method === "POST" && resourcePath === "orders") {
      if (!dbConnected) {
        return sendJson(res, 503, {
          error: "MONGODB_URI is required in Vercel for production order writes.",
        });
      }

      const { tableId, items, total } = await readBody<OrderInput>(req);

      if (!items || !Array.isArray(items) || items.length === 0) {
        return sendJson(res, 400, { error: "Invalid order ticket. Purchase Items are required." });
      }

      const lastOrder = await OrderItem.findOne({ orderId: /^ORD-/ }).sort({ orderId: -1 });
      let nextNum = 1001;

      if (lastOrder?.orderId) {
        const match = String(lastOrder.orderId).match(/ORD-(\d+)/);
        if (match) {
          nextNum = parseInt(match[1], 10) + 1;
        }
      }

      const newOrder = await OrderItem.create({
        orderId: `ORD-${nextNum}`,
        tableId: tableId ? String(tableId) : "None",
        items,
        total: Number(total),
        status: "Pending",
      });

      return sendJson(res, 201, newOrder);
    }

    if (method === "PATCH" && orderStatusMatch) {
      if (!dbConnected) {
        return sendJson(res, 503, {
          error: "MONGODB_URI is required in Vercel for production order updates.",
        });
      }

      const { status } = await readBody<{ status?: string }>(req);

      if (!status) {
        return sendJson(res, 400, { error: "Status field parameter is required." });
      }

      const updated = await OrderItem.findOneAndUpdate(
        { orderId: String(orderStatusMatch[1]) },
        { status },
        { new: true },
      );

      if (!updated) {
        return sendJson(res, 404, {
          error: `Order ticket matching ${orderStatusMatch[1]} is not registered.`,
        });
      }

      return sendJson(res, 200, updated);
    }

    return sendJson(res, 404, { error: "API route not found." });
  } catch (error: any) {
    return sendJson(res, 500, { error: error.message || "Unexpected API error." });
  }
}
