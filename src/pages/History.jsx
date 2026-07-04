import { useState, useMemo, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import {
  Clock,
  Search,
  Download,
  ChevronDown,
  ChevronUp,
  Heart,
  MessageSquare,
  Share2,
  
  
  
  MessageCircle,
  Globe,
  Filter,
} from 'lucide-react';
import { FaTwitter as Twitter, FaLinkedin as Linkedin, FaInstagram as Instagram, FaFacebook as Facebook } from 'react-icons/fa';
import { useToast } from '../context/ToastContext';
import './History.css';

const PLATFORM_ICONS = {
  X: Twitter,
  LinkedIn: Linkedin,
  Instagram: Instagram,
  Facebook: Globe,
  Reddit: MessageCircle,
};

const PLATFORM_COLORS = {
  X: 'var(--color-x)',
  LinkedIn: 'var(--color-linkedin)',
  Instagram: 'var(--color-instagram)',
  Facebook: 'var(--color-facebook)',
  Reddit: 'var(--color-reddit)',
};

const historyItems = [
  {
    id: 1,
    platform: 'LinkedIn',
    publishedAt: '2 hours ago',
    date: 'Jul 2, 2026',
    preview: 'Just shipped our biggest feature update yet. After 3 months of heads-down building, PostPilot now supports...',
    fullContent:
      'Just shipped our biggest feature update yet. After 3 months of heads-down building, PostPilot now supports multi-platform scheduling, AI content generation, and deep analytics. The team pulled off something incredible, and I couldn\'t be more proud. Here\'s what we learned about shipping fast without breaking things...',
    likes: 247,
    comments: 42,
    shares: 18,
  },
  {
    id: 2,
    platform: 'X',
    publishedAt: '5 hours ago',
    date: 'Jul 2, 2026',
    preview: '🧵 Thread: 5 mistakes I made pricing my SaaS (and how I fixed them)...',
    fullContent:
      '🧵 Thread: 5 mistakes I made pricing my SaaS (and how I fixed them)\n\n1/ Pricing too low. We started at $9/mo thinking we\'d attract more users. Instead, we attracted the wrong users.\n\n2/ No annual plans. Monthly-only pricing killed our cash flow predictability.\n\n3/ Feature gating was wrong. We locked power features behind enterprise tier nobody could afford.\n\n4/ No free trial. Asking for credit card upfront reduced signups by 60%.\n\n5/ Not AB testing prices. We guessed instead of testing. Data > intuition.',
    likes: 532,
    comments: 89,
    shares: 124,
  },
  {
    id: 3,
    platform: 'Instagram',
    publishedAt: '1 day ago',
    date: 'Jul 1, 2026',
    preview: 'Monday morning at PostPilot HQ ☕ The energy in the office when you\'re building something you love...',
    fullContent:
      'Monday morning at PostPilot HQ ☕ The energy in the office when you\'re building something you love is unmatched. Today we\'re tackling our biggest roadmap item yet — real-time collaboration. Stay tuned for updates! #BuildInPublic #SaaS #StartupLife',
    likes: 1243,
    comments: 67,
    shares: 34,
  },
  {
    id: 4,
    platform: 'Reddit',
    publishedAt: '2 days ago',
    date: 'Jun 30, 2026',
    preview: '[Show HN] PostPilot — AI-powered social media copilot for founders and creators...',
    fullContent:
      '[Show HN] PostPilot — AI-powered social media copilot for founders and creators\n\nHey HN! After 6 months of building, I\'m launching PostPilot — a tool that uses AI to help you create, schedule, and analyze social media content across all platforms.\n\nKey features:\n- AI content generation tuned for each platform\n- Multi-platform scheduling\n- Analytics dashboard\n- Community engagement tracking\n\nWould love your feedback!',
    likes: 189,
    comments: 156,
    shares: 23,
  },
  {
    id: 5,
    platform: 'LinkedIn',
    publishedAt: '3 days ago',
    date: 'Jun 29, 2026',
    preview: 'Hot take: The best marketing strategy for early-stage startups isn\'t ads. It\'s building in public...',
    fullContent:
      'Hot take: The best marketing strategy for early-stage startups isn\'t ads. It\'s building in public.\n\nHere\'s why:\n1. You build trust through transparency\n2. Your journey becomes your content\n3. Early users feel like co-creators\n4. You get feedback before you ship\n5. It costs $0\n\nWe\'ve grown PostPilot to 2,000 users with zero ad spend. Everything came from sharing our journey authentically.',
    likes: 892,
    comments: 73,
    shares: 56,
  },
  {
    id: 6,
    platform: 'X',
    publishedAt: '5 days ago',
    date: 'Jun 27, 2026',
    preview: 'The "overnight success" of PostPilot: 6 months of 16-hour days, 847 commits, 3 pivots, and 1 near-death...',
    fullContent:
      'The "overnight success" of PostPilot:\n\n• 6 months of 16-hour days\n• 847 commits\n• 3 pivots\n• 1 near-death moment when AWS bill hit $8k\n• 200+ user interviews\n• 14 rejected VC meetings\n\nSuccess isn\'t overnight. It\'s every night.',
    likes: 1847,
    comments: 234,
    shares: 312,
  },
  {
    id: 7,
    platform: 'Facebook',
    publishedAt: '1 week ago',
    date: 'Jun 25, 2026',
    preview: 'Excited to announce PostPilot has been selected for the TechStars accelerator program! After months...',
    fullContent:
      'Excited to announce PostPilot has been selected for the TechStars accelerator program! After months of applications and interviews, we\'re thrilled to be joining the cohort. This is a massive opportunity to learn, grow, and scale. Thank you to everyone who supported us on this journey!',
    likes: 456,
    comments: 89,
    shares: 67,
  },
  {
    id: 8,
    platform: 'LinkedIn',
    publishedAt: '10 days ago',
    date: 'Jun 22, 2026',
    preview: 'I asked 100 content creators what their biggest pain point was. The answer surprised me...',
    fullContent:
      'I asked 100 content creators what their biggest pain point was.\n\nThe answer surprised me.\n\nIt wasn\'t algorithm changes. It wasn\'t monetization. It was consistency.\n\n78% said their #1 struggle was posting consistently across platforms.\n\nThat\'s exactly why we built PostPilot — to make consistency effortless.',
    likes: 634,
    comments: 45,
    shares: 28,
  },
  {
    id: 9,
    platform: 'X',
    publishedAt: '2 weeks ago',
    date: 'Jun 18, 2026',
    preview: 'We just crossed 1,000 users on PostPilot 🎉 From idea to 1K in 4 months. Here\'s exactly how we did it...',
    fullContent:
      'We just crossed 1,000 users on PostPilot 🎉\n\nFrom idea to 1K in 4 months. Here\'s exactly how we did it:\n\nMonth 1: Built MVP, got 50 beta users from Twitter\nMonth 2: Launched on Product Hunt, got 200 users\nMonth 3: Content marketing + partnerships = 500 users\nMonth 4: Word of mouth kicked in = 1,000 users\n\nNext stop: 10K 🚀',
    likes: 2341,
    comments: 178,
    shares: 445,
  },
  {
    id: 10,
    platform: 'Instagram',
    publishedAt: '3 weeks ago',
    date: 'Jun 11, 2026',
    preview: 'Team dinner to celebrate our first paying customer! 🥂 It\'s not about the $29 — it\'s about validation...',
    fullContent:
      'Team dinner to celebrate our first paying customer! 🥂\n\nIt\'s not about the $29 — it\'s about validation that someone believes in what we\'re building enough to pay for it.\n\nNever forget your first customer. Frame that receipt. Screenshot that notification. This is the moment everything changes. #StartupLife #FirstCustomer',
    likes: 876,
    comments: 54,
    shares: 12,
  },
];

const FILTER_OPTIONS = ['All', 'X', 'LinkedIn', 'Instagram', 'Facebook', 'Reddit'];

export default function History() {
  const { addToast } = useToast();
  const { userId } = useAuth();
  const [historyItems, setHistoryItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [platformFilter, setPlatformFilter] = useState('All');
  const [showFilter, setShowFilter] = useState(false);
  const [expandedIds, setExpandedIds] = useState(new Set());

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch(`/api/history?userId=${userId || 'default_user'}`);
        if (res.ok) {
          const data = await res.json();
          setHistoryItems(data);
        }
      } catch (err) {
        console.error('Failed to load history', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, [userId]);

  const filteredItems = useMemo(() => {
    return historyItems.filter((item) => {
      const matchSearch =
        item.preview.toLowerCase().includes(search.toLowerCase()) ||
        item.fullContent.toLowerCase().includes(search.toLowerCase());
      const matchPlatform =
        platformFilter === 'All' || item.platform === platformFilter;
      return matchSearch && matchPlatform;
    });
  }, [search, platformFilter]);

  const toggleExpand = (id) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleExport = () => {
    addToast('Export coming soon', 'info');
  };

  const formatNumber = (num) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="history-page animate-fadeIn">
      <div className="history-header">
        <div className="history-header-left">
          <div className="history-title">
            <Clock size={24} />
            <h1>Content History</h1>
          </div>
        </div>
        <div className="history-header-right">
          <div className="history-search">
            <Search size={16} className="history-search-icon" />
            <input
              type="text"
              className="input"
              placeholder="Search history..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="history-filter-wrapper">
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setShowFilter(!showFilter)}
            >
              <Filter size={14} />
              {platformFilter === 'All' ? 'Platform' : platformFilter}
              <ChevronDown size={14} />
            </button>
            {showFilter && (
              <div className="history-filter-dropdown card">
                {FILTER_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    className={`history-filter-option ${platformFilter === opt ? 'active' : ''}`}
                    onClick={() => {
                      setPlatformFilter(opt);
                      setShowFilter(false);
                    }}
                  >
                    {opt !== 'All' && (() => {
                      const Icon = PLATFORM_ICONS[opt] || Globe;
                      return <Icon size={14} style={{ color: PLATFORM_COLORS[opt] }} />;
                    })()}
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button className="btn btn-ghost btn-sm" onClick={handleExport}>
            <Download size={14} />
            Export
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="history-empty card">
          <h3>Loading your posts...</h3>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="history-empty card">
          <Clock size={48} className="history-empty-icon" />
          <h3>No posts found</h3>
          <p>Try adjusting your search or filter.</p>
        </div>
      ) : (
        <div className="history-timeline">
          <div className="history-timeline-line" />
          {filteredItems.map((item, index) => {
            const Icon = PLATFORM_ICONS[item.platform] || Globe;
            const isExpanded = expandedIds.has(item.id);

            return (
              <div
                key={item.id}
                className="history-timeline-item animate-fadeInUp"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div
                  className="history-timeline-dot"
                  style={{ borderColor: PLATFORM_COLORS[item.platform] }}
                >
                  <div
                    className="history-timeline-dot-inner"
                    style={{ background: PLATFORM_COLORS[item.platform] }}
                  />
                </div>

                <div className="history-item-card card">
                  <div className="history-item-header">
                    <div className="history-item-platform">
                      <span
                        className="history-platform-icon"
                        style={{ color: PLATFORM_COLORS[item.platform] }}
                      >
                        <Icon size={16} />
                      </span>
                      <span className="history-platform-name">{item.platform}</span>
                    </div>
                    <div className="history-item-date">
                      <span className="history-date-relative">{item.publishedAt}</span>
                      <span className="history-date-absolute">{item.date}</span>
                    </div>
                  </div>

                  <div className="history-item-content">
                    <p>{isExpanded ? item.fullContent : item.preview}</p>
                  </div>

                  <div className="history-item-footer">
                    <div className="history-item-stats">
                      <span className="history-stat">
                        <Heart size={13} />
                        {formatNumber(item.likes)}
                      </span>
                      <span className="history-stat">
                        <MessageSquare size={13} />
                        {formatNumber(item.comments)}
                      </span>
                      <span className="history-stat">
                        <Share2 size={13} />
                        {formatNumber(item.shares)}
                      </span>
                    </div>
                    <button
                      className="btn btn-ghost btn-sm"
                      onClick={() => toggleExpand(item.id)}
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp size={14} />
                          Collapse
                        </>
                      ) : (
                        <>
                          <ChevronDown size={14} />
                          Expand
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
