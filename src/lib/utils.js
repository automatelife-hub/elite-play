import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { generateSecureRandomString } from "./secure-random.js"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
} 

export const isIframe = typeof window !== 'undefined' ? (window.self !== window.top) : false;

export { generateSecureRandomString };
