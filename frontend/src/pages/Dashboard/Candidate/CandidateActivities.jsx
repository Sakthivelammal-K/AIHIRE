import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../api/api";

import {
  FaUser,
  FaCalendarCheck,
  FaEnvelope,
  FaSpinner,
  FaBell,
  FaUserPlus,
  FaClock,
  FaFileAlt,
  FaCheckCircle,
  FaStar
} from "react-icons/fa";

function CandidateActivity() {
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [stats, setStats] = useState({
    totalApplications: 0,
    totalInterviews: 0,
    offersReceived: 0,
    profileScore: 0
  });

  const myEmail = localStorage.getItem("email");
  const myName = localStorage.getItem("username") || "Candidate";

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    setLoading(true);
    try {
      let allActivities = [];
      let appCount = 0;
      let intCount = 0;
      let offerCount = 0;

      // 1. Fetch Real Applications
      try {
        const appRes = await API.get("/applications/");
        const rawApps = Array.isArray(appRes.data) ? appRes.data : appRes.data.applications || [];
        
        // Filter applications for this logged-in user
        const myApps = rawApps.filter(app => app.email === myEmail || app.candidateName === myName);
        appCount = myApps.length;

        const appActivities = myApps.map((app) => ({
          _id: `app_${app._id}`,
          type: 'application',
          title: `Applied for ${app.jobTitle}`,
          description: `Company: ${app.companyName || 'N/A'}`,
          timestamp: app.createdAt || app.appliedDate || new Date().toISOString(),
          badge: app.status || 'Applied',
          icon: <FaUserPlus />
        }));

        // Calculate offers
        offerCount = myApps.filter(a => a.status === "Offer" || a.status === "Hired" || a.status === "Selected").length;
        allActivities = [...allActivities, ...appActivities];

      } catch (e) { console.log("Applications API not available"); }

      // 2. Fetch Real Interviews
      try {
        const intRes = await API.get("/interviews/");
        const rawInts = Array.isArray(intRes.data.scheduled) ? intRes.data.scheduled : intRes.data || [];
        
        // Filter interviews for this logged-in user
        const myInts = rawInts.filter(int => int.email === myEmail || int.candidateName === myName);
        intCount = myInts.length;

        const intActivities = myInts.map((int) => ({
          _id: `int_${int._id}`,
          type: 'interview',
          title: `Interview for ${int.jobTitle}`,
          description: `Type: ${int.interviewType || int.type || 'Video Interview'}`,
          timestamp: int.date || new Date().toISOString(),
          badge: 'Upcoming',
          icon: <FaCalendarCheck />
        }));
        allActivities = [...allActivities, ...intActivities];

      } catch (e) { console.log("Interviews API not available"); }

      // 3. Check Resume (For Profile Completion)
      let profileScore = 0;
      try {
        const resRes = await API.get(`/resumes/${myEmail}`);
        if (resRes.data && resRes.data._id) {
          profileScore = 75; // Base score
          allActivities.push({
            _id: `resume_${Date.now()}`,
            type: 'resume',
            title: 'Resume Uploaded',
            description: 'Your profile is now 75% complete.',
            timestamp: new Date().toISOString(),
            badge: 'Complete',
            icon: <FaFileAlt />
          });
        }
      } catch (e) { 
        // No resume uploaded
      }

      // Update Stats
      setStats({
        totalApplications: appCount,
        totalInterviews: intCount,
        offersReceived: offerCount,
        profileScore: profileScore
      });

      // Sort all activities by date (Newest first)
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
    if (activeTab === "applications") return activity.type === 'application';
    if (activeTab === "offers") return activity.type === 'offer';
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
        <div className="cand-activity-page">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px', flexDirection: 'column' }}>
            <FaSpinner className="spin" style={{ fontSize: '30px', color: '#e67e22', marginBottom: '15px' }} />
            <p style={{ color: '#718096' }}>Loading your activity feed...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="cand-activity-page">
        
        {/* HEADER */}
        <div className="cand-activity-header">
          <div className="cand-activity-header-left">
            <h1><FaBell /> My Activity</h1>
            <p>Track your application journey and interview progress</p>
          </div>
          <div className="cand-activity-header-right">
            <span style={{ fontSize: '13px', color: '#718096', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <FaClock /> Real-time data
            </span>
          </div>
        </div>

        {/* FILTER TABS */}
        <div className="cand-activity-tabs">
          <span className={activeTab === "all" ? "active" : ""} onClick={() => setActiveTab("all")}>All</span>
          <span className={activeTab === "applications" ? "active" : ""} onClick={() => setActiveTab("applications")}>Applications</span>
          <span className={activeTab === "interviews" ? "active" : ""} onClick={() => setActiveTab("interviews")}>Interviews</span>
          <span className={activeTab === "offers" ? "active" : ""} onClick={() => setActiveTab("offers")}>Offers</span>
        </div>

        {/* MAIN GRID */}
        <div className="cand-activity-grid">
          
          {/* LEFT FEED */}
          <div className="cand-activity-feed">
            {filteredActivities.length > 0 ? (
              filteredActivities.map((activity) => (
                <div key={activity._id} className="cand-activity-item">
                  <div className="cand-time-line-connector"></div>
                  <div className={`cand-activity-icon-wrapper ${activity.type}`}>
                    {activity.icon}
                  </div>
                  <div className="cand-activity-content">
                    <h4>{activity.title}</h4>
                    <p>{activity.description}</p>
                    <div className="cand-activity-meta">
                      <span>{formatTime(activity.timestamp)}</span>
                      {activity.badge && (
                        <span className={`cand-badge ${activity.type}`}>
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
          <div className="cand-activity-sidebar">
            
            <div className="cand-activity-stats-card">
              <h4>Application Stats</h4>
              <div className="cand-activity-stats-grid">
                <div className="cand-activity-stat-item">
                  <span className="cand-stat-num">{stats.totalApplications}</span>
                  <span className="cand-stat-label">Applications</span>
                </div>
                <div className="cand-activity-stat-item">
                  <span className="cand-stat-num">{stats.totalInterviews}</span>
                  <span className="cand-stat-label">Interviews</span>
                </div>
                <div className="cand-activity-stat-item">
                  <span className="cand-stat-num">{stats.offersReceived}</span>
                  <span className="cand-stat-label">Offers</span>
                </div>
                <div className="cand-activity-stat-item">
                  <span className="cand-stat-num">{stats.profileScore}%</span>
                  <span className="cand-stat-label">Profile</span>
                </div>
              </div>
            </div>

            <div className="cand-activity-stats-card">
              <h4>Latest Updates</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {activities.slice(0, 3).map((act, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px', borderBottom: '1px solid #f8f9fa', paddingBottom: '10px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: act.type === 'interview' ? '#e67e22' : act.type === 'application' ? '#0d6efd' : '#10b981' }}></div>
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

export default CandidateActivity;