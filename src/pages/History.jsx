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
          <h3>No uploads yet</h3>
          <p>You haven't published anything from PostPilot yet.</p>
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
