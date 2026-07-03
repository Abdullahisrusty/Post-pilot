import { useState } from 'react';
import {
  Settings as SettingsIcon,
  User,
  Link2,
  Sparkles,
  Bell,
  CreditCard,
  AlertTriangle,
  
  
  
  MessageCircle,
  Globe,
  Check,
  Camera,
} from 'lucide-react';
import { FaTwitter as Twitter, FaLinkedin as Linkedin, FaInstagram as Instagram, FaFacebook as Facebook } from 'react-icons/fa';
import { useToast } from '../context/ToastContext';
import './Settings.css';

const initialPlatforms = [
  {
    id: 'x',
    name: 'X (Twitter)',
    icon: Twitter,
    color: 'var(--color-x)',
    connected: true,
    lastSync: '2 min ago',
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: Linkedin,
    color: 'var(--color-linkedin)',
    connected: true,
    lastSync: '5 min ago',
  },
  {
    id: 'reddit',
    name: 'Reddit',
    icon: MessageCircle,
    color: 'var(--color-reddit)',
    connected: false,
    lastSync: null,
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: Instagram,
    color: 'var(--color-instagram)',
    connected: true,
    lastSync: '10 min ago',
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: Globe,
    color: 'var(--color-facebook)',
    connected: false,
    lastSync: null,
  },
];

