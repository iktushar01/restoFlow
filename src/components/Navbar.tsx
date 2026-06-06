import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { ChefHat, ShoppingBag, LayoutDashboard, QrCode, ClipboardList } from "lucide-react";

export default function Navbar() {
  const location = useLocation();
  const { cartCount, activeTableId, setTableId } = useCart();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <Link 
          to="/" 
          id="nav_logo_link" 
          className="flex items-center gap-2.5 transition-transform duration-200 hover:scale-[1.02]"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/15">
            <ChefHat className="h-5.5 w-5.5" />
          </div>
          <div>
            <span className="font-heading text-xl font-bold tracking-tight text-gray-950">
              Resto<span className="text-indigo-600">Flow</span>
            </span>
            <span className="hidden sm:block text-[9px] font-mono tracking-widest text-gray-400 font-semibold uppercase">
              Smart Bistro OS
            </span>
          </div>
        </Link>

        {/* Navigation Items */}
        <nav className="flex items-center gap-1 sm:gap-4">
          <Link
            to="/menu"
            id="nav_menu_link"
            className={`rounded-lg px-3 py-2 text-sm font-medium transition-all ${
              isActive("/menu")
                ? "bg-indigo-50 text-indigo-600 font-semibold"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            Digital Menu
          </Link>

          {/* QR Tables Sim Menu */}
          <Link
            to="/#qr-tables"
            className={`hidden md:inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all text-gray-600 hover:bg-gray-50 hover:text-gray-900`}
            onClick={() => {
              const el = document.getElementById("qr-tables-section");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
          >
            <QrCode className="h-4 w-4" />
            Scan Tables
          </Link>

          {/* Admin link */}
          <Link
            to="/admin"
            id="nav_admin_link"
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
              isActive("/admin")
                ? "bg-indigo-50/50 text-indigo-700 font-semibold border border-indigo-100"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <LayoutDashboard className="h-4 w-4 text-indigo-600" />
            <span className="hidden sm:inline">Admin Panel</span>
          </Link>

          {/* Table ID visualizer */}
          {activeTableId && (
            <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-100">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Table {activeTableId}</span>
              <button
                onClick={() => setTableId(null)}
                className="ml-1 text-emerald-400 hover:text-emerald-700 font-bold focus:outline-none"
                title="Disconnect from Table"
              >
                &times;
              </button>
            </div>
          )}

          {/* Shopping Bag Button */}
          <Link
            to="/cart"
            id="nav_cart_link"
            className={`relative flex h-10 w-10 items-center justify-center rounded-xl border transition-all ${
              isActive("/cart")
                ? "border-indigo-200 bg-indigo-50 text-indigo-600 shadow-sm"
                : "border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-5.5 w-5.5 items-center justify-center rounded-full bg-indigo-600 text-[11px] font-bold text-white shadow-md shadow-indigo-600/20 animate-scaleIn">
                {cartCount}
              </span>
            )}
          </Link>
        </nav>

      </div>
    </header>
  );
}
