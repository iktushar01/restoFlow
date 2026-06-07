import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { ChefHat, ShoppingBag, LayoutDashboard, QrCode, LogOut, Menu, X, User, Sparkles } from "lucide-react";

export default function Navbar() {
  const location = useLocation();
  const { cartCount, activeTableId, setTableId } = useCart();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-150/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left Side: Logo */}
        <Link 
          to="/" 
          id="nav_logo_link" 
          onClick={closeMenu}
          className="flex items-center gap-2 transition-transform duration-200 hover:scale-[1.01] shrink-0"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-600/15">
            <ChefHat className="h-5.5 w-5.5" />
          </div>
          <div className="text-left">
            <span className="font-heading text-lg sm:text-xl font-bold tracking-tight text-gray-950 block leading-tight">
              Resto<span className="text-indigo-600">Flow</span>
            </span>
            <span className="text-[9px] font-mono tracking-wider text-gray-400 font-bold uppercase block leading-none">
              {user?.role === "admin" ? "HQ Control Center" : "Smart Bistro OS"}
            </span>
          </div>
        </Link>

        {/* Middle/Right: Desktop Navigation Items */}
        <nav className="hidden md:flex items-center gap-4">
          {/* CUSTOMER LINKS */}
          {user?.role === "customer" && (
            <>
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

              <Link
                to="/"
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                onClick={(e) => {
                  if (location.pathname !== "/") {
                    // Normal route transition
                  } else {
                    e.preventDefault();
                    const el = document.getElementById("qr-tables-section");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              >
                <QrCode className="h-4 w-4" />
                Scan Tables
              </Link>
            </>
          )}

          {/* ADMIN LINKS */}
          {user?.role === "admin" && (
            <Link
              to="/admin"
              id="nav_admin_link"
              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                isActive("/admin")
                  ? "bg-indigo-50 text-indigo-700 font-semibold border border-indigo-100"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <LayoutDashboard className="h-4 w-4 text-indigo-600" />
              <span>Admin Console</span>
            </Link>
          )}

          {/* Table ID visualizer */}
          {user?.role === "customer" && activeTableId && (
            <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-100 shrink-0">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>Table {activeTableId}</span>
              <button
                onClick={() => setTableId(null)}
                className="ml-1 text-emerald-400 hover:text-emerald-700 font-bold focus:outline-none cursor-pointer"
                title="Disconnect from Table"
              >
                &times;
              </button>
            </div>
          )}

          {/* Shopping Bag Button */}
          {user?.role === "customer" && (
            <Link
              to="/cart"
              id="nav_cart_link"
              className={`relative flex h-10 w-10 items-center justify-center rounded-xl border transition-all shrink-0 ${
                isActive("/cart")
                  ? "border-indigo-200 bg-indigo-50 text-indigo-600 shadow-sm"
                  : "border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white shadow-md shadow-indigo-600/20">
                  {cartCount}
                </span>
              )}
            </Link>
          )}

          {/* Divider line */}
          {user && <span className="h-6 w-[1.5px] bg-gray-200 mx-1"></span>}

          {/* User profile & logout */}
          {user && (
            <div className="flex items-center gap-2">
              <div className="flex flex-col text-right">
                <span className="text-xs font-bold text-gray-800 leading-tight">
                  {user.name}
                </span>
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-indigo-600 leading-none">
                  {user.role} mode
                </span>
              </div>
              <button
                onClick={() => logout()}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:text-rose-600 hover:bg-rose-50 hover:border-rose-200 transition-all cursor-pointer"
                title="Log Out of Session"
              >
                <LogOut className="h-4.5 w-4.5" />
              </button>
            </div>
          )}
        </nav>

        {/* Right Side: Mobile Indicators + Mobile Toggle Button */}
        <div className="flex items-center gap-2.5 md:hidden">
          {/* Mobile Active Table Flag */}
          {user?.role === "customer" && activeTableId && (
            <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 border border-emerald-100">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>T-{activeTableId}</span>
            </div>
          )}

          {/* Mobile Shopping Bag (Always accessible directly for high UX) */}
          {user?.role === "customer" && (
            <Link
              to="/cart"
              onClick={closeMenu}
              className={`relative flex h-9.5 w-9.5 items-center justify-center rounded-xl border transition-all ${
                isActive("/cart")
                  ? "border-indigo-200 bg-indigo-50 text-indigo-600"
                  : "border-gray-200 text-gray-600 bg-white"
              }`}
            >
              <ShoppingBag className="h-4.5 w-4.5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-indigo-600 text-[9px] font-black text-white">
                  {cartCount}
                </span>
              )}
            </Link>
          )}

          {/* Hamburger toggle button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            type="button"
            className="flex h-9.5 w-9.5 items-center justify-center rounded-xl border border-gray-200 text-gray-600 bg-white hover:bg-gray-50 transition-all focus:outline-none"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

      </div>

      {/* Slide-down mobile panel */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white shadow-2xl px-4 py-6 space-y-5 animate-scaleIn">
          
          {/* User brief card */}
          {user && (
            <div className="rounded-2xl bg-slate-50 border border-gray-100 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600">
                  <User className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <h4 className="text-sm font-bold text-gray-950 leading-tight">
                    {user.name}
                  </h4>
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-600 leading-none mt-1">
                    {user.role} workspace
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  closeMenu();
                  logout();
                }}
                className="flex items-center gap-1.5 rounded-xl border border-rose-250 bg-rose-50 text-rose-700 text-xs font-bold px-3 py-2 hover:bg-rose-100 transition-all cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Exit</span>
              </button>
            </div>
          )}

          {/* Navigation Links */}
          <div className="space-y-1.5">
            {user?.role === "customer" && (
              <>
                <Link
                  to="/menu"
                  onClick={closeMenu}
                  className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold transition-all ${
                    isActive("/menu")
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                      : "text-gray-700 hover:bg-gray-50 border border-transparent"
                  }`}
                >
                  <span>Digital Menu System</span>
                  <ChefHat className="h-4.5 w-4.5 opacity-80" />
                </Link>

                <Link
                  to="/"
                  onClick={(e) => {
                    closeMenu();
                    if (location.pathname !== "/") {
                      // Allow normal navigation to '/'
                    } else {
                      e.preventDefault();
                      const el = document.getElementById("qr-tables-section");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold text-gray-750 hover:bg-slate-50 transition-all border border-transparent"
                >
                  <span>Scan QR Tables</span>
                  <QrCode className="h-4.5 w-4.5 text-indigo-600" />
                </Link>
              </>
            )}

            {user?.role === "admin" && (
              <Link
                to="/admin"
                onClick={closeMenu}
                className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold transition-all ${
                  isActive("/admin")
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                    : "text-gray-700 hover:bg-gray-50 border border-transparent"
                }`}
              >
                <span>HQ Admin Command Console</span>
                <LayoutDashboard className="h-4.5 w-4.5 text-white" />
              </Link>
            )}
          </div>

          {/* Table Quick Disconnect inside Mobile Menu */}
          {user?.role === "customer" && activeTableId && (
            <div className="pt-3 border-t border-gray-100 text-left space-y-2">
              <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest block">
                Session Connectivity
              </span>
              <div className="flex items-center justify-between bg-emerald-50/50 border border-emerald-100 rounded-xl p-3">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-emerald-800">Linked to QR Table {activeTableId}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setTableId(null);
                    closeMenu();
                  }}
                  className="rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] uppercase font-bold px-3 py-1.5 transition"
                >
                  Disconnect
                </button>
              </div>
            </div>
          )}

        </div>
      )}
    </header>
  );
}
