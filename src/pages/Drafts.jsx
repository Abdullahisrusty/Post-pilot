import { useState, useMemo } from 'react';
import {
  FileText,
  Search,
  Pencil,
  Trash2,
  Send,
  X,
  Check,
  ChevronDown,
  
  
  
  MessageCircle,
  Globe,
  SortAsc,
} from 'lucide-react';
import { FaTwitter as Twitter, FaLinkedin as Linkedin, FaInstagram as Instagram, FaFacebook as Facebook } from 'react-icons/fa';
import { useToast } from '../context/ToastContext';
import './Drafts.css';

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

const initialDrafts = [
  {
    id: 1,
    title: '10 Things I Learned Building a SaaS in 2024',
    content:
      'Building a SaaS product from scratch has been one of the most rewarding yet challenging experiences of my career. Here are the top 10 lessons I wish I knew before starting...',
    platforms: ['X', 'LinkedIn'],
    status: 'Draft',
    editedAgo: '2h ago',
    wordCount: 342,
  },
  {
    id: 2,
    title: 'Why Every Founder Should Learn to Code',
    content:
      'As a non-technical founder who taught myself to code, I can confidently say it was the best investment I made. Here\'s why understanding code gives you a massive edge...',
    platforms: ['LinkedIn', 'Reddit'],
    status: 'Draft',
    editedAgo: '5h ago',
    wordCount: 528,
  },
  {
    id: 3,
    title: 'Product Hunt Launch Checklist',
    content:
      'After launching 3 products on Product Hunt and hitting the top 5 twice, I created the ultimate checklist. Save this for your next launch day...',
    platforms: ['X', 'LinkedIn', 'Facebook'],
    status: 'Scheduled',
    editedAgo: '1d ago',
    wordCount: 456,
  },
  {
    id: 4,
    title: 'The Future of AI in Content Creation',
    content:
      'AI isn\'t replacing content creators — it\'s giving them superpowers. Here\'s how I see the landscape evolving over the next 5 years and why human creativity still matters...',
    platforms: ['X', 'LinkedIn', 'Instagram', 'Facebook', 'Reddit'],
    status: 'Review',
    editedAgo: '2d ago',
    wordCount: 712,
  },
  {
    id: 5,
    title: 'Weekly Productivity Tips Thread',
    content:
      '🧵 Thread: 7 productivity tips that actually work (backed by science, not hustle culture). Tip #1: Time blocking isn\'t about rigidity — it\'s about intention...',
    platforms: ['X'],
    status: 'Draft',
    editedAgo: '3d ago',
    wordCount: 280,
  },
  {
    id: 6,
    title: 'Behind the Scenes: Building PostPilot',
    content:
      'Take a peek behind the curtain! Here\'s what our typical week looks like at PostPilot — from Monday standups to Friday deploys. The journey of building in public...',
    platforms: ['Instagram', 'Facebook'],
    status: 'Draft',
    editedAgo: '4d ago',
    wordCount: 394,
  },
];

const STATUS_BADGE = {
  Draft: 'badge-neutral',
  Scheduled: 'badge-primary',
  Review: 'badge-warning',
};

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'az', label: 'A — Z' },
  { value: 'za', label: 'Z — A' },
];

