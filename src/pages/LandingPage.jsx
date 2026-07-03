import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Sparkles,
  Send,
  Calendar,
  MessageSquare,
  BarChart3,
  Clock,
  ArrowRight,
  Play,
  Check,
  Zap,
  Globe,
  
  
  Hash,
  
  
  ChevronDown,
} from 'lucide-react';
import { FaTwitter as Twitter, FaLinkedin as Linkedin, FaInstagram as Instagram, FaFacebook as Facebook } from 'react-icons/fa';
import './LandingPage.css';

const FEATURES = [
  {
    icon: Sparkles,
    title: 'AI Content Generation',
    description:
      'Generate platform-optimized content from a single idea. Let AI craft the perfect message for every audience.',
  },
  {
    icon: Send,
    title: 'Multi-Platform Publishing',
    description:
      'Publish to X, LinkedIn, Reddit, Instagram & Facebook — all from one unified workspace.',
  },
  {
    icon: Calendar,
    title: 'Smart Scheduling',
    description:
      'Schedule posts with AI-recommended optimal times to maximize reach and engagement.',
  },
  {
    icon: MessageSquare,
    title: 'Community Management',
    description:
      'Reply to comments and messages across all platforms from a single, unified inbox.',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description:
      'Track engagement, follower growth, and content performance in real-time with beautiful charts.',
  },
  {
    icon: Clock,
    title: 'Content History',
    description:
      'Never lose a post with full version history. Revert, reuse, and repurpose any content.',
  },
];

const PLATFORMS = [
  { name: 'X (Twitter)', icon: Twitter },
  { name: 'LinkedIn', icon: Linkedin },
  { name: 'Reddit', icon: Hash },
  { name: 'Instagram', icon: Instagram },
  { name: 'Facebook', icon: Facebook },
];

const STATS = [
  { value: '50K+', label: 'Posts Generated' },
  { value: '10K+', label: 'Active Users' },
  { value: '5', label: 'Platforms' },
  { value: '99.9%', label: 'Uptime' },
];

