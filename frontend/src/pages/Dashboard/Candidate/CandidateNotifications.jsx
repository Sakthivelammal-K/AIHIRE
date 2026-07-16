import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../api/api";

import {
  FaBell,
  FaCheckCircle,
  FaTimesCircle,
  FaFilter,
  FaClock,
  FaUserPlus,
  FaCalendarAlt,
  FaBriefcase,
  FaFileAlt,
  FaStar,
  FaTrash,
  FaCheckDouble,
  FaSpinner,
  FaSearch,
  FaCog,
  FaEnvelope,
  FaUsers,
  FaAward,
  FaExclamationTriangle,
  FaInfoCircle,
  FaArrowRight,
  FaSortAmountDown,
  FaSortAmountUp
} from "react-icons/fa";

// Safe Icon Map
const ICON_MAP = {
  FaBell, FaCheckCircle, FaTimesCircle, FaClock, FaUserPlus, 
  FaCalendarAlt, FaBriefcase, FaFileAlt, FaStar, FaTrash, 
  FaCheckDouble, FaSpinner, FaFilter, FaSearch, FaCog, 
  FaEnvelope, FaUsers, FaAward, FaExclamationTriangle, 
  FaInfoCircle, FaArrowRight, FaSortAmountDown, FaSortAmountUp
};

