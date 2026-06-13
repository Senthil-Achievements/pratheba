import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../lib/gsap';

export function useScrollAnimation(animationFn, deps = []) {
  const ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      animationFn(ref.current);
    }, ref);

    return () => ctx.revert();
  }, deps);

  return ref;
}

export function useFadeUp(options = {}) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: options.duration || 0.9,
          ease: 'power3.out',
          delay: options.delay || 0,
          scrollTrigger: {
            trigger: el,
            start: options.start || 'top 85%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, el);
    return () => ctx.revert();
  }, []);
  return ref;
}
