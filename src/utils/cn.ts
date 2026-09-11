import { type ClassValue, clsx } from 'clsx';

/** Compose conditional class names. Thin wrapper so call sites have one
 * consistent import instead of reaching for clsx/classnames ad hoc. */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}
