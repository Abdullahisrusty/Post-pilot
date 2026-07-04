import { useState } from 'react';
import {
  MessageSquare,
  Sparkles,
  Check,
  Send,
  Filter,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import './Community.css';

const PLATFORMS = {
  x: { label: 'X', color: '#ffffff', bg: 'rgba(255,255,255,0.1)' },
  linkedin: { label: 'LinkedIn', color: '#0a66c2', bg: 'rgba(10,102,194,0.15)' },
  reddit: { label: 'Reddit', color: '#ff4500', bg: 'rgba(255,69,0,0.15)' },
  instagram: { label: 'Instagram', color: '#e4405f', bg: 'rgba(228,64,95,0.15)' },
  facebook: { label: 'Facebook', color: '#1877f2', bg: 'rgba(24,119,242,0.15)' },
};

const MOCK_COMMENTS = [];

function generateReplies(comment) {
  return {
    friendly: `Hey ${comment.username.replace('@', '')}! 😊 Thank you so much for the kind words — it really means a lot! We're thrilled you're enjoying it. Stay tuned for more exciting updates coming soon! 🚀`,
    professional: `Thank you for your feedback, ${comment.username.replace('@', '')}. We appreciate your engagement and are committed to continuously improving the experience. Please don't hesitate to reach out if you have any further questions or suggestions.`,
    funny: `You just made our entire team do a happy dance 🕺💃 — we might need to add that as a feature next! Thanks for the love, ${comment.username.replace('@', '')}! 😄`,
  };
}

const FILTERS = ['All', 'Unread', 'X', 'LinkedIn', 'Reddit', 'Instagram', 'Facebook'];

export default function Community() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [expandedComment, setExpandedComment] = useState(null);
  const [repliedComments, setRepliedComments] = useState(new Set());
  const [readComments, setReadComments] = useState(new Set());

  const filteredComments = MOCK_COMMENTS.filter((c) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Unread') return c.unread && !readComments.has(c.id);
    return PLATFORMS[c.platform]?.label === activeFilter;
  });

  const unreadCount = MOCK_COMMENTS.filter(
    (c) => c.unread && !readComments.has(c.id)
  ).length;

  const handleGenerateReply = (commentId) => {
    setExpandedComment(expandedComment === commentId ? null : commentId);
  };

  const handleReply = (commentId) => {
    setRepliedComments((prev) => new Set(prev).add(commentId));
    setReadComments((prev) => new Set(prev).add(commentId));
    setTimeout(() => {
      setExpandedComment(null);
    }, 1500);
  };

  return (
    <div className="community-page">
      {/* Header */}
      <div className="community-header animate-fadeInUp">
        <div className="community-header-left">
          <div className="community-title-group">
            <div className="community-icon-wrap">
              <MessageSquare size={22} />
            </div>
            <h1 className="community-title">Community</h1>
            {unreadCount > 0 && (
              <span className="community-unread-badge">{unreadCount} unread</span>
            )}
          </div>
          <p className="community-subtitle">
            Manage and reply to comments across all your connected platforms
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="community-filters animate-fadeInUp" style={{ animationDelay: '0.05s' }}>
        <Filter size={15} className="community-filter-icon" />
        {FILTERS.map((filter) => (
          <button
            key={filter}
            className={`community-filter-btn${activeFilter === filter ? ' active' : ''}`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
            {filter === 'Unread' && unreadCount > 0 && (
              <span className="filter-count">{unreadCount}</span>
            )}
          </button>
        ))}
      </div>

      {/* Comment List */}
      <div className="community-list">
        {filteredComments.length === 0 && (
          <div className="community-empty animate-fadeInUp">
            <MessageSquare size={40} strokeWidth={1} />
            <p>No comments match this filter</p>
          </div>
        )}

        {filteredComments.map((comment, index) => {
          const platform = PLATFORMS[comment.platform];
          const isExpanded = expandedComment === comment.id;
          const isReplied = repliedComments.has(comment.id);
          const isUnread = comment.unread && !readComments.has(comment.id);
          const replies = generateReplies(comment);

          return (
            <div
              key={comment.id}
              className={`community-comment-item animate-fadeInUp${isUnread ? ' unread' : ''}${isReplied ? ' replied' : ''}`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="comment-main">
                {/* Unread indicator */}
                {isUnread && <div className="comment-unread-dot" />}

                {/* Avatar */}
                <div
                  className="comment-avatar"
                  style={{ background: comment.avatarColor }}
                >
                  {comment.initials}
                </div>

                {/* Content */}
                <div className="comment-content">
                  <div className="comment-meta">
                    <span
                      className="comment-platform-badge"
                      style={{ background: platform.bg, color: platform.color }}
                    >
                      {platform.label}
                    </span>
                    <span className="comment-username">{comment.username}</span>
                    <span className="comment-separator">·</span>
                    <span className="comment-time">{comment.timestamp}</span>
                  </div>
                  <p className="comment-text">{comment.text}</p>
                  <p className="comment-ref">
                    on <span>{comment.postRef}</span>
                  </p>
                </div>

                {/* Actions */}
                <div className="comment-actions">
                  {isReplied ? (
                    <span className="comment-replied-badge">
                      <Check size={13} />
                      Replied
                    </span>
                  ) : (
                    <button
                      className="btn btn-secondary btn-sm comment-generate-btn"
                      onClick={() => handleGenerateReply(comment.id)}
                    >
                      <Sparkles size={13} />
                      Generate Reply
                      {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                    </button>
                  )}
                </div>
              </div>

              {/* Reply Panel */}
              {isExpanded && !isReplied && (
                <div className="comment-reply-panel">
                  <div className="reply-panel-header">
                    <Sparkles size={14} className="reply-sparkle" />
                    <span>AI-Generated Replies</span>
                  </div>
                  <div className="reply-options">
                    {[
                      { key: 'friendly', label: 'Friendly', emoji: '😊', desc: 'Warm & appreciative' },
                      { key: 'professional', label: 'Professional', emoji: '💼', desc: 'Formal & structured' },
                      { key: 'funny', label: 'Funny', emoji: '😄', desc: 'Witty & humorous' },
                    ].map((tone) => (
                      <div key={tone.key} className="reply-option-card">
                        <div className="reply-option-header">
                          <span className="reply-tone-emoji">{tone.emoji}</span>
                          <span className="reply-tone-label">{tone.label}</span>
                          <span className="reply-tone-desc">{tone.desc}</span>
                        </div>
                        <p className="reply-option-text">{replies[tone.key]}</p>
                        <button
                          className="btn btn-primary btn-sm reply-send-btn"
                          onClick={() => handleReply(comment.id)}
                        >
                          <Send size={12} />
                          Reply
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Success State */}
              {isReplied && expandedComment === comment.id && (
                <div className="comment-success-banner">
                  <Check size={16} />
                  Reply sent successfully!
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
