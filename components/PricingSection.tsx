"use client";

import { motion } from "framer-motion";
import { Check, Crown, Zap, Star } from "lucide-react";
import { PLANS } from "@/lib/stripe";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { useState } from "react";

export function PricingSection() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (planKey: string) => {
    if (!session) {
      router.push("/register");
      return;
    }

    if (planKey === "free") {
      toast.success("Siz allaqachon bepul rejimdasiz!");
      return;
    }

    setLoading(planKey);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planKey }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error("Xatolik yuz berdi");
      }
    } catch (error) {
      toast.error("Xatolik yuz berdi");
    } finally {
      setLoading(null);
    }
  };

  const plans = [
    { key: "free", ...PLANS.free },
    { key: "normal", ...PLANS.normal },
    { key: "pro", ...PLANS.pro },
  ];

  return (
    <section id="pricing" className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="glass px-4 py-2 rounded-full text-sm text-yellow-300 inline-block mb-4">
            💎 Narxlar
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            O'zingizga mos{" "}
            <span className="gradient-text">rejimni tanlang</span>
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Bepuldan boshlang, kerak bo'lsa yangilang. Hech qanday yashirin to'lov yo'q.
          </p>
        </motion.div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, i) => {
            const isPopular = plan.key === "normal";
            const isPro = plan.key === "pro";
            const isFree = plan.key === "free";
            const currentPlan = (session?.user as any)?.plan;
            const isCurrentPlan = currentPlan === plan.key;

            return (
              <motion.div
                key={plan.key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                className={cn(
                  "relative rounded-3xl p-8 transition-all duration-300",
                  isPro
                    ? "bg-gradient-to-b from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 glow-gold"
                    : isPopular
                    ? "bg-gradient-to-b from-indigo-500/10 to-purple-500/10 border border-indigo-500/30 glow-purple"
                    : "glass"
                )}
              >
                {/* Badge */}
                {plan.badge && (
                  <div
                    className={cn(
                      "absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-bold text-white",
                      isPro
                        ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                        : "bg-gradient-to-r from-indigo-500 to-purple-500"
                    )}
                  >
                    {isPro ? (
                      <span className="flex items-center gap-1">
                        <Crown className="w-3 h-3" /> {plan.badge}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3" /> {plan.badge}
                      </span>
                    )}
                  </div>
                )}

                {/* Plan name */}
                <div className="mb-6">
                  <h3
                    className={cn(
                      "text-2xl font-bold mb-1",
                      isPro
                        ? "gradient-text-gold"
                        : isPopular
                        ? "gradient-text"
                        : "text-white"
                    )}
                  >
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-black text-white">
                      ${plan.price}
                    </span>
                    {plan.price > 0 && (
                      <span className="text-white/50 text-sm">/oy</span>
                    )}
                  </div>
                  <p className="text-white/50 text-sm mt-2">
                    {plan.credits === -1
                      ? "Cheksiz rasm"
                      : `${plan.credits} ta rasm/oy`}
                  </p>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-3">
                      <div
                        className={cn(
                          "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0",
                          isPro
                            ? "bg-yellow-500/20"
                            : isPopular
                            ? "bg-indigo-500/20"
                            : "bg-white/10"
                        )}
                      >
                        <Check
                          className={cn(
                            "w-3 h-3",
                            isPro
                              ? "text-yellow-400"
                              : isPopular
                              ? "text-indigo-400"
                              : "text-white/60"
                          )}
                        />
                      </div>
                      <span className="text-white/70 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  onClick={() => handleSubscribe(plan.key)}
                  disabled={loading === plan.key || isCurrentPlan}
                  className={cn(
                    "w-full py-3 px-6 rounded-xl font-semibold text-sm transition-all duration-200",
                    isCurrentPlan
                      ? "bg-white/10 text-white/50 cursor-not-allowed"
                      : isPro
                      ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:scale-105 hover:shadow-lg hover:shadow-yellow-500/25 active:scale-95"
                      : isPopular
                      ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/25 active:scale-95"
                      : "glass text-white hover:bg-white/10 active:scale-95"
                  )}
                >
                  {loading === plan.key ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Yuklanmoqda...
                    </span>
                  ) : isCurrentPlan ? (
                    "Joriy rejim ✓"
                  ) : isFree ? (
                    "Bepul boshlash"
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      {isPro ? (
                        <Crown className="w-4 h-4" />
                      ) : (
                        <Zap className="w-4 h-4" />
                      )}
                      {plan.name} rejimga o'tish
                    </span>
                  )}
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Money back guarantee */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-white/40 text-sm mt-8"
        >
          🔒 30 kunlik pul qaytarish kafolati • Istalgan vaqt bekor qilish mumkin
        </motion.p>
      </div>
    </section>
  );
}