function useIntersectionObserver(options = {}) {
  const [entries, setEntries] = useState([]);
  const refs = useRef([]);

  const setRef = useCallback((index) => (el) => {
    refs.current[index] = el;
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (observedEntries) => {
        setEntries((prev) => {
          const updated = [...prev];
          observedEntries.forEach((entry) => {
            const idx = refs.current.indexOf(entry.target);
            if (idx !== -1) {
              updated[idx] = entry.isIntersecting;
            }
          });
          return updated;
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px', ...options }
    );

    const currentRefs = refs.current;
    currentRefs.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      currentRefs.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [options]);

  return { setRef, entries };
}

function LandingPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const featureObserver = useIntersectionObserver();
  const platformObserver = useIntersectionObserver();
  const statObserver = useIntersectionObserver();

  const handleGetStarted = () => {
    signIn();
    navigate('/app');
  };

  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="landing-page">
      {/* Animated Background */}
      <div className="landing-bg">
        <div className="landing-bg-grid" />
        <div className="landing-bg-mesh">
          <div className="landing-bg-orb landing-bg-orb--1" />
          <div className="landing-bg-orb landing-bg-orb--2" />
          <div className="landing-bg-orb landing-bg-orb--3" />
          <div className="landing-bg-orb landing-bg-orb--4" />
        </div>
        <div className="landing-bg-particles">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="landing-particle" />
          ))}
        </div>
      </div>

      <div className="landing-content">
        {/* Navbar */}
        <nav className="landing-nav">
          <div className="landing-nav-brand">
            <div className="landing-nav-logo">
              <Zap size={18} />
            </div>
            <span className="landing-nav-name">PostPilot</span>
          </div>
          <div className="landing-nav-links">
            <button className="landing-nav-link" onClick={scrollToFeatures}>
              Features
            </button>
            <a href="#platforms" className="landing-nav-link">
              Platforms
            </a>
            <a href="#stats" className="landing-nav-link">
              About
            </a>
            <button className="landing-nav-cta" onClick={handleGetStarted}>
              Get Started
            </button>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="landing-hero">
          <div className="landing-hero-badge">
            <span className="landing-hero-badge-dot" />
            Now with GPT-4o &amp; multi-platform support
          </div>

          <h1 className="landing-hero-title">PostPilot</h1>

          <p className="landing-hero-subtitle">Write once. Publish everywhere.</p>

          <p className="landing-hero-desc">
            Generate content, schedule posts, publish across platforms, and manage
            your community with one AI-powered workspace.
          </p>

          <div className="landing-hero-actions">
            <button className="landing-btn-primary" onClick={handleGetStarted}>
              Get Started
              <ArrowRight size={18} />
            </button>
            <button className="landing-btn-ghost" onClick={scrollToFeatures}>
              <Play size={16} />
              Watch Demo
            </button>
          </div>

          <div className="landing-hero-glow" />

          <div className="landing-scroll-indicator" onClick={scrollToFeatures}>
            <ChevronDown size={16} />
            <div className="landing-scroll-line" />
          </div>
        </section>

        {/* Features Section */}
        <section className="landing-section landing-section--center" id="features">
          <span className="landing-section-label">
            <Sparkles size={14} />
            Features
          </span>
          <h2 className="landing-section-title">
            Everything you need to dominate social
          </h2>
          <p className="landing-section-desc">
            From AI content creation to cross-platform analytics — PostPilot gives
            you superpowers for social media.
          </p>
          <div className="landing-features-grid">
            {FEATURES.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  ref={featureObserver.setRef(index)}
                  className={`landing-feature-card${
                    featureObserver.entries[index] ? ' is-visible' : ''
                  }`}
                  style={{ animationDelay: `${index * 0.08}s` }}
                >
                  <div className="landing-feature-icon">
                    <Icon size={22} />
                  </div>
                  <h3 className="landing-feature-title">{feature.title}</h3>
                  <p className="landing-feature-desc">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </section>

        <div className="landing-divider" />

        {/* Platforms Section */}
        <section className="landing-platforms" id="platforms">
          <p className="landing-platforms-tagline">
            Trusted by 10,000+ creators worldwide
          </p>
          <div className="landing-platforms-row">
            {PLATFORMS.map((platform, index) => {
              const Icon = platform.icon;
              return (
                <div
                  key={platform.name}
                  ref={platformObserver.setRef(index)}
                  className={`landing-platform-badge${
                    platformObserver.entries[index] ? ' is-visible' : ''
                  }`}
                  style={{ animationDelay: `${index * 0.08}s` }}
                >
                  <span className="landing-platform-icon">
                    <Icon size={16} />
                  </span>
                  {platform.name}
                </div>
              );
            })}
          </div>
        </section>

        <div className="landing-divider" />

        {/* Stats Section */}
        <section className="landing-section landing-section--center" id="stats">
          <span className="landing-section-label">
            <Globe size={14} />
            Traction
          </span>
          <h2 className="landing-section-title">Numbers that speak for themselves</h2>
          <p className="landing-section-desc">
            Join thousands of creators and teams who trust PostPilot to grow their
            online presence.
          </p>
          <div className="landing-stats-grid">
            {STATS.map((stat, index) => (
              <div
                key={stat.label}
                ref={statObserver.setRef(index)}
                className={`landing-stat-card${
                  statObserver.entries[index] ? ' is-visible' : ''
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <p className="landing-stat-value">{stat.value}</p>
                <p className="landing-stat-label">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="landing-divider" />

        {/* CTA Section */}
        <section className="landing-cta">
          <div className="landing-cta-wrapper">
            <div className="landing-cta-glow" />
            <h2 className="landing-cta-title">
              Ready to pilot your social media?
            </h2>
            <p className="landing-cta-desc">
              Start creating, scheduling, and publishing — all in one place.
            </p>
            <div className="landing-cta-btn-wrap">
              <button className="landing-btn-primary" onClick={handleGetStarted}>
                Get Started Free
                <ArrowRight size={18} />
              </button>
              <span className="landing-cta-subtext">
                <Check size={14} />
                No credit card required
              </span>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="landing-footer">
          <div className="landing-footer-inner">
            <div className="landing-footer-brand">
              <div className="landing-footer-logo">
                <Zap size={14} />
              </div>
              <span className="landing-footer-name">PostPilot</span>
            </div>

            <div className="landing-footer-links">
              <a href="#features" className="landing-footer-link">
                Features
              </a>
              <a href="#platforms" className="landing-footer-link">
                Platforms
              </a>
              <a href="#stats" className="landing-footer-link">
                About
              </a>
              <a href="mailto:support@postpilot.ai" className="landing-footer-link">
                Support
              </a>
              <a href="#" className="landing-footer-link">
                Privacy
              </a>
              <a href="#" className="landing-footer-link">
                Terms
              </a>
            </div>

            <p className="landing-footer-copy">
              &copy; {new Date().getFullYear()} PostPilot. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default LandingPage;
