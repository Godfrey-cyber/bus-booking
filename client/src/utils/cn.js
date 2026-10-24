import { clsx } from 'clsx'

// Small class-name combiner so components can compose conditional Tailwind classes cleanly.
export function cn(...inputs) {
  return clsx(...inputs)
}
