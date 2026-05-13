"use client";

import { motion } from "framer-motion";
import Image from "next/image";

// Demo gallery images - real AI generated image placeholders
const GALLERY_ITEMS = [
  {
    prompt: "Mushuk velosipedda tog'lar orasida",
    style: "Fantastik",
    color: "from-purple-500 to-pink-500",
    emoji: "🐱🚲",
  },
  {
    prompt: "Kosmosda suzayotgan astronavt",
    style: "Sci-Fi",
    color: "from-blue-500 to-cyan-500",
    emoji: "👨‍🚀🌌",
  },
  {
    prompt: "Sehrli o'rmon, parilar",
    style: "Fantaziya",
    color: "from-green-500 to-emerald-500",
    emoji: "🧚🌿",
  },
  {
    prompt: "Futuristik shahar kechasi",
    style: "Cyberpunk",
    color: "from-yellow-500 to-orange-500",
    emoji: "🌆⚡",
  },
  {
    prompt: "Dengiz ostidagi shahar",
    style: "Suv osti",
    color: "from-teal-500 to-blue-500",
    emoji: "🐠🏙️",
  },
  {
    prompt: "Qor yog'ayotgan tog' qishlog'i",
    style: "Manzara",
    color: "from-indigo-500 to-purple-500",
    emoji: "🏔️❄️",
  },
];

export function GallerySection() {
  return (
    <section id="gallery" className="py-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="glass px-4 py-2 rounded-full text-sm text-indigo-300 inline-block mb-4">
            ✨ Galereya
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            AI yaratgan{" "}
            <span className="gradient-text">ajoyib rasmlar</span>
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Foydalanuvchilarimiz yaratgan rasmlardan namunalar
          </p>
        </motion.div>

        {/* Gallery grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {GALLERY_ITEMS.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ scale: 1.03, zIndex: 10 }}
              className="relative group cursor-pointer"
            >
              <div
                className={`aspect-square rounded-2xl bg-gradient-to-br ${item.color} p-0.5`}
              >
                <div className="w-full h-full rounded-[14px] bg-dark-900 flex flex-col items-center justify-center relative overflow-hidden">
                  {/* Animated background */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-10`}
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}
                  />

                  {/* Emoji placeholder */}
                  <div className="text-6xl mb-3 group-hover:scale-110 transition-transform duration-300">
                    {item.emoji}
                  </div>

                  {/* Shimmer effect */}
                  <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4">
                    <p className="text-white text-sm font-medium text-center mb-2">
                      {item.prompt}
                    </p>
                    <span
                      className={`text-xs px-3 py-1 rounded-full bg-gradient-to-r ${item.color} text-white font-semibold`}
                    >
                      {item.style}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <a href="/generate" className="btn-primary inline-flex items-center gap-2">
            ✨ O'zingiz ham yarating
          </a>
        </motion.div>
      </div>
    </section>
  );
}
