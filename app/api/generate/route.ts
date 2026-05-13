import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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

async function generateWithTogether(prompt: string, width: number, height: number): Promise<string> {
  const API_KEY = process.env.TOGETHER_API_KEY;

  if (!API_KEY) throw new Error("TOGETHER_API_KEY topilmadi");

  console.log("Generating with Together.ai...");

  const response = await fetch("https://api.together.xyz/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "black-forest-labs/FLUX.1-schnell-Free",
      prompt,
      width: Math.min(width, 1024),
      height: Math.min(height, 1024),
      steps: 4,
      n: 1,
      response_format: "url",
    }),
  });

  console.log("Together.ai status:", response.status);

  if (!response.ok) {
    const text = await response.text();
    console.log("Together.ai error:", text.slice(0, 300));
    throw new Error(`Together.ai xatosi ${response.status}: ${text.slice(0, 150)}`);
  }

  const result = await response.json();
  console.log("Together.ai result:", JSON.stringify(result).slice(0, 200));

  if (result.data?.[0]?.url) return result.data[0].url;
  if (result.data?.[0]?.b64_json) {
    return `data:image/png;base64,${result.data[0].b64_json}`;
  }

  throw new Error("Rasm URL topilmadi");
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Tizimga kiring" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const user = await prisma.user.findUnique({ where: { id: userId } });

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
      imageUrl = await generateWithTogether(fullPrompt, width, height);
    } catch (err: any) {
      console.error("Generate failed:", err.message);
      return NextResponse.json({ error: err.message }, { status: 500 });
    }

    if (user.credits !== -1) {
      await prisma.user.update({
        where: { id: userId },
        data: { credits: { decrement: 1 } },
      });
    }

    await prisma.generatedImage.create({
      data: {
        userId,
        prompt,
        imageUrl: imageUrl.startsWith("data:") ? "base64_image" : imageUrl,
        model: "flux-schnell-free",
        width: Math.min(width, 1024),
        height: Math.min(height, 1024),
        style: style || "none",
      },
    });

    return NextResponse.json({ imageUrl });
  } catch (error: any) {
    console.error("Generate error:", error);
    return NextResponse.json({ error: error.message || "Server xatosi" }, { status: 500 });
  }
}
