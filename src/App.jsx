import React, { useState, useEffect } from 'react';
import { CursorProvider } from './context/CursorContext';
import { Cursor } from './components/Cursor';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Work } from './components/WorkSection';
import { Skills } from './components/Skills';
import { Experience } from './components/Experience';
import { Background } from './components/Background';
import { Footer } from './components/Footer';
import { AdminPanel } from './components/AdminPanel';

// Default mock portfolio data retrieved from the original HTML
const defaultPortfolioData = {
  passcode: 'admin',
  profile: {
    name: 'Shreyansh Singh',
    tagline: 'Creative Lead & Multidisciplinary Designer',
    subhead: 'Designing visual brands, editorial systems, and digital interfaces at the intersection of engineering systems and creative aesthetics.',
    resumeUrl: 'https://drive.google.com/file/d/1Bypb7F4N-a477yBw4Oqg_xZpxq0V0f_B/view?usp=sharing'
  },
  disciplines: [
    'Creative Direction',
    'Brand Systems',
    'Editorial Design',
    'UI/UX Layouts',
    'Motion & Kinetic Video'
  ],
  about: {
    paragraph: 'I am a self-taught multidisciplinary designer currently studying Chemical Engineering at <strong>IIT Bombay</strong>. My design process is defined by high contrast grids, modern typographic rhythm, and clean execution. From branding campaigns for college festivals to telemetry dashboards for rockets, I design functional art.<br><br>I specialize in translating complex systems into clean interfaces and visual guides. For the last 2 years, I have built design architectures for festival teams, student groups, and independent clients.',
    stats: [
      '5+ Years Design Experience',
      '50+ Shipped Creative Projects',
      '150k+ Festival Video Views'
    ]
  },
  work: {
    social: [
      { title: "Mood Indigo '25 Reveal", tag: "Instagram Post", image: "svg:social-1" },
      { title: "E-Summit Speaker Lineup", tag: "Instagram Carousel", image: "svg:social-2" },
      { title: "Inter-IIT Sports Campaign", tag: "Facebook Graphics", image: "svg:social-3" }
    ],
    print: [
      { title: "Aether Propulsion Journal", tag: "Editorial Booklet", image: "svg:print-1" },
      { title: "Mood Indigo Festival Guide", tag: "Printed Zine", image: "svg:print-2" }
    ],
    ui: [
      { title: "E-Cell Incubator Portal", tag: "UI/UX Dashboard", caseStudyUrl: "https://behance.net", image: "svg:ui-1" },
      { title: "IITB Rocket Telemetry", tag: "Flight Control UI", caseStudyUrl: "https://behance.net", image: "svg:ui-2" }
    ],
    reels: [
      { title: "Mood Indigo Aftermovie Promo", tag: "Instagram Reel", image: "svg:reels-1" },
      { title: "E-Summit Keynote Kinetic Typo", tag: "YouTube Shorts", image: "svg:reels-2" },
      { title: "Founder's Talk Sneak Peek", tag: "Instagram Reel", image: "svg:reels-3" }
    ],
    video: [
      { title: "IITB Rocket Team Test Launch Vlog", tag: "Documentary Edit", tools: ["Premiere Pro", "After Effects"], image: "svg:video-1" },
      { title: "Campus Life Mini-Doc: IIT Bombay", tag: "Cinematic Vlog", tools: ["Premiere Pro", "DaVinci Resolve"], image: "svg:video-2" }
    ],
    branding: [
      {
        title: "Alumination Identity System",
        tag: "Brand System",
        desc: "A complete design system restructuring Alumination (the student-alumni relations cell of IIT Bombay). Standardized construction grids for the primary logo, developed customized typography specs, and created physical mockups for apparel.",
        scope: "Logo, Guides & Merch",
        org: "IIT Bombay",
        image: "svg:branding-1"
      }
    ]
  },
  experience: [
    {
      role: "Creative Lead",
      company: "Alumination, IIT Bombay",
      duration: "Jun 2025 – Present",
      points: [
        "Leading a team of 8 design coordinators to construct Alumination's brand systems.",
        "Designing the annual printed newsletter and editorial booklets delivered to over 40,000 global IIT Bombay alumni."
      ]
    },
    {
      role: "Design Lead",
      company: "E-Cell IIT Bombay",
      duration: "Apr 2025 – Present",
      points: [
        "Spearheading digital assets, interface layouts, and UI components for the E-Summit website.",
        "Designing targeted social media campaigns that drove E-Summit registration engagement metrics up by 40%."
      ]
    },
    {
      role: "Design & Business Lead",
      company: "IIT Bombay Rocket Team",
      duration: "Oct 2024 – Present",
      points: [
        "Designing the telemetry visual dashboards, vector blueprints, and rocket schemas for international competition folders.",
        "Building the brand look and custom merchandise (hoodies, badges, banners) representing the college rocket team."
      ]
    },
    {
      role: "Creative Executive",
      company: "Mood Indigo, IIT Bombay",
      duration: "Jul 2024 – Jan 2025",
      points: [
        "Collaborated in designing print zines and booklets for Asia's largest college cultural festival.",
        "Directed and edited 10+ high-engagement festival teaser videos and short Reels, accumulating 150k+ organic views."
      ]
    },
    {
      role: "Independent Multidisciplinary Designer",
      company: "Freelance",
      duration: "Jan 2024 – Present",
      points: [
        "Crafting visual brand guides and clean website interfaces for early-stage student startups and independent clients.",
        "Translating technical systems into highly readable, beautiful vector graphics and interface screens."
      ]
    }
  ],
  skills: {
    tools: ["Figma", "Adobe Premiere", "CapCut", "Adobe Illustrator", "Canva", "DaVinci Resolve", "After Effects"],
    other: ["Brand Identity", "Social Media Strategy", "Motion Design", "Print Layout", "UI/UX Design", "Content Direction", "Editorial Systems", "Chemical Engineering"]
  },
  background: {
    degree: "B.Tech Chemical Engineering",
    institution: "IIT Bombay",
    year: "Graduating 2027",
    philosophy: "All design skills self-taught — built through real projects, not courses. I believe in learning by breaking things, shipping actual work, and designing at the intersection of engineering systems and creative aesthetics.",
    achievements: [
      "Winner, Mood Indigo Annual Design Hackathon (2025)",
      "Best Branding Runner-up, IITB Tech Fest Design Challenge (2024)"
    ]
  }
};

