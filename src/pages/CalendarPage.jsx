import { useState, useMemo } from 'react';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  
  
  
  
  Globe,
  MessageCircle,
} from 'lucide-react';
import { FaTwitter as Twitter, FaLinkedin as Linkedin, FaInstagram as Instagram, FaFacebook as Facebook } from 'react-icons/fa';
import { useToast } from '../context/ToastContext';
import './CalendarPage.css';

const PLATFORM_ICONS = {
  X: Twitter,
  LinkedIn: Linkedin,
  Instagram: Instagram,
  Facebook: Facebook,
  Reddit: MessageCircle,
};

const PLATFORM_COLORS = {
  X: 'var(--color-x)',
  LinkedIn: 'var(--color-linkedin)',
  Instagram: 'var(--color-instagram)',
  Facebook: 'var(--color-facebook)',
  Reddit: 'var(--color-reddit)',
};

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getScheduledPosts(year, month) {
  return [];
}

function getCalendarDays(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDayOfWeek = firstDay.getDay();
  const daysInMonth = lastDay.getDate();
  const prevMonthLastDay = new Date(year, month, 0).getDate();

  const days = [];

  // Previous month trailing days
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    days.push({
      date: prevMonthLastDay - i,
      currentMonth: false,
      month: month - 1,
      year: month === 0 ? year - 1 : year,
    });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({
      date: i,
      currentMonth: true,
      month,
      year,
    });
  }

  // Next month leading days
  const remaining = 42 - days.length;
  for (let i = 1; i <= remaining; i++) {
    days.push({
      date: i,
      currentMonth: false,
      month: month + 1,
      year: month === 11 ? year + 1 : year,
    });
  }

  return days;
}

export default function CalendarPage() {
  const { addToast } = useToast();
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState(null);
  const [viewMode, setViewMode] = useState('month');

  const calendarDays = useMemo(
    () => getCalendarDays(currentYear, currentMonth),
    [currentYear, currentMonth]
  );

  const scheduledPosts = useMemo(
    () => getScheduledPosts(currentYear, currentMonth),
    [currentYear, currentMonth]
  );

  const monthName = new Date(currentYear, currentMonth).toLocaleString('default', {
    month: 'long',
  });

  const goToPrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
    setSelectedDay(null);
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
    setSelectedDay(null);
  };

  const goToToday = () => {
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
    setSelectedDay(today.getDate());
  };

  const isToday = (day) =>
    day.currentMonth &&
    day.date === today.getDate() &&
    currentMonth === today.getMonth() &&
    currentYear === today.getFullYear();

  const getPostsForDay = (dayNum) =>
    scheduledPosts.filter((p) => p.day === dayNum);

  const selectedDayPosts = selectedDay ? getPostsForDay(selectedDay) : [];

  return (
    <div className="calendar-page animate-fadeIn">
      <div className="calendar-header">
        <div className="calendar-header-left">
          <div className="calendar-title">
            <Calendar size={24} />
            <h1>Calendar</h1>
          </div>
          <span className="calendar-month-label">
            {monthName} {currentYear}
          </span>
        </div>
        <div className="calendar-header-right">
          <div className="calendar-view-toggle">
            <button
              className={`calendar-view-pill ${viewMode === 'month' ? 'active' : ''}`}
              onClick={() => setViewMode('month')}
            >
              Month
            </button>
            <button
              className={`calendar-view-pill ${viewMode === 'week' ? 'active' : ''}`}
              onClick={() => {
                setViewMode('week');
                addToast('Week view coming soon', 'info');
              }}
            >
              Week
            </button>
          </div>
          <div className="calendar-nav-btns">
            <button className="btn btn-ghost btn-icon" onClick={goToPrevMonth} title="Previous month">
              <ChevronLeft size={18} />
            </button>
            <button className="btn btn-secondary btn-sm" onClick={goToToday}>
              Today
            </button>
            <button className="btn btn-ghost btn-icon" onClick={goToNextMonth} title="Next month">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="calendar-grid-wrapper card">
        <div className="calendar-day-headers">
          {DAY_NAMES.map((d) => (
            <div key={d} className="calendar-day-header">
              {d}
            </div>
          ))}
        </div>
        <div className="calendar-grid">
          {calendarDays.map((day, index) => {
            const posts = day.currentMonth ? getPostsForDay(day.date) : [];
            const todayClass = isToday(day) ? 'calendar-cell-today' : '';
            const dimmedClass = !day.currentMonth ? 'calendar-cell-dimmed' : '';
            const selectedClass =
              day.currentMonth && selectedDay === day.date
                ? 'calendar-cell-selected'
                : '';

            return (
              <div
                key={index}
                className={`calendar-cell ${todayClass} ${dimmedClass} ${selectedClass}`}
                onClick={() => {
                  if (day.currentMonth) setSelectedDay(day.date);
                }}
              >
                <span className="calendar-cell-date">{day.date}</span>
                <div className="calendar-cell-posts">
                  {posts.slice(0, 2).map((post) => (
                    <div
                      key={post.id}
                      className="calendar-post-pill"
                      style={{ background: post.color }}
                      title={post.title}
                    >
                      <span className="calendar-post-pill-text">{post.title}</span>
                    </div>
                  ))}
                  {posts.length > 2 && (
                    <span className="calendar-post-more">+{posts.length - 2} more</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedDay && (
        <div className="calendar-detail-panel card animate-fadeInUp">
          <div className="calendar-detail-header">
            <h3>
              {monthName} {selectedDay}, {currentYear}
            </h3>
            <span className="badge badge-primary">
              {selectedDayPosts.length} post{selectedDayPosts.length !== 1 ? 's' : ''}
            </span>
          </div>
          {selectedDayPosts.length === 0 ? (
            <div className="calendar-detail-empty">
              <Clock size={32} className="calendar-detail-empty-icon" />
              <p>No posts scheduled for this day</p>
              <button className="btn btn-primary btn-sm">Schedule a post</button>
            </div>
          ) : (
            <div className="calendar-detail-list">
              {selectedDayPosts.map((post, i) => (
                <div
                  key={post.id}
                  className="calendar-detail-item"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div
                    className="calendar-detail-color"
                    style={{ background: post.color }}
                  />
                  <div className="calendar-detail-info">
                    <span className="calendar-detail-title">{post.title}</span>
                    <span className="calendar-detail-time">
                      <Clock size={12} />
                      {post.time}
                    </span>
                  </div>
                  <div className="calendar-detail-platforms">
                    {post.platforms.map((platform) => {
                      const Icon = PLATFORM_ICONS[platform] || Globe;
                      return (
                        <span
                          key={platform}
                          className="calendar-platform-badge"
                          style={{ color: PLATFORM_COLORS[platform] }}
                          title={platform}
                        >
                          <Icon size={14} />
                        </span>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
