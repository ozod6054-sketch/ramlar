"use client";

import Link from "next/link";
import { Sparkles, Github, Twitter, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/10 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold gradient-text">PixelMind</span>
            </div>
            <p className="text-white/50 text-sm max-w-xs leading-relaxed">
              Sun'iy intellekt yordamida so'zlaringizni ajoyib rasmlarga
              aylantiring. Eng zamonaviy AI texnologiyalari bilan.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a
                href="#"
                className="glass p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <Twitter className="w-4 h-4 text-white/60" />
              </a>
              <a
                href="#"
                className="glass p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <Instagram className="w-4 h-4 text-white/60" />
              </a>
              <a
                href="#"
                className="glass p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <Github className="w-4 h-4 text-white/60" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Sahifalar</h4>
            <ul className="space-y-2">
              {[
                { label: "Bosh sahifa", href: "/" },
                { label: "Rasm yaratish", href: "/generate" },
                { label: "Narxlar", href: "#pricing" },
                { label: "Galereya", href: "#gallery" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/50 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Qo'llab-quvvatlash</h4>
            <ul className="space-y-2">
              {[
                { label: "Yordam markazi", href: "#" },
                { label: "Maxfiylik siyosati", href: "#" },
                { label: "Foydalanish shartlari", href: "#" },
                { label: "Bog'lanish", href: "#" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-white/50 hover:text-white text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm">
            © 2024 PixelMind AI. Barcha huquqlar himoyalangan.
          </p>
          <p className="text-white/40 text-sm">
            ❤️ O'zbekistonda yaratilgan
          </p>
        </div>
      </div>
    </footer>
  );
}
