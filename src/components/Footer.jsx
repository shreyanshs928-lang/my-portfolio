import React, { useContext } from 'react';
import { CursorContext } from '../context/CursorContext';
import { Linkedin, Instagram, Mail } from 'lucide-react';

export const Footer = ({ onSecretClick }) => {
  const { setMagneticElement, triggerHover, triggerDefault } = useContext(CursorContext);

  // Custom Behance icon as a component
  const BehanceIcon = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '20px', height: '20px' }}>
      <path d="M9 10h1.5a2.5 2.5 0 0 0 0-5H9v5zm0 5h2a2.5 2.5 0 0 0 0-5H9v5z"/>
      <path d="M20 12h-7a4.5 4.5 0 0 0 9 0h-2"/>
      <line x1="14" y1="7" x2="19" y2="7"/>
    </svg>
  );

  return (
    <footer className="footer" id="contact">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <h3 className="display-font" style={{ fontSize: '1.5rem', color: 'var(--text-white)', marginBottom: '0.8rem' }}>
              Shreyansh Singh
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
              Designing at the intersection of systems and aesthetics.
            </p>
            <div className="social-links" style={{ display: 'flex', gap: '0.8rem' }}>
              {/* LinkedIn */}
              <a
                href="https://linkedin.com"
                className="social-icon-btn"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                onMouseEnter={(e) => {
                  setMagneticElement(e.currentTarget);
                  triggerHover('Follow');
                }}
                onMouseLeave={triggerDefault}
              >
                <Linkedin size={20} />
              </a>
              {/* Instagram */}
              <a
                href="https://instagram.com"
                className="social-icon-btn"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                onMouseEnter={(e) => {
                  setMagneticElement(e.currentTarget);
                  triggerHover('Follow');
                }}
                onMouseLeave={triggerDefault}
              >
                <Instagram size={20} />
              </a>
              {/* Behance */}
              <a
                href="https://behance.net"
                className="social-icon-btn"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Behance"
                onMouseEnter={(e) => {
                  setMagneticElement(e.currentTarget);
                  triggerHover('Follow');
                }}
                onMouseLeave={triggerDefault}
              >
                <BehanceIcon />
              </a>
              {/* Email */}
              <a
                href="mailto:shreyansh@example.com"
                className="social-icon-btn"
                aria-label="Email"
                onMouseEnter={(e) => {
                  setMagneticElement(e.currentTarget);
                  triggerHover('Email');
                }}
                onMouseLeave={triggerDefault}
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="footer-links-title">Sections</h4>
            <ul className="footer-nav">
              <li>
                <a
                  href="#about"
                  className="footer-nav-link"
                  onMouseEnter={(e) => {
                    setMagneticElement(e.currentTarget);
                    triggerHover('Go');
                  }}
                  onMouseLeave={triggerDefault}
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="#work"
                  className="footer-nav-link"
                  onMouseEnter={(e) => {
                    setMagneticElement(e.currentTarget);
                    triggerHover('Go');
                  }}
                  onMouseLeave={triggerDefault}
                >
                  Work
                </a>
              </li>
              <li>
                <a
                  href="#skills"
                  className="footer-nav-link"
                  onMouseEnter={(e) => {
                    setMagneticElement(e.currentTarget);
                    triggerHover('Go');
                  }}
                  onMouseLeave={triggerDefault}
                >
                  Skills
                </a>
              </li>
              <li>
                <a
                  href="#experience"
                  className="footer-nav-link"
                  onMouseEnter={(e) => {
                    setMagneticElement(e.currentTarget);
                    triggerHover('Go');
                  }}
                  onMouseLeave={triggerDefault}
                >
                  Experience
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="footer-links-title">Let's connect</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineSpace: 1.5, marginBottom: '1.2rem' }}>
              Whether it's rocket branding, creative engineering websites, or freelance campaigns, let's ship work together.
            </p>
            <a
              href="mailto:shreyansh@example.com"
              className="btn btn-primary"
              style={{ padding: '0.65rem 1.5rem', fontSize: '0.85rem' }}
              onMouseEnter={(e) => {
                setMagneticElement(e.currentTarget);
                triggerHover('Email');
              }}
              onMouseLeave={triggerDefault}
            >
              Email Shreyansh
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">
            © 2026 Shreyansh Singh · Made with{' '}
            <span
              className="secret-trigger"
              id="secret-login-trigger"
              onClick={onSecretClick}
              style={{
                cursor: 'pointer',
                color: 'var(--text-muted)',
                transition: 'color 0.3s'
              }}
              onMouseEnter={(e) => {
                setMagneticElement(e.currentTarget);
                triggerHover('Lock');
              }}
              onMouseLeave={triggerDefault}
            >
              intention
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};
