import { useState, useEffect } from 'react';

export const useFadeInOnScroll = (ref, options = {}) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const { threshold = 0.1, delay = 0, rootMargin = '0px 0px -50px 0px' } = options;

  useEffect(() => {
    if (!ref.current) return;

    // Accessibility check: immediately reveal if reduced motion is requested
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        if (delay > 0) {
          setTimeout(() => setIsRevealed(true), delay);
        } else {
          setIsRevealed(true);
        }
        observer.unobserve(entry.target);
      }
    }, {
      threshold,
      rootMargin
    });

    observer.observe(ref.current);

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref, threshold, delay, rootMargin]);

  return isRevealed;
};
