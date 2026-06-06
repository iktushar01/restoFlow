import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { 
  Trash2, 
  ShoppingBag, 
  CreditCard, 
  DollarSign, 
  ArrowLeft, 
  UtensilsCrossed, 
  Loader2, 
  CheckCircle,
  HelpCircle,
  Bookmark
} from "lucide-react";

export default function CartPage() {
  const navigate = useNavigate();
  const { 
    cart, 
    cartTotal, 
    updateQuantity, 
    removeFromCart, 
    activeTableId, 
    placeOrder,
    clearCart
  } = useCart();

  const [paymentMethod, setPaymentMethod] = useState<string>("Cash on Delivery");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [placedOrder, setPlacedOrder] = useState<any | null>(null);

  const taxRate = 0.05; // 5% state tax representation
  const serviceCharge = activeTableId ? 1.50 : 0.00; // flat guest seat fee for scanned tables
  const taxes = cartTotal * taxRate;
  const grandTotal = cartTotal + taxes + serviceCharge;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setSubmitting(true);
    try {
      const order = await placeOrder(paymentMethod);
      setPlacedOrder(order);
    } catch (err) {
      console.error("Order error", err);
    } finally {
      setSubmitting(false);
    }
  };

  // If order was successfully completed
  if (placedOrder) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center animate-scaleIn min-h-[80vh] flex flex-col justify-center">
        <div className="bg-white rounded-3xl border border-gray-100 p-8 sm:p-10 shadow-xl space-y-6 relative overflow-hidden">
          
          <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-indigo-600 to-indigo-800" />
          
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-500 border border-emerald-100">
            <CheckCircle className="h-10 w-10" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 font-mono">
              Kitchen Confirmed
            </span>
            <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-gray-950">
              Order Dispatched!
            </h1>
            <p className="text-sm text-gray-600">
              Your order has been filed directly in our digital queue. Staff have begun preparations.
            </p>
          </div>

          <div className="rounded-2xl bg-amber-50/50 p-5 border border-amber-100/50 space-y-3.5 text-left text-xs text-gray-700">
            <div className="flex justify-between items-center pb-2 border-b border-amber-100/30">
              <span className="font-semibold text-gray-500">Order ID Code:</span>
              <span className="font-mono font-bold text-[13px] bg-amber-100/80 px-2.5 py-0.5 rounded text-amber-900 border border-amber-200">
                {placedOrder.orderId}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="font-semibold text-gray-500">Delivery Point:</span>
              <span className="font-bold text-gray-900">
                {placedOrder.tableId === "Takeaway" ? "🛍️ Takeaway Counter" : `🪑 Table ${placedOrder.tableId}`}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="font-semibold text-gray-500">Billing Total:</span>
              <span className="font-bold text-gray-900 font-mono">${placedOrder.total.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-semibold text-gray-500">Payment Selection:</span>
              <span className="font-semibold text-indigo-600">{paymentMethod}</span>
            </div>

            <div className="pt-2 border-t border-amber-100/30">
              <p className="font-bold text-gray-900 mb-1">Delivered Items:</p>
              <ul className="space-y-1 text-[11px] text-gray-600">
                {placedOrder.items.map((it: any, idx: number) => (
                  <li key={idx} className="flex justify-between">
                    <span>{it.qty}x {it.name}</span>
                    <span>${(it.qty * it.price).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="text-[10px] text-gray-400">
            Open the <strong>Admin Dashboard</strong> to monitor, cook, and change order status logs securely!
          </p>

          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                setPlacedOrder(null);
                navigate("/menu");
              }}
              className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm py-3 transition shadow-lg shadow-indigo-600/15"
            >
              Order More Food
            </button>
            <Link
              to="/admin"
              className="w-full rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold text-sm py-3 transition block"
            >
              Go to Dashboard
            </Link>
          </div>

        </div>
      </div>
    );
  }

  // If cart is empty
  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center min-h-[75vh] flex flex-col justify-center space-y-5">
        <div className="h-16 w-16 mx-auto rounded-2xl bg-indigo-50 text-indigo-605 flex items-center justify-center shadow-inner">
          <ShoppingBag className="h-8 w-8" />
        </div>
        <div className="space-y-1">
          <h2 className="font-heading text-2xl font-black text-gray-950">Your basket is resting.</h2>
          <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
            There are no plates currently waiting for checkout. Open our interactive menu and select a few crowd favorites.
          </p>
        </div>
        <div className="pt-4">
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-6 py-3 transition-transform hover:-translate-y-0.5 shadow-md shadow-indigo-600/10"
          >
            <UtensilsCrossed className="h-4 w-4" />
            Launch Menu System
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 min-h-screen">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
        <div className="space-y-1">
          <Link to="/menu" className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-650 hover:text-indigo-700 mb-1">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Digital Menu
          </Link>
          <h1 className="font-heading text-3xl font-black text-gray-950 tracking-tight">
            Checkout <span className="text-indigo-600">Basket</span>
          </h1>
        </div>
        <button
          onClick={clearCart}
          className="self-start sm:self-center text-xs font-semibold text-rose-500 hover:text-rose-600 border border-rose-100 hover:bg-rose-50 rounded-xl px-3 py-1.5 transition"
        >
          Flush Basket
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column - List of Items in Basket */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm">
            <div className="bg-gray-50/50 px-5 py-3 border-b border-gray-100">
              <span className="font-heading text-xs font-bold uppercase tracking-wider text-gray-500">
                Selected Food Items ({cart.reduce((ac, x) => ac + x.qty, 0)})
              </span>
            </div>

            <div className="divide-y divide-gray-50">
              {cart.map((item) => (
                <div key={item.id} id={`cart-item-${item.id}`} className="p-5 flex gap-4 items-start sm:items-center">
                  
                  {/* Photo representation */}
                  <img
                    src={item.image}
                    className="h-14 w-14 sm:h-16 sm:w-16 rounded-xl object-cover bg-gray-50 border border-gray-100"
                    alt={item.name}
                    referrerPolicy="no-referrer"
                  />

                  {/* Item credentials */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-bold text-gray-950 truncate leading-snug">
                        {item.name}
                      </h3>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-rose-500 transition shrink-0"
                        title="Remove Item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <p className="text-[10px] uppercase font-mono tracking-wider font-semibold text-gray-400">
                      {item.category}
                    </p>

                    {/* Desktop View Price, Controls, and Totals */}
                    <div className="flex items-center justify-between pt-1">
                      <span className="font-mono text-xs font-semibold text-gray-600">
                        ${item.price.toFixed(2)} each
                      </span>

                      {/* Quantity editors */}
                      <div className="flex items-center gap-1.5 bg-gray-50 px-1.5 py-1 rounded-lg border border-gray-100">
                        <button
                          onClick={() => updateQuantity(item.id, item.qty - 1)}
                          className="h-6 w-6 rounded-md bg-white hover:bg-gray-100 flex items-center justify-center text-gray-500 border border-gray-100 transition shadow-3xs"
                          title="Less Portion"
                        >
                          <span className="text-xs font-bold leading-none">-</span>
                        </button>
                        <span className="w-6 text-center text-xs font-bold font-mono text-gray-800">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.qty + 1)}
                          className="h-6 w-6 rounded-md bg-white hover:bg-gray-100 flex items-center justify-center text-gray-500 border border-gray-100 transition shadow-3xs"
                          title="More Portion"
                        >
                          <span className="text-xs font-bold leading-none">+</span>
                        </button>
                      </div>

                      {/* Total line item price */}
                      <span className="font-mono text-xs font-extrabold text-gray-950">
                        ${(item.price * item.qty).toFixed(2)}
                      </span>
                    </div>

                  </div>

                </div>
              ))}
            </div>
          </div>

          {/* Table ID notification */}
          {activeTableId ? (
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4 flex gap-3 items-start text-xs text-emerald-800">
              <CheckCircle className="h-4.5 w-4.5 shrink-0 text-emerald-500 mt-0.5" />
              <div>
                <strong>Table Scanned Anchor active:</strong> This order is tagged for <strong>Table {activeTableId}</strong>. It will be served at that table and can be paid on order, or at table.
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-amber-100 bg-amber-50/50 p-4 flex gap-3 items-start text-xs text-amber-800">
              <HelpCircle className="h-4.5 w-4.5 shrink-0 text-amber-500 mt-0.5" />
              <div>
                <strong>Takeaway Mode active:</strong> You are checking out without scanning a tabletop QR. Order will be marked for pickup at the main counter. To order for a simulated table, click <strong>"Scan Tables"</strong> in the navbar!
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Billing Summaries and Cash on Delivery triggers */}
        <div className="lg:col-span-5">
          <form onSubmit={handleCheckout} className="rounded-2xl border border-gray-100 bg-white p-5 space-y-6 shadow-sm">
            <h3 className="font-heading text-base font-extrabold text-gray-950 pb-3 border-b border-gray-50">
              Billing & Dispatch Summary
            </h3>

            {/* Calculations items */}
            <div className="space-y-2.5 text-xs text-gray-600 font-mono">
              <div className="flex justify-between">
                <span>Items Subtotal:</span>
                <span className="font-semibold text-gray-900">${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>State Tax (5%):</span>
                <span className="font-semibold text-gray-900">${taxes.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Table Service Charge:</span>
                <span className="font-semibold text-gray-900">${serviceCharge.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between text-sm text-gray-950 uppercase font-bold">
                <span>Amount Due:</span>
                <span className="text-indigo-650 text-base">${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Method Accordion */}
            <div className="space-y-3 pt-3 border-t border-gray-50">
              <p className="text-xs font-bold text-gray-900">
                Choose Settlement Terms
              </p>

              <div className="grid grid-cols-1 gap-2.5">
                
                {/* Method 1: Cash on Delivery / Pay after service */}
                <div
                  onClick={() => setPaymentMethod("Cash on Delivery")}
                  className={`rounded-xl border p-3.5 flex items-center gap-3 cursor-pointer transition ${
                    paymentMethod === "Cash on Delivery"
                      ? "border-indigo-500 bg-indigo-50/20"
                      : "border-gray-200 hover:bg-gray-50 bg-white"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment_choice"
                    checked={paymentMethod === "Cash on Delivery"}
                    onChange={() => setPaymentMethod("Cash on Delivery")}
                    className="accent-indigo-650"
                  />
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 shrink-0">
                    <DollarSign className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-gray-950">Cash/Card at Seat</p>
                    <p className="text-[10px] text-gray-500">Pay physically when plates are served.</p>
                  </div>
                </div>

                {/* Method 2: Pay at Table / Digital simulation */}
                <div
                  onClick={() => setPaymentMethod("Pay at Table")}
                  className={`rounded-xl border p-3.5 flex items-center gap-3 cursor-pointer transition ${
                    paymentMethod === "Pay at Table"
                      ? "border-indigo-500 bg-indigo-50/20"
                      : "border-gray-200 hover:bg-gray-50 bg-white"
                  }`}
                >
                  <input
                    type="radio"
                    name="payment_choice"
                    checked={paymentMethod === "Pay at Table"}
                    onChange={() => setPaymentMethod("Pay at Table")}
                    className="accent-indigo-650"
                  />
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 shrink-0">
                    <CreditCard className="h-4.5 w-4.5" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-gray-950">Simulate Pay via App</p>
                    <p className="text-[10px] text-gray-500">Settle order with visual mock mobile card.</p>
                  </div>
                </div>

              </div>
            </div>

            {/* Note placeholder */}
            <div className="space-y-1 text-left">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                Special Kitchen Requests (Allergies, spices)
              </label>
              <textarea
                placeholder="No onions, extra spicy, warm coffee milk, etc."
                rows={2}
                className="w-full rounded-lg border border-gray-200 p-2 text-xs text-gray-950 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500/25 focus:border-indigo-500 transition-all placeholder-gray-400"
              />
            </div>

            {/* Submit checkout buttons */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm py-3 px-4 inline-flex items-center justify-center gap-2 transition duration-200 shadow-md shadow-indigo-600/10 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-600/20 active:scale-[0.98] disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Verifying Order credentials...
                </>
              ) : (
                `File Order - $${grandTotal.toFixed(2)}`
              )}
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
