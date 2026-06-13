import React, { useEffect, useState, useContext } from 'react';
import { CursorContext } from '../../context/CursorContext';

export const Hero = ({ profileData }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { setMagneticElement, triggerHover, triggerDefault } = useContext(CursorContext);

  useEffect(() => {
    // Trigger animation slightly after mount to feel deliberate
    const timer = setTimeout(() => setIsLoaded(true), 150);
    return () => clearTimeout(timer);
  }, []);

  const tagline = profileData?.profile?.headline || "Creative Lead & Multidisciplinary Designer";
  const subhead = profileData?.profile?.subhead || "";
  const resumeUrl = profileData?.profile?.resumeUrl || "#";
  const ctaLabel = profileData?.profile?.ctaLabel || "View Work";
  const disciplines = profileData?.disciplines || [];

  const headlineWords = tagline.split(" ");
  const subheadDelay = (headlineWords.length * 80) + 200;
  const ctaDelay = subheadDelay + 300;

  return (
    <section id="hero" style={{ overflow: 'hidden' }}>
      <div className="container hero-wrapper">
        <div className="hero-content">
          <h1 className="hero-headline display-font">
            {headlineWords.map((word, idx) => (
              <span key={idx} style={{ overflow: 'hidden', display: 'inline-block', verticalAlign: 'top' }}>
                <span
                  className="will-animate"
                  style={{
                    display: 'inline-block',
                    transform: isLoaded ? 'translateY(0)' : 'translateY(45px)',
                    opacity: isLoaded ? 1 : 0,
                    transition: 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    transitionDelay: `${idx * 80}ms`
                  }}
                >
                  {word.includes("<br>") ? (
                    <>
                      {word.replace("<br>", "")}
                      <br />
                    </>
                  ) : (
                    word + '\u00A0'
                  )}
                </span>
              </span>
            ))}
          </h1>

          <p
            className="hero-subhead will-animate"
            style={{
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 1s cubic-bezier(0.16, 1, 0.3, 1), transform 1s cubic-bezier(0.16, 1, 0.3, 1)',
              transitionDelay: `${subheadDelay}ms`
            }}
          >
            {subhead}
          </p>

          <div
            className="hero-ctas will-animate"
            style={{
              opacity: isLoaded ? 1 : 0,
              transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
              transition: 'opacity 1s cubic-bezier(0.16, 1, 0.3, 1), transform 1s cubic-bezier(0.16, 1, 0.3, 1)',
              transitionDelay: `${ctaDelay}ms`
            }}
          >
            <a
              href="#work"
              className="btn btn-primary"
              style={{ transitionDelay: '0ms' }}
              onMouseEnter={(e) => {
                setMagneticElement(e.currentTarget);
                triggerHover('Explore');
              }}
              onMouseLeave={triggerDefault}
            >
              {ctaLabel} ↓
            </a>
            <a
              href={resumeUrl}
              className="btn btn-secondary"
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={(e) => {
                setMagneticElement(e.currentTarget);
                triggerHover('Resume');
              }}
              onMouseLeave={triggerDefault}
            >
              Download Resume
            </a>
          </div>
        </div>

        {/* Ticker marquee banner */}
        {disciplines.length > 0 && (
          <div className="hero-marquee-container">
            <div className="hero-marquee-track">
              {disciplines.concat(disciplines).map((disc, idx) => (
                <div key={idx} className="hero-marquee-item">
                  <span>·</span> {disc}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
