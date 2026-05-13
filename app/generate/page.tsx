"use client";

import { useState, useEffect, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wand2,
  Download,
  Share2,
  RefreshCw,
  Settings,
  Sparkles,
  Lock,
  ChevronDown,
  Image as ImageIcon,
  Zap,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import Link from "next/link";

declare global {
  interface Window {
    puter: any;
  }
}

const STYLES = [
  { id: "none", label: "Oddiy", emoji: "🎨" },
  { id: "photorealistic", label: "Fotorealistik", emoji: "📷" },
  { id: "anime", label: "Anime", emoji: "🎌" },
  { id: "oil-painting", label: "Moy bo'yoq", emoji: "🖼️" },
  { id: "watercolor", label: "Akvarel", emoji: "💧" },
  { id: "digital-art", label: "Raqamli san'at", emoji: "💻" },
  { id: "3d-render", label: "3D render", emoji: "🎮" },
  { id: "sketch", label: "Eskiz", emoji: "✏️" },
  { id: "cyberpunk", label: "Cyberpunk", emoji: "⚡" },
  { id: "fantasy", label: "Fantaziya", emoji: "🧙" },
];

const STYLE_PROMPTS: Record<string, string> = {
  none: "",
  photorealistic: "photorealistic, ultra detailed, 8k, professional photography, sharp focus",
  anime: "anime style, manga art, vibrant colors, Studio Ghibli inspired",
  "oil-painting": "oil painting, classical art style, textured brushstrokes, masterpiece",
  watercolor: "watercolor painting, soft colors, artistic, flowing paint",
  "digital-art": "digital art, concept art, highly detailed, artstation trending",
  "3d-render": "3D render, octane render, cinema 4D, photorealistic 3D, ray tracing",
  sketch: "pencil sketch, hand drawn, detailed line art, black and white",
  cyberpunk: "cyberpunk style, neon lights, futuristic city, dark atmosphere, blade runner",
  fantasy: "fantasy art, magical, epic, detailed, mystical atmosphere, D&D art style",
};

function GeneratePageContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [prompt, setPrompt] = useState(searchParams.get("prompt") || "");
  const [selectedStyle, setSelectedStyle] = useState("none");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [generationTime, setGenerationTime] = useState<number | null>(null);
  const [puterLoaded, setPuterLoaded] = useState(false);

  // Load Puter.js
  useEffect(() => {
    if (window.puter) {
      setPuterLoaded(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://js.puter.com/v2/";
    script.onload = () => setPuterLoaded(true);
    document.head.appendChild(script);
  }, []);

  const handleGenerate = async () => {
    if (!session) {
      toast.error("Rasm yaratish uchun tizimga kiring!");
      router.push("/login");
      return;
    }

    if (!prompt.trim()) {
      toast.error("Iltimos, tavsif yozing!");
      return;
    }

    if (!puterLoaded || !window.puter) {
      toast.error("Yuklanmoqda, bir oz kuting...");
      return;
    }

    setIsGenerating(true);
    setGeneratedImage(null);
    const startTime = Date.now();

    try {
      const stylePrompt = STYLE_PROMPTS[selectedStyle] || "";
      const fullPrompt = stylePrompt ? `${prompt}, ${stylePrompt}` : prompt;

      // Puter.js bilan FLUX rasm yaratish - bepul!
      const imageElement = await window.puter.ai.txt2img(fullPrompt, {
        model: "black-forest-labs/flux-schnell",
        disable_safety_checker: true,
      });

      // img elementdan src olish
      const imgSrc = imageElement.src || imageElement;
      setGeneratedImage(imgSrc);
      setGenerationTime(Math.round((Date.now() - startTime) / 1000));
      toast.success("Rasm muvaffaqiyatli yaratildi! 🎉");
    } catch (error: any) {
      console.error("Generation error:", error);
      toast.error(error.message || "Rasm yaratishda xatolik");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!generatedImage) return;
    try {
      const a = document.createElement("a");
      a.href = generatedImage;
      a.download = `pixelmind-${Date.now()}.png`;
      a.click();
      toast.success("Rasm yuklab olindi!");
    } catch {
      toast.error("Yuklab olishda xatolik");
    }
  };

  const handleShare = async () => {
    if (!generatedImage) return;
    try {
      await navigator.clipboard.writeText(generatedImage);
      toast.success("Havola nusxalandi!");
    } catch {
      toast.error("Nusxalashda xatolik");
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <h1 className="text-4xl font-bold mb-2">
              <span className="gradient-text">Rasm Yaratish</span>
            </h1>
            <p className="text-white/50">Xayolingizdagi narsani tasvirlab bering</p>
            <div className="flex items-center justify-center gap-2 mt-3">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-white/60 text-sm">Bepul • Cheksiz • FLUX AI</span>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Controls */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-6"
            >
              {/* Prompt input */}
              <div className="glass rounded-2xl p-6">
                <label className="block text-white/80 text-sm font-medium mb-3">
                  📝 Tavsif (Prompt)
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Mushuk velosipedda tog'lar orasida ketmoqda, quyosh botishi..."
                  rows={4}
                  className="input-dark w-full resize-none text-sm"
                />
                <p className="text-white/30 text-xs mt-2">
                  Inglizcha yozsangiz natija yaxshiroq bo'ladi
                </p>
              </div>

              {/* Style selector */}
              <div className="glass rounded-2xl p-6">
                <label className="block text-white/80 text-sm font-medium mb-3">
                  🎨 Uslub
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {STYLES.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setSelectedStyle(style.id)}
                      className={cn(
                        "flex flex-col items-center gap-1 p-2 rounded-xl text-xs transition-all duration-200",
                        selectedStyle === style.id
                          ? "bg-indigo-500/30 border border-indigo-500/50 text-white"
                          : "glass hover:bg-white/10 text-white/60"
                      )}
                    >
                      <span className="text-lg">{style.emoji}</span>
                      <span className="text-[10px] text-center leading-tight">{style.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate button */}
              {!session ? (
                <div className="glass rounded-2xl p-6 text-center">
                  <Lock className="w-8 h-8 text-white/40 mx-auto mb-3" />
                  <p className="text-white/60 text-sm mb-4">
                    Rasm yaratish uchun tizimga kiring
                  </p>
                  <div className="flex gap-3">
                    <Link href="/login" className="flex-1 btn-secondary text-center text-sm py-2.5">
                      Kirish
                    </Link>
                    <Link href="/register" className="flex-1 btn-primary text-center text-sm py-2.5">
                      Ro'yxatdan o'tish
                    </Link>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt.trim() || !puterLoaded}
                  className={cn(
                    "w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3",
                    isGenerating || !prompt.trim() || !puterLoaded
                      ? "bg-white/10 text-white/40 cursor-not-allowed"
                      : "btn-primary hover:scale-[1.02]"
                  )}
                >
                  {isGenerating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Yaratilmoqda...
                    </>
                  ) : !puterLoaded ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Yuklanmoqda...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-5 h-5" />
                      Rasm Yaratish
                      <Sparkles className="w-5 h-5" />
                    </>
                  )}
                </button>
              )}
            </motion.div>

            {/* Right: Result */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="glass rounded-2xl overflow-hidden aspect-square relative">
                <AnimatePresence mode="wait">
                  {isGenerating ? (
                    <motion.div
                      key="generating"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 flex flex-col items-center justify-center"
                    >
                      <div className="relative w-32 h-32 mb-6">
                        <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 animate-ping" />
                        <div className="absolute inset-2 rounded-full border-4 border-purple-500/30 animate-spin" />
                        <div className="absolute inset-4 rounded-full border-4 border-pink-500/40 animate-spin"
                          style={{ animationDirection: "reverse", animationDuration: "1.5s" }} />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Sparkles className="w-10 h-10 text-indigo-400 animate-pulse" />
                        </div>
                      </div>
                      <p className="text-white/80 font-medium text-lg mb-2">AI rasm yaratmoqda...</p>
                      <p className="text-white/40 text-sm text-center max-w-xs">
                        "{prompt.slice(0, 50)}{prompt.length > 50 ? "..." : ""}"
                      </p>
                      <div className="mt-6 flex gap-1">
                        {[0, 1, 2, 3, 4].map((i) => (
                          <motion.div
                            key={i}
                            className="w-2 h-2 bg-indigo-500 rounded-full"
                            animate={{ y: [0, -8, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
                          />
                        ))}
                      </div>
                    </motion.div>
                  ) : generatedImage ? (
                    <motion.div
                      key="result"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute inset-0"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={generatedImage}
                        alt={prompt}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                        <p className="text-white/80 text-sm mb-4 line-clamp-2">{prompt}</p>
                        {generationTime && (
                          <p className="text-white/40 text-xs mb-3">⚡ {generationTime} soniyada yaratildi</p>
                        )}
                        <div className="flex gap-3">
                          <button onClick={handleDownload}
                            className="flex-1 glass py-2.5 rounded-xl text-sm font-medium hover:bg-white/20 transition-colors flex items-center justify-center gap-2">
                            <Download className="w-4 h-4" /> Yuklab olish
                          </button>
                          <button onClick={handleGenerate}
                            className="glass p-2.5 rounded-xl hover:bg-white/20 transition-colors" title="Qayta yaratish">
                            <RefreshCw className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 flex flex-col items-center justify-center text-center p-8"
                    >
                      <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                        <ImageIcon className="w-10 h-10 text-white/20" />
                      </div>
                      <p className="text-white/40 text-sm">Rasm bu yerda ko'rinadi</p>
                      <p className="text-white/20 text-xs mt-2">
                        Tavsif yozing va "Rasm Yaratish" tugmasini bosing
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {generatedImage && !isGenerating && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3 mt-4"
                >
                  <button onClick={handleDownload}
                    className="flex-1 glass py-3 rounded-xl text-sm font-medium hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
                    <Download className="w-4 h-4" /> Yuklab olish
                  </button>
                  <button onClick={handleShare}
                    className="flex-1 glass py-3 rounded-xl text-sm font-medium hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
                    <Share2 className="w-4 h-4" /> Ulashish
                  </button>
                  <button onClick={handleGenerate}
                    className="glass px-4 py-3 rounded-xl hover:bg-white/10 transition-colors" title="Qayta yaratish">
                    <RefreshCw className="w-4 h-4" />
                  </button>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function GeneratePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <GeneratePageContent />
    </Suspense>
  );
}
