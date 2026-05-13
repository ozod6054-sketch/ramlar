"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Menu, X, Zap, Crown, LogOut, User } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { data: session } = useSession();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const plan = (session?.user as any)?.plan || "free";
  const credits = (session?.user as any)?.credits ?? 0;

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "glass-dark py-3 shadow-lg shadow-black/20" : "py-5"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-pink-500 rounded-full animate-pulse" />
            </div>
            <span className="text-xl font-bold gradient-text">PixelMind</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="#features"
              className="text-white/70 hover:text-white transition-colors text-sm font-medium"
            >
              Imkoniyatlar
            </Link>
            <Link
              href="#gallery"
              className="text-white/70 hover:text-white transition-colors text-sm font-medium"
            >
              Galereya
            </Link>
            <Link
              href="#pricing"
              className="text-white/70 hover:text-white transition-colors text-sm font-medium"
            >
              Narxlar
            </Link>
          </div>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-3">
            {session ? (
              <div className="flex items-center gap-3">
                {/* Credits badge */}
                <div className="flex items-center gap-1.5 glass px-3 py-1.5 rounded-full text-sm">
                  <Zap className="w-3.5 h-3.5 text-yellow-400" />
                  <span className="text-white/80">
                    {credits === -1 ? "∞" : credits} kredit
                  </span>
                </div>

                {/* Plan badge */}
                <div
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-semibold",
                    plan === "pro"
                      ? "plan-badge-pro"
                      : plan === "normal"
                      ? "plan-badge-normal"
                      : "plan-badge-free"
                  )}
                >
                  {plan === "pro" ? (
                    <span className="flex items-center gap-1">
                      <Crown className="w-3 h-3" /> PRO
                    </span>
                  ) : plan === "normal" ? (
                    "NORMAL"
                  ) : (
                    "BEPUL"
                  )}
                </div>

                {/* User menu */}
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 glass px-3 py-2 rounded-xl hover:bg-white/10 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold">
                      {session.user?.name?.[0]?.toUpperCase() || "U"}
                    </div>
                    <span className="text-sm text-white/80">
                      {session.user?.name || "Foydalanuvchi"}
                    </span>
                  </button>

                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 top-full mt-2 w-48 glass-dark rounded-xl overflow-hidden shadow-xl"
                      >
                        <Link
                          href="/dashboard"
                          className="flex items-center gap-2 px-4 py-3 text-sm text-white/80 hover:bg-white/10 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <User className="w-4 h-4" />
                          Dashboard
                        </Link>
                        <Link
                          href="/generate"
                          className="flex items-center gap-2 px-4 py-3 text-sm text-white/80 hover:bg-white/10 transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Sparkles className="w-4 h-4" />
                          Rasm yaratish
                        </Link>
                        <hr className="border-white/10" />
                        <button
                          onClick={() => {
                            setIsUserMenuOpen(false);
                            signOut();
                          }}
                          className="flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors w-full"
                        >
                          <LogOut className="w-4 h-4" />
                          Chiqish
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Link href="/generate" className="btn-primary text-sm py-2 px-4">
                  <Sparkles className="w-4 h-4 inline mr-1" />
                  Yaratish
                </Link>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-white/70 hover:text-white transition-colors text-sm font-medium"
                >
                  Kirish
                </Link>
                <Link href="/register" className="btn-primary text-sm py-2 px-5">
                  Boshlash
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden glass p-2 rounded-xl"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
          >
            {isMobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 glass-dark rounded-2xl overflow-hidden"
            >
              <div className="p-4 space-y-3">
                <Link
                  href="#features"
                  className="block text-white/70 hover:text-white py-2 text-sm"
                  onClick={() => setIsMobileOpen(false)}
                >
                  Imkoniyatlar
                </Link>
                <Link
                  href="#gallery"
                  className="block text-white/70 hover:text-white py-2 text-sm"
                  onClick={() => setIsMobileOpen(false)}
                >
                  Galereya
                </Link>
                <Link
                  href="#pricing"
                  className="block text-white/70 hover:text-white py-2 text-sm"
                  onClick={() => setIsMobileOpen(false)}
                >
                  Narxlar
                </Link>
                <hr className="border-white/10" />
                {session ? (
                  <>
                    <Link
                      href="/generate"
                      className="btn-primary block text-center text-sm"
                      onClick={() => setIsMobileOpen(false)}
                    >
                      Rasm yaratish
                    </Link>
                    <button
                      onClick={() => signOut()}
                      className="block w-full text-red-400 text-sm py-2"
                    >
                      Chiqish
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="block text-white/70 hover:text-white py-2 text-sm"
                      onClick={() => setIsMobileOpen(false)}
                    >
                      Kirish
                    </Link>
                    <Link
                      href="/register"
                      className="btn-primary block text-center text-sm"
                      onClick={() => setIsMobileOpen(false)}
                    >
                      Boshlash
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
