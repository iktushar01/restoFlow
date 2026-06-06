import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { MenuItem } from "../types";
import { 
  Plus, 
  Minus, 
  ShoppingBag, 
  ChevronRight, 
  Loader2, 
  AlertCircle,
  HelpCircle,
  Clock,
  Sparkles
} from "lucide-react";

export default function TablePage() {
  const { tableId } = useParams<{ tableId: string }>();
  const { 
    cart, 
    cartCount, 
    cartTotal, 
    addToCart, 
    setTableId 
  } = useCart();

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  // Quantity states for local list selectors
  const [localQtys, setLocalQtys] = useState<Record<number, number>>({});

  useEffect(() => {
    if (tableId) {
      setTableId(tableId);
    }
  }, [tableId]);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch("/api/menu");
        if (!response.ok) {
          throw new Error("Failed to load digital menu data from backend.");
        }
        const data = await response.json();
        setMenuItems(data);
        
        const initialQtys: Record<number, number> = {};
        data.forEach((item: MenuItem) => {
          initialQtys[item.id] = 1;
        });
        setLocalQtys(initialQtys);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  const adjustQty = (itemId: number, diff: number) => {
    setLocalQtys((prev) => {
      const current = prev[itemId] || 1;
      return { ...prev, [itemId]: Math.max(1, current + diff) };
    });
  };

  const handleAddToCart = (item: MenuItem) => {
    const qty = localQtys[item.id] || 1;
    addToCart(item, qty);
    
    // Reset quantity back to 1
    setLocalQtys((prev) => ({ ...prev, [item.id]: 1 }));
  };

  const categories = ["All", "Starters", "Main Course", "Drinks", "Dessert"];

  const filteredItems = activeCategory === "All" 
    ? menuItems 
    : menuItems.filter((i) => i.category === activeCategory);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 min-h-screen relative pb-28">
      
      {/* Table Welcome Header */}
      <div className="rounded-3xl bg-gradient-to-r from-gray-950 to-gray-800 p-6 md:p-8 text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 h-44 w-44 rounded-full bg-indigo-600/10 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 h-32 w-32 rounded-full bg-indigo-850/10 blur-2xl pointer-events-none" />

        <div className="max-w-3xl space-y-4 relative z-10 text-left">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-500/15 border border-indigo-500/30 px-3.5 py-1 text-xs font-semibold text-indigo-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Digital QR Table Ordering enabled</span>
          </div>

          <div className="space-y-1">
            <h1 className="font-heading text-3xl sm:text-5xl font-black tracking-tight leading-none">
              Welcome to Table <span className="text-indigo-400">{tableId}</span>
            </h1>
            <p className="text-sm text-gray-300 font-medium">
              You are ordering for <strong className="text-white">Table {tableId}</strong>. Simply browse, tap to pack your plate, and place checkout tickets instantly.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 pt-2 text-xs text-gray-400">
            <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
              <Clock className="h-4 w-4 text-indigo-400" />
              <span>Served at table: ~15-20 mins</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
              <HelpCircle className="h-4 w-4 text-indigo-400" />
              <span>Table service fee: $1.50 flat</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Menu Category Navigation bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-gray-100">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`rounded-xl px-4.5 py-2 text-xs font-bold whitespace-nowrap transition-all ${
              activeCategory === cat
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/15"
                : "bg-white border border-gray-100 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        // Loading animation grids
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div key={idx} className="rounded-2xl border border-gray-100 bg-white p-5 space-y-4 animate-pulse">
              <div className="aspect-[4/3] rounded-xl bg-gray-200" />
              <div className="space-y-2">
                <div className="h-5 bg-gray-200 rounded w-2/3" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        // Error state
        <div className="rounded-2xl bg-rose-50 border border-rose-100 p-8 text-center max-w-lg mx-auto space-y-4">
          <AlertCircle className="h-10 w-10 text-rose-500" />
          <div>
            <h3 className="font-heading text-lg font-bold text-rose-950">Gourmet Dispatch Stall</h3>
            <p className="text-xs text-rose-600 mt-1">{error}</p>
          </div>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center max-w-sm mx-auto">
          <p className="text-sm text-gray-500">No food items matching this filter.</p>
        </div>
      ) : (
        // Dense layout optimized for quick mobile ordering
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => {
            const currentQty = localQtys[item.id] || 1;
            return (
              <div
                key={item.id}
                className="group rounded-2xl border border-gray-100 bg-white p-4 flex gap-4 hover:shadow-lg hover:border-gray-200 transition-all duration-300"
              >
                {/* Square Photo on left */}
                <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                  <img
                    src={item.image}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105 duration-300"
                    alt={item.name}
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute bottom-1 right-1 font-mono text-[10px] font-black bg-indigo-600 text-white px-1.5 py-0.5 rounded shadow-sm">
                    ${item.price.toFixed(2)}
                  </span>
                </div>

                {/* Info and Actions on right */}
                <div className="flex-1 min-w-0 flex flex-col justify-between space-y-2">
                  <div className="space-y-0.5 text-left">
                    <h3 className="text-sm font-bold text-gray-950 truncate leading-snug">
                      {item.name}
                    </h3>
                    <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Actions Row */}
                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-gray-50">
                    
                    {/* Portion trigger */}
                    <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-0.5 border border-gray-100">
                      <button
                        onClick={() => adjustQty(item.id, -1)}
                        className="h-6 w-6 rounded-md bg-white hover:bg-gray-100 flex items-center justify-center text-gray-500 border border-gray-100 transition shadow-3xs"
                        title="Less portion"
                      >
                        <Minus className="h-2.5 w-2.5" />
                      </button>
                      <span className="w-6 text-center text-[11px] font-bold font-mono text-gray-800">
                        {currentQty}
                      </span>
                      <button
                        onClick={() => adjustQty(item.id, 1)}
                        className="h-6 w-6 rounded-md bg-white hover:bg-gray-100 flex items-center justify-center text-gray-500 border border-gray-100 transition shadow-3xs"
                        title="More portion"
                      >
                        <Plus className="h-2.5 w-2.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => handleAddToCart(item)}
                      className="rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] uppercase tracking-wider px-3.5 py-1.5 transition active:scale-95"
                    >
                      Add +
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* STICKY BOTTOM EXCEL BASKET FLOATING BAR (Uber Eats Style) */}
      {cartCount > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-lg animate-slideUp">
          <Link
            to="/cart"
            id="sticky_basket_drawer"
            className="flex items-center justify-between rounded-2xl bg-indigo-600 hover:bg-indigo-700 px-6 py-4 text-white shadow-xl shadow-indigo-600/20 border border-indigo-500 transition-all hover:scale-[1.01]"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 border border-white/10 text-white">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold uppercase tracking-widest text-indigo-200">
                  Ready to serve table {tableId}
                </p>
                <p className="text-sm font-black font-mono">
                  {cartCount} {cartCount === 1 ? "Item" : "Items"} • ${cartTotal.toFixed(2)}
                </p>
              </div>
            </div>

            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase bg-white text-indigo-650 px-3.5 py-1.5 rounded-xl shadow-md">
              View Basket
              <ChevronRight className="h-4.5 w-4.5" />
            </span>
          </Link>
        </div>
      )}

    </div>
  );
}
