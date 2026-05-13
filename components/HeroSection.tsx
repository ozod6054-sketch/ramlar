"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight, Wand2, Star, Zap } from "lucide-react";

const EXAMPLE_PROMPTS = [
  "Mushuk velosipedda tog'lar orasida ketmoqda",
  "Kosmosda suzayotgan astronavt, neon ranglar",
  "Sehrli o'rmon, parilar va yulduzlar",
  "Futuristik shahar, kechasi, neon chiroqlar",
  "Dengiz ostidagi shahar, baliqlar va marjonlar",
];

export function HeroSection() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [currentExample, setCurrentExample] = useState(0);

  const handleGenerate = () => {
    if (prompt.trim()) {
      router.push(`/generate?prompt=${encodeURIComponent(prompt)}`);
    } else {
      router.push("/generate");
    }
  };

  const useExample = (example: string) => {
    setPrompt(example);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 pb-16 px-4">
      <div className="max-w-5xl mx-auto text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full text-sm text-white/80 mb-8"
        >
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span>AI bilan rasm yaratishning eng oson yo'li</span>
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
        </motion.div>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-black mb-6 leading-tight"
        >
          So'zlaringizni{" "}
          <span className="gradient-text">Rasmlarga</span>
          <br />
          Aylantiring
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl text-white/60 mb-12 max-w-2xl mx-auto"
        >
          Xohlagan narsangizni yozing — mushuk velosipedda, kosmik shahar,
          sehrli o'rmon — va AI bir zumda ajoyib rasm yaratadi!
        </motion.p>

        {/* Input area */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-2xl mx-auto mb-8"
        >
          <div className="gradient-border p-1">
            <div className="bg-dark-900 rounded-[14px] p-2 flex gap-2">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                placeholder="Mushuk velosipedda ketmoqda..."
                className="flex-1 bg-transparent px-4 py-3 text-white placeholder-white/30 focus:outline-none text-base"
              />
              <button
                onClick={handleGenerate}
                className="btn-primary flex items-center gap-2 whitespace-nowrap"
              >
                <Wand2 className="w-4 h-4" />
                Yaratish
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Example prompts */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-2 mb-16"
        >
          <span className="text-white/40 text-sm self-center">Masalan:</span>
          {EXAMPLE_PROMPTS.map((example, i) => (
            <button
              key={i}
              onClick={() => useExample(example)}
              className="glass px-3 py-1.5 rounded-full text-xs text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              {example}
            </button>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="grid grid-cols-3 gap-8 max-w-lg mx-auto"
        >
          {[
            { value: "1M+", label: "Rasm yaratildi" },
            { value: "50K+", label: "Foydalanuvchi" },
            { value: "4.9★", label: "Reyting" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl font-bold gradient-text">{stat.value}</div>
              <div className="text-white/50 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/20 rounded-full flex items-start justify-center p-1"
          >
            <div className="w-1.5 h-3 bg-white/40 rounded-full" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
