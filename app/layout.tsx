import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PixelMind AI - Rasm Yaratuvchi",
  description:
    "Sun'iy intellekt yordamida so'zlaringizni ajoyib rasmlarga aylantiring. Mushuk velosipedda, tog'lar, fantastik dunyolar - xohlagan narsangizni yarating!",
  keywords: "AI rasm, rasm yaratish, sun'iy intellekt, image generation",
  openGraph: {
    title: "PixelMind AI - Rasm Yaratuvchi",
    description: "So'zlaringizni rasmlarga aylantiring",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uz" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {/* Background orbs */}
          <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            <div className="orb orb-1" />
            <div className="orb orb-2" />
            <div className="orb orb-3" />
          </div>
          <div className="relative z-10">{children}</div>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#1e293b",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
              },
              success: {
                iconTheme: {
                  primary: "#6366f1",
                  secondary: "#fff",
                },
              },
              error: {
                iconTheme: {
                  primary: "#ef4444",
                  secondary: "#fff",
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
