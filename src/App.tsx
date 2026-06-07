import React from "react";
import { HashRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { CartProvider, useCart } from "./context/CartContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LandingPage from "./pages/LandingPage";
import MenuPage from "./pages/MenuPage";
import CartPage from "./pages/CartPage";
import TablePage from "./pages/TablePage";
import AdminPage from "./pages/AdminPage";
import LoginPage from "./pages/LoginPage";
import { Sparkles, AlertCircle, Info, ShieldAlert, ArrowLeft } from "lucide-react";

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

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: ("admin" | "customer")[] }) {
  const { user } = useAuth();

  if (!user) {
    return <LoginPage />;
  }

  if (!allowedRoles.includes(user.role)) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center min-h-[70vh] flex flex-col justify-center space-y-6">
        <div className="h-16 w-16 mx-auto rounded-3xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center shadow-sm">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <div className="space-y-1">
          <h2 className="font-heading text-2xl font-black text-gray-950">Access Restricted</h2>
          <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
            As a <strong className="text-indigo-650 uppercase tracking-widest font-mono text-[11px]">{user.role}</strong>, you do not have permission to view this section.
          </p>
        </div>
        <div className="pt-4">
          <Link
            to={user.role === "admin" ? "/admin" : "/menu"}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-750 text-white text-xs font-bold px-6 py-3 transition shadow-md shadow-indigo-605/15"
          >
            <ArrowLeft className="h-4 w-4" />
            Go to Workspace ({user.role === "admin" ? "Admin Dash" : "Digital Menu"})
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

function AppContent() {
  const { user } = useAuth();

  // Guard all pages with user authentication
  if (!user) {
    return (
      <div className="flex flex-col min-h-screen bg-[#f8fafc]">
        {/* Simple minimal header for LoginPage */}
        <header className="border-b border-gray-100 bg-white py-4 shadow-sm">
          <div className="mx-auto max-w-7xl px-4 flex items-center justify-center">
            <span className="font-heading text-xl font-bold tracking-tight text-gray-950 flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-605 text-white">
                🏰
              </span>
              Resto<span className="text-indigo-650">Flow</span>
            </span>
          </div>
        </header>

        <main className="flex-grow flex items-center justify-center">
          <LoginPage />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc]">
      {/* Dynamic Navbar responds to current user role */}
      <Navbar />

      {/* Primary routes */}
      <main className="flex-grow">
        <Routes>
          {/* Landing / Portal */}
          <Route path="/" element={<LandingPage />} />

          {/* Customer views */}
          <Route
            path="/menu"
            element={
              <ProtectedRoute allowedRoles={["customer"]}>
                <MenuPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute allowedRoles={["customer"]}>
                <CartPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/table/:tableId"
            element={
              <ProtectedRoute allowedRoles={["customer"]}>
                <TablePage />
              </ProtectedRoute>
            }
          />

          {/* Admin views */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminPage />
              </ProtectedRoute>
            }
          />

          {/* Redirect rule */}
          <Route path="*" element={<Navigate to={user.role === "admin" ? "/admin" : "/"} replace />} />
        </Routes>
      </main>

      {/* Persistent notifications hub */}
      <ToastNotificationHub />

      {/* Footer Branding */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <HashRouter>
          <AppContent />
        </HashRouter>
      </CartProvider>
    </AuthProvider>
  );
}
