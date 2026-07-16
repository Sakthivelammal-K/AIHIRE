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
  FaCheckCircle,
  FaTimesCircle,
  FaBuilding,
  FaFileAlt,
  FaUserCircle,
  FaEnvelope,
  FaDownload,
  FaEllipsisV,
  FaRegCalendarAlt,
  FaHeadphones,
  FaCode,
  FaComments,
  FaClipboardList,
  FaCrown,
  FaExternalLinkAlt,
  FaLongArrowAltRight
} from "react-icons/fa";

function CandidateInterviews() {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState([]);
  const [results, setResults] = useState([]);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [personalNotes, setPersonalNotes] = useState("");

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

  const nextInterview = upcomingInterviews.length > 0 ? upcomingInterviews[0] : null;

  // ==========================================
  // INTERVIEW TYPE HELPER
  // ==========================================
  const getInterviewTypeConfig = (type) => {
    const configs = {
      "Video": { icon: <FaVideo />, label: "Video Interview", color: "#7c3aed", bg: "#ede9fe" },
      "Audio": { icon: <FaHeadphones />, label: "Audio Interview", color: "#8b5cf6", bg: "#ede9fe" },
      "MCQ": { icon: <FaClipboardList />, label: "MCQ Assessment", color: "#f59e0b", bg: "#fef3c7" },
      "Technical": { icon: <FaCode />, label: "Technical Assessment", color: "#10b981", bg: "#d1fae5" },
      "Technical Coding": { icon: <FaCode />, label: "Technical Coding", color: "#10b981", bg: "#d1fae5" },
      "HR": { icon: <FaComments />, label: "HR Interview", color: "#ec4899", bg: "#fce7f3" },
      "Coding": { icon: <FaCode />, label: "Coding Challenge", color: "#10b981", bg: "#d1fae5" },
    };
    if (configs[type]) return configs[type];
    for (const [key, value] of Object.entries(configs)) {
      if (type?.toLowerCase().includes(key.toLowerCase())) return value;
    }
    return configs["Video"];
  };

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

  // --- TIMER LOGIC ---
  const calculateTimeLeft = (dateStr) => {
    const diff = new Date(dateStr) - new Date();
    if (diff <= 0) return null;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    return `${days > 0 ? days + 'd ' : ''}${hours}h ${minutes}m`;
  };

  // --- HELPER FOR FORMATTING DATE DISPLAY IN CARDS ---
  const formatDateCard = (dateStr) => {
    if (!dateStr) return 'Today';
    try {
      const date = new Date(dateStr);
      const today = new Date();
      if (date.toDateString() === today.toDateString()) return 'Today';
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return 'N/A';
    }
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
      <div className="cand-interviews-page-new">
        {/* STATS ROW (4 Cards) */}
        <div className="cand-stats-row-new">
          <div className="cand-stat-card-new">
            <div className="cand-stat-icon purple"><FaRegCalendarAlt /></div>
            <div className="cand-stat-content-new">
              <h2>{upcomingInterviews.length}</h2>
              <p>Upcoming</p>
              <span className="cand-stat-sub">Next: {nextInterview ? formatTime(nextInterview.date) : 'None'}</span>
            </div>
          </div>
          <div className="cand-stat-card-new">
            <div className="cand-stat-icon green"><FaCheckCircle /></div>
            <div className="cand-stat-content-new">
              <h2>{completedInterviews.length}</h2>
              <p>Completed</p>
              <span className="cand-stat-sub">Keep it up!</span>
            </div>
          </div>
          <div className="cand-stat-card-new">
            <div className="cand-stat-icon orange"><FaClock /></div>
            <div className="cand-stat-content-new">
              <h2>{cancelledInterviews.length}</h2>
              <p>Rescheduled</p>
              <span className="cand-stat-sub">View details</span>
            </div>
          </div>
          <div className="cand-stat-card-new">
            <div className="cand-stat-icon grey"><FaTimesCircle /></div>
            <div className="cand-stat-content-new">
              <h2>{cancelledInterviews.length}</h2>
              <p>Cancelled</p>
              <span className="cand-stat-sub">View details</span>
            </div>
          </div>
        </div>

        {/* 2-COLUMN LAYOUT */}
        <div className="cand-layout-new">
          
          {/* MAIN COLUMN (Upcoming & Completed Lists) */}
          <div className="cand-main-col-new">
            
            {/* UPCOMING SECTION */}
            <div className="cand-section-header-new">
              <h3>Upcoming Interviews</h3>
              {upcomingInterviews.length === 0 ? (
                <div className="cand-empty-state-mini">
                  <p>No upcoming interviews scheduled.</p>
                </div>
              ) : (
                <span className="cand-section-count">{upcomingInterviews.length} upcoming</span>
              )}
            </div>

            <div className="cand-list-new">
              {upcomingInterviews.map((item, index) => {
                const logo = getCompanyLogo(item.company);
                const typeConfig = getInterviewTypeConfig(item.type);
                
                return (
                  <div key={item._id || index} className="cand-card-item-new" onClick={() => setSelectedInterview(item)}>
                    <div className="cand-card-logo-new" style={{ backgroundColor: logo.bg }}>
                      {logo.text}
                    </div>
                    <div className="cand-card-details-new">
                      <div className="cand-card-row-top">
                        <h4 className="cand-card-title">{item.jobTitle}</h4>
                        <span className="cand-card-company">{item.company}</span>
                      </div>
                      <div className="cand-card-row-mid">
                        <span className="cand-card-type-badge" style={{ backgroundColor: typeConfig.bg, color: typeConfig.color }}>
                          {typeConfig.icon} {typeConfig.label}
                        </span>
                        <span className="cand-card-round-badge">{item.round || 'Technical Round'}</span>
                      </div>
                      <div className="cand-card-row-bottom">
                        <span className="cand-card-date"><FaRegCalendarAlt /> {formatDateCard(item.date)}</span>
                        <span className="cand-card-time"><FaClock /> {formatTime(item.date)}</span>
                        {item.interviewers && (
                          <span className="cand-card-interviewer"><FaUser /> {item.interviewers}</span>
                        )}
                      </div>
                    </div>
                    <div className="cand-card-actions-new">
                      <button 
                        className="cand-btn-join-new" 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (item.type === "Video" || item.type === "Audio" || item.type === "HR") {
                            navigate("/candidate/video-interview");
                          } else if (item.type === "MCQ" || item.type === "Technical" || item.type === "Coding") {
                            navigate("/candidate/online-assessment");
                          }
                        }}
                      >
                        <FaVideo /> Join Interview
                      </button>
                      <div className="cand-card-more-new">
                        <span className="cand-reschedule-link">Reschedule</span>
                        <FaEllipsisV />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* COMPLETED SECTION */}
            <div className="cand-section-header-new mt-large">
              <h3>Completed Interviews</h3>
              {completedInterviews.length > 0 ? (
                <span className="cand-section-count">{completedInterviews.length} completed</span>
              ) : (
                <div className="cand-empty-state-mini">
                  <p>No completed interviews yet.</p>
                </div>
              )}
            </div>

            <div className="cand-list-new">
              {completedInterviews.map((item, index) => {
                const logo = getCompanyLogo(item.company);
                const typeConfig = getInterviewTypeConfig(item.type);
                
                return (
                  <div key={item._id || index} className="cand-card-item-new completed-card">
                    <div className="cand-card-logo-new" style={{ backgroundColor: logo.bg }}>
                      {logo.text}
                    </div>
                    <div className="cand-card-details-new">
                      <div className="cand-card-row-top">
                        <h4 className="cand-card-title">{item.jobTitle}</h4>
                        <span className="cand-card-company">{item.company}</span>
                      </div>
                      <div className="cand-card-row-mid">
                        <span className="cand-card-type-badge" style={{ backgroundColor: typeConfig.bg, color: typeConfig.color }}>
                          {typeConfig.icon} {typeConfig.label}
                        </span>
                        <span className="cand-card-round-badge">{item.round || 'Technical Round'}</span>
                      </div>
                      <div className="cand-card-row-bottom">
                        <span className="cand-card-date"><FaRegCalendarAlt /> {formatDateCard(item.date)}</span>
                        <span className="cand-card-time"><FaClock /> {formatTime(item.date)}</span>
                        {item.interviewers && (
                          <span className="cand-card-interviewer"><FaUser /> {item.interviewers}</span>
                        )}
                      </div>
                    </div>
                    <div className="cand-card-actions-new end">
                      <span className="cand-status-completed-badge"><FaCheckCircle /> Completed</span>
                      <button className="cand-btn-share-new">Share Feedback</button>
                      <FaEllipsisV />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* SIDEBAR COLUMN */}
          <div className="cand-side-col-new">
            
            {/* NEXT INTERVIEW CARD */}
            <div className="cand-side-widget-new">
              <div className="cand-side-header-new">
                <h4>Next Interview</h4>
                <span className="cand-side-link">View all</span>
              </div>
              {nextInterview ? (
                <div className="cand-side-next-card">
                  <div className="cand-side-next-logo" style={{ backgroundColor: getCompanyLogo(nextInterview.company).bg }}>
                    {getCompanyLogo(nextInterview.company).text}
                  </div>
                  <div className="cand-side-next-info">
                    <h5>{nextInterview.jobTitle}</h5>
                    <span className="cand-side-company">{nextInterview.company}</span>
                    <span className="cand-side-type-badge" style={{ 
                      backgroundColor: getInterviewTypeConfig(nextInterview.type).bg, 
                      color: getInterviewTypeConfig(nextInterview.type).color 
                    }}>
                      {getInterviewTypeConfig(nextInterview.type).label}
                    </span>
                  </div>
                  <div className="cand-side-next-details">
                    <p><FaRegCalendarAlt /> {formatDate(nextInterview.date)}</p>
                    <p><FaClock /> {formatTime(nextInterview.date)}</p>
                    <p><FaUser /> {nextInterview.interviewers || 'TBD'}</p>
                  </div>
                  <button 
                    className="cand-btn-side-join"
                    onClick={() => {
                      if (nextInterview.type === "Video" || nextInterview.type === "Audio" || nextInterview.type === "HR") {
                        navigate("/candidate/video-interview");
                      } else {
                        navigate("/candidate/online-assessment");
                      }
                    }}
                  >
                    <FaVideo /> Join Interview
                  </button>
                  <button className="cand-btn-side-calendar">
                    <FaCalendarAlt /> Add to Calendar
                  </button>
                </div>
              ) : (
                <div className="cand-side-empty">No upcoming interviews</div>
              )}
            </div>

            {/* PREPARATION CARD */}
            <div className="cand-side-widget-new">
              <div className="cand-side-header-new">
                <h4>Interview Preparation</h4>
                <span className="cand-side-link">View all</span>
              </div>
              <div className="cand-prep-item-new">
                <div className="cand-prep-icon purple"><FaRobot /></div>
                <div className="cand-prep-text">
                  <h5>Mock Interview</h5>
                  <p>Practice with AI and improve your confidence.</p>
                </div>
                <FaArrowRight className="cand-prep-arrow" />
              </div>
              <div className="cand-prep-item-new">
                <div className="cand-prep-icon green"><FaBrain /></div>
                <div className="cand-prep-text">
                  <h5>Common Questions</h5>
                  <p>View role-specific frequently asked questions.</p>
                </div>
                <FaArrowRight className="cand-prep-arrow" />
              </div>
              <div className="cand-prep-item-new">
                <div className="cand-prep-icon orange"><FaLightbulb /></div>
                <div className="cand-prep-text">
                  <h5>Interview Tips</h5>
                  <p>Tips and best practices to ace your interview.</p>
                </div>
                <FaArrowRight className="cand-prep-arrow" />
              </div>
            </div>

            {/* QUICK TIPS */}
            <div className="cand-side-widget-new tips-widget">
              <h4>Quick Tips</h4>
              <div className="cand-tip-card">
                <div className="cand-tip-icon"><FaMicrophone /></div>
                <div className="cand-tip-content">
                  <p>Test your internet connection, camera and mic before the interview.</p>
                  <div className="cand-tip-dots">
                    <span className="active"></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            </div>

            {/* PREMIUM WIDGET */}
            <div className="cand-side-widget-new premium-widget">
              <div className="cand-premium-header">
                <FaCrown className="cand-premium-icon" />
                <h4>Upgrade to Premium</h4>
                <p>Unlock mock interviews, resume review and more.</p>
                <button className="cand-premium-btn">Upgrade Now</button>
              </div>
            </div>
          </div>
        </div>

        {/* DETAILS MODAL */}
        {selectedInterview && (
          <div className="cand-modal-overlay-new" onClick={() => setSelectedInterview(null)}>
            <div className="cand-modal-new" onClick={(e) => e.stopPropagation()}>
              <div className="cand-modal-header-new">
                <div className="cand-modal-logo-new" style={{ backgroundColor: getCompanyLogo(selectedInterview.company).bg }}>
                  {getCompanyLogo(selectedInterview.company).text}
                </div>
                <div className="cand-modal-title-new">
                  <h2>{selectedInterview.jobTitle}</h2>
                  <p>{selectedInterview.company}</p>
                </div>
                <span className={`cand-modal-status-new ${getStatusClass(selectedInterview.status)}`}>
                  {getStatusDisplay(selectedInterview.status)}
                </span>
                <button className="cand-modal-close-new" onClick={() => setSelectedInterview(null)}>×</button>
              </div>
              <div className="cand-modal-body-new">
                <div className="cand-modal-grid-new">
                  <div className="cand-modal-info-item"><label>Date</label><span>{formatDate(selectedInterview.date)}</span></div>
                  <div className="cand-modal-info-item"><label>Time</label><span>{formatTime(selectedInterview.date)}</span></div>
                  <div className="cand-modal-info-item"><label>Type</label><span className="cand-modal-type-badge" style={{ backgroundColor: getInterviewTypeConfig(selectedInterview.type).bg, color: getInterviewTypeConfig(selectedInterview.type).color }}>{getInterviewTypeConfig(selectedInterview.type).icon} {getInterviewTypeConfig(selectedInterview.type).label}</span></div>
                  <div className="cand-modal-info-item"><label>Interviewers</label><span>{selectedInterview.interviewers || 'TBD'}</span></div>
                  <div className="cand-modal-info-item full"><label>Meeting Link</label><span>{selectedInterview.meetingLink ? <a href={selectedInterview.meetingLink} target="_blank" rel="noopener noreferrer">{selectedInterview.meetingLink}</a> : 'Not provided'}</span></div>
                </div>
                {selectedInterview.description && (
                  <div className="cand-modal-desc-new">
                    <h4>Description</h4>
                    <p>{selectedInterview.description}</p>
                  </div>
                )}
                <div className="cand-modal-actions-new">
                  <button className="cand-modal-btn-primary" onClick={() => {
                    if (selectedInterview.type === "Video" || selectedInterview.type === "Audio" || selectedInterview.type === "HR") {
                      navigate("/candidate/video-interview");
                    } else {
                      navigate("/candidate/online-assessment");
                    }
                  }}>
                    <FaPlay /> Join Interview
                  </button>
                  <button className="cand-modal-btn-secondary" onClick={() => setSelectedInterview(null)}>Close</button>
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