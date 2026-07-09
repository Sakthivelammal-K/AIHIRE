import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import { useEffect, useState } from "react";
import API from "../../../api/api";

import {
  FaBell,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaUserPlus,
  FaCalendarAlt,
  FaBriefcase,
  FaRobot,
  FaVideo,
  FaFileAlt,
  FaStar,
  FaTrash,
  FaCheckDouble,
  FaSpinner,
  FaFilter,
  FaSearch,
  FaCog,
  FaEnvelope,
  FaUsers,
  FaAward,
  FaExclamationTriangle,
  FaInfoCircle,
  FaArrowRight,
  FaChevronDown,
  FaChevronUp,
  FaEye,
  FaArchive,
  FaBookmark,
  FaRegBookmark,
  FaThumbsUp,
  FaComment
} from "react-icons/fa";

function Notifications() {
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [markingAll, setMarkingAll] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const response = await API.get("/notifications").catch(() => ({ data: null }));
      
      if (response.data && response.data.length > 0) {
        setNotifications(response.data);
      } else {
        // Mock notifications for demo
        const mockNotifications = [
          {
            _id: "notif1",
            type: "application",
            title: "New Application Received",
            message: "Sarah Johnson applied for Frontend Developer position",
            time: "2024-05-15T14:30:00",
            read: false,
            priority: "high",
            actionLink: "/candidate-detail/123",
            icon: FaUserPlus,
            color: "#3B82F6",
            metadata: {
              candidateName: "Sarah Johnson",
              jobTitle: "Frontend Developer",
              department: "Engineering"
            }
          },
          {
            _id: "notif2",
            type: "interview",
            title: "Interview Scheduled",
            message: "Technical interview scheduled with Michael Chen for May 20, 2024 at 10:00 AM",
            time: "2024-05-15T11:30:00",
            read: false,
            priority: "high",
            actionLink: "/recruiter-interviews",
            icon: FaCalendarAlt,
            color: "#8B5CF6",
            metadata: {
              candidateName: "Michael Chen",
              interviewType: "Technical Interview",
              date: "May 20, 2024"
            }
          },
          {
            _id: "notif3",
            type: "ai_interview",
            title: "AI Interview Completed",
            message: "AI interview completed for Emily Davis - Score: 85/100",
            time: "2024-05-15T09:15:00",
            read: false,
            priority: "medium",
            actionLink: "/ai-interview-results",
            icon: FaRobot,
            color: "#10B981",
            metadata: {
              candidateName: "Emily Davis",
              score: 85,
              verdict: "Hire"
            }
          },
          {
            _id: "notif4",
            type: "assessment",
            title: "Assessment Submitted",
            message: "James Wilson completed the technical assessment with a score of 78%",
            time: "2024-05-14T16:45:00",
            read: true,
            priority: "medium",
            actionLink: "/assessments",
            icon: FaFileAlt,
            color: "#F59E0B",
            metadata: {
              candidateName: "James Wilson",
              score: 78
            }
          },
          {
            _id: "notif5",
            type: "hire",
            title: "New Hire Onboarded",
            message: "Olivia Martin has been hired for Product Manager position",
            time: "2024-05-14T14:20:00",
            read: true,
            priority: "high",
            actionLink: "/candidates",
            icon: FaAward,
            color: "#F97316",
            metadata: {
              candidateName: "Olivia Martin",
              jobTitle: "Product Manager"
            }
          },
          {
            _id: "notif6",
            type: "job",
            title: "Job Posting Expiring Soon",
            message: "Frontend Developer job posting will expire in 3 days",
            time: "2024-05-14T10:00:00",
            read: true,
            priority: "low",
            actionLink: "/jobs",
            icon: FaBriefcase,
            color: "#EF4444",
            metadata: {
              jobTitle: "Frontend Developer",
              daysLeft: 3
            }
          },
          {
            _id: "notif7",
            type: "message",
            title: "New Message Received",
            message: "Daniel Brown sent you a message about the assessment",
            time: "2024-05-13T15:30:00",
            read: true,
            priority: "medium",
            actionLink: "/messages",
            icon: FaEnvelope,
            color: "#EC407A",
            metadata: {
              senderName: "Daniel Brown",
              subject: "Assessment Query"
            }
          },
          {
            _id: "notif8",
            type: "system",
            title: "System Update",
            message: "New features available in the AI Interview module",
            time: "2024-05-13T08:00:00",
            read: true,
            priority: "low",
            actionLink: "/ai-interview-results",
            icon: FaInfoCircle,
            color: "#6B7280",
            metadata: {
              update: "AI Interview v2.0"
            }
          }
        ];
        setNotifications(mockNotifications);
      }
    } catch (error) {
      console.log("Error loading notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await API.put(`/notifications/${id}/read`).catch(() => {});
      setNotifications(prev =>
        prev.map(notif =>
          notif._id === id ? { ...notif, read: true } : notif
        )
      );
    } catch (error) {
      console.log("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    setMarkingAll(true);
    try {
      await API.put("/notifications/mark-all-read").catch(() => {});
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, read: true }))
      );
    } catch (error) {
      console.log("Error marking all as read:", error);
    } finally {
      setMarkingAll(false);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await API.delete(`/notifications/${id}`).catch(() => {});
      setNotifications(prev => prev.filter(notif => notif._id !== id));
    } catch (error) {
      console.log("Error deleting notification:", error);
    }
  };

  const getFilteredNotifications = () => {
    let filtered = notifications;
    
    // Apply search
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(notif =>
        notif.title.toLowerCase().includes(search) ||
        notif.message.toLowerCase().includes(search) ||
        notif.metadata?.candidateName?.toLowerCase().includes(search) ||
        notif.metadata?.jobTitle?.toLowerCase().includes(search)
      );
    }
    
    // Apply type filter
    if (filter !== "all") {
      if (filter === "unread") {
        filtered = filtered.filter(notif => !notif.read);
      } else {
        filtered = filtered.filter(notif => notif.type === filter);
      }
    }
    
    // Sort by time (newest first)
    return filtered.sort((a, b) => new Date(b.time) - new Date(a.time));
  };

  const getTimeAgo = (timestamp) => {
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
  const filteredNotifications = getFilteredNotifications();

  const notificationTypes = [
    { value: "all", label: "All", icon: FaBell },
    { value: "unread", label: "Unread", icon: FaClock },
    { value: "application", label: "Applications", icon: FaUserPlus },
    { value: "interview", label: "Interviews", icon: FaCalendarAlt },
    { value: "ai_interview", label: "AI Interviews", icon: FaRobot },
    { value: "assessment", label: "Assessments", icon: FaFileAlt },
    { value: "hire", label: "Hires", icon: FaAward },
    { value: "job", label: "Jobs", icon: FaBriefcase },
    { value: "message", label: "Messages", icon: FaEnvelope },
    { value: "system", label: "System", icon: FaInfoCircle }
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="notifications-loading">
          <FaSpinner className="spin" />
          <p>Loading notifications...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="notifications-page">
        {/* Header */}
        <div className="notifications-header">
          <div className="notifications-header-left">
            <h1>
              <FaBell className="notifications-header-icon" />
              Notifications
            </h1>
            {unreadCount > 0 && (
              <span className="notifications-unread-badge">{unreadCount} unread</span>
            )}
          </div>
          <div className="notifications-header-right">
            <button 
              className="notifications-mark-all"
              onClick={markAllAsRead}
              disabled={markingAll || unreadCount === 0}
            >
              {markingAll ? (
                <FaSpinner className="spin" />
              ) : (
                <FaCheckDouble />
              )}
              Mark all as read
            </button>
            <button 
              className="notifications-settings-btn"
              onClick={() => setShowSettings(!showSettings)}
            >
              <FaCog />
            </button>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="notifications-toolbar">
          <div className="notifications-search">
            <FaSearch className="notifications-search-icon" />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="notifications-filters">
            {notificationTypes.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.value}
                  className={`notifications-filter-btn ${filter === type.value ? 'active' : ''}`}
                  onClick={() => setFilter(type.value)}
                >
                  <Icon />
                  <span>{type.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="notifications-settings-panel">
            <div className="notifications-settings-header">
              <h3>Notification Settings</h3>
              <button onClick={() => setShowSettings(false)}>
                <FaTimesCircle />
              </button>
            </div>
            <div className="notifications-settings-body">
              <div className="notifications-setting-item">
                <div className="notifications-setting-info">
                  <span className="notifications-setting-label">Email Notifications</span>
                  <span className="notifications-setting-desc">Receive notifications via email</span>
                </div>
                <label className="notifications-toggle">
                  <input type="checkbox" defaultChecked />
                  <span className="notifications-toggle-slider"></span>
                </label>
              </div>
              <div className="notifications-setting-item">
                <div className="notifications-setting-info">
                  <span className="notifications-setting-label">Push Notifications</span>
                  <span className="notifications-setting-desc">Receive push notifications in browser</span>
                </div>
                <label className="notifications-toggle">
                  <input type="checkbox" defaultChecked />
                  <span className="notifications-toggle-slider"></span>
                </label>
              </div>
              <div className="notifications-setting-item">
                <div className="notifications-setting-info">
                  <span className="notifications-setting-label">Application Updates</span>
                  <span className="notifications-setting-desc">Get notified about new applications</span>
                </div>
                <label className="notifications-toggle">
                  <input type="checkbox" defaultChecked />
                  <span className="notifications-toggle-slider"></span>
                </label>
              </div>
              <div className="notifications-setting-item">
                <div className="notifications-setting-info">
                  <span className="notifications-setting-label">Interview Reminders</span>
                  <span className="notifications-setting-desc">Get reminders before interviews</span>
                </div>
                <label className="notifications-toggle">
                  <input type="checkbox" defaultChecked />
                  <span className="notifications-toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Notifications List */}
        <div className="notifications-list">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => {
              const Icon = notification.icon || FaBell;
              const isUnread = !notification.read;
              
              return (
                <div
                  key={notification._id}
                  className={`notifications-item ${isUnread ? 'unread' : ''}`}
                  onClick={() => {
                    markAsRead(notification._id);
                    if (notification.actionLink) {
                      // Navigate to action link
                    }
                  }}
                >
                  <div 
                    className="notifications-item-icon"
                    style={{ background: `${notification.color}15`, color: notification.color }}
                  >
                    <Icon />
                  </div>
                  <div className="notifications-item-content">
                    <div className="notifications-item-header">
                      <div className="notifications-item-title">
                        <span className="notifications-item-type">{notification.title}</span>
                        {isUnread && <span className="notifications-item-dot"></span>}
                      </div>
                      <div className="notifications-item-actions">
                        {isUnread && (
                          <button 
                            className="notifications-item-mark-read"
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(notification._id);
                            }}
                            title="Mark as read"
                          >
                            <FaCheckCircle />
                          </button>
                        )}
                        <button 
                          className="notifications-item-delete"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification._id);
                          }}
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                    <p className="notifications-item-message">{notification.message}</p>
                    {notification.metadata && (
                      <div className="notifications-item-metadata">
                        {notification.metadata.candidateName && (
                          <span className="notifications-item-tag">
                            <FaUsers /> {notification.metadata.candidateName}
                          </span>
                        )}
                        {notification.metadata.jobTitle && (
                          <span className="notifications-item-tag">
                            <FaBriefcase /> {notification.metadata.jobTitle}
                          </span>
                        )}
                        {notification.metadata.score && (
                          <span className="notifications-item-tag score">
                            <FaStar /> {notification.metadata.score}%
                          </span>
                        )}
                      </div>
                    )}
                    <div className="notifications-item-footer">
                      <span className="notifications-item-time">
                        {getTimeAgo(notification.time)}
                      </span>
                      {notification.actionLink && (
                        <button className="notifications-item-action">
                          View Details <FaArrowRight />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="notifications-empty">
              <FaBell className="notifications-empty-icon" />
              <h3>No notifications</h3>
              <p>You're all caught up! Check back later for updates.</p>
            </div>
          )}
        </div>

        {/* Load More */}
        {filteredNotifications.length > 0 && filteredNotifications.length >= 10 && (
          <div className="notifications-load-more">
            <button className="notifications-load-more-btn">
              Load More
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default Notifications;