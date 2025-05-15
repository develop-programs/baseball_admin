import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Session } from "next-auth";

/**
 * Combine multiple class names with Tailwind support
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Check if a user has admin access
 */
export function isAdmin(session: Session | null): boolean {
  if (!session || !session.user || !session.user.role) return false;
  return session.user.role === 'admin' || session.user.role === 'super_admin';
}

/**
 * Check if a user has super admin access
 */
export function isSuperAdmin(session: Session | null): boolean {
  if (!session || !session.user || !session.user.role) return false;
  return session.user.role === 'super_admin';
}

/**
 * Format error messages for display
 */
export function formatErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'An unknown error occurred';
}
