// src/utils/cn.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility to conditionally combine Tailwind class names and resolve conflicts.
 * Works like the `cn` function from shadcn/ui.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
