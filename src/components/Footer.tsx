import React from "react";
import { Link } from "react-router-dom";
import { ChefHat, Heart, MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white">
                <ChefHat className="h-5 w-5" />
              </div>
              <span className="font-heading text-lg font-bold tracking-tight text-gray-950">
                Resto<span className="text-indigo-600">Flow</span>
              </span>
            </Link>
            <p className="text-xs text-gray-500 leading-relaxed max-w-xs">
              Modern digital infrastructure helping premium bistros, bistros, cafes, and hotels streamline guest orders and skyrocket visual ticket value.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading text-xs font-semibold uppercase tracking-wider text-gray-900 mb-4">
              RestFlow Product
            </h3>
            <ul className="space-y-2.5 text-xs text-gray-600">
              <li>
                <Link to="/menu" className="hover:text-indigo-600 transition-colors">
                  Digital Smart Menu
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-indigo-600 transition-colors">
                  Interactive Checkout
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-indigo-600 transition-colors">
                  Admin Real-Time Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Simulated Quick Tables */}
          <div>
            <h3 className="font-heading text-xs font-semibold uppercase tracking-wider text-gray-900 mb-4">
              Table QR Simulators
            </h3>
            <ul className="grid grid-cols-2 gap-2 text-xs text-gray-600">
              <li>
                <Link to="/table/1" className="hover:text-indigo-600 transition-colors font-mono">
                  → Table 1
                </Link>
              </li>
              <li>
                <Link to="/table/2" className="hover:text-indigo-600 transition-colors font-mono">
                  → Table 2
                </Link>
              </li>
              <li>
                <Link to="/table/3" className="hover:text-indigo-600 transition-colors font-mono">
                  → Table 3
                </Link>
              </li>
              <li>
                <Link to="/table/4" className="hover:text-indigo-600 transition-colors font-mono">
                  → Table 4
                </Link>
              </li>
              <li>
                <Link to="/table/5" className="hover:text-indigo-600 transition-colors font-mono">
                  → Table 5
                </Link>
              </li>
            </ul>
          </div>

          {/* Simulated Address Details */}
          <div className="space-y-3 text-xs text-gray-600">
            <h3 className="font-heading text-xs font-semibold uppercase tracking-wider text-gray-900 mb-1">
              Contact & Location
            </h3>
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 shrink-0 text-indigo-600" />
              <span>742 Gourmet Avenue, Culinary District, San Francisco, CA</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-indigo-600" />
              <span>+1 (555) 490-RESTO</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0 text-indigo-600" />
              <span>operations@restoflow.com</span>
            </div>
          </div>

        </div>

        <div className="mt-12 border-t border-gray-100 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© 2026 RestoFlow. All Rights Reserved. Built for high-tier restaurant guests.</p>
          <p className="flex items-center gap-1">
            Engineered with <Heart className="h-3 w-3 fill-rose-500 text-rose-500" /> for modern culinary spaces.
          </p>
        </div>
      </div>
    </footer>
  );
}
