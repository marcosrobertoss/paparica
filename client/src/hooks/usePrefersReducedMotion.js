import { useMediaQuery } from './useMediaQuery';

export function usePrefersReducedMotion() {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}

// Shared helper: pass every GSAP duration through this so animations collapse
// to instant when the user has requested reduced motion.
export function gsapDuration(base, reducedMotion) {
  return reducedMotion ? 0 : base;
}
