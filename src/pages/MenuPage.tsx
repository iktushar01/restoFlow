import React, { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { MenuItem } from "../types";
import { Search, ShoppingBag, Filter, Check, Plus, Minus, AlertCircle } from "lucide-react";

export default function MenuPage() {
  const { addToCart, activeTableId } = useCart();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Keep track of quantity per menu item ID
  const [quantities, setQuantities] = useState<Record<number, number>>({});

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch("/api/menu");
        if (!response.ok) {
          throw new Error("Failed to load digital menu data from backend.");
        }
        const data = await response.json();
        setMenuItems(data);
        
        // Initialize default quantity mapping to 1
        const initialQtys: Record<number, number> = {};
        data.forEach((item: MenuItem) => {
          initialQtys[item.id] = 1;
        });
        setQuantities(initialQtys);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  const changeQuantity = (itemId: number, change: number) => {
    setQuantities((prev) => {
      const current = prev[itemId] || 1;
      const next = Math.max(1, current + change);
      return { ...prev, [itemId]: next };
    });
  };

  const categories = ["All", "Starters", "Main Course", "Drinks", "Dessert"];

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (item: MenuItem) => {
    const qty = quantities[item.id] || 1;
    addToCart(item, qty);
    
    // Reset individual item quantity back to 1
    setQuantities((prev) => ({ ...prev, [item.id]: 1 }));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 min-h-screen">
      
      {/* Table Welcome Badge */}
      {activeTableId && (
        <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
            </span>
            <div>
              <p className="text-sm font-bold text-emerald-950">You are placing an order for Table {activeTableId}</p>
              <p className="text-xs text-emerald-600">All added plates will be routed directly to Table {activeTableId}'s virtual ticket.</p>
            </div>
          </div>
          <span className="text-xs font-mono font-semibold text-emerald-700 uppercase bg-emerald-100/60 px-2.5 py-1 rounded-lg">
            Direct QR Sync
          </span>
        </div>
      )}

      {/* Hero Header */}
      <div className="text-center sm:text-left space-y-2">
        <h1 className="font-heading text-3xl sm:text-5xl font-black text-gray-950 tracking-tight">
          Crafted Digital <span className="text-indigo-600">Menu</span>
        </h1>
        <p className="text-sm text-gray-500 max-w-2xl leading-relaxed">
          Order premium dishes made from farm-to-table organic ingredients. Filter categories, adjust dish portions, and enjoy instant table dispatching.
        </p>
      </div>

      {/* Control Cockpit Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between pb-4 border-b border-gray-100">
        
        {/* Search */}
        <div className="relative w-full md:max-w-md">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-gray-400">
            <Search className="h-4.5 w-4.5" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search our delicious burgers, pizza, coffee..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white placeholder-gray-400 text-sm text-gray-950 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-xs"
          />
        </div>

        {/* Categories filters */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-xl px-4 py-2 text-xs font-semibold tracking-wide whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/15"
                  : "bg-white border border-gray-100 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

      </div>

      {/* Dynamic Main Section */}
      {loading ? (
        // Skeleton loader grids
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((idx) => (
            <div key={idx} className="rounded-2xl border border-gray-100 bg-white p-5 space-y-4 animate-pulse">
              <div className="aspect-[4/3] rounded-xl bg-gray-200" />
              <div className="h-5 bg-gray-200 rounded w-2/3" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
              <div className="h-8 bg-gray-200 rounded pt-3" />
            </div>
          ))}
        </div>
      ) : error ? (
        // Error state feedback
        <div className="rounded-2xl bg-rose-50 border border-rose-100 p-8 text-center max-w-lg mx-auto space-y-4">
          <AlertCircle className="h-10 w-10 text-rose-500 mx-auto" />
          <div>
            <h3 className="font-heading text-lg font-bold text-rose-950">Menu Delivery Error</h3>
            <p className="text-xs text-rose-600 mt-1">{error}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="rounded-xl bg-rose-600 text-white px-4 py-2 text-xs font-semibold hover:bg-rose-700 transition"
          >
            Refetch Menu Data
          </button>
        </div>
      ) : filteredItems.length === 0 ? (
        // No items matching state
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center max-w-md mx-auto space-y-4">
          <ShoppingBag className="h-10 w-10 text-gray-300 mx-auto" />
          <div>
            <h3 className="font-heading text-lg font-bold text-gray-900">No plates found</h3>
            <p className="text-xs text-gray-500 mt-1">We couldn't locate any dishes matching "{searchQuery}" under {selectedCategory}. Try shifting parameters.</p>
          </div>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
            }}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
          >
            Reset filter searches
          </button>
        </div>
      ) : (
        // Premium Grid layout
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => {
            const currentQty = quantities[item.id] || 1;
            return (
              <div
                key={item.id}
                id={`menu-card-${item.id}`}
                className="group rounded-2xl border border-gray-100 bg-white overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-gray-200/80 flex flex-col h-full"
              >
                {/* Photo Header */}
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
                  <img
                    src={item.image}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    alt={item.name}
                    referrerPolicy="no-referrer"
                  />
                  {/* Category Chip */}
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs rounded-full px-2.5 py-0.5 text-[9px] font-bold text-gray-700 border border-gray-100 uppercase tracking-wider shadow-sm">
                    {item.category}
                  </span>
                  
                  {/* Digital Price tag badge */}
                  <span className="absolute bottom-3 right-3 rounded-lg bg-indigo-600 text-white font-mono text-sm font-bold px-2.5 py-1 shadow-md shadow-indigo-600/10">
                    ${item.price.toFixed(2)}
                  </span>
                </div>

                {/* Body details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <h3 className="font-heading text-lg font-bold text-gray-950 group-hover:text-indigo-600 transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
                      {item.description}
                    </p>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                    
                    {/* Quantity selectors */}
                    <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1 border border-gray-100">
                      <button
                        onClick={() => changeQuantity(item.id, -1)}
                        className="h-7 w-7 rounded-md bg-white hover:bg-gray-100 flex items-center justify-center text-gray-500 border border-gray-100 transition shadow-2xs hover:text-gray-900"
                        title="Reduce Quantity"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-8 text-center text-xs font-bold font-mono text-gray-800">
                        {currentQty}
                      </span>
                      <button
                        onClick={() => changeQuantity(item.id, 1)}
                        className="h-7 w-7 rounded-md bg-white hover:bg-gray-100 flex items-center justify-center text-gray-500 border border-gray-100 transition shadow-2xs hover:text-gray-900"
                        title="Increase Quantity"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    {/* Add triggers */}
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-4 py-2.5 inline-flex items-center gap-1.5 transition duration-200 shadow-md shadow-indigo-600/10 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-605/20 active:scale-[0.98]"
                    >
                      Add To Cart
                    </button>

                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
