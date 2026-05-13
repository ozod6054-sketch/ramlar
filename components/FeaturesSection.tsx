"use client";

import { motion } from "framer-motion";
import {
  Wand2,
  Zap,
  Palette,
  Download,
  Shield,
  Sparkles,
  Film,
  Globe,
} from "lucide-react";

const FEATURES = [
  {
    icon: Wand2,
    title: "Oson foydalanish",
    description:
      "Faqat matn yozing va AI bir zumda ajoyib rasm yaratadi. Hech qanday texnik bilim kerak emas.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Zap,
    title: "Tez yaratish",
    description:
      "Eng zamonaviy AI modellari yordamida rasmlar 5-10 soniyada yaratiladi.",
    color: "from-yellow-500 to-orange-500",
  },
  {
    icon: Palette,
    title: "Ko'p uslublar",
    description:
      "Fotorealistik, animatsiya, rasm, fantaziya va boshqa ko'plab uslublarda rasm yarating.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Film,
    title: "Animatsiya",
    description:
      "Pro rejimda rasmlaringizni animatsiyaga aylantiring. Harakatlanuvchi GIF va video yarating.",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Download,
    title: "Yuklab olish",
    description:
      "Yaratilgan rasmlarni yuqori sifatda PNG, JPG formatlarida yuklab oling.",
    color: "from-indigo-500 to-purple-500",
  },
  {
    icon: Shield,
    title: "Xavfsiz va shaxsiy",
    description:
      "Sizning rasmlaringiz va ma'lumotlaringiz to'liq himoyalangan va maxfiy saqlanadi.",
    color: "from-red-500 to-pink-500",
  },
  {
    icon: Sparkles,
    title: "Premium modellar",
    description:
      "FLUX, Stable Diffusion, DALL-E kabi eng yaxshi AI modellaridan foydalaning.",
    color: "from-teal-500 to-blue-500",
  },
  {
    icon: Globe,
    title: "O'zbek tilida",
    description:
      "O'zbek tilida ham buyruq bering! AI o'zbek tilini tushunadi va rasm yaratadi.",
    color: "from-orange-500 to-red-500",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="glass px-4 py-2 rounded-full text-sm text-purple-300 inline-block mb-4">
            🚀 Imkoniyatlar
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Nima uchun{" "}
            <span className="gradient-text">PixelMind?</span>
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Eng zamonaviy AI texnologiyalari bilan qurilgan, foydalanish uchun
            qulay platforma
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              whileHover={{ y: -5 }}
              className="glass rounded-2xl p-6 card-hover group"
            >
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}
              >
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">
                {feature.title}
              </h3>
              <p className="text-white/50 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
