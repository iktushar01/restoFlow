export interface MenuItem {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
}

export interface OrderItem {
  name: string;
  qty: number;
  price: number;
}

export interface Order {
  orderId: string;
  tableId: string;
  items: OrderItem[];
  total: number;
  status: "Pending" | "Preparing" | "Served";
  createdAt: string;
}

export interface Table {
  id: number;
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
  qty: number;
  category: string;
  image: string;
}