export default function Settings() {
  const { addToast } = useToast();

  // Profile
  const [name, setName] = useState('Alex Rivera');
  const [email, setEmail] = useState('alex@postpilot.io');
  const [bio, setBio] = useState('');

  // Platforms
  const [platforms, setPlatforms] = useState(initialPlatforms);

  // AI Preferences
  const [tone, setTone] = useState('Professional');
  const [contentLength, setContentLength] = useState('Medium');
  const [includeEmojis, setIncludeEmojis] = useState(true);
  const [includeHashtags, setIncludeHashtags] = useState(true);
  const [language, setLanguage] = useState('English');

  // Notifications
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(false);
  const [commentAlerts, setCommentAlerts] = useState(true);

  const handleSaveProfile = () => {
    addToast('Profile saved successfully', 'success');
  };

  const togglePlatform = (id) => {
    setPlatforms((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const nowConnected = !p.connected;
          addToast(
            `${p.name} ${nowConnected ? 'connected' : 'disconnected'}`,
            nowConnected ? 'success' : 'info'
          );
          return {
            ...p,
            connected: nowConnected,
            lastSync: nowConnected ? 'Just now' : null,
          };
        }
        return p;
      })
    );
  };

  const handleDeleteAccount = () => {
    addToast('Account deletion is disabled in demo mode', 'warning');
  };

  return (
    <div className="settings-page animate-fadeIn">
      <div className="settings-header">
        <div className="settings-title">
          <SettingsIcon size={24} />
          <h1>Settings</h1>
        </div>
      </div>

      <div className="settings-sections">
        {/* ---- Profile Section ---- */}
        <section className="settings-section card" style={{ animationDelay: '0s' }}>
          <div className="settings-section-header">
            <User size={18} />
            <h2>Profile</h2>
          </div>
          <div className="settings-section-body">
            <div className="settings-avatar-row">
              <div className="settings-avatar">
                <span>AR</span>
                <button className="settings-avatar-overlay" title="Change avatar">
                  <Camera size={16} />
                  <span>Change</span>
                </button>
              </div>
            </div>
            <div className="settings-field">
              <label className="settings-label">Full Name</label>
              <input
                type="text"
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="settings-field">
              <label className="settings-label">Email</label>
              <input
                type="email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="settings-field">
              <label className="settings-label">Bio</label>
              <textarea
                className="input textarea"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself..."
                rows={3}
              />
            </div>
            <button className="btn btn-primary" onClick={handleSaveProfile}>
              <Check size={16} />
              Save Profile
            </button>
          </div>
        </section>

        {/* ---- Connected Platforms ---- */}
        <section className="settings-section card" style={{ animationDelay: '0.05s' }}>
          <div className="settings-section-header">
            <Link2 size={18} />
            <h2>Connected Platforms</h2>
          </div>
          <div className="settings-section-body">
            <div className="settings-platforms-list">
              {platforms.map((platform) => {
                const Icon = platform.icon;
                return (
                  <div key={platform.id} className="settings-platform-item">
                    <div className="settings-platform-info">
                      <span
                        className="settings-platform-icon"
                        style={{ color: platform.color }}
                      >
                        <Icon size={18} />
                      </span>
                      <div className="settings-platform-details">
                        <span className="settings-platform-name">{platform.name}</span>
                        <span className="settings-platform-status">
                          {platform.connected ? (
                            <>
                              <span className="settings-status-dot connected" />
                              Connected · Synced {platform.lastSync}
                            </>
                          ) : (
                            <>
                              <span className="settings-status-dot" />
                              Not connected
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                    {platform.connected ? (
                      <label className="settings-toggle">
                        <input
                          type="checkbox"
                          checked={platform.connected}
                          onChange={() => togglePlatform(platform.id)}
                        />
                        <span className="settings-toggle-slider" />
                      </label>
                    ) : (
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => togglePlatform(platform.id)}
                      >
                        Connect
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ---- AI Preferences ---- */}
        <section className="settings-section card" style={{ animationDelay: '0.1s' }}>
          <div className="settings-section-header">
            <Sparkles size={18} />
            <h2>AI Preferences</h2>
          </div>
          <div className="settings-section-body">
            <div className="settings-fields-grid">
              <div className="settings-field">
                <label className="settings-label">Default Tone</label>
                <select
                  className="input"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                >
                  <option>Professional</option>
                  <option>Casual</option>
                  <option>Humorous</option>
                  <option>Inspirational</option>
                </select>
              </div>
              <div className="settings-field">
                <label className="settings-label">Content Length</label>
                <select
                  className="input"
                  value={contentLength}
                  onChange={(e) => setContentLength(e.target.value)}
                >
                  <option>Short</option>
                  <option>Medium</option>
                  <option>Long</option>
                </select>
              </div>
              <div className="settings-field">
                <label className="settings-label">Language</label>
                <select
                  className="input"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                </select>
              </div>
            </div>
            <div className="settings-toggle-group">
              <div className="settings-toggle-row">
                <div>
                  <span className="settings-toggle-label">Include Emojis</span>
                  <span className="settings-toggle-desc">
                    Add relevant emojis to generated content
                  </span>
                </div>
                <label className="settings-toggle">
                  <input
                    type="checkbox"
                    checked={includeEmojis}
                    onChange={() => setIncludeEmojis(!includeEmojis)}
                  />
                  <span className="settings-toggle-slider" />
                </label>
              </div>
              <div className="settings-toggle-row">
                <div>
                  <span className="settings-toggle-label">Include Hashtags</span>
                  <span className="settings-toggle-desc">
                    Auto-generate hashtags for posts
                  </span>
                </div>
                <label className="settings-toggle">
                  <input
                    type="checkbox"
                    checked={includeHashtags}
                    onChange={() => setIncludeHashtags(!includeHashtags)}
                  />
                  <span className="settings-toggle-slider" />
                </label>
              </div>
            </div>
          </div>
        </section>

        {/* ---- Notifications ---- */}
        <section className="settings-section card" style={{ animationDelay: '0.15s' }}>
          <div className="settings-section-header">
            <Bell size={18} />
            <h2>Notifications</h2>
          </div>
          <div className="settings-section-body">
            <div className="settings-toggle-group">
              <div className="settings-toggle-row">
                <div>
                  <span className="settings-toggle-label">Email Notifications</span>
                  <span className="settings-toggle-desc">
                    Receive updates and alerts via email
                  </span>
                </div>
                <label className="settings-toggle">
                  <input
                    type="checkbox"
                    checked={emailNotifs}
                    onChange={() => setEmailNotifs(!emailNotifs)}
                  />
                  <span className="settings-toggle-slider" />
                </label>
              </div>
              <div className="settings-toggle-row">
                <div>
                  <span className="settings-toggle-label">Push Notifications</span>
                  <span className="settings-toggle-desc">
                    Browser push notifications for important events
                  </span>
                </div>
                <label className="settings-toggle">
                  <input
                    type="checkbox"
                    checked={pushNotifs}
                    onChange={() => setPushNotifs(!pushNotifs)}
                  />
                  <span className="settings-toggle-slider" />
                </label>
              </div>
              <div className="settings-toggle-row">
                <div>
                  <span className="settings-toggle-label">Weekly Report</span>
                  <span className="settings-toggle-desc">
                    Get a weekly summary of your performance
                  </span>
                </div>
                <label className="settings-toggle">
                  <input
                    type="checkbox"
                    checked={weeklyReport}
                    onChange={() => setWeeklyReport(!weeklyReport)}
                  />
                  <span className="settings-toggle-slider" />
                </label>
              </div>
              <div className="settings-toggle-row">
                <div>
                  <span className="settings-toggle-label">Comment Alerts</span>
                  <span className="settings-toggle-desc">
                    Get notified when someone comments on your posts
                  </span>
                </div>
                <label className="settings-toggle">
                  <input
                    type="checkbox"
                    checked={commentAlerts}
                    onChange={() => setCommentAlerts(!commentAlerts)}
                  />
                  <span className="settings-toggle-slider" />
                </label>
              </div>
            </div>
          </div>
        </section>

        {/* ---- Billing ---- */}
        <section className="settings-section card" style={{ animationDelay: '0.2s' }}>
          <div className="settings-section-header">
            <CreditCard size={18} />
            <h2>Billing</h2>
          </div>
          <div className="settings-section-body">
            <div className="settings-billing-plan">
              <div className="settings-billing-info">
                <div className="settings-billing-current">
                  <span className="settings-billing-plan-name">Current Plan</span>
                  <span className="badge badge-primary">Pro</span>
                </div>
                <span className="settings-billing-price">$29/month</span>
              </div>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => addToast('Upgrade options coming soon', 'info')}
              >
                Upgrade
              </button>
            </div>
            <div className="settings-usage">
              <div className="settings-usage-header">
                <span className="settings-usage-label">AI Generations</span>
                <span className="settings-usage-count">247 / 500</span>
              </div>
              <div className="settings-usage-bar">
                <div
                  className="settings-usage-fill"
                  style={{ width: `${(247 / 500) * 100}%` }}
                />
              </div>
              <span className="settings-usage-note">Resets on Aug 1, 2026</span>
            </div>
            <div className="settings-billing-next">
              <span className="settings-label">Next billing date</span>
              <span className="settings-billing-date">August 1, 2026</span>
            </div>
          </div>
        </section>

        {/* ---- Danger Zone ---- */}
        <section
          className="settings-section card settings-danger-zone"
          style={{ animationDelay: '0.25s' }}
        >
          <div className="settings-section-header">
            <AlertTriangle size={18} />
            <h2>Danger Zone</h2>
          </div>
          <div className="settings-section-body">
            <p className="settings-danger-warning">
              Once you delete your account, there is no going back. All your data,
              drafts, and analytics will be permanently removed.
            </p>
            <button className="btn btn-danger" onClick={handleDeleteAccount}>
              <AlertTriangle size={16} />
              Delete Account
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
