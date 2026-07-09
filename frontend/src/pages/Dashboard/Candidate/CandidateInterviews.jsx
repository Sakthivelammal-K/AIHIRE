import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import { useEffect, useState } from "react";
import API from "../../../api/api";
import { useNavigate } from "react-router-dom";

import {
  FaVideo,
  FaCalendarCheck,
  FaRobot,
  FaBrain,
  FaMicrophone,
  FaChartLine,
  FaLightbulb,
  FaClipboardCheck,
  FaCalendarAlt,
  FaFilter,
  FaClock,
  FaUsers,
  FaUser,
  FaBriefcase,
  FaMapMarkerAlt,
  FaStar,
  FaChevronRight,
  FaArrowRight,
  FaInfoCircle,
  FaPlay,
  FaCircle,
  FaCheckCircle,
  FaTimesCircle,
  FaBuilding,
  FaFileAlt,
  FaUserCircle,
  FaEnvelope,
} from "react-icons/fa";

function CandidateInterviews() {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState([]);
  const [results, setResults] = useState([]);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [selectedResult, setSelectedResult] = useState(null);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInterviews();
    loadResults();
  }, []);

  const loadInterviews = async () => {
    try {
      const res = await API.get("/interviews/");
      setInterviews(res.data.scheduled || []);
    } catch (error) {
      console.log(error);
      setInterviews([]);
    } finally {
      setLoading(false);
    }
  };

  const loadResults = async () => {
    try {
      const res = await API.get("/interviews/results");
      const username = localStorage.getItem("username");
      const myResults = res.data.filter(item => item.candidateName === username);
      setResults(myResults);
    } catch (error) {
      console.log(error);
      setResults([]);
    }
  };

  const username = localStorage.getItem("username");
  const myInterviews = interviews.filter(item => item.candidateName === username);

  // Filter interviews by status
  const upcomingInterviews = myInterviews.filter(item => 
    item.status === "Scheduled" || item.status === "Upcoming" || item.status === "Confirmed"
  );
  const completedInterviews = myInterviews.filter(item => 
    item.status === "Completed" || item.status === "Finished"
  );
  const cancelledInterviews = myInterviews.filter(item => 
    item.status === "Cancelled" || item.status === "Canceled"
  );

  // Get next upcoming interview
  const nextInterview = upcomingInterviews.length > 0 ? upcomingInterviews[0] : null;

  const getStatusClass = (status) => {
    const map = {
      'Scheduled': 'scheduled',
      'Upcoming': 'scheduled',
      'Confirmed': 'scheduled',
      'Completed': 'completed',
      'Finished': 'completed',
      'Cancelled': 'cancelled',
      'Canceled': 'cancelled'
    };
    return map[status] || 'scheduled';
  };

  const getStatusDisplay = (status) => {
    const map = {
      'Scheduled': 'Upcoming',
      'Upcoming': 'Upcoming',
      'Confirmed': 'Upcoming',
      'Completed': 'Completed',
      'Finished': 'Completed',
      'Cancelled': 'Cancelled',
      'Canceled': 'Cancelled'
    };
    return map[status] || status;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { 
        weekday: 'short',
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
    } catch {
      return 'N/A';
    }
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const date = new Date(dateStr);
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
    } catch {
      return 'N/A';
    }
  };

  const getCompanyLogo = (companyName) => {
    const logos = {
      'google': { bg: '#4285f4', text: 'G' },
      'microsoft': { bg: '#00a4ef', text: 'M' },
      'meta': { bg: '#4267b2', text: 'M' },
      'airbnb': { bg: '#ff5a5f', text: 'A' },
      'amazon': { bg: '#ff9900', text: 'A' },
      'spotify': { bg: '#1db954', text: 'S' },
      'uber': { bg: '#000000', text: 'U' },
      'hubspot': { bg: '#ff7a59', text: 'H' },
      'notion': { bg: '#000000', text: 'N' },
      'shopify': { bg: '#5e8e3e', text: 'S' },
      'acme': { bg: '#e67e22', text: 'A' },
    };
    const key = companyName?.toLowerCase() || '';
    for (const [name, logo] of Object.entries(logos)) {
      if (key.includes(name)) return logo;
    }
    const colors = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b', '#fa709a'];
    const index = (companyName?.length || 0) % colors.length;
    return { bg: colors[index], text: companyName?.charAt(0)?.toUpperCase() || 'C' };
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="cand-interviews-page">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <span>Loading interviews...</span>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="cand-interviews-page">
        {/* Header */}
        <div className="cand-interviews-header">
          <h1>My Interviews</h1>
          <p>Track and manage all your upcoming and past interviews.</p>
        </div>

        {/* Stats Tabs */}
        <div className="cand-interviews-tabs">
          <span 
            className={activeTab === "upcoming" ? "active" : ""} 
            onClick={() => setActiveTab("upcoming")}
          >
            Upcoming <span>{upcomingInterviews.length}</span>
          </span>
          <span 
            className={activeTab === "completed" ? "active" : ""} 
            onClick={() => setActiveTab("completed")}
          >
            Completed <span>{completedInterviews.length}</span>
          </span>
          <span 
            className={activeTab === "cancelled" ? "active" : ""} 
            onClick={() => setActiveTab("cancelled")}
          >
            Cancelled <span>{cancelledInterviews.length}</span>
          </span>
        </div>

        {/* Main Grid */}
        <div className="cand-interviews-grid">
          {/* Left Column */}
          <div className="cand-interviews-left">
            {/* Next Interview Card */}
            <div className="cand-interviews-next-card">
              <div className="cand-interviews-next-header">
                <h3>Next Interview</h3>
                <div className="cand-interviews-next-actions">
                  <FaCalendarAlt />
                  <FaFilter />
                </div>
              </div>
              <div className="cand-interviews-next-content">
                <div className="cand-interviews-next-info">
                  <div className="cand-interviews-next-date">
                    <FaClock />
                    <span>Today, 2:00 PM</span>
                  </div>
                  <div className="cand-interviews-next-interviewer">
                    <FaUser />
                    <span>Sarah Johnson</span>
                  </div>
                </div>
                <div className="cand-interviews-next-badge">
                  <span className="cand-interviews-next-count">1</span>
                  <span className="cand-interviews-next-label">Upcoming</span>
                </div>
              </div>
            </div>

            {/* Interview List */}
            <div className="cand-interviews-list">
              {activeTab === "upcoming" && upcomingInterviews.map((item, index) => {
                const logo = getCompanyLogo(item.company);
                return (
                  <div 
                    key={item._id || index} 
                    className="cand-interviews-card"
                    onClick={() => setSelectedInterview(item)}
                  >
                    <div className="cand-interviews-card-logo" style={{ backgroundColor: logo.bg }}>
                      {logo.text}
                    </div>
                    <div className="cand-interviews-card-content">
                      <div className="cand-interviews-card-header">
                        <h4>{item.jobTitle}</h4>
                        <span className={`cand-interviews-status ${getStatusClass(item.status)}`}>
                          {getStatusDisplay(item.status)}
                        </span>
                      </div>
                      <p className="cand-interviews-card-company">{item.company}</p>
                      <div className="cand-interviews-card-meta">
                        <span className="cand-interviews-card-type">
                          <FaVideo /> Video Interview
                        </span>
                        <span className="cand-interviews-card-round">
                          {index === 0 ? 'Technical Round' : index === 1 ? 'HR Round' : 'Video Interview'}
                        </span>
                      </div>
                      <div className="cand-interviews-card-footer">
                        <span className="cand-interviews-card-date">
                          <FaCalendarAlt /> {formatDate(item.date)}
                        </span>
                        <span className="cand-interviews-card-time">
                          <FaClock /> {formatTime(item.date)}
                        </span>
                      </div>
                    </div>
                    <div className="cand-interviews-card-arrow">
                      <FaChevronRight />
                    </div>
                  </div>
                );
              })}

              {activeTab === "completed" && completedInterviews.map((item, index) => {
                const logo = getCompanyLogo(item.company);
                return (
                  <div 
                    key={item._id || index} 
                    className="cand-interviews-card completed"
                    onClick={() => setSelectedInterview(item)}
                  >
                    <div className="cand-interviews-card-logo" style={{ backgroundColor: logo.bg }}>
                      {logo.text}
                    </div>
                    <div className="cand-interviews-card-content">
                      <div className="cand-interviews-card-header">
                        <h4>{item.jobTitle}</h4>
                        <span className={`cand-interviews-status ${getStatusClass(item.status)}`}>
                          {getStatusDisplay(item.status)}
                        </span>
                      </div>
                      <p className="cand-interviews-card-company">{item.company}</p>
                      <div className="cand-interviews-card-meta">
                        <span className="cand-interviews-card-type">
                          <FaVideo /> Video Interview
                        </span>
                        <span className="cand-interviews-card-round">
                          Technical Round
                        </span>
                      </div>
                      <div className="cand-interviews-card-footer">
                        <span className="cand-interviews-card-date">
                          <FaCalendarAlt /> {formatDate(item.date)}
                        </span>
                        <span className="cand-interviews-card-time">
                          <FaClock /> {formatTime(item.date)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {activeTab === "cancelled" && cancelledInterviews.map((item, index) => {
                const logo = getCompanyLogo(item.company);
                return (
                  <div 
                    key={item._id || index} 
                    className="cand-interviews-card cancelled"
                    onClick={() => setSelectedInterview(item)}
                  >
                    <div className="cand-interviews-card-logo" style={{ backgroundColor: logo.bg }}>
                      {logo.text}
                    </div>
                    <div className="cand-interviews-card-content">
                      <div className="cand-interviews-card-header">
                        <h4>{item.jobTitle}</h4>
                        <span className={`cand-interviews-status ${getStatusClass(item.status)}`}>
                          {getStatusDisplay(item.status)}
                        </span>
                      </div>
                      <p className="cand-interviews-card-company">{item.company}</p>
                      <div className="cand-interviews-card-meta">
                        <span className="cand-interviews-card-type">
                          <FaVideo /> Video Interview
                        </span>
                        <span className="cand-interviews-card-round">
                          Technical Round
                        </span>
                      </div>
                      <div className="cand-interviews-card-footer">
                        <span className="cand-interviews-card-date">
                          <FaCalendarAlt /> {formatDate(item.date)}
                        </span>
                        <span className="cand-interviews-card-time">
                          <FaClock /> {formatTime(item.date)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {activeTab === "upcoming" && upcomingInterviews.length === 0 && (
                <div className="cand-interviews-empty">
                  <FaCalendarAlt className="empty-icon" />
                  <h3>No upcoming interviews</h3>
                  <p>You don't have any scheduled interviews at the moment.</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="cand-interviews-right">
            {/* Stats Card - Applications */}
            <div className="cand-interviews-stats-card">
              <div className="cand-interviews-stats-item">
                <div className="cand-interviews-stats-icon blue">
                  <FaVideo />
                </div>
                <div>
                  <span className="cand-interviews-stats-number">{upcomingInterviews.length}</span>
                  <span className="cand-interviews-stats-label">Upcoming</span>
                  <span className="cand-interviews-stats-sub">
                    Next: {nextInterview ? formatTime(nextInterview.date) : 'No upcoming'}
                  </span>
                </div>
              </div>
              <div className="cand-interviews-stats-item">
                <div className="cand-interviews-stats-icon green">
                  <FaCheckCircle />
                </div>
                <div>
                  <span className="cand-interviews-stats-number">{completedInterviews.length}</span>
                  <span className="cand-interviews-stats-label">Completed</span>
                  <span className="cand-interviews-stats-sub">Keep it up!</span>
                </div>
              </div>
              <div className="cand-interviews-stats-item">
                <div className="cand-interviews-stats-icon orange">
                  <FaClock />
                </div>
                <div>
                  <span className="cand-interviews-stats-number">{cancelledInterviews.length}</span>
                  <span className="cand-interviews-stats-label">Rescheduled</span>
                  <span className="cand-interviews-stats-sub">View details</span>
                </div>
              </div>
            </div>

            {/* Activity Links */}
            <div className="cand-interviews-activity-card">
              <div className="cand-interviews-activity-item">
                <FaFileAlt />
                <span>Resume</span>
              </div>
              <div className="cand-interviews-activity-item">
                <FaUserCircle />
                <span>Profile</span>
              </div>
            </div>

            {/* Messages Card */}
            <div className="cand-interviews-messages-card">
              <h4>Messages</h4>
              {myInterviews.slice(0, 3).map((item, index) => {
                const logo = getCompanyLogo(item.company);
                const rounds = ['Technical Round', 'HR Round', 'Video Interview'];
                return (
                  <div key={index} className="cand-interviews-message-item">
                    <div className="cand-interviews-message-logo" style={{ backgroundColor: logo.bg }}>
                      {logo.text}
                    </div>
                    <div className="cand-interviews-message-content">
                      <h5>{item.jobTitle}</h5>
                      <p>{item.company}</p>
                      <span className="cand-interviews-message-type">
                        <FaVideo /> Video Interview
                      </span>
                      <span className="cand-interviews-message-round">
                        {rounds[index % rounds.length]}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Premium Card */}
            <div className="cand-interviews-premium-card">
              <h4>Upgraded to Premium</h4>
              <p>Unlock mock interviews, resume review and more.</p>
              <button className="cand-interviews-premium-btn">Upgrade Now</button>
            </div>

            {/* Interview Preparation */}
            <div className="cand-interviews-prep-card">
              <h4>Interview Preparation</h4>
              <div className="cand-interviews-prep-item">
                <div className="cand-interviews-prep-icon">
                  <FaRobot />
                </div>
                <div>
                  <h5>Mock Interview</h5>
                  <p>Practice with AI and improve your confidence.</p>
                </div>
              </div>
              <div className="cand-interviews-prep-item">
                <div className="cand-interviews-prep-icon">
                  <FaBrain />
                </div>
                <div>
                  <h5>Common Questions</h5>
                  <p>View role-specific frequently asked questions.</p>
                </div>
              </div>
              <div className="cand-interviews-prep-item">
                <div className="cand-interviews-prep-icon">
                  <FaLightbulb />
                </div>
                <div>
                  <h5>Interview Tips</h5>
                  <p>Tips and best practices to ace your interview.</p>
                </div>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="cand-interviews-tips-card">
              <FaInfoCircle className="cand-interviews-tips-icon" />
              <p>Test your internet connection, camera and mic before the interview.</p>
            </div>
          </div>
        </div>

        {/* Interview Details Modal */}
        {selectedInterview && (
          <div className="cand-interviews-modal-overlay" onClick={() => setSelectedInterview(null)}>
            <div className="cand-interviews-modal" onClick={(e) => e.stopPropagation()}>
              <button className="cand-interviews-modal-close" onClick={() => setSelectedInterview(null)}>
                ×
              </button>
              <div className="cand-interviews-modal-content">
                <div className="cand-interviews-modal-header">
                  <div className="cand-interviews-modal-logo" style={{ 
                    backgroundColor: getCompanyLogo(selectedInterview.company).bg 
                  }}>
                    {getCompanyLogo(selectedInterview.company).text}
                  </div>
                  <div className="cand-interviews-modal-title">
                    <h2>{selectedInterview.jobTitle}</h2>
                    <p>{selectedInterview.company}</p>
                  </div>
                  <div className="cand-interviews-modal-status">
                    <span className={`cand-interviews-status ${getStatusClass(selectedInterview.status)}`}>
                      {getStatusDisplay(selectedInterview.status)}
                    </span>
                  </div>
                </div>

                <div className="cand-interviews-modal-body">
                  <div className="cand-interviews-modal-info-grid">
                    <div className="cand-interviews-modal-info">
                      <label>Date</label>
                      <span>{formatDate(selectedInterview.date)}</span>
                    </div>
                    <div className="cand-interviews-modal-info">
                      <label>Time</label>
                      <span>{formatTime(selectedInterview.date)}</span>
                    </div>
                    <div className="cand-interviews-modal-info">
                      <label>Type</label>
                      <span>{selectedInterview.type || 'Video Interview'}</span>
                    </div>
                    <div className="cand-interviews-modal-info">
                      <label>Interviewers</label>
                      <span>{selectedInterview.interviewers || 'TBD'}</span>
                    </div>
                  </div>

                  {selectedInterview.description && (
                    <div className="cand-interviews-modal-section">
                      <h4>Description</h4>
                      <p>{selectedInterview.description}</p>
                    </div>
                  )}
                </div>

                <div className="cand-interviews-modal-footer">
                  <button 
                    className="cand-interviews-modal-btn primary"
                    onClick={() => {
                      if (selectedInterview.type === "Video Interview") {
                        navigate("/candidate/video-interview");
                      } else if (selectedInterview.type === "Online Assessment") {
                        navigate("/candidate/online-assessment");
                      }
                    }}
                  >
                    <FaPlay /> Join Interview
                  </button>
                  <button 
                    className="cand-interviews-modal-btn secondary"
                    onClick={() => setSelectedInterview(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default CandidateInterviews;