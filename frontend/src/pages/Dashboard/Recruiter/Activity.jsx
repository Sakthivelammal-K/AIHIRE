import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import { useEffect, useState } from "react";
import API from "../../../api/api";

import {
  FaUsers,
  FaBriefcase,
  FaCalendarCheck,
  FaEnvelope,
  FaStar,
  FaCheckCircle,
  FaSpinner,
  FaBell,
  FaUserPlus,
  FaClock,
  FaArrowRight
} from "react-icons/fa";

function Activity() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [stats, setStats] = useState({
    totalInterviews: 0,
    newCandidates: 0,
    offersSent: 0,
    messagesReceived: 0
  });

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    setLoading(true);
    try {
      // 1. Load Interviews to create "Interview Scheduled" & "Interview Completed" activities
      let interviewActivities = [];
      try {
        const interviewRes = await API.get("/interviews/results");
        const interviews = Array.isArray(interviewRes.data) ? interviewRes.data : [];
        
        interviewActivities = interviews.map((item) => ({
          _id: `interview_${item._id}`,
          type: 'interview',
          title: `Interview with ${item.candidateName}`,
          description: `Position: ${item.jobTitle || 'N/A'} • Score: ${item.overall || item.score || 0}%`,
          timestamp: item.date || item.createdAt || new Date().toISOString(),
          badge: item.finalDecision || 'Pending',
          icon: <FaCalendarCheck />
        }));

        // Update stats based on interviews
        setStats(prev => ({
          ...prev,
          totalInterviews: interviews.length,
        }));
      } catch (e) { console.log("Interviews API not available"); }

      // 2. Load Messages to create "New Message" activities
      let messageActivities = [];
      try {
        const email = localStorage.getItem("email");
        const msgRes = await API.get(`/messages/users/${email}`);
        const messages = Array.isArray(msgRes.data) ? msgRes.data : [];

        messageActivities = messages.slice(0, 5).map((msg) => ({
          _id: `msg_${msg._id || Date.now()}`,
          type: 'message',
          title: `New message from ${msg.name || 'Unknown'}`,
          description: msg.lastMessage || 'No message content',
          timestamp: msg.lastMessageTime || new Date().toISOString(),
          badge: 'Unread',
          icon: <FaEnvelope />
        }));
        
        setStats(prev => ({
          ...prev,
          messagesReceived: messages.length,
        }));
      } catch (e) { console.log("Messages API not available"); }

      // 3. Load Applications to create "New Candidate" activities
      let candidateActivities = [];
      try {
        const appRes = await API.get("/applications/");
        const apps = Array.isArray(appRes.data) ? appRes.data : appRes.data.applications || [];

        candidateActivities = apps.slice(0, 5).map((app) => ({
          _id: `candidate_${app._id || Date.now()}`,
          type: 'candidate',
          title: `New application from ${app.candidateName || app.name || 'Unknown'}`,
          description: `Applied for ${app.jobTitle || 'a position'}`,
          timestamp: app.createdAt || new Date().toISOString(),
          badge: 'New',
          icon: <FaUserPlus />
        }));

        setStats(prev => ({
          ...prev,
          newCandidates: apps.length,
        }));
      } catch (e) { console.log("Applications API not available"); }

      // Combine all activities, sort by date (newest first), and limit to 20
      const allActivities = [...interviewActivities, ...messageActivities, ...candidateActivities];
      const sortedActivities = allActivities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

      setActivities(sortedActivities.slice(0, 20));

    } catch (err) {
      console.log("Error loading activities:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter activities based on selected tab
  const filteredActivities = activities.filter(activity => {
    if (activeTab === "all") return true;
    if (activeTab === "interviews") return activity.type === 'interview';
    if (activeTab === "candidates") return activity.type === 'candidate';
    if (activeTab === "messages") return activity.type === 'message';
    return true;
  });

  // Helper to format date
  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} min ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="activity-page">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px', flexDirection: 'column' }}>
            <FaSpinner className="spin" style={{ fontSize: '30px', color: '#e67e22', marginBottom: '15px' }} />
            <p style={{ color: '#718096' }}>Loading activity feed...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="activity-page">
        
        {/* HEADER */}
        <div className="activity-header">

          <div className="activity-header-right">
            <span style={{ fontSize: '13px', color: '#718096', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <FaClock /> Last updated just now
            </span>
          </div>
        </div>

        {/* FILTER TABS */}
        <div className="activity-tabs">
          <span className={activeTab === "all" ? "active" : ""} onClick={() => setActiveTab("all")}>All</span>
          <span className={activeTab === "interviews" ? "active" : ""} onClick={() => setActiveTab("interviews")}>Interviews</span>
          <span className={activeTab === "candidates" ? "active" : ""} onClick={() => setActiveTab("candidates")}>Candidates</span>
          <span className={activeTab === "messages" ? "active" : ""} onClick={() => setActiveTab("messages")}>Messages</span>
        </div>

        {/* MAIN GRID */}
        <div className="activity-grid">
          
          {/* LEFT FEED */}
          <div className="activity-feed">
            {filteredActivities.length > 0 ? (
              filteredActivities.map((activity) => (
                <div key={activity._id} className="activity-item">
                  <div className="time-line-connector"></div>
                  <div className={`activity-icon-wrapper ${activity.type}`}>
                    {activity.icon}
                  </div>
                  <div className="activity-content">
                    <h4>{activity.title}</h4>
                    <p>{activity.description}</p>
                    <div className="activity-meta">
                      <span>{formatTime(activity.timestamp)}</span>
                      {activity.badge && (
                        <span className={`badge ${activity.badge.toLowerCase()}`}>
                          {activity.badge}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 20px', color: '#718096' }}>
                <FaBell style={{ fontSize: '40px', color: '#e2e8f0', marginBottom: '10px' }} />
                <p>No activities found for this filter.</p>
              </div>
            )}
          </div>

          {/* RIGHT SIDEBAR - STATS */}
          <div className="activity-sidebar">
            
            <div className="activity-stats-card">
              <h4>Quick Stats</h4>
              <div className="activity-stats-grid">
                <div className="activity-stat-item">
                  <span className="stat-num">{stats.totalInterviews}</span>
                  <span className="stat-label">Interviews</span>
                </div>
                <div className="activity-stat-item">
                  <span className="stat-num">{stats.newCandidates}</span>
                  <span className="stat-label">Candidates</span>
                </div>
                <div className="activity-stat-item">
                  <span className="stat-num">{stats.offersSent}</span>
                  <span className="stat-label">Offers</span>
                </div>
                <div className="activity-stat-item">
                  <span className="stat-num">{stats.messagesReceived}</span>
                  <span className="stat-label">Messages</span>
                </div>
              </div>
            </div>

            <div className="activity-stats-card">
              <h4>Latest Updates</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {activities.slice(0, 3).map((act, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', borderBottom: '1px solid #f8f9fa', paddingBottom: '10px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: act.type === 'interview' ? '#e67e22' : act.type === 'candidate' ? '#10b981' : '#0d6efd' }}></div>
                    <div style={{ flex: 1, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                      <span style={{ fontWeight: '500', color: '#1a202c' }}>{act.title}</span>
                    </div>
                    <span style={{ fontSize: '11px', color: '#718096' }}>{formatTime(act.timestamp)}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}

export default Activity;