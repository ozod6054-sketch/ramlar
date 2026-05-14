import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db, initDB } from "@/lib/db";

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

async function generateImage(prompt: string, width: number, height: number): Promise<string> {
  // 1. FAL AI
  const FAL_KEY = process.env.FAL_API_KEY;
  if (FAL_KEY) {
    try {
      const response = await fetch("https://fal.run/fal-ai/flux/schnell", {
        method: "POST",
        headers: { Authorization: `Key ${FAL_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          image_size: { width: Math.min(width, 1024), height: Math.min(height, 1024) },
          num_inference_steps: 4,
          num_images: 1,
        }),
      });
      if (response.ok) {
        const result = await response.json();
        if (result.images?.[0]?.url) return result.images[0].url;
      }
    } catch {}
  }

  // 2. Hugging Face
  const HF_KEY = process.env.HUGGINGFACE_API_TOKEN;
  if (HF_KEY) {
    try {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${HF_KEY}`, "Content-Type": "application/json" },
          body: JSON.stringify({ inputs: prompt }),
        }
      );
      if (response.ok) {
        const blob = await response.blob();
        const buffer = await blob.arrayBuffer();
        const base64 = Buffer.from(buffer).toString("base64");
        return `data:image/png;base64,${base64}`;
      }
    } catch {}
  }

  // 3. Together AI
  const TOGETHER_KEY = process.env.TOGETHER_API_KEY;
  if (TOGETHER_KEY) {
    try {
      const response = await fetch("https://api.together.xyz/v1/images/generations", {
        method: "POST",
        headers: { Authorization: `Bearer ${TOGETHER_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "black-forest-labs/FLUX.1-schnell-Free",
          prompt,
          width: Math.min(width, 1024),
          height: Math.min(height, 1024),
          steps: 4,
          n: 1,
        }),
      });
      if (response.ok) {
        const result = await response.json();
        if (result.data?.[0]?.url) return result.data[0].url;
        if (result.data?.[0]?.b64_json) return `data:image/png;base64,${result.data[0].b64_json}`;
      }
    } catch {}
  }

  throw new Error("Rasm yaratishda xatolik. Iltimos qayta urining.");
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Tizimga kiring" }, { status: 401 });
    }

    await initDB();
    const userId = (session.user as any).id;
    const user = await db.user.findUnique({ where: { id: userId } });

    if (!user) {
      return NextResponse.json({ error: "Foydalanuvchi topilmadi" }, { status: 404 });
    }

    if (user.credits === 0) {
      return NextResponse.json({ error: "Kreditlaringiz tugadi!" }, { status: 403 });
    }

    const { prompt, style, size } = await req.json();
    if (!prompt?.trim()) {
      return NextResponse.json({ error: "Tavsif kiritilmadi" }, { status: 400 });
    }

    const stylePrompt = STYLE_PROMPTS[style] || "";
    const fullPrompt = stylePrompt ? `${prompt}, ${stylePrompt}` : prompt;
    const [width, height] = (size || "1024x1024").split("x").map(Number);

    let imageUrl: string;
    try {
      imageUrl = await generateImage(fullPrompt, width, height);
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    }

    if (user.credits !== -1) {
      await db.user.update({
        where: { id: userId },
        data: { credits: user.credits - 1 },
      });
    }

    await db.generatedImage.create({
      data: {
        userId,
        prompt,
        imageUrl: imageUrl.startsWith("data:") ? "base64_image" : imageUrl,
        model: "flux-schnell",
        style: style || "none",
      },
    });

    return NextResponse.json({ imageUrl });
  } catch (error: any) {
    console.error("Generate error:", error);
    return NextResponse.json({ error: error.message || "Server xatosi" }, { status: 500 });
  }
}
