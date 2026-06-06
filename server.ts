import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json());

// Path Helpers for the JSON "database"
const dataDir = path.join(process.cwd(), "data");
const menuPath = path.join(dataDir, "menu.json");
const tablesPath = path.join(dataDir, "tables.json");
const ordersPath = path.join(dataDir, "orders.json");

// Ensure data directory and files exist
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const ensureFileExists = (filePath: string, defaultContent: string) => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, defaultContent, "utf-8");
  }
};

ensureFileExists(menuPath, "[]");
ensureFileExists(tablesPath, "[]");
ensureFileExists(ordersPath, "[]");

// API Routes

// 1. Get Menu list
app.get("/api/menu", (req, res) => {
  try {
    const rawData = fs.readFileSync(menuPath, "utf-8");
    const menu = JSON.parse(rawData);
    res.json(menu);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to read menu data: " + error.message });
  }
});

// 2. Get Tables list
app.get("/api/tables", (req, res) => {
  try {
    const rawData = fs.readFileSync(tablesPath, "utf-8");
    const tables = JSON.parse(rawData);
    res.json(tables);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to read tables data: " + error.message });
  }
});

// 3. Get Orders list
app.get("/api/orders", (req, res) => {
  try {
    const rawData = fs.readFileSync(ordersPath, "utf-8");
    const orders = JSON.parse(rawData);
    res.json(orders);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to read orders data: " + error.message });
  }
});

// 4. Create Order
app.post("/api/orders", (req, res) => {
  try {
    const { tableId, items, total } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Invalid order. Items are required." });
    }

    const rawData = fs.readFileSync(ordersPath, "utf-8");
    const orders = JSON.parse(rawData);

    // Generate high-quality sequential ID: ORD-1001, etc.
    let nextNum = 1001;
    if (orders.length > 0) {
      const ids = orders
        .map((o: any) => {
          const match = String(o.orderId).match(/ORD-(\d+)/);
          return match ? parseInt(match[1], 10) : 0;
        })
        .filter((val: number) => !isNaN(val));
      if (ids.length > 0) {
        nextNum = Math.max(...ids) + 1;
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
    fs.writeFileSync(ordersPath, JSON.stringify(orders, null, 2), "utf-8");

    res.status(201).json(newOrder);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to create order: " + error.message });
  }
});

// 5. Update Order status
app.patch("/api/orders/:orderId", (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: "Status field is required." });
    }

    const rawData = fs.readFileSync(ordersPath, "utf-8");
    const orders = JSON.parse(rawData);

    const orderIdx = orders.findIndex((o: any) => String(o.orderId) === String(orderId));
    if (orderIdx === -1) {
      return res.status(404).json({ error: `Order with ID ${orderId} not found.` });
    }

    orders[orderIdx].status = status;
    fs.writeFileSync(ordersPath, JSON.stringify(orders, null, 2), "utf-8");

    res.json(orders[orderIdx]);
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
