import { type ClassValue, clsx } from "clsx";
import { format, formatDistanceToNowStrict } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string) {
  return format(new Date(date), "MMM d, yyyy");
}

export function formatRelativeTime(date: Date | string) {
  return formatDistanceToNowStrict(new Date(date), {
    addSuffix: true,
  });
}

export function calculateBMI(weight?: number | null, height?: number | null) {
  if (!weight || !height) return null;
  const heightInMeters = height / 100;
  return Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
}

export function getDailyQuote(index: number) {
  const quotes = [
    "Consistency compounds faster than intensity.",
    "A good plan beats waiting for motivation.",
    "Small wins are still wins worth tracking.",
    "Train for the life you want to live.",
    "Progress gets louder when excuses get quieter.",
  ];

  return quotes[index % quotes.length];
}
