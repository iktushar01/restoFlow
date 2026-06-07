import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { ChefHat, Lock, Mail, ShieldAlert, Sparkles, User, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email || !password) {
      setErrorMsg("Please fill in all credential fields.");
      return;
    }

    const success = login(email, password);
    if (!success) {
      setErrorMsg("Invalid credentials. Try our quick play preset buttons below!");
    }
  };

  const handleQuickPlay = (role: "admin" | "customer") => {
    setErrorMsg(null);
    let targetEmail = "";
    let targetPassword = "";

    if (role === "admin") {
      targetEmail = "admin@restoflow.com";
      targetPassword = "admin";
    } else {
      targetEmail = "customer@restoflow.com";
      targetPassword = "customer";
    }

    setEmail(targetEmail);
    setPassword(targetPassword);
    login(targetEmail, targetPassword);
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-xl transition-all relative overflow-hidden">
        
        {/* Top Accent Strip */}
        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-indigo-600 to-indigo-850" />

        <div className="text-center space-y-3">
          {/* Logo */}
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100">
            <ChefHat className="h-6 w-6" />
          </div>
          <h2 className="text-3xl font-black text-gray-950 tracking-tight">
            Sign In to Resto<span className="text-indigo-600">Flow</span>
          </h2>
          <p className="text-xs text-gray-400 font-medium max-w-xs mx-auto">
            Choose a role to access the workspace, check in tables, or operate the kitchen console.
          </p>
        </div>

        {errorMsg && (
          <div className="rounded-xl bg-rose-50 border border-rose-100 p-3.5 flex items-start gap-2.5 text-xs text-rose-800 font-medium">
            <ShieldAlert className="h-4 w-4 shrink-0 text-rose-500 mt-0.5" />
            <p className="leading-normal">{errorMsg}</p>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block text-left">
              Email Address / Account
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400 pointer-events-none">
                <Mail className="h-4 w-4" />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all font-medium text-gray-950"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block text-left">
              Security Key / Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400 pointer-events-none">
                <Lock className="h-4 w-4" />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all font-medium text-gray-950"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-750 text-white font-bold text-sm py-3 px-4 inline-flex items-center justify-center gap-2 transition duration-200 shadow-md shadow-indigo-600/10 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/25 active:scale-[0.98] mt-2 cursor-pointer"
          >
            Access Smart OS
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        {/* Divider line */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-100"></div>
          </div>
          <div className="relative flex justify-center text-xs font-bold uppercase">
            <span className="bg-white px-3 text-gray-400 tracking-widest">Instant Demo Presets</span>
          </div>
        </div>

        {/* Preset selections for fast testing */}
        <div className="grid grid-cols-2 gap-4">
          {/* Admin Selector */}
          <button
            type="button"
            onClick={() => handleQuickPlay("admin")}
            className="group cursor-pointer rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/20 to-white hover:from-indigo-50/50 p-4 transition text-left space-y-2 hover:border-indigo-300 relative"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
              <User className="h-4.5 w-4.5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-gray-950 uppercase tracking-wide">
                Admin Panel
              </h4>
              <p className="text-[10px] text-gray-400 font-semibold leading-normal mt-0.5">
                Manage orders, add menu items, view seating
              </p>
            </div>
            <span className="absolute top-1 right-2 inline-flex items-center rounded-full bg-indigo-50 px-1.5 py-0.5 text-[8px] font-bold text-indigo-600">
              Preset
            </span>
          </button>

          {/* Customer Selector */}
          <button
            type="button"
            onClick={() => handleQuickPlay("customer")}
            className="group cursor-pointer rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50/10 to-white hover:from-emerald-50/30 p-4 transition text-left space-y-2 hover:border-emerald-200 relative"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
              <Sparkles className="h-4.5 w-4.5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-gray-950 uppercase tracking-wide">
                Customer View
              </h4>
              <p className="text-[10px] text-gray-400 font-semibold leading-normal mt-0.5">
                Scan QR Tables, load cart, checkout food
              </p>
            </div>
            <span className="absolute top-1 right-2 inline-flex items-center rounded-full bg-emerald-50 px-1.5 py-0.5 text-[8px] font-bold text-emerald-600">
              Preset
            </span>
          </button>
        </div>

        {/* Visual Credentials Helper lines */}
        <div className="text-[10px] text-gray-400 font-semibold space-y-0.5 bg-gray-50 p-3 rounded-2xl border border-gray-100">
          <p className="text-left"><strong>Credentials Helper:</strong></p>
          <ul className="list-disc pl-3.5 space-y-0.5 text-left leading-normal">
            <li>Admin: <code className="bg-white px-1 py-0.5 rounded text-gray-800">admin@restoflow.com</code> / <code className="bg-white px-1 py-0.5 rounded text-gray-800">admin</code></li>
            <li>Customer: <code className="bg-white px-1 py-0.5 rounded text-gray-800">customer@restoflow.com</code> / <code className="bg-white px-1 py-0.5 rounded text-gray-800">customer</code></li>
          </ul>
        </div>

      </div>
    </div>
  );
}
