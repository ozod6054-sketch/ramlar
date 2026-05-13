"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  Sparkles,
  Crown,
  Zap,
  Image as ImageIcon,
  Download,
  Calendar,
  TrendingUp,
  Plus,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { cn } from "@/lib/utils";
import Link from "next/link";
import toast from "react-hot-toast";
import { Suspense } from "react";

interface GeneratedImage {
  id: string;
  prompt: string;
  imageUrl: string;
  model: string;
  style: string;
  createdAt: string;
}

function DashboardContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const userPlan = (session?.user as any)?.plan || "free";
  const userCredits = (session?.user as any)?.credits ?? 0;

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (searchParams.get("success") === "true") {
      const plan = searchParams.get("plan");
      toast.success(`${plan === "pro" ? "Pro" : "Normal"} rejimga o'tdingiz! 🎉`);
    }
  }, [searchParams]);

  useEffect(() => {
    if (session) {
      fetchImages();
    }
  }, [session]);

  const fetchImages = async () => {
    try {
      const res = await fetch("/api/user/images?limit=12");
      const data = await res.json();
      setImages(data.images || []);
      setTotal(data.total || 0);
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (imageUrl: string, prompt: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `pixelmind-${Date.now()}.png`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Yuklab olindi!");
    } catch {
      toast.error("Yuklab olishda xatolik");
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) return null;

  const planColors = {
    free: "from-gray-500 to-gray-600",
    normal: "from-blue-500 to-indigo-600",
    pro: "from-yellow-500 to-orange-500",
  };

  const planColor = planColors[userPlan as keyof typeof planColors] || planColors.free;

  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-white mb-1">
              Salom, {session.user?.name}! 👋
            </h1>
            <p className="text-white/50">Sizning dashboard</p>
          </motion.div>

          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Plan card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={cn(
                "rounded-2xl p-6 bg-gradient-to-br",
                planColor,
                "relative overflow-hidden"
              )}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                  {userPlan === "pro" ? (
                    <Crown className="w-5 h-5 text-white" />
                  ) : (
                    <Sparkles className="w-5 h-5 text-white" />
                  )}
                  <span className="text-white/80 text-sm font-medium">
                    Joriy rejim
                  </span>
                </div>
                <div className="text-3xl font-black text-white capitalize mb-1">
                  {userPlan === "free"
                    ? "Bepul"
                    : userPlan === "normal"
                    ? "Normal"
                    : "Pro"}
                </div>
                {userPlan !== "pro" && (
                  <Link
                    href="/#pricing"
                    className="text-white/70 text-xs hover:text-white transition-colors underline"
                  >
                    Yangilash →
                  </Link>
                )}
              </div>
            </motion.div>

            {/* Credits card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass rounded-2xl p-6"
            >
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span className="text-white/60 text-sm">Kreditlar</span>
              </div>
              <div className="text-3xl font-black text-white mb-1">
                {userCredits === -1 ? "∞" : userCredits}
              </div>
              <p className="text-white/40 text-xs">
                {userCredits === -1
                  ? "Cheksiz kredit"
                  : userCredits === 0
                  ? "Kreditlar tugadi"
                  : `${userCredits} ta rasm yaratish mumkin`}
              </p>
            </motion.div>

            {/* Total images card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass rounded-2xl p-6"
            >
              <div className="flex items-center gap-2 mb-3">
                <ImageIcon className="w-5 h-5 text-purple-400" />
                <span className="text-white/60 text-sm">Jami rasmlar</span>
              </div>
              <div className="text-3xl font-black text-white mb-1">{total}</div>
              <p className="text-white/40 text-xs">Yaratilgan rasmlar soni</p>
            </motion.div>
          </div>

          {/* Quick action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <Link
              href="/generate"
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Yangi rasm yaratish
            </Link>
          </motion.div>

          {/* Images gallery */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-purple-400" />
              Mening rasmlarim
            </h2>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square glass rounded-2xl shimmer"
                  />
                ))}
              </div>
            ) : images.length === 0 ? (
              <div className="glass rounded-2xl p-16 text-center">
                <ImageIcon className="w-16 h-16 text-white/20 mx-auto mb-4" />
                <p className="text-white/50 text-lg mb-2">
                  Hali rasm yaratmadingiz
                </p>
                <p className="text-white/30 text-sm mb-6">
                  Birinchi rasmingizni yarating!
                </p>
                <Link href="/generate" className="btn-primary inline-flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Rasm yaratish
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((image, i) => (
                  <motion.div
                    key={image.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="group relative aspect-square rounded-2xl overflow-hidden glass"
                  >
                    <Image
                      src={image.imageUrl}
                      alt={image.prompt}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-end p-3">
                      <p className="text-white text-xs line-clamp-2 mb-2">
                        {image.prompt}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-white/40 text-[10px]">
                          {new Date(image.createdAt).toLocaleDateString("uz-UZ")}
                        </span>
                        <button
                          onClick={() =>
                            handleDownload(image.imageUrl, image.prompt)
                          }
                          className="glass p-1.5 rounded-lg hover:bg-white/20 transition-colors"
                        >
                          <Download className="w-3 h-3 text-white" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Upgrade CTA for free users */}
          {userPlan === "free" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-8 gradient-border p-6 text-center"
            >
              <Crown className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
              <h3 className="text-white font-bold text-lg mb-2">
                Ko'proq rasm yarating!
              </h3>
              <p className="text-white/60 text-sm mb-4">
                Normal rejimda oyiga 50 ta, Pro rejimda cheksiz rasm yarating
              </p>
              <Link href="/#pricing" className="btn-primary inline-flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Rejimni yangilash
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </main>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
