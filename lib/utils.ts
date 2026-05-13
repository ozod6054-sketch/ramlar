import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCredits(credits: number): string {
  if (credits === -1) return "Cheksiz";
  return credits.toString();
}

export function getPlanColor(plan: string): string {
  switch (plan) {
    case "pro":
      return "from-yellow-400 to-orange-500";
    case "normal":
      return "from-blue-400 to-indigo-500";
    default:
      return "from-gray-400 to-gray-500";
  }
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