function CandidateNotifications() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [error, setError] = useState(null);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [sortOrder, setSortOrder] = useState(-1);
  const [stats, setStats] = useState({ total: 0, unread: 0, read: 0, by_type: {} });
  const [markingAll, setMarkingAll] = useState(false);

  const myEmail = localStorage.getItem("email");
  const myRole = localStorage.getItem("role") || "candidate";

  // ==========================================
  // FETCH NOTIFICATIONS
  // ==========================================
  const loadNotifications = async (reset = true) => {
    if (reset) {
      setLoading(true);
      setSkip(0);
      setHasMore(true);
    } else {
      setLoadingMore(true);
    }

    setError(null);
    try {
      const currentSkip = reset ? 0 : skip;
      let url = `/notifications?recipient=${myEmail}&limit=15&skip=${currentSkip}&sort_order=${sortOrder}`;
      
      if (filter !== "all" && filter !== "unread") url += `&type=${filter}`;
      if (filter === "unread") url += `&read=false`;
      if (searchTerm) url += `&search=${searchTerm}`;

      const response = await API.get(url);
      
      if (response.data) {
        if (reset) {
          setNotifications(response.data);
          setHasMore(response.data.length >= 15);
        } else {
          setNotifications(prev => [...prev, ...response.data]);
          setHasMore(response.data.length >= 15);
        }
      } else {
        if (reset) setNotifications([]);
        setHasMore(false);
      }
    } catch (error) {
      console.log("Error loading notifications:", error);
      setError("Failed to load notifications. Please try again.");
    } finally {
      if (reset) setLoading(false);
      else setLoadingMore(false);
    }
  };

  // ==========================================
  // FETCH STATS
  // ==========================================
  const loadStats = async () => {
    try {
      const response = await API.get(`/notifications/stats?recipient=${myEmail}`);
      if (response.data) setStats(response.data);
    } catch (error) {
      console.log("Error loading stats:", error);
    }
  };

  // ==========================================
  // SEARCH HANDLER
  // ==========================================
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (searchTimeout) clearTimeout(searchTimeout);
    const newTimeout = setTimeout(() => {
      loadNotifications(true);
    }, 500);
    setSearchTimeout(newTimeout);
  };

  // ==========================================
  // INITIAL LOAD & POLLING
  // ==========================================
  useEffect(() => {
    if (myEmail) {
      loadNotifications(true);
      loadStats();
    }
  }, [filter, searchTerm, sortOrder, myEmail]);

  useEffect(() => {
    if (!myEmail) return;
    const intervalId = setInterval(() => {
      const fetchNew = async () => {
        try {
          let url = `/notifications?recipient=${myEmail}&limit=15&skip=0&sort_order=${sortOrder}`;
          if (filter !== "all" && filter !== "unread") url += `&type=${filter}`;
          if (filter === "unread") url += `&read=false`;

          const response = await API.get(url);
          if (response.data && response.data.length > 0) {
            if (notifications.length === 0 || response.data[0]._id !== notifications[0]?._id) {
              setNotifications(response.data);
              setHasMore(response.data.length >= 15);
              setSkip(0);
              loadStats();
            }
          }
        } catch (err) {}
      };
      fetchNew();
    }, 5000);
    return () => clearInterval(intervalId);
  }, [myEmail, filter, notifications, sortOrder]);

  // ==========================================
  // ACTIONS
  // ==========================================
  const markAsRead = async (id) => {
    try {
      await API.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(notif => notif._id === id ? { ...notif, read: true } : notif));
      loadStats();
    } catch (error) {
      console.log("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    setMarkingAll(true);
    try {
      await API.put(`/notifications/mark-all-read?recipient=${myEmail}`);
      setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
      loadStats();
    } catch (error) {
      console.log("Error marking all as read:", error);
    } finally {
      setMarkingAll(false);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await API.delete(`/notifications/${id}`);
      setNotifications(prev => prev.filter(notif => notif._id !== id));
      loadStats();
    } catch (error) {
      console.log("Error deleting notification:", error);
    }
  };

    // ==========================================
  // LOAD MORE
  // ==========================================
  const handleLoadMore = () => {
    const newSkip = skip + 15;
    setSkip(newSkip);
    loadNotifications(false);
  };

  const deleteAllNotifications = async () => {
    if (window.confirm("Are you sure you want to delete all notifications?")) {
      try {
        await API.delete(`/notifications/clear-all/${myEmail}`);
        setNotifications([]);
        setHasMore(false);
        loadStats();
      } catch (error) {
        console.log("Error clearing notifications:", error);
      }
    }
  };

  // ==========================================
  // NAVIGATION
  // ==========================================
  const handleNotificationClick = (notification) => {
    if (!notification.read) markAsRead(notification._id);
    let targetPath = "";
    
    if (notification.action_link === "/candidates") {
      targetPath = "/candidate/candidates"; // Candidate doesn't have candidates page, fallback to dashboard
    } else if (!notification.action_link) {
      targetPath = "/candidate";
    } else if (notification.action_link.startsWith("/candidate")) {
      targetPath = notification.action_link;
    } else {
      targetPath = `/candidate${notification.action_link}`;
    }
    
    console.log("Candidate Navigating to:", targetPath);
    navigate(targetPath);
  };

  // ==========================================
  // HELPERS
  // ==========================================
  const getTimeAgo = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} min ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`;
    if (diff < 172800000) return 'Yesterday';
    if (diff < 604800000) return `${Math.floor(diff / 86400000)} days ago`;
    return date.toLocaleDateString();
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const notificationTypes = [
    { value: "all", label: "All", icon: FaBell },
    { value: "unread", label: "Unread", icon: FaClock },
    { value: "application", label: "Applications", icon: FaUserPlus },
    { value: "interview", label: "Interviews", icon: FaCalendarAlt },
    { value: "assessment", label: "Assessments", icon: FaFileAlt },
    { value: "job", label: "Jobs", icon: FaBriefcase },
    { value: "message", label: "Messages", icon: FaEnvelope }
  ];

  // ==========================================
  // RENDER
  // ==========================================
  if (loading && notifications.length === 0) {
    return (
      <DashboardLayout>
        <div className="candidate-loading">
          <FaSpinner className="spin" />
          <p>Loading notifications...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="candidate-error">
          <FaExclamationTriangle className="candidate-error-icon" />
          <p>{error}</p>
          <button className="candidate-retry-btn" onClick={() => loadNotifications(true)}>
            Retry
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="candidate-notifications-page">
        
        {/* Header */}
        <div className="candidate-notifications-header">
          <div className="candidate-notifications-header-left">
            <h1>
              <FaBell className="candidate-notifications-header-icon" />
              Notifications
            </h1>
            <span className="candidate-unread-badge">{unreadCount} unread</span>
          </div>
          <div className="candidate-notifications-header-right">
            <button 
              className="candidate-notifications-mark-all"
              onClick={markAllAsRead}
              disabled={markingAll || unreadCount === 0}
            >
              {markingAll ? <FaSpinner className="spin" /> : <FaCheckDouble />}
              Mark all as read
            </button>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="candidate-stats-bar">
          <div className="candidate-stat-item">
            <span className="stat-label">Total</span>
            <span className="stat-value">{stats.total}</span>
          </div>
          <div className="candidate-stat-item">
            <span className="stat-label">New</span>
            <span className="stat-value new">{stats.unread}</span>
          </div>
          <div className="candidate-stat-item">
            <span className="stat-label">Read</span>
            <span className="stat-value read">{stats.read}</span>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="candidate-toolbar">
          <div className="candidate-search">
            <FaSearch className="candidate-search-icon" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <div className="candidate-filters">
            {notificationTypes.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.value}
                  className={`candidate-filter-btn ${filter === type.value ? 'active' : ''}`}
                  onClick={() => setFilter(type.value)}
                >
                  <Icon />
                  <span>{type.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sort */}
        <div className="candidate-sort">
          <button className="candidate-sort-btn" onClick={() => setSortOrder(sortOrder === -1 ? 1 : -1)}>
            {sortOrder === -1 ? <FaSortAmountDown /> : <FaSortAmountUp />}
            {sortOrder === -1 ? "Newest First" : "Oldest First"}
          </button>
          {notifications.length > 0 && (
            <button className="candidate-clear-all" onClick={deleteAllNotifications}>
              <FaTrash /> Clear All
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="candidate-list">
          {notifications.length > 0 ? (
            notifications.map((notification) => {
              try {
                const Icon = ICON_MAP[notification.icon] || FaBell;
                const isUnread = !notification.read;

                return (
                  <div
                    key={notification._id}
                    className={`candidate-item ${isUnread ? 'unread' : ''}`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div 
                      className="candidate-item-icon"
                      style={{ background: `${notification.color}15`, color: notification.color }}
                    >
                      <Icon />
                    </div>
                    <div className="candidate-item-content">
                      <div className="candidate-item-header">
                        <div className="candidate-item-title">
                          <span className="candidate-item-type">{notification.title}</span>
                          {isUnread && <span className="candidate-item-dot"></span>}
                        </div>
                        <div className="candidate-item-actions">
                          {isUnread && (
                            <button 
                              className="candidate-item-mark-read"
                              onClick={(e) => { e.stopPropagation(); markAsRead(notification._id); }}
                            >
                              <FaCheckCircle />
                            </button>
                          )}
                          <button 
                            className="candidate-item-delete"
                            onClick={(e) => { e.stopPropagation(); deleteNotification(notification._id); }}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                      <p className="candidate-item-message">{notification.message}</p>
                      
                      {notification.metadata && Object.keys(notification.metadata).length > 0 && (
                        <div className="candidate-item-metadata">
                          {notification.metadata.jobTitle && (
                            <span className="candidate-item-tag"><FaBriefcase /> {notification.metadata.jobTitle}</span>
                          )}
                          {notification.metadata.score && (
                            <span className="candidate-item-tag score"><FaStar /> {notification.metadata.score}%</span>
                          )}
                          {notification.metadata.company && (
                            <span className="candidate-item-tag"><FaUsers /> {notification.metadata.company}</span>
                          )}
                          {notification.metadata.status && (
                            <span className={`candidate-item-tag status-${notification.metadata.status}`}>
                              {notification.metadata.status}
                            </span>
                          )}
                        </div>
                      )}
                      
                      <div className="candidate-item-footer">
                        <span className="candidate-item-time">{getTimeAgo(notification.time)}</span>
                        {notification.action_link && (
                          <button 
                            className="candidate-item-action"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleNotificationClick(notification);
                            }}
                          >
                            View Details <FaArrowRight />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              } catch (e) {
                console.warn("Skipped a broken notification:", notification._id, e);
                return null;
              }
            })
          ) : (
            <div className="candidate-empty">
              <FaBell className="candidate-empty-icon" />
              <h3>No notifications</h3>
              <p>You're all caught up! Check back later for updates.</p>
            </div>
          )}
        </div>

        {/* Load More */}
        {hasMore && notifications.length > 0 && (
          <div className="candidate-load-more">
            <button className="candidate-load-more-btn" onClick={handleLoadMore} disabled={loadingMore}>
              {loadingMore ? <FaSpinner className="spin" /> : 'Load More'}
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default CandidateNotifications;