export default function Drafts() {
  const { addToast } = useToast();
  const [drafts, setDrafts] = useState(initialDrafts);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showSort, setShowSort] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [removingIds, setRemovingIds] = useState([]);

  const filteredDrafts = useMemo(() => {
    let result = drafts.filter(
      (d) =>
        d.title.toLowerCase().includes(search.toLowerCase()) ||
        d.content.toLowerCase().includes(search.toLowerCase())
    );

    switch (sortBy) {
      case 'oldest':
        result = [...result].reverse();
        break;
      case 'az':
        result = [...result].sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'za':
        result = [...result].sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        break;
    }

    return result;
  }, [drafts, search, sortBy]);

  const handleEdit = (draft) => {
    setEditingId(draft.id);
    setEditContent(draft.content);
  };

  const handleSaveEdit = (id) => {
    setDrafts((prev) =>
      prev.map((d) => (d.id === id ? { ...d, content: editContent } : d))
    );
    setEditingId(null);
    setEditContent('');
    addToast('Draft updated successfully', 'success');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditContent('');
  };

  const handleDelete = (id) => {
    setRemovingIds((prev) => [...prev, id]);
    setTimeout(() => {
      setDrafts((prev) => prev.filter((d) => d.id !== id));
      setRemovingIds((prev) => prev.filter((rid) => rid !== id));
      addToast('Draft deleted', 'success');
    }, 300);
  };

  const handlePublish = (draft) => {
    addToast(`"${draft.title}" sent to publishing queue`, 'success');
  };

  return (
    <div className="drafts-page animate-fadeIn">
      <div className="drafts-header">
        <div className="drafts-header-left">
          <div className="drafts-title">
            <FileText size={24} />
            <h1>Drafts</h1>
          </div>
          <span className="badge badge-neutral drafts-count">
            {drafts.length} draft{drafts.length !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="drafts-header-right">
          <div className="drafts-search">
            <Search size={16} className="drafts-search-icon" />
            <input
              type="text"
              className="input"
              placeholder="Search drafts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="drafts-sort-wrapper">
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setShowSort(!showSort)}
            >
              <SortAsc size={14} />
              Sort
              <ChevronDown size={14} />
            </button>
            {showSort && (
              <div className="drafts-sort-dropdown card">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    className={`drafts-sort-option ${sortBy === opt.value ? 'active' : ''}`}
                    onClick={() => {
                      setSortBy(opt.value);
                      setShowSort(false);
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {filteredDrafts.length === 0 ? (
        <div className="drafts-empty card">
          <div className="drafts-empty-icon">
            <FileText size={48} />
          </div>
          <h3>No drafts yet</h3>
          <p>Start composing to see your drafts here!</p>
        </div>
      ) : (
        <div className="drafts-list">
          {filteredDrafts.map((draft, index) => (
            <div
              key={draft.id}
              className={`drafts-card card ${removingIds.includes(draft.id) ? 'drafts-card-removing' : ''}`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="drafts-card-main">
                <div className="drafts-card-content">
                  <div className="drafts-card-top">
                    <h3 className="drafts-card-title">{draft.title}</h3>
                    <span className={`badge ${STATUS_BADGE[draft.status]}`}>
                      {draft.status}
                    </span>
                  </div>

                  {editingId === draft.id ? (
                    <div className="drafts-edit-area">
                      <textarea
                        className="input textarea"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows={4}
                        autoFocus
                      />
                      <div className="drafts-edit-actions">
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleSaveEdit(draft.id)}
                        >
                          <Check size={14} />
                          Save
                        </button>
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={handleCancelEdit}
                        >
                          <X size={14} />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="drafts-card-preview">{draft.content}</p>
                  )}

                  <div className="drafts-card-meta">
                    <div className="drafts-card-platforms">
                      {draft.platforms.map((platform) => {
                        const Icon = PLATFORM_ICONS[platform] || Globe;
                        return (
                          <span
                            key={platform}
                            className="drafts-platform-tag"
                            style={{ color: PLATFORM_COLORS[platform] }}
                            title={platform}
                          >
                            <Icon size={12} />
                            <span>{platform}</span>
                          </span>
                        );
                      })}
                    </div>
                    <div className="drafts-card-info">
                      <span className="drafts-card-words">{draft.wordCount} words</span>
                      <span className="drafts-card-separator">·</span>
                      <span className="drafts-card-time">{draft.editedAgo}</span>
                    </div>
                  </div>
                </div>

                <div className="drafts-card-actions">
                  <button
                    className="btn btn-ghost btn-icon-sm"
                    title="Edit"
                    onClick={() => handleEdit(draft)}
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    className="btn btn-ghost btn-icon-sm drafts-btn-delete"
                    title="Delete"
                    onClick={() => handleDelete(draft.id)}
                  >
                    <Trash2 size={15} />
                  </button>
                  <button
                    className="btn btn-primary btn-sm"
                    title="Publish"
                    onClick={() => handlePublish(draft)}
                  >
                    <Send size={13} />
                    Publish
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
