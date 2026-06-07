import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { 
  QrCode, 
  ChefHat, 
  Zap, 
  Layers, 
  CheckCircle2, 
  Coins,
  ArrowRight,
  TrendingUp,
  Clock,
  ThumbsUp,
  Smartphone
} from "lucide-react";

export default function LandingPage() {
  const navigate = useNavigate();
  const { setTableId, addToast } = useCart();
  const { user } = useAuth();

  const handleSimulateScan = (id: number) => {
    if (user?.role === "admin") {
      addToast("Switch to a Customer account using logout to test table simulations!", "error");
      return;
    }
    setTableId(String(id));
    addToast(`Successfully Simulated QR Code Scan for Table ${id}!`, "success");
    navigate(`/table/${id}`);
  };

  const simulatedTables = [1, 2, 3, 4, 5];

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50/20 via-white to-white py-16 sm:py-24">
        {/* Subtle decorative circles */}
        <div className="absolute top-0 right-0 -z-10 h-[400px] w-[400px] rounded-full bg-indigo-100/20 blur-3xl" />
        <div className="absolute bottom-10 left-10 -z-10 h-[300px] w-[300px] rounded-full bg-slate-100/30 blur-3xl" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Col Info */}
            <div className="lg:col-span-7 text-center lg:text-left space-y-6">
              
              <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3.5 py-1.5 text-xs font-semibold text-indigo-600 border border-indigo-100/80">
                <Zap className="h-3.5 w-3.5" />
                <span>Next-Gen Guest Ordering Experience</span>
              </div>

              <h1 className="font-heading text-4xl sm:text-6xl font-black tracking-tight text-gray-900 leading-[1.1]">
                Smart Ordering for <br />
                <span className="bg-gradient-to-r from-indigo-600 to-indigo-850 bg-clip-text text-transparent">
                  Modern Restaurants
                </span>
              </h1>

              <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-2xl">
                RestoFlow bridges the gap between culinary craft and frictionless service. Guests scan table QR codes, explore beautiful digital menus, and place instant tickets without the wait.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                {user?.role === "admin" ? (
                  <Link
                    to="/admin"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/15 transition-all hover:bg-indigo-700 hover:-translate-y-0.5"
                  >
                    Go to Admin Workspace
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/menu"
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/15 transition-all hover:bg-indigo-700 hover:-translate-y-0.5"
                    >
                      Explore Digital Menu
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <a
                      href="#qr-tables"
                      onClick={(e) => {
                        e.preventDefault();
                        const el = document.getElementById("qr-tables-section");
                        if (el) el.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-white border border-gray-200 px-6 py-3.5 text-sm font-semibold text-gray-800 shadow-sm transition-all hover:bg-gray-50 hover:border-gray-300"
                    >
                      <QrCode className="h-4.5 w-4.5 text-indigo-600" />
                      Simulate QR Table Order
                    </a>
                  </>
                )}
              </div>

              {/* Mini Social Metrics */}
              <div className="pt-6 border-t border-gray-100 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-gray-500">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>No special app download required</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>Instantly updates order queues</span>
                </div>
              </div>

            </div>

            {/* Right Col Marketing Image Overlay */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-[340px] rounded-[40px] border-8 border-gray-900 bg-gray-900 p-2 shadow-2xl shadow-indigo-900/5">
                {/* Speaker pill */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 h-4 w-24 rounded-full bg-gray-900 z-20" />
                
                {/* Inner Screen Mockup */}
                <div className="overflow-hidden rounded-[32px] bg-indigo-50/10 aspect-[9/19] relative">
                  <img
                    src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&auto=format&fit=crop&q=85"
                    className="absolute inset-0 h-full w-full object-cover brightness-[0.7] contrast-[1.05]"
                    alt="Smartphone Applet UI"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent" />
                  
                  {/* Floating Mock interface details */}
                  <div className="absolute bottom-6 left-4 right-4 text-white space-y-3">
                    <span className="inline-block rounded bg-indigo-600/95 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider font-bold">
                      Demo Live Screen
                    </span>
                    <h3 className="font-heading text-lg font-bold leading-tight">
                      Table 4 ordering session status:
                    </h3>
                    <div className="rounded-xl bg-white/10 backdrop-blur-md p-3 border border-white/10 space-y-2">
                      <div className="flex justify-between text-xs font-semibold">
                        <span>1x Truffle Fries</span>
                        <span>$8.50</span>
                      </div>
                      <div className="flex justify-between text-xs font-semibold">
                        <span>1x Smash Burger</span>
                        <span>$15.00</span>
                      </div>
                      <div className="border-t border-white/10 pt-2 flex justify-between text-sm font-bold text-indigo-300">
                        <span>Total Pay</span>
                        <span>$23.50</span>
                      </div>
                    </div>
                    <p className="text-[10px] text-gray-300 text-center italic">
                      ✨ Touch scan targets below to try this live!
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating review card */}
              <div className="absolute top-12 -left-6 bg-white p-3.5 rounded-xl border border-gray-100 shadow-xl flex items-center gap-3 max-w-[200px] animate-bounce-slow">
                <div className="h-8 w-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <ThumbsUp className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-gray-900">“Zero Friction”</p>
                  <p className="text-[10px] text-gray-500">Ordered in under 45 seconds.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. How It Works Section */}
      <section className="bg-white py-16 sm:py-20 border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold tracking-widest text-indigo-600 uppercase">
              Unified Simple Operations
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-950">
              Frictionless Gastronomy in 4 Simple Steps
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              No login requests, app downloads, or long waiter signals. RestoFlow is pure guest utility.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Step 1 */}
            <div className="relative group p-6 rounded-2xl bg-slate-50/50 border border-gray-100 transition-all hover:bg-white hover:shadow-lg hover:border-gray-200/80">
              <span className="absolute top-4 right-4 font-mono text-3xl font-extrabold text-indigo-50 group-hover:text-indigo-100 transition-colors">
                01
              </span>
              <div className="h-12 w-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6">
                <QrCode className="h-6 w-6" />
              </div>
              <h3 className="font-heading text-lg font-bold text-gray-950 mb-2">
                Scan Table QR
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Guest points camera at the subtle tabletop code. RestoFlow attaches table coordinates instantly.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative group p-6 rounded-2xl bg-slate-50/50 border border-gray-100 transition-all hover:bg-white hover:shadow-lg hover:border-gray-200/80">
              <span className="absolute top-4 right-4 font-mono text-3xl font-extrabold text-indigo-50 group-hover:text-indigo-100 transition-colors">
                02
              </span>
              <div className="h-12 w-12 rounded-xl bg-indigo-50/80 text-indigo-700 flex items-center justify-center mb-6">
                <ChefHat className="h-6 w-6" />
              </div>
              <h3 className="font-heading text-lg font-bold text-gray-950 mb-2">
                Browse Digital Menu
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                A gorgeous mobile menu pops open. High-def photos, precise descriptions, and pricing at a glance.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative group p-6 rounded-2xl bg-slate-50/50 border border-gray-100 transition-all hover:bg-white hover:shadow-lg hover:border-gray-200/80">
              <span className="absolute top-4 right-4 font-mono text-3xl font-extrabold text-indigo-50 group-hover:text-indigo-100 transition-colors">
                03
              </span>
              <div className="h-12 w-12 rounded-xl bg-indigo-100/50 text-indigo-800 flex items-center justify-center mb-6">
                <Smartphone className="h-6 w-6" />
              </div>
              <h3 className="font-heading text-lg font-bold text-gray-950 mb-2">
                Place Order
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Choose Pay at Table or Cash on Delivery. Order is routed straight to the kitchen screen instantly.
              </p>
            </div>

            {/* Step 4 */}
            <div className="relative group p-6 rounded-2xl bg-slate-50/50 border border-gray-100 transition-all hover:bg-white hover:shadow-lg hover:border-gray-200/80">
              <span className="absolute top-4 right-4 font-mono text-3xl font-extrabold text-indigo-50 group-hover:text-indigo-100 transition-colors">
                04
              </span>
              <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center mb-6">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h3 className="font-heading text-lg font-bold text-gray-950 mb-2">
                Food Served!
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Our kitchen prints and prepares the items. Run-times drop by 15 minutes per guest cycle.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 3. VIRTUAL QR TABLE SIMULATOR INTERACTIVE COCKPIT */}
      <section id="qr-tables-section" className="bg-slate-50 py-16 sm:py-20 border-y border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

           <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <span className="text-xs font-bold tracking-widest text-indigo-600 uppercase">
              Interactive Live Cockpit
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-950">
              Scan simulated Table QR Codes
            </h2>
            <p className="text-sm text-gray-600">
              Click any table mockup below. This simulates scanning that physical table’s QR code with your phone. You will be directed to that specific Table order interface with corresponding data tagged.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {simulatedTables.map((id) => (
              <div
                key={id}
                onClick={() => handleSimulateScan(id)}
                className="group cursor-pointer rounded-2xl bg-white border border-gray-200/80 p-5 text-center transition-all duration-300 hover:shadow-xl hover:border-indigo-300 hover:-translate-y-1 block relative"
              >
                {/* Simulated QR Code Graphic */}
                <div className="mx-auto aspect-square w-28 bg-gray-50 rounded-xl border border-gray-100 flex flex-col items-center justify-center p-3.5 relative overflow-hidden group-hover:bg-indigo-50/30 transition-colors">
                  
                  {/* Fake QR Pattern dots */}
                  <div className="w-full h-full opacity-80 flex flex-col justify-between gap-1">
                    <div className="flex justify-between gap-1">
                      <div className="w-6 h-6 border-4 border-gray-900 rounded-sm" />
                      <div className="w-6 h-6 flex flex-wrap gap-1 items-center justify-center">
                        <span className="w-1.5 h-1.5 bg-gray-900 rounded-full" />
                        <span className="w-1.5 h-1.5 bg-gray-900 rounded-full" />
                      </div>
                      <div className="w-6 h-6 border-4 border-gray-900 rounded-sm" />
                    </div>
                    <div className="flex justify-between gap-1 items-center h-full">
                      <span className="w-2 h-2 bg-gray-900" />
                      <span className="w-3 h-1.5 bg-indigo-600" />
                      <span className="w-2 h-2 bg-gray-900" />
                    </div>
                    <div className="flex justify-between gap-1">
                      <div className="w-6 h-6 border-4 border-gray-900 rounded-sm" />
                      <span className="w-2 h-2 bg-gray-900" />
                      <div className="w-6 h-6 bg-gray-900 rounded-sm" />
                    </div>
                  </div>

                  {/* Scan Badge Overlay */}
                  <div className="absolute inset-x-0 bottom-0 bg-indigo-600 text-white text-[9px] font-bold py-0.5 opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-wider">
                    Instant Scan
                  </div>
                </div>

                <div className="mt-4 pt-1 space-y-1.5">
                  <span className="inline-block rounded-full bg-indigo-50 px-2.5 py-0.5 text-[10px] font-bold text-indigo-600 border border-indigo-100">
                    Simulator Target
                  </span>
                  <h3 className="font-heading text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                    Table {id}
                  </h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSimulateScan(id);
                    }}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-650 hover:text-indigo-700"
                  >
                    Launch session <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 p-4 rounded-xl border border-indigo-100/60 bg-indigo-50/50 px-6 max-w-2xl mx-auto flex gap-3 items-start">
            <Smartphone className="h-5 w-5 shrink-0 text-indigo-600 mt-0.5" />
            <p className="text-xs text-indigo-900 leading-relaxed">
              <strong>Testing Tip:</strong> Placing an order from a simulated Table attaches the <code>tableID</code> directly inside the finalized JSON payload. Go ahead, click a table, browse the menu, checkout, and then open the <strong>Admin Panel</strong> to monitor your action live!
            </p>
          </div>

        </div>
      </section>

      {/* 4. Core SaaS Features Section */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Graphics */}
            <div className="order-2 lg:order-1 grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100/50 space-y-2">
                  <TrendingUp className="h-6 w-6 text-indigo-650" />
                  <h4 className="font-heading text-base font-bold text-gray-950">Revenue Booster</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Visual appetising layouts and smart pairings trigger up to 21% higher average checkout ticketing.
                  </p>
                </div>
                <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 space-y-2">
                  <Clock className="h-6 w-6 text-emerald-500" />
                  <h4 className="font-heading text-base font-bold text-gray-950">Faster prep flow</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Instant routing bypasses paper manual copying, decreasing server steps and double key errors.
                  </p>
                </div>
              </div>

              <div className="space-y-4 pt-6">
                <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 space-y-2">
                  <Layers className="h-6 w-6 text-indigo-500" />
                  <h4 className="font-heading text-base font-bold text-gray-950">Analytics Matrix</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Deep insights into top-selling desserts, high-margin coffee roasts, and peak table velocity.
                  </p>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl border border-gray-200/80 space-y-2">
                  <Coins className="h-6 w-6 text-indigo-600" />
                  <h4 className="font-heading text-base font-bold text-gray-950">Pay At Table</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Options for pay via Cash or Simulated mobile Pay At Table directly within the digital basket page.
                  </p>
                </div>
              </div>
            </div>

            {/* Right text details */}
            <div className="order-1 lg:order-2 space-y-6">
              <span className="text-xs font-bold tracking-widest text-indigo-650 uppercase">
                Designed for Restaurant Operations
              </span>
              <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 leading-tight">
                Engineered for busy plates and beautiful hospitality.
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                RestoFlow was built on-site with chefs, busy managers, and guests. It operates with extreme simplicity to keep the core focus on delightful culinary arts, eliminating the traditional bottlenecks of table hosting and taking tickets.
              </p>
              
              <ul className="space-y-3 pt-2">
                <li className="flex items-center gap-3">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <CheckCircle2 className="h-4 w-4" />
                  </span>
                  <span className="text-xs font-medium text-gray-700">100% responsive for all mobile browsers</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <CheckCircle2 className="h-4 w-4" />
                  </span>
                  <span className="text-xs font-medium text-gray-700">Dynamic category filter search built-in</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <CheckCircle2 className="h-4 w-4" />
                  </span>
                  <span className="text-xs font-medium text-gray-700">Detailed administrative orders tracker dashboards</span>
                </li>
              </ul>
            </div>

          </div>

        </div>
      </section>

      {/* 5. Food Menu Premium Preview Section */}
      <section className="bg-gray-50 py-16 border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
            <div>
              <h2 className="font-heading text-2xl sm:text-3xl font-extrabold text-gray-950">
                Gourmet Highlights
              </h2>
              <p className="text-xs text-gray-500">
                A sneak peek into top-tier crowd favorites.
              </p>
            </div>
            <Link
              to="/menu"
              className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-750 transition-all border-b border-indigo-100 hover:border-indigo-600 pb-0.5"
            >
              Launch entire digital menu <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            
            {/* Highlights 1 */}
            <div className="group rounded-2xl bg-white border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  alt="Smash Burger"
                />
                <span className="absolute top-3 right-3 rounded-lg bg-indigo-600 text-white font-mono text-xs font-bold px-2 py-1 shadow-sm">
                  $15.00
                </span>
              </div>
              <div className="p-4 space-y-1">
                <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-indigo-650 font-semibold">
                  Main Course
                </span>
                <h3 className="font-heading text-base font-bold text-gray-950">
                  Classic Resto Smash Burger
                </h3>
                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                  Double dry-aged smash patties, melty cheddar, house burger sauce, and caramelized onions on toasted brioche.
                </p>
              </div>
            </div>

            {/* Highlights 2 */}
            <div className="group rounded-2xl bg-white border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop&q=80"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  alt="Neapolitan Pepperoni Pizza"
                />
                <span className="absolute top-3 right-3 rounded-lg bg-indigo-600 text-white font-mono text-xs font-bold px-2 py-1 shadow-sm">
                  $16.50
                </span>
              </div>
              <div className="p-4 space-y-1">
                <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-indigo-650 font-semibold">
                  Main Course
                </span>
                <h3 className="font-heading text-base font-bold text-gray-950">
                  Neapolitan Pepperoni Pizza
                </h3>
                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                  San Marzano tomatoes, fresh mozzarella, spicy pepperoni slices, fresh basil, and a hot honey drizzle.
                </p>
              </div>
            </div>

            {/* Highlights 3 */}
            <div className="group rounded-2xl bg-white border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500&auto=format&fit=crop&q=80"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  alt="Classic Italian Tiramisu"
                />
                <span className="absolute top-3 right-3 rounded-lg bg-indigo-600 text-white font-mono text-xs font-bold px-2 py-1 shadow-sm">
                  $8.50
                </span>
              </div>
              <div className="p-4 space-y-1">
                <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-indigo-650 font-semibold">
                  Dessert
                </span>
                <h3 className="font-heading text-base font-bold text-gray-950">
                  Classic Italian Tiramisu
                </h3>
                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                  Espresso-soaked coffee ladyfingers, velvety whipped layers of mascarpone cream, dusted with premium dark cocoa powder.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 6. Realistic Testimonials */}
      <section className="bg-white py-16 sm:py-20 border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold tracking-widest text-indigo-600 uppercase">
              Operational Reviews
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-950">
              Trusted by Leading Restorateurs
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Reviews 1 */}
            <div className="rounded-2xl border border-gray-100 p-6 space-y-4 shadow-sm bg-slate-50/40">
              <div className="flex gap-0.5 text-amber-400">
                {"★★★★★".split("").map((s, idx) => (
                  <span key={idx} className="text-lg">★</span>
                ))}
              </div>
              <p className="text-xs text-gray-600 italic leading-relaxed">
                “RestoFlow transformed our tables completely. QR scans on Table 2 are processed in the kitchen instantly. Waiters focus exclusively on clearing and pouring drinks. Absolute pure joy for kitchen efficiency and guest speeds.”
              </p>
              <div className="flex items-center gap-3 border-t border-gray-100 pt-3">
                <div className="h-9 w-9 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs uppercase">
                  MC
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Marcus Corelli</h4>
                  <p className="text-[10px] text-gray-500">Owner, Corelli Modern Pasta Loft</p>
                </div>
              </div>
            </div>

            {/* Reviews 2 */}
            <div className="rounded-2xl border border-gray-100 p-6 space-y-4 shadow-sm bg-slate-50/40">
              <div className="flex gap-0.5 text-amber-400">
                {"★★★★★".split("").map((s, idx) => (
                  <span key={idx} className="text-lg">★</span>
                ))}
              </div>
              <p className="text-xs text-gray-600 italic leading-relaxed">
                “Our guests love not waiting 10 minutes just to get their bill. They order our Cold Brew and Chocolate Cakes straight from their phones. Average checks skyrocketed by 18% during weekend peak hours!”
              </p>
              <div className="flex items-center gap-3 border-t border-gray-100 pt-3">
                <div className="h-9 w-9 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs uppercase">
                  SL
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Sarah Lowther</h4>
                  <p className="text-[10px] text-gray-500">General Director, Bloom & Grind Cafe</p>
                </div>
              </div>
            </div>

            {/* Reviews 3 */}
            <div className="rounded-2xl border border-gray-100 p-6 space-y-4 shadow-sm bg-slate-50/40">
              <div className="flex gap-0.5 text-amber-400">
                {"★★★★★".split("").map((s, idx) => (
                  <span key={idx} className="text-lg">★</span>
                ))}
              </div>
              <p className="text-xs text-gray-600 italic leading-relaxed">
                “Frictionless checkout is beautiful. Pay at table simulation works flawlessly. Implementation into our existing kitchen flow is direct and very easy. Purely professional SaaS structure!”
              </p>
              <div className="flex items-center gap-3 border-t border-gray-100 pt-3">
                <div className="h-9 w-9 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xs uppercase">
                  DK
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Danielle Krey</h4>
                  <p className="text-[10px] text-gray-500">F&B Consultant, Krey Lodging Group</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
