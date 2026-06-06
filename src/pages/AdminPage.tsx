import React, { useState, useEffect } from "react";
import { 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  UtensilsCrossed, 
  RefreshCw, 
  Loader2, 
  Building2, 
  User, 
  DollarSign, 
  Layers,
  AlertCircle
} from "lucide-react";

interface OrderItem {
  name: string;
  qty: number;
  price: number;
}

interface Order {
  orderId: string;
  tableId: string;
  items: OrderItem[];
  total: number;
  status: "Pending" | "Preparing" | "Served";
  createdAt: string;
}

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [pollingActive, setPollingActive] = useState<boolean>(true);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  const fetchOrders = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const response = await fetch("/api/orders");
      if (!response.ok) {
        throw new Error("Failed to sync orders archive from database.");
      }
      const data = await response.json();
      
      // Sort orders by most recent createdAt or orderId descending
      const sorted = data.sort((a: any, b: any) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      setOrders(sorted);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  // 1. Initial Load
  useEffect(() => {
    fetchOrders();
  }, []);

  // 2. Simulated Live Order updates: Interval Polling (polls every 5 seconds)
  useEffect(() => {
    if (!pollingActive) return;
    
    const interval = setInterval(() => {
      fetchOrders(true); // silent updates
    }, 5000);

    return () => clearInterval(interval);
  }, [pollingActive]);

  const updateOrderStatus = async (orderId: string, nextStatus: "Pending" | "Preparing" | "Served") => {
    setActionInProgress(orderId);
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to commit status change on server.");
      }

      // Optimistically update status in local state or re-fetch
      setOrders((prevOrders) =>
        prevOrders.map((o) => (o.orderId === orderId ? { ...o, status: nextStatus } : o))
      );
    } catch (err: any) {
      alert("Error writing status: " + err.message);
    } finally {
      setActionInProgress(null);
    }
  };

  // Compute stats metrics
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter((o) => o.status === "Pending").length;
  const preparingOrders = orders.filter((o) => o.status === "Preparing").length;
  const servedOrders = orders.filter((o) => o.status === "Served").length;
  const averageTicket = orders.length > 0 ? totalRevenue / orders.length : 0;

  // Active table simulation indicator map (occupied tables are ones who have Pending or Preparing orders)
  const occupiedTablesSet = new Set(
    orders
      .filter((o) => o.status !== "Served" && o.tableId !== "Takeaway")
      .map((o) => o.tableId)
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 min-h-screen">
      
      {/* Dynamic Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1 text-left">
          <div className="inline-flex items-center gap-2 rounded-lg bg-indigo-50 px-3 py-1 border border-indigo-100 text-xs font-semibold text-indigo-800">
            <Building2 className="h-3.5 w-3.5 text-indigo-600" />
            <span>HQ Bistro Command Console</span>
          </div>
          <h1 className="font-heading text-3xl font-black text-gray-950 tracking-tight leading-none">
            Resto<span className="text-indigo-600">Flow</span> Admin Panel
          </h1>
          <p className="text-xs text-gray-500 leading-relaxed font-medium">
            Monitor incoming orders, track culinary earnings, change food state logs, and manage seating capacities.
          </p>
        </div>

        {/* Polling controllers */}
        <div className="flex items-center gap-3 self-start sm:self-center">
          <button
            onClick={() => setPollingActive(!pollingActive)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 border transition ${
              pollingActive
                ? "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                : "bg-gray-100 border-gray-200 text-gray-600 hover:bg-gray-200"
            }`}
            title="Toggle live state polling"
          >
            <span className={`h-2 w-2 rounded-full ${pollingActive ? "bg-emerald-500 animate-ping" : "bg-gray-400"}`} />
            <span>{pollingActive ? "Simulating Live Updates" : "Feed Paused"}</span>
          </button>

          <button
            onClick={() => fetchOrders()}
            disabled={loading}
            className="rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600 font-semibold text-xs p-2.5 transition inline-flex items-center gap-1 focus:outline-none"
            title="Manual sync archives"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin text-indigo-600" : ""}`} />
          </button>
        </div>
      </div>

      {/* Primary Analytics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Stat 1 */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 space-y-4 shadow-sm text-left">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Revenue</span>
            <div className="h-9 w-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
          <div>
            <p className="font-heading text-2xl sm:text-3xl font-black text-gray-950 font-mono">${totalRevenue.toFixed(2)}</p>
            <p className="text-[10px] text-gray-400">Sum of both Cash & simulated cards</p>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 space-y-4 shadow-sm text-left">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Incoming Queues</span>
            <div className="h-9 w-9 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center">
              <Clock className="h-5 w-5 animate-pulse" />
            </div>
          </div>
          <div>
            <p className="font-heading text-2xl sm:text-3xl font-black text-gray-950 font-mono">
              {pendingOrders + preparingOrders}
            </p>
            <p className="text-[10px] text-gray-400">
              {pendingOrders} Pending • {preparingOrders} Preparing
            </p>
          </div>
        </div>

        {/* Stat 3 */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 space-y-4 shadow-sm text-left">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Served plates</span>
            <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          </div>
          <div>
            <p className="font-heading text-2xl sm:text-3xl font-black text-gray-950 font-mono">
              {servedOrders}
            </p>
            <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
              <span>{orders.length > 0 ? ((servedOrders / orders.length) * 100).toFixed(0) : 0}% success rate</span>
            </p>
          </div>
        </div>

        {/* Stat 4 */}
        <div className="rounded-2xl border border-gray-100 bg-white p-5 space-y-4 shadow-sm text-left">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Average ticket</span>
            <div className="h-9 w-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div>
            <p className="font-heading text-2xl sm:text-3xl font-black text-gray-950 font-mono">${averageTicket.toFixed(2)}</p>
            <p className="text-[10px] text-gray-400">Average ticket size per order placed</p>
          </div>
        </div>

      </div>

      {/* Occupied Table Matrix */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 space-y-4 shadow-sm">
        <h3 className="font-heading text-sm font-extrabold text-gray-950 text-left border-b border-gray-50 pb-2">
          Virtual Room Seating Matrix
        </h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
          {[1, 2, 3, 4, 5].map((id) => {
            const isOccupied = occupiedTablesSet.has(String(id));
            const tableOrders = orders.filter((o) => o.tableId === String(id) && o.status !== "Served");
            return (
              <div
                key={id}
                className={`rounded-xl border p-4.5 text-center space-y-2 transition ${
                  isOccupied
                    ? "bg-rose-50 border-rose-200 text-rose-950 shadow-sm"
                    : "bg-emerald-50/40 border-emerald-100 text-emerald-950"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Seat {id}
                  </span>
                  <span className={`h-2.5 w-2.5 rounded-full ${isOccupied ? "bg-rose-500 animate-pulse" : "bg-emerald-500"}`} />
                </div>
                
                <h4 className="font-heading text-lg font-bold">Table {id}</h4>
                
                <p className="text-[10px] font-medium leading-none">
                  {isOccupied 
                    ? `⚠️ Occupied • ${tableOrders.length} ticket${tableOrders.length > 1 ? 's' : ''}` 
                    : "🟢 Ready for Guests"}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Orders Manager Desk */}
      <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-xs">
        
        <div className="bg-gray-50/50 px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-heading text-sm font-extrabold text-gray-950">
            Real-Time Ticket Manager ({orders.length} orders total)
          </h3>
          <span className="font-mono text-[11px] font-semibold text-gray-400">
            Sorted: Newest ➔ Oldest
          </span>
        </div>

        {loading ? (
          <div className="py-16 text-center space-y-2">
            <Loader2 className="h-10 w-10 animate-spin text-orange-500 mx-auto" />
            <p className="text-xs text-gray-500">Syncing database order history...</p>
          </div>
        ) : error ? (
          <div className="py-12 text-center text-rose-500 space-y-2">
            <AlertCircle className="h-10 w-10 mx-auto" />
            <p className="text-xs font-semibold">{error}</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <UtensilsCrossed className="h-10 w-10 text-gray-300 mx-auto" />
            <h4 className="text-sm font-bold text-gray-800">No Orders logged</h4>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">There are no orders stored in orders.json. Go to the menu or a table to submit your first demo ticket!</p>
          </div>
        ) : (
          /* Table style layout for professional order monitoring */
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-700 min-w-[700px]">
              
              <thead className="bg-slate-50 border-b border-gray-100 text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-4 px-6">ID & Date</th>
                  <th className="py-4 px-6 text-center">Table / Spot</th>
                  <th className="py-4 px-6">Dish Elements Ordered</th>
                  <th className="py-4 px-6 text-right">Sum Fee</th>
                  <th className="py-4 px-6 text-center">Current State</th>
                  <th className="py-4 px-6 text-center">Admin Actions Workflow</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50 font-medium">
                {orders.map((ord) => {
                  
                  // Status tag colors
                  const statusColors = {
                    Pending: "bg-amber-50 text-amber-700 border-amber-100",
                    Preparing: "bg-blue-50 text-blue-700 border-blue-100",
                    Served: "bg-emerald-50 text-emerald-700 border-emerald-100"
                  };

                  return (
                    <tr key={ord.orderId} className="hover:bg-amber-50/5 transition">
                      
                      {/* ID and Date */}
                      <td className="py-4 px-6 space-y-0.5">
                        <span className="font-mono font-extrabold text-[13px] bg-gray-100 text-gray-800 px-2 py-0.5 rounded border border-gray-200">
                          {ord.orderId}
                        </span>
                        <p className="text-[10px] text-gray-400 font-semibold font-mono">
                          {new Date(ord.createdAt).toLocaleTimeString()}
                        </p>
                      </td>

                      {/* Seat */}
                      <td className="py-4 px-6 text-center">
                        <span className={`inline-block rounded-lg px-2.5 py-1 text-xs font-bold leading-none ${
                          ord.tableId === "Takeaway" 
                            ? "bg-gray-100 text-gray-800 border border-gray-200"
                            : "bg-indigo-50 text-indigo-700 border border-indigo-100 font-semibold"
                        }`}>
                          {ord.tableId === "Takeaway" ? "Takeaway 🛍️" : `Table ${ord.tableId} 🪑`}
                        </span>
                      </td>

                      {/* Dishes summary */}
                      <td className="py-4 px-6 max-w-xs">
                        <ul className="space-y-1 text-gray-800 font-semibold">
                          {ord.items.map((it, itemIdx) => (
                            <li key={itemIdx} className="flex justify-between text-xs">
                              <span>
                                <span className="text-indigo-650 font-bold">{it.qty}x</span> {it.name}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </td>

                      {/* Value payed */}
                      <td className="py-4 px-6 text-right font-mono font-extrabold text-gray-950 text-[13px]">
                        ${ord.total.toFixed(2)}
                      </td>

                      {/* Status pill */}
                      <td className="py-4 px-6 text-center">
                        <span className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-bold border ${statusColors[ord.status]}`}>
                          {ord.status}
                        </span>
                      </td>

                      {/* Action buttons */}
                      <td className="py-4 px-6 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {ord.status === "Pending" && (
                            <button
                              onClick={() => updateOrderStatus(ord.orderId, "Preparing")}
                              disabled={actionInProgress === ord.orderId}
                              className="rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] uppercase font-bold py-1.5 px-3 transition disabled:opacity-50"
                            >
                              Cook Food
                            </button>
                          )}
                          {ord.status === "Preparing" && (
                            <button
                              onClick={() => updateOrderStatus(ord.orderId, "Served")}
                              disabled={actionInProgress === ord.orderId}
                              className="rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] uppercase font-bold py-1.5 px-3 transition disabled:opacity-50"
                            >
                              Dispatch Food
                            </button>
                          )}
                          {ord.status === "Served" && (
                            <span className="text-[10px] font-bold text-gray-400">✓ Served to Table</span>
                          )}
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>

            </table>
          </div>
        )}

      </div>

    </div>
  );
}
