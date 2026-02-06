import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility function to merge Tailwind CSS classes with proper precedence.
 * Later classes override earlier ones when they conflict.
 *
 * @example
 * cn("px-2 py-1", "px-4") // => "py-1 px-4"
 * cn("text-red-500", condition && "text-blue-500") // => conditional class
 */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
