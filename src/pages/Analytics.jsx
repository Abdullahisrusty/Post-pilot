import { useState, useEffect, useRef } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Heart,
  MessageSquare,
  Sparkles,
  Trophy,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Send,
  Eye,
  PenTool,
  Zap,
} from 'lucide-react';
import './Analytics.css';

/* ---- Animated Counter Hook ---- */
function useAnimatedNumber(target, duration = 1200) {
  const [value, setValue] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    const startTime = performance.now();
    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(target * eased));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return value;
}

function StatCard({ icon: Icon, iconColor, label, value, suffix, change, changePositive, delay }) {
  const numericValue = typeof value === 'number' ? value : parseFloat(value);
  const animated = useAnimatedNumber(numericValue);

  const displayValue = suffix
    ? animated >= 1000
      ? (animated / 1000).toFixed(1) + 'K'
      : animated.toString()
    : animated.toLocaleString();

  return (
    <div className="analytics-stat-card animate-fadeInUp" style={{ animationDelay: `${delay}s` }}>
      <div className="stat-card-header">
        <div className="stat-card-icon" style={{ background: `${iconColor}15`, color: iconColor }}>
          <Icon size={18} />
        </div>
        <div className={`stat-card-change ${changePositive ? 'positive' : 'negative'}`}>
          {changePositive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
          {change}
        </div>
      </div>
      <div className="stat-card-value">{suffix && numericValue >= 1000 ? (animated / 1000).toFixed(1) + 'K' : displayValue}</div>
      <div className="stat-card-label">{label}</div>
    </div>
  );
}

/* ---- Mock Data ---- */
const TIME_RANGES = ['7 Days', '30 Days', '90 Days'];

const STATS = [
  { icon: TrendingUp, iconColor: '#10b981', label: 'Posts Published', value: 147, change: '+12%', changePositive: true },
  { icon: Heart, iconColor: '#ef4444', label: 'Total Engagement', value: 23400, suffix: true, change: '+8%', changePositive: true },
  { icon: MessageSquare, iconColor: '#6366f1', label: 'Comments Replied', value: 89, change: '+15%', changePositive: true },
  { icon: Sparkles, iconColor: '#8b5cf6', label: 'AI Content Generated', value: 312, change: '+22%', changePositive: true },
];

const ENGAGEMENT_DATA = [
  { day: 'Mon', value: 320 },
  { day: 'Tue', value: 480 },
  { day: 'Wed', value: 390 },
  { day: 'Thu', value: 620 },
  { day: 'Fri', value: 540 },
  { day: 'Sat', value: 710 },
  { day: 'Sun', value: 450 },
];

const PLATFORM_BREAKDOWN = [
  { platform: 'LinkedIn', posts: 42, engagement: '10.5K', avgLikes: 248, growth: '+18%', positive: true, color: '#0a66c2', share: 45 },
  { platform: 'X (Twitter)', posts: 58, engagement: '7.2K', avgLikes: 124, growth: '+12%', positive: true, color: '#ffffff', share: 31 },
  { platform: 'Reddit', posts: 23, engagement: '3.1K', avgLikes: 135, growth: '+25%', positive: true, color: '#ff4500', share: 13 },
  { platform: 'Instagram', posts: 15, engagement: '1.8K', avgLikes: 120, growth: '+5%', positive: true, color: '#e4405f', share: 8 },
  { platform: 'Facebook', posts: 9, engagement: '800', avgLikes: 89, growth: '-3%', positive: false, color: '#1877f2', share: 3 },
];

const RECENT_ACTIVITY = [
  { icon: Send, text: 'Published LinkedIn post — "5 SaaS Metrics Every Founder Should Track"', time: '2h ago', color: '#0a66c2' },
  { icon: MessageSquare, text: 'Replied to 3 comments on your X thread', time: '4h ago', color: '#6366f1' },
  { icon: PenTool, text: 'AI generated 5 content drafts for next week', time: '6h ago', color: '#8b5cf6' },
  { icon: Eye, text: 'Reddit post hit 1.2K views in r/SaaS', time: '8h ago', color: '#ff4500' },
  { icon: Zap, text: 'Engagement rate increased by 15% on LinkedIn', time: '12h ago', color: '#10b981' },
];

export default function Analytics() {
  const [activeRange, setActiveRange] = useState('7 Days');
  const [hoveredBar, setHoveredBar] = useState(null);

  const maxEngagement = Math.max(...ENGAGEMENT_DATA.map((d) => d.value));

  return (
    <div className="analytics-page">
      {/* Header */}
      <div className="analytics-header animate-fadeInUp">
        <div className="analytics-header-left">
          <div className="analytics-title-group">
            <div className="analytics-icon-wrap">
              <BarChart3 size={22} />
            </div>
            <h1 className="analytics-title">Analytics</h1>
          </div>
          <p className="analytics-subtitle">Track performance across all your connected platforms</p>
        </div>
        <div className="analytics-range-selector">
          {TIME_RANGES.map((range) => (
            <button
              key={range}
              className={`range-btn${activeRange === range ? ' active' : ''}`}
              onClick={() => setActiveRange(range)}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="analytics-stats-grid">
        {STATS.map((stat, i) => (
          <StatCard key={stat.label} {...stat} delay={0.05 + i * 0.05} />
        ))}
      </div>

      {/* Best Performing Platform + Engagement Chart */}
      <div className="analytics-two-col">
        {/* Best Platform */}
        <div className="analytics-best-platform glass animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
          <div className="best-platform-header">
            <Trophy size={20} className="best-platform-trophy" />
            <span>Best Performing Platform</span>
          </div>
          <div className="best-platform-main">
            <div className="best-platform-logo" style={{ background: 'rgba(10,102,194,0.15)', color: '#0a66c2' }}>
              Li
            </div>
            <div className="best-platform-info">
              <h3>LinkedIn</h3>
              <p>Your best performing platform with <strong>45%</strong> of total engagement</p>
            </div>
          </div>
          <div className="platform-bars">
            {PLATFORM_BREAKDOWN.map((p) => (
              <div key={p.platform} className="platform-bar-row">
                <span className="platform-bar-label">{p.platform}</span>
                <div className="platform-bar-track">
                  <div
                    className="platform-bar-fill"
                    style={{ width: `${p.share}%`, background: p.color }}
                  />
                </div>
                <span className="platform-bar-value">{p.share}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Engagement Chart */}
        <div className="analytics-chart glass animate-fadeInUp" style={{ animationDelay: '0.35s' }}>
          <h3 className="chart-title">Engagement Over Time</h3>
          <p className="chart-subtitle">Last 7 days performance</p>
          <div className="chart-container">
            <div className="chart-bars">
              {ENGAGEMENT_DATA.map((d, i) => (
                <div
                  key={d.day}
                  className="chart-bar-col"
                  onMouseEnter={() => setHoveredBar(i)}
                  onMouseLeave={() => setHoveredBar(null)}
                >
                  {hoveredBar === i && (
                    <div className="chart-tooltip">{d.value}</div>
                  )}
                  <div
                    className={`chart-bar${hoveredBar === i ? ' hovered' : ''}`}
                    style={{
                      height: `${(d.value / maxEngagement) * 100}%`,
                      animationDelay: `${0.4 + i * 0.07}s`,
                    }}
                  />
                  <span className="chart-bar-label">{d.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Platform Breakdown Table */}
      <div className="analytics-table-section glass animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
        <h3 className="table-section-title">Platform Breakdown</h3>
        <div className="analytics-table-wrap">
          <table className="analytics-table">
            <thead>
              <tr>
                <th>Platform</th>
                <th>Posts</th>
                <th>Engagement</th>
                <th>Avg. Likes</th>
                <th>Growth</th>
              </tr>
            </thead>
            <tbody>
              {PLATFORM_BREAKDOWN.map((row, i) => (
                <tr key={row.platform} className="animate-fadeInUp" style={{ animationDelay: `${0.45 + i * 0.04}s` }}>
                  <td>
                    <div className="table-platform-cell">
                      <span className="table-platform-dot" style={{ background: row.color }} />
                      {row.platform}
                    </div>
                  </td>
                  <td>{row.posts}</td>
                  <td>{row.engagement}</td>
                  <td>{row.avgLikes}</td>
                  <td>
                    <span className={`table-growth ${row.positive ? 'positive' : 'negative'}`}>
                      {row.positive ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                      {row.growth}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="analytics-activity glass animate-fadeInUp" style={{ animationDelay: '0.5s' }}>
        <h3 className="activity-title">Recent Activity</h3>
        <div className="activity-list">
          {RECENT_ACTIVITY.map((item, i) => (
            <div
              key={i}
              className="activity-item animate-fadeInUp"
              style={{ animationDelay: `${0.55 + i * 0.04}s` }}
            >
              <div className="activity-icon" style={{ background: `${item.color}15`, color: item.color }}>
                <item.icon size={15} />
              </div>
              <div className="activity-content">
                <p className="activity-text">{item.text}</p>
                <span className="activity-time">
                  <Clock size={11} />
                  {item.time}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