export default function App() {
  const [portfolioData, setPortfolioData] = useState(() => {
    const saved = localStorage.getItem('shreyansh_portfolio_data');
    return saved ? JSON.parse(saved) : defaultPortfolioData;
  });

  const [loading, setLoading] = useState(true);
  const [overlayExit, setOverlayExit] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Disable scroll during preloader sequence
  useEffect(() => {
    if (loading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [loading]);

  // Loading Screen Animation Timeline
  useEffect(() => {
    const exitTimer = setTimeout(() => {
      setOverlayExit(true);
    }, 1300); // 1.3 seconds wait, then slide up

    const cleanupTimer = setTimeout(() => {
      setLoading(false);
    }, 2100); // 2.1 seconds total preloader mount time

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(cleanupTimer);
    };
  }, []);

  const handleSavePortfolio = (updatedData) => {
    setPortfolioData(updatedData);
    localStorage.setItem('shreyansh_portfolio_data', JSON.stringify(updatedData));
  };

  const handleResetPortfolio = () => {
    setPortfolioData(defaultPortfolioData);
    localStorage.removeItem('shreyansh_portfolio_data');
  };

  return (
    <CursorProvider>
      {/* 1. Portal-rendered smooth lagging custom cursor */}
      <Cursor />

      {/* 2. Page Loader Overlay Sequence */}
      {loading && (
        <div
          className={`will-animate ${overlayExit ? 'overlay-slide-exit' : ''}`}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: '#0D0D0D',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <h1
            className="loader-text-anim display-font"
            style={{
              fontSize: '2.2rem',
              color: 'var(--text-white)',
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              fontWeight: 800
            }}
          >
            Shreyansh Singh
          </h1>
        </div>
      )}

      {/* 3. Base Noise Film Grain Filter Overlay */}
      <div className="noise-overlay" />

      {/* 4. GPU-animated background radial gradient mesh canvas */}
      <div className="bg-mesh-canvas-animated" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1 }} />

      {/* 5. Sticky header nav */}
      <Header />

      {/* 6. Modular Visual Sections */}
      <main style={{ opacity: loading ? 0 : 1, transition: 'opacity 0.8s ease' }}>
        <Hero profileData={portfolioData} />
        <About profileData={portfolioData} />
        <Work portfolioData={portfolioData} />
        <Skills skillsData={portfolioData.skills} />
        <Experience experienceData={portfolioData.experience} />
        <Background backgroundData={portfolioData.background} />
      </main>

      {/* 7. Footer containing section linkages and secret trigger */}
      <Footer onSecretClick={() => setIsAdminOpen(true)} />

      {/* 8. Admin Gateway Dashboard Modal Overlay */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        portfolioData={portfolioData}
        onSave={handleSavePortfolio}
        onReset={handleResetPortfolio}
      />
    </CursorProvider>
  );
}
