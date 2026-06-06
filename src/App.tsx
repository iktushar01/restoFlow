import React from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import { CartProvider, useCart } from "./context/CartContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LandingPage from "./pages/LandingPage";
import MenuPage from "./pages/MenuPage";
import CartPage from "./pages/CartPage";
import TablePage from "./pages/TablePage";
import AdminPage from "./pages/AdminPage";
import { Sparkles, ThumbsUp, AlertCircle, Info } from "lucide-react";

function ToastNotificationHub() {
  const { toasts, removeToast } = useCart();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        
        let icon = <Sparkles className="h-4.5 w-4.5 text-emerald-500 shrink-0" />;
        let borderClass = "border-emerald-100 bg-white/95";
        if (toast.type === "error") {
          icon = <AlertCircle className="h-4.5 w-4.5 text-rose-500 shrink-0" />;
          borderClass = "border-rose-100 bg-white/95";
        } else if (toast.type === "info") {
          icon = <Info className="h-4.5 w-4.5 text-blue-500 shrink-0" />;
          borderClass = "border-blue-100 bg-white/95";
        }

        return (
          <div
            key={toast.id}
            onClick={() => removeToast(toast.id)}
            className={`pointer-events-auto flex items-center justify-between gap-3 rounded-2xl border p-4 shadow-lg backdrop-blur-md cursor-pointer transition-all hover:scale-[1.01] animate-scaleIn ${borderClass}`}
          >
            <div className="flex items-center gap-2.5">
              {icon}
              <p className="text-xs font-bold text-gray-900 leading-normal text-left">
                {toast.message}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeToast(toast.id);
              }}
              className="text-gray-400 hover:text-gray-700 text-sm font-bold focus:outline-none"
            >
              &times;
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <HashRouter>
        <div className="flex flex-col min-h-screen bg-[#f8fafc]">
          
          {/* Main header block */}
          <Navbar />

          {/* Primary screen render block */}
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/table/:tableId" element={<TablePage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Routes>
          </main>

          {/* Toast Notification Container */}
          <ToastNotificationHub />

          {/* Footer branding */}
          <Footer />

        </div>
      </HashRouter>
    </CartProvider>
  );
}
