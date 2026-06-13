import React, { useRef } from 'react';
import { useFadeInOnScroll } from '../hooks/useFadeInOnScroll';

export const AnimatedSection = ({
  id,
  className = '',
  children,
  delay = 0,
  threshold = 0.1,
  rootMargin = '0px 0px -50px 0px',
  ...props
}) => {
  const sectionRef = useRef(null);
  const isRevealed = useFadeInOnScroll(sectionRef, { threshold, delay, rootMargin });

  return (
    <section
      ref={sectionRef}
      id={id}
      className={`${className} reveal-item ${isRevealed ? 'revealed' : ''}`}
      {...props}
    >
      {children}
    </section>
  );
};
