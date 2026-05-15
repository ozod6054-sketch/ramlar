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

async function generateWithFal(prompt: string): Promise<string> {
  const FAL_KEY = process.env.FAL_API_KEY;
  if (!FAL_KEY) throw new Error("FAL_API_KEY yo'q");
  const response = await fetch("https://fal.run/fal-ai/flux/schnell", {
    method: "POST",
    headers: { "Authorization": `Key ${FAL_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, image_size: { width: 1024, height: 1024 }, num_inference_steps: 4, num_images: 1 }),
    signal: AbortSignal.timeout(55000),
  });
  if (!response.ok) { const t = await response.text(); throw new Error(`FAL: ${response.status} - ${t.slice(0,200)}`); }
  const data = await response.json();
  const url = data?.images?.[0]?.url;
  if (!url) throw new Error("FAL: URL topilmadi");
  return url;
}

async function generateWithTogether(prompt: string): Promise<string> {
  const KEY = process.env.TOGETHER_API_KEY;
  if (!KEY) throw new Error("TOGETHER_API_KEY yo'q");
  const response = await fetch("https://api.together.xyz/v1/images/generations", {
    method: "POST",
    headers: { "Authorization": `Bearer ${KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: "black-forest-labs/FLUX.1-schnell-Free", prompt, width: 1024, height: 1024, steps: 4, n: 1 }),
    signal: AbortSignal.timeout(55000),
  });
  if (!response.ok) { const t = await response.text(); throw new Error(`Together: ${response.status} - ${t.slice(0,200)}`); }
  const data = await response.json();
  const url = data?.data?.[0]?.url;
  if (!url) throw new Error("Together: URL topilmadi");
  return url;
}

async function generateWithReplicate(prompt: string): Promise<string> {
  const TOKEN = process.env.REPLICATE_API_TOKEN;
  if (!TOKEN) throw new Error("REPLICATE_API_TOKEN yo'q");
  const res = await fetch("https://api.replicate.com/v1/models/black-forest-labs/flux-schnell/predictions", {
    method: "POST",
    headers: { "Authorization": `Bearer ${TOKEN}`, "Content-Type": "application/json", "Prefer": "wait" },
    body: JSON.stringify({ input: { prompt, go_fast: true, num_outputs: 1, aspect_ratio: "1:1", output_format: "webp" } }),
    signal: AbortSignal.timeout(55000),
  });
  if (!res.ok) { const t = await res.text(); throw new Error(`Replicate: ${res.status} - ${t.slice(0,200)}`); }
  const data = await res.json();
  if (data.output?.[0]) return data.output[0];
  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 2000));
    const p = await fetch(`https://api.replicate.com/v1/predictions/${data.id}`, { headers: { "Authorization": `Bearer ${TOKEN}` } });
    const pd = await p.json();
    if (pd.status === "succeeded" && pd.output?.[0]) return pd.output[0];
    if (pd.status === "failed") throw new Error(`Replicate failed: ${pd.error}`);
  }
  throw new Error("Replicate: timeout");
}

async function generateWithPollinations(prompt: string): Promise<string> {
  const seed = Math.floor(Math.random() * 1000000);
  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1024&seed=${seed}&nologo=true&model=flux`;
  const response = await fetch(url, { signal: AbortSignal.timeout(55000) });
  if (!response.ok) throw new Error(`Pollinations: ${response.status}`);
  const buffer = await response.arrayBuffer();
  return `data:image/jpeg;base64,${Buffer.from(buffer).toString("base64")}`;
}

async function generateImage(prompt: string): Promise<{ url: string; provider: string }> {
  const providers = [
    { name: "fal", fn: () => generateWithFal(prompt) },
    { name: "together", fn: () => generateWithTogether(prompt) },
    { name: "replicate", fn: () => generateWithReplicate(prompt) },
    { name: "pollinations", fn: () => generateWithPollinations(prompt) },
  ];
  const errors: string[] = [];
  for (const p of providers) {
    try {
      console.log(`[generate] Trying ${p.name}...`);
      const url = await p.fn();
      console.log(`[generate] Success: ${p.name}`);
      return { url, provider: p.name };
    } catch (err: any) {
      console.error(`[generate] ${p.name} failed:`, err.message);
      errors.push(`${p.name}: ${err.message}`);
    }
  }
  throw new Error(errors.join(" | "));
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) return NextResponse.json({ error: "Tizimga kiring" }, { status: 401 });

    await initDB();
    const userId = (session.user as any).id;
    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) return NextResponse.json({ error: "Foydalanuvchi topilmadi" }, { status: 404 });
    if (user.credits === 0) return NextResponse.json({ error: "Kreditlaringiz tugadi!" }, { status: 403 });

    const { prompt, style } = await req.json();
    if (!prompt?.trim()) return NextResponse.json({ error: "Tavsif kiritilmadi" }, { status: 400 });

    const stylePrompt = STYLE_PROMPTS[style] || "";
    const fullPrompt = stylePrompt ? `${prompt}, ${stylePrompt}` : prompt;

    let imageUrl: string;
    let provider: string;
    try {
      const result = await generateImage(fullPrompt);
      imageUrl = result.url;
      provider = result.provider;
    } catch (err: any) {
      console.error("[generate] All failed:", err.message);
      return NextResponse.json({ error: "Rasm yaratishda xatolik: " + err.message }, { status: 500 });
    }

    if (user.credits !== -1) {
      await db.user.update({ where: { id: userId }, data: { credits: user.credits - 1 } });
    }

    await db.generatedImage.create({
      data: { userId, prompt, imageUrl, model: `flux-${provider}`, style: style || "none" },
    });

    return NextResponse.json({ imageUrl, provider });
  } catch (error: any) {
    console.error("[generate] Error:", error);
    return NextResponse.json({ error: error.message || "Server xatosi" }, { status: 500 });
  }
}
