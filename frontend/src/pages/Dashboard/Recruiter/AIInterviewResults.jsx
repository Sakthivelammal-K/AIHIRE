import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../api/api";

import {
  FaRobot,
  FaVideo,
  FaCheckCircle,
  FaTimesCircle,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaLinkedin,
  FaExternalLinkAlt,
  FaPlay,
  FaShare,
  FaStar,
  FaChartLine,
  FaLightbulb,
  FaExclamationTriangle,
  FaArrowRight,
  FaCalendar,
  FaClock,
  FaSpinner,
  FaThumbsUp,
  FaThumbsDown,
  FaUserTie,
  FaBriefcase,
  FaArrowLeft,
  FaEdit,
  FaDownload,
  FaSearch,
  FaFilter,
  FaSortAmountDown,
  FaUsers,
  FaMicrophone,
  FaCode,
  FaGraduationCap,
  FaTools,
  FaTasks,
  FaCheck,
  FaTimes,
  FaInfoCircle,
  FaTrash,
  FaEllipsisV,
  FaRedo,
  FaUndo,
  FaFileAlt,
  FaCrown
} from "react-icons/fa";

function AIInterviewResults() {
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedResult, setSelectedResult] = useState(null);
  const [assessment, setAssessment] = useState(null);
  const [reviewType, setReviewType] = useState("");
  const [recruiterComment, setRecruiterComment] = useState("");
  const [recruiterRating, setRecruiterRating] = useState(0);
  const [finalDecision, setFinalDecision] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [candidateDetails, setCandidateDetails] = useState(null);

  // Search, Filter & Sort states
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterDecision, setFilterDecision] = useState("all");
  const [filterDate, setFilterDate] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    setLoading(true);
    setError(null);
    try {
      const [videoRes, assessmentRes] = await Promise.all([
        API.get("/video-interviews/completed").catch(() => ({ data: [] })),
        API.get("/assessments/results").catch(() => ({ data: [] }))
      ]);

      const videos = (videoRes.data || []).map(item => ({
        ...item,
        resultType: "video",
        applicationId: item.applicationId
      }));

      const assessments = (assessmentRes.data || []).map(item => ({
        ...item,
        resultType: "assessment"
      }));

      setResults([...videos, ...assessments]);
    } catch (error) {
      console.log(error);
      setError("Failed to load results. Please try again.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const loadCandidateDetails = async (applicationId) => {
    if (!applicationId) return;
    try {
      const response = await API.get(`/candidate/applications/${applicationId}`).catch(() => ({ data: null }));
      if (response.data) {
        setCandidateDetails(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const saveReview = async () => {
    if (!reviewType) {
      alert("Please select a review type");
      return;
    }
    
    if (!finalDecision) {
      alert("Please select a final decision");
      return;
    }

    try {
      const payload = {
        recruiterComment: recruiterComment || "",
        recruiterRating: recruiterRating || 0,
        finalDecision: finalDecision
      };

      const selected = reviewType === "video" ? selectedResult : assessment;
      
      if (reviewType === "video" && selectedResult?._id) {
        await API.put(`/video-interviews/${selectedResult._id}/review`, payload).catch(() => {});
      } else if (reviewType === "assessment" && assessment?._id) {
        await API.put(`/assessments/${assessment._id}/review`, payload).catch(() => {});
      }

      if (selected?.applicationId && finalDecision) {
        let status = "";
        if (finalDecision === "Selected") status = "Selected";
        else if (finalDecision === "Rejected") status = "Rejected";
        else if (finalDecision === "Hold") status = "Hold";
        else if (finalDecision === "Next Round") status = "Next Round";
        if (status) {
          await API.put(`/candidate/applications/${selected.applicationId}`, { status }).catch(() => {});
        }
      }

      alert("Review Saved Successfully!");
      setSelectedResult(null);
      setAssessment(null);
      setReviewType("");
      setRecruiterComment("");
      setRecruiterRating(0);
      setFinalDecision("");
      loadResults();
    } catch (error) {
      console.log(error);
      alert("Failed to save review. Please try again.");
    }
  };

  const handleViewDetails = async (item) => {
    if (item.resultType === "video") {
      setSelectedResult(item);
      setReviewType("video");
      setAssessment(null);
    } else {
      setAssessment(item);
      setReviewType("assessment");
      setSelectedResult(null);
    }
    setRecruiterComment("");
    setRecruiterRating(0);
    setFinalDecision("");
    setActiveTab("overview");
    if (item.applicationId) {
      await loadCandidateDetails(item.applicationId);
    }
  };

  const handleBack = () => {
    setSelectedResult(null);
    setAssessment(null);
    setReviewType("");
    setCandidateDetails(null);
    setActiveTab("overview");
  };

  // ----- STATS COMPUTATION -----
  const total = results.length;
  const completed = results.filter(r => r.status === "Completed" || r.finalDecision).length;
  const pendingReview = results.filter(r => !r.finalDecision || r.finalDecision === "Pending").length;
  const hired = results.filter(r => r.finalDecision === "Selected").length;
  const rejected = results.filter(r => r.finalDecision === "Rejected").length;
  const avgScore = total > 0 
    ? Math.round(results.reduce((sum, r) => sum + (r.resultType === "video" ? (r.overall || 0) : (r.score || 0)), 0) / total) 
    : 0;

  // ----- FILTERING, SEARCH & SORTING LOGIC -----
  const filteredResults = results.filter(item => {
    const searchLower = searchTerm.toLowerCase();
    const name = (item.candidateName || "").toLowerCase();
    const job = (item.jobTitle || "").toLowerCase();
    const typeLabel = item.resultType === "video" ? "Video Interview" : 
                     item.resultType === "audio" ? "Audio Interview" :
                     item.resultType === "mcq" ? "MCQ Assessment" :
                     item.resultType === "technical" ? "Technical Interview" :
                     item.resultType === "hr" ? "HR Interview" :
                     item.resultType === "coding" ? "Coding Challenge" :
                     "Assessment";

    const matchesSearch = name.includes(searchLower) || job.includes(searchLower) || typeLabel.toLowerCase().includes(searchLower);
    const matchesType = filterType === "all" || typeLabel === filterType;
    const matchesDecision = filterDecision === "all" || (item.finalDecision || "Pending Review") === filterDecision;
    const matchesStatus = filterStatus === "all" || (item.status || "Completed") === filterStatus;
    
    let matchesDate = true;
    const dateObj = new Date(item.createdAt || item.date || Date.now());
    const now = new Date();
    if (filterDate === "today") {
      matchesDate = dateObj.toDateString() === now.toDateString();
    } else if (filterDate === "week") {
      const weekAgo = new Date(); weekAgo.setDate(now.getDate() - 7);
      matchesDate = dateObj >= weekAgo;
    } else if (filterDate === "month") {
      const monthAgo = new Date(); monthAgo.setMonth(now.getMonth() - 1);
      matchesDate = dateObj >= monthAgo;
    }

    return matchesSearch && matchesType && matchesDecision && matchesStatus && matchesDate;
  });

  const sortedResults = [...filteredResults].sort((a, b) => {
    const scoreA = a.resultType === "video" ? (a.overall || 0) : (a.score || 0);
    const scoreB = b.resultType === "video" ? (b.overall || 0) : (b.score || 0);
    const nameA = (a.candidateName || "").toLowerCase();
    const nameB = (b.candidateName || "").toLowerCase();
    const dateA = new Date(a.createdAt || a.date || 0);
    const dateB = new Date(b.createdAt || b.date || 0);

    switch(sortBy) {
      case "score-desc": return scoreB - scoreA;
      case "score-asc": return scoreA - scoreB;
      case "name-asc": return nameA.localeCompare(nameB);
      case "name-desc": return nameB.localeCompare(nameA);
      case "date-asc": return dateA - dateB;
      case "date-desc":
      default: return dateB - dateA;
    }
  });

  const resetFilters = () => {
    setSearchTerm("");
    setFilterType("all");
    setFilterDecision("all");
    setFilterDate("all");
    setFilterStatus("all");
    setSortBy("date-desc");
  };

  const currentItem = selectedResult || assessment;
  const candidate = candidateDetails || {
    candidateName: currentItem?.candidateName || "Unknown Candidate",
    jobTitle: currentItem?.jobTitle || "N/A",
    email: currentItem?.email || "",
    phone: currentItem?.phone || "",
    location: currentItem?.location || "",
    experience: currentItem?.experience || "N/A",
    skills: currentItem?.skills || []
  };

  // ----- HELPER FUNCTIONS FOR UI (Orange Color Schema) -----
  const getScoreBadge = (score) => {
    let label = "Needs Improvement";
    let cls = "red";
    if (score >= 90) { label = "Excellent"; cls = "green"; }
    else if (score >= 75) { label = "Good"; cls = "orange"; } // Changed Blue to Orange
    else if (score >= 60) { label = "Average"; cls = "yellow"; }
    return { label, cls };
  };

  const getInterviewTypeLabel = (item) => {
    if (item.resultType === "video") return "Video Interview";
    if (item.resultType === "audio") return "Audio Interview";
    if (item.resultType === "mcq") return "MCQ Assessment";
    if (item.resultType === "technical") return "Technical Interview";
    if (item.resultType === "hr") return "HR Interview";
    if (item.resultType === "coding") return "Coding Challenge";
    return "Assessment";
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="ai-results-loading">
          <FaSpinner className="spin" />
          <p>Loading interview results...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="ai-results-error">
          <p>{error}</p>
          <button onClick={loadResults} className="retry-btn">Retry</button>
        </div>
      </DashboardLayout>
    );
  }

  // ==========================================
  // DETAIL VIEW MODAL
  // ==========================================
  if (currentItem) {
    const overall = currentItem.resultType === "video" ? currentItem.overall : currentItem.score || 0;
    const technical = currentItem.technical || 0;
    const communication = currentItem.communication || 0;
    const problemSolving = currentItem.problemSolving || 0;
    const confidence = currentItem.confidence || 0;
    const behavioral = currentItem.behavioral || 0;
    const coding = currentItem.coding || 0;
    const strengths = currentItem.strengths || [];
    const improvements = currentItem.improvements || [];

    const getScoreColor = (sc) => {
      if (sc >= 80) return '#10B981'; // Green
      if (sc >= 60) return '#F59E0B'; // Yellow
      if (sc >= 40) return '#F97316'; // Orange
      return '#EF4444'; // Red
    };

    return (
      <DashboardLayout>
        <div className="ai-results-detail-page">
          <button className="back-btn" onClick={handleBack}>
            <FaArrowLeft /> Back to Results
          </button>

          <div className="ai-detail-header">
            <div className="ai-detail-profile">
              <div className="ai-detail-avatar" style={{ background: '#fdf2e9', color: '#e67e22' }}>
                {candidate.candidateName?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="ai-detail-info">
                <h1>{candidate.candidateName || "Unknown"}</h1>
                <p className="ai-detail-title">{candidate.jobTitle || "N/A"}</p>
                <div className="ai-detail-meta">
                  <span><FaEnvelope /> {candidate.email}</span>
                  <span><FaPhone /> {candidate.phone}</span>
                  <span><FaMapMarkerAlt /> {candidate.location}</span>
                </div>
              </div>
            </div>
            <div className="ai-detail-status">
              <span className={`ai-modal-status ${currentItem.finalDecision || 'pending'}`}>
                {currentItem.finalDecision || "Pending Review"}
              </span>
            </div>
          </div>

          <div className="ai-detail-tabs">
            {['overview', 'evaluation', 'feedback', 'timeline'].map(tab => (
              <button 
                key={tab}
                className={`ai-tab ${activeTab === tab ? 'active' : ''}`} 
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="ai-detail-content">
            {/* --- OVERVIEW TAB --- */}
            {activeTab === 'overview' && (
              <div className="ai-detail-grid">
                <div className="ai-detail-left">
                  <div className="ai-section-card">
                    <h3 style={{ color: '#e67e22' }}><FaUser /> Candidate Information</h3>
                    <div className="ai-info-list">
                      <div className="ai-info-item"><span>Name</span> <strong>{candidate.candidateName}</strong></div>
                      <div className="ai-info-item"><span>Email</span> {candidate.email}</div>
                      <div className="ai-info-item"><span>Applied Job</span> {candidate.jobTitle}</div>
                      <div className="ai-info-item"><span>Experience</span> {candidate.experience}</div>
                      <div className="ai-info-item"><span>Resume Score</span> <span className="ai-resume-score" style={{ color: '#e67e22' }}>{candidate.atsScore || 0}%</span></div>
                      <div className="ai-info-item skills">
                        <span>Skills</span>
                        <div className="ai-skill-tags">
                          {(Array.isArray(candidate.skills) && candidate.skills.length > 0) 
                            ? candidate.skills.map((s, i) => <span key={i} className="ai-skill-tag">{s}</span>)
                            : 'N/A'
                          }
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="ai-section-card">
                    <h3 style={{ color: '#e67e22' }}><FaCalendar /> Interview Summary</h3>
                    <div className="ai-info-list grid-2">
                      <div className="ai-info-item"><span>Type</span> {getInterviewTypeLabel(currentItem)}</div>
                      <div className="ai-info-item"><span>Date</span> {new Date(currentItem.createdAt || Date.now()).toLocaleDateString()}</div>
                      <div className="ai-info-item"><span>Time</span> {new Date(currentItem.createdAt || Date.now()).toLocaleTimeString()}</div>
                      <div className="ai-info-item"><span>Duration</span> {currentItem.duration || "N/A"}</div>
                      <div className="ai-info-item"><span>Interviewers</span> {Array.isArray(currentItem.interviewers) ? currentItem.interviewers.join(', ') : "N/A"}</div>
                      <div className="ai-info-item"><span>Mode</span> {currentItem.mode || "Virtual"}</div>
                      <div className="ai-info-item full"><span>Status</span> <span className={`ai-status-badge ${currentItem.status?.toLowerCase() || 'pending'}`}>{currentItem.status || "Pending"}</span></div>
                    </div>
                  </div>
                </div>

                <div className="ai-detail-right">
                  <div className="ai-section-card score-card">
                    <h3 style={{ color: '#e67e22' }}><FaChartLine /> Evaluation</h3>
                    <div className="ai-score-circle-container">
                      <div className={`ai-score-circle ${getScoreBadge(overall).cls}`}>
                        <span>{overall}%</span>
                      </div>
                      <div className="ai-score-breakdown">
                        <div className="ai-score-row"><span>Technical</span> <div className="ai-score-bar"><div className="ai-score-fill orange" style={{width: `${technical}%`}}></div></div> <span>{technical}%</span></div>
                        <div className="ai-score-row"><span>Communication</span> <div className="ai-score-bar"><div className="ai-score-fill orange" style={{width: `${communication}%`}}></div></div> <span>{communication}%</span></div>
                        <div className="ai-score-row"><span>Problem Solving</span> <div className="ai-score-bar"><div className="ai-score-fill orange" style={{width: `${problemSolving}%`}}></div></div> <span>{problemSolving}%</span></div>
                        <div className="ai-score-row"><span>Confidence</span> <div className="ai-score-bar"><div className="ai-score-fill orange" style={{width: `${confidence}%`}}></div></div> <span>{confidence}%</span></div>
                      </div>
                    </div>
                  </div>

                  <div className="ai-section-card">
                    <h3 style={{ color: '#e67e22' }}><FaEdit /> Recruiter Notes</h3>
                    <div className="ai-notes-area">
                      <div className="ai-note-group">
                        <label>Feedback</label>
                        <textarea 
                          value={recruiterComment} 
                          onChange={(e) => setRecruiterComment(e.target.value)}
                          placeholder="Add your feedback about the candidate..."
                        />
                      </div>
                      <div className="ai-note-group">
                        <label>Final Decision</label>
                        <select value={finalDecision} onChange={(e) => setFinalDecision(e.target.value)}>
                          <option value="">Select Decision</option>
                          <option value="Selected">Selected</option>
                          <option value="Rejected">Rejected</option>
                          <option value="Hold">Hold</option>
                          <option value="Next Round">Next Round</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* --- EVALUATION TAB --- */}
            {activeTab === 'evaluation' && (
              <div className="ai-section-card">
                <h3 style={{ color: '#e67e22' }}><FaStar /> Detailed Evaluation</h3>
                <div className="ai-detailed-eval">
                  <div className="ai-eval-item"><span>Overall</span> <div className="ai-eval-bar"><div className="ai-eval-fill orange" style={{width: `${overall}%`}}></div></div> <span className="ai-eval-score">{overall}%</span></div>
                  <div className="ai-eval-item"><span>Technical Skills</span> <div className="ai-eval-bar"><div className="ai-eval-fill orange" style={{width: `${technical}%`}}></div></div> <span className="ai-eval-score">{technical}%</span></div>
                  <div className="ai-eval-item"><span>Communication</span> <div className="ai-eval-bar"><div className="ai-eval-fill orange" style={{width: `${communication}%`}}></div></div> <span className="ai-eval-score">{communication}%</span></div>
                  <div className="ai-eval-item"><span>Problem Solving</span> <div className="ai-eval-bar"><div className="ai-eval-fill orange" style={{width: `${problemSolving}%`}}></div></div> <span className="ai-eval-score">{problemSolving}%</span></div>
                  <div className="ai-eval-item"><span>Confidence</span> <div className="ai-eval-bar"><div className="ai-eval-fill orange" style={{width: `${confidence}%`}}></div></div> <span className="ai-eval-score">{confidence}%</span></div>
                  <div className="ai-eval-item"><span>Behavioral</span> <div className="ai-eval-bar"><div className="ai-eval-fill orange" style={{width: `${behavioral}%`}}></div></div> <span className="ai-eval-score">{behavioral}%</span></div>
                  <div className="ai-eval-item"><span>Coding Assessment</span> <div className="ai-eval-bar"><div className="ai-eval-fill orange" style={{width: `${coding}%`}}></div></div> <span className="ai-eval-score">{coding}%</span></div>
                </div>
              </div>
            )}

            {/* --- FEEDBACK TAB --- */}
            {activeTab === 'feedback' && (
              <div className="ai-section-card feedback-card">
                <h3 style={{ color: '#e67e22' }}><FaEdit /> Recruiter Feedback</h3>
                <div className="ai-feedback-form">
                  <div className="ai-feedback-group">
                    <label>Strengths</label>
                    <textarea rows="2" placeholder="List the candidate's strengths..." />
                  </div>
                  <div className="ai-feedback-group">
                    <label>Weaknesses</label>
                    <textarea rows="2" placeholder="List areas for improvement..." />
                  </div>
                  <div className="ai-feedback-group">
                    <label>Recruiter Feedback</label>
                    <textarea rows="3" placeholder="Add your detailed feedback..." value={recruiterComment} onChange={(e) => setRecruiterComment(e.target.value)} />
                  </div>
                  <div className="ai-feedback-group">
                    <label>Hiring Recommendation</label>
                    <select value={finalDecision} onChange={(e) => setFinalDecision(e.target.value)}>
                      <option value="">Select Decision</option>
                      <option value="Selected">✅ Approve & Select</option>
                      <option value="Next Round">🔄 Move to Next Round</option>
                      <option value="Hold">⏳ Hold</option>
                      <option value="Rejected">❌ Reject</option>
                    </select>
                  </div>
                  <div className="ai-feedback-actions">
                    <button className="ai-feedback-cancel" onClick={handleBack}>Cancel</button>
                    <button className="ai-feedback-save" onClick={saveReview}><FaCheckCircle /> Save Review</button>
                  </div>
                </div>
              </div>
            )}

            {/* --- TIMELINE TAB --- */}
            {activeTab === 'timeline' && (
              <div className="ai-section-card">
                <h3 style={{ color: '#e67e22' }}><FaClock /> Recruitment Timeline</h3>
                <div className="ai-timeline">
                  <div className="ai-timeline-step completed"><div className="ai-timeline-dot"></div><div className="ai-timeline-content"><span>Interview Scheduled</span><span className="ai-timeline-date">{new Date(currentItem.createdAt || Date.now()).toLocaleDateString()}</span></div></div>
                  <div className="ai-timeline-step completed"><div className="ai-timeline-dot"></div><div className="ai-timeline-content"><span>Candidate Joined</span><span className="ai-timeline-date">{new Date(currentItem.createdAt || Date.now()).toLocaleDateString()}</span></div></div>
                  <div className="ai-timeline-step completed"><div className="ai-timeline-dot"></div><div className="ai-timeline-content"><span>Interview Completed</span><span className="ai-timeline-date">{new Date(currentItem.createdAt || Date.now()).toLocaleDateString()}</span></div></div>
                  <div className={`ai-timeline-step ${finalDecision ? 'completed' : 'pending'}`}><div className="ai-timeline-dot"></div><div className="ai-timeline-content"><span>Recruiter Reviewed</span><span className="ai-timeline-date">{finalDecision ? 'Today' : 'Pending'}</span></div></div>
                  <div className={`ai-timeline-step ${finalDecision ? (finalDecision === 'Selected' ? 'completed' : 'rejected') : 'pending'}`}><div className="ai-timeline-dot"></div><div className="ai-timeline-content"><span>{finalDecision || 'Final Decision Pending'}</span><span className="ai-timeline-date">{finalDecision || 'Awaiting Review'}</span></div></div>
                </div>
              </div>
            )}
          </div>

          <div className="ai-modal-actions">
            <div className="ai-modal-actions-left">
              <button className="ai-action-btn" onClick={() => alert("Download Report triggered!")}><FaDownload /> Download Report</button>
            </div>
            <div className="ai-modal-actions-right">
              <button className="ai-action-btn reject" onClick={() => { setFinalDecision("Rejected"); saveReview(); }}><FaTimes /> Reject</button>
              <button className="ai-action-btn hold" onClick={() => { setFinalDecision("Hold"); saveReview(); }}><FaClock /> Hold</button>
              <button className="ai-action-btn next" onClick={() => { setFinalDecision("Next Round"); saveReview(); }}><FaArrowRight /> Next Round</button>
              <button className="ai-action-btn approve" onClick={() => { setFinalDecision("Selected"); saveReview(); }}><FaCheck /> Select</button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // ==========================================
  // MAIN LIST VIEW
  // ==========================================
  return (
    <DashboardLayout>
      <div className="ai-results-page">
        
        {/* --- DASHBOARD STATISTICS (6 Equal Width Cards) --- */}
        <div className="ai-stats-grid">
          <div className="ai-stat-card"><div className="ai-stat-icon" style={{ background: '#fdf2e9', color: '#e67e22' }}><FaUsers /></div><div className="ai-stat-content"><div className="ai-stat-value">{total}</div><div className="ai-stat-label">Total Interviews</div></div></div>
          <div className="ai-stat-card"><div className="ai-stat-icon green"><FaCheckCircle /></div><div className="ai-stat-content"><div className="ai-stat-value">{completed}</div><div className="ai-stat-label">Completed</div></div></div>
          <div className="ai-stat-card"><div className="ai-stat-icon yellow"><FaClock /></div><div className="ai-stat-content"><div className="ai-stat-value">{pendingReview}</div><div className="ai-stat-label">Pending Review</div></div></div>
          <div className="ai-stat-card"><div className="ai-stat-icon orange"><FaThumbsUp /></div><div className="ai-stat-content"><div className="ai-stat-value">{hired}</div><div className="ai-stat-label">Selected</div></div></div>
          <div className="ai-stat-card"><div className="ai-stat-icon red"><FaThumbsDown /></div><div className="ai-stat-content"><div className="ai-stat-value">{rejected}</div><div className="ai-stat-label">Rejected</div></div></div>
          <div className="ai-stat-card"><div className="ai-stat-icon purple"><FaChartLine /></div><div className="ai-stat-content"><div className="ai-stat-value">{avgScore}%</div><div className="ai-stat-label">Avg Score</div></div></div>
        </div>

        {/* --- ANALYTICS SECTION (Selection vs Rejection) --- */}
        <div className="ai-charts-row">
          <div className="ai-chart-card">
            <h4 style={{ color: '#e67e22' }}><FaChartLine /> Selection vs Rejection</h4>
            <div className="ai-bar-chart">
              <div className="ai-bar-row"><span>Selected</span><div className="ai-bar-track"><div className="ai-bar-fill green" style={{ width: `${total > 0 ? (hired/total)*100 : 0}%` }}></div></div><span>{hired} ({total > 0 ? Math.round((hired/total)*100) : 0}%)</span></div>
              <div className="ai-bar-row"><span>Rejected</span><div className="ai-bar-track"><div className="ai-bar-fill red" style={{ width: `${total > 0 ? (rejected/total)*100 : 0}%` }}></div></div><span>{rejected} ({total > 0 ? Math.round((rejected/total)*100) : 0}%)</span></div>
              <div className="ai-bar-row"><span>Pending</span><div className="ai-bar-track"><div className="ai-bar-fill yellow" style={{ width: `${total > 0 ? (pendingReview/total)*100 : 0}%` }}></div></div><span>{pendingReview} ({total > 0 ? Math.round((pendingReview/total)*100) : 0}%)</span></div>
            </div>
          </div>

          {/* --- ANALYTICS SECTION (Interview Type Distribution) --- */}
          <div className="ai-chart-card">
            <h4 style={{ color: '#e67e22' }}><FaVideo /> Interview Type Distribution</h4>
            <div className="ai-bar-chart">
              {['video', 'audio', 'technical', 'hr', 'mcq', 'coding'].map(type => {
                const count = results.filter(r => r.resultType === type).length;
                const pct = total > 0 ? Math.round((count/total)*100) : 0;
                const label = type.charAt(0).toUpperCase() + type.slice(1);
                return (
                  <div key={type} className="ai-bar-row">
                    <span>{label}</span>
                    <div className="ai-bar-track"><div className="ai-bar-fill orange" style={{ width: `${pct}%` }}></div></div>
                    <span>{count} ({pct}%)</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* --- SEARCH, FILTER & SORTING --- */}
        <div className="ai-controls-bar">
          <div className="ai-search-box">
            <FaSearch className="ai-search-icon" />
            <input type="text" placeholder="Search candidates, jobs, or types..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="ai-filters-group">
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="all">Type: All</option>
              <option value="Video Interview">Video Interview</option>
              <option value="Audio Interview">Audio Interview</option>
              <option value="MCQ Assessment">MCQ Assessment</option>
              <option value="Technical Interview">Technical Interview</option>
              <option value="HR Interview">HR Interview</option>
              <option value="Coding Challenge">Coding Challenge</option>
            </select>
            <select value={filterDecision} onChange={(e) => setFilterDecision(e.target.value)}>
              <option value="all">Decision: All</option>
              <option value="Selected">Selected</option>
              <option value="Rejected">Rejected</option>
              <option value="Hold">Hold</option>
              <option value="Next Round">Next Round</option>
              <option value="Pending Review">Pending Review</option>
            </select>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">Status: All</option>
              <option value="Completed">Completed</option>
              <option value="Pending">Pending</option>
              <option value="In Review">In Review</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <select value={filterDate} onChange={(e) => setFilterDate(e.target.value)}>
              <option value="all">Date: All</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
            <div className="ai-sort-group">
              <span><FaSortAmountDown /> Sort:</span>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="date-desc">Latest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="score-desc">Highest Score</option>
                <option value="score-asc">Lowest Score</option>
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
              </select>
            </div>
            <button className="ai-reset-btn" onClick={resetFilters}>Reset Filters</button>
          </div>
        </div>

        {/* --- RESULTS TABLE --- */}
        <div className="ai-table-container">
          <div className="ai-table-header">
            <h2>Interview Results</h2>
            <span className="ai-table-count">{sortedResults.length} results</span>
          </div>
          <div className="table-responsive">
            <table className="ai-table">
              <thead>
                <tr>
                  <th style={{width: '40px'}}>#</th>
                  <th>Candidate</th>
                  <th>Applied Job</th>
                  <th>Interview Type</th>
                  <th>Overall Score</th>
                  <th>Status</th>
                  <th>Recruiter Decision</th>
                  <th>Interview Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedResults.length === 0 ? (
                  <tr><td colSpan="9">
                    <div className="ai-empty-state">
                      <FaRobot className="ai-empty-icon" style={{ color: '#e67e22' }} />
                      <h3>No Interview Results Yet</h3>
                      <p>Completed interview evaluations will appear here once recruiters finish reviewing candidates.</p>
                      <div className="ai-empty-actions">
                        <button className="ai-empty-btn" onClick={() => navigate('/recruiter/interviews')}>Go to Interview Calendar</button>
                        <button className="ai-empty-btn secondary" onClick={() => navigate('/recruiter/interviews')}>Schedule New Interview</button>
                      </div>
                    </div>
                  </td></tr>
                ) : (
                  sortedResults.map((item, index) => {
                    const score = item.resultType === "video" ? (item.overall || 0) : (item.score || 0);
                    const scoreBadge = getScoreBadge(score);
                    const status = item.status || "Completed";
                    const decision = item.finalDecision || "Pending Review";
                    const date = item.createdAt || item.date || "N/A";

                    return (
                      <tr key={item._id} className="ai-table-row">
                        <td className="ai-row-index">{index + 1}</td>
                        <td>
                          <div className="ai-candidate-cell">
                            <div className="ai-avatar-sm" style={{ background: '#fdf2e9', color: '#e67e22' }}>
                              {item.candidateName?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            <div>
                              <div className="ai-name">{item.candidateName || "Unknown"}</div>
                              <div className="ai-email"><FaEnvelope /> {item.email || "N/A"}</div>
                            </div>
                          </div>
                        </td>
                        <td>{item.jobTitle || "N/A"}</td>
                        <td>
                          <span className={`ai-type-badge ${item.resultType}`}>
                            {item.resultType === "video" ? <FaVideo /> : <FaRobot />}
                            {getInterviewTypeLabel(item)}
                          </span>
                        </td>
                        <td>
                          <div className={`ai-score-badge ${scoreBadge.cls}`}>
                            <span className="ai-score-num">{score}%</span>
                            <span className="ai-score-label">{scoreBadge.label}</span>
                          </div>
                        </td>
                        <td>
                          <span className={`ai-status-badge ${status.toLowerCase().replace(' ', '-')}`}>
                            {status === "Completed" ? <FaCheckCircle /> : <FaClock />} {status}
                          </span>
                        </td>
                        <td>
                          <span className={`ai-decision-badge ${decision.toLowerCase().replace(' ', '-')}`}>
                            {decision === "Selected" ? <FaThumbsUp /> : 
                             decision === "Rejected" ? <FaThumbsDown /> : 
                             decision === "Next Round" ? <FaArrowRight /> : <FaClock />} {decision}
                          </span>
                        </td>
                        <td>{new Date(date).toLocaleDateString()}</td>
                        <td>
                          <div className="ai-action-buttons">
                            <button className="ai-btn-view" title="View Details" onClick={() => handleViewDetails(item)}><FaExternalLinkAlt /></button>
                            <button className="ai-btn-download" title="Download Report" onClick={() => alert("Download Report triggered!")}><FaDownload /></button>
                            <button className="ai-btn-approve" title="Approve & Select" onClick={() => { setFinalDecision("Selected"); saveReview(); }}><FaCheck /></button>
                            <button className="ai-btn-reject" title="Reject" onClick={() => { setFinalDecision("Rejected"); saveReview(); }}><FaTimes /></button>
                            <button className="ai-btn-next" title="Move to Next Round" onClick={() => { setFinalDecision("Next Round"); saveReview(); }}><FaArrowRight /></button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* --- FUTURE READY: AI INSIGHTS SECTION --- */}
        <div className="ai-future-insights" style={{ borderLeftColor: '#e67e22' }}>
          <div className="ai-insights-header">
            <h4><FaRobot style={{ color: '#e67e22' }} /> AI Insights <span className="ai-coming-soon" style={{ background: '#fdf2e9', color: '#e67e22' }}>Coming Soon</span></h4>
          </div>
          <div className="ai-insights-placeholder">
            <div className="ai-insight-item"><span>AI Recommendation</span> <span className="ai-placeholder-text">Available After AI Integration</span></div>
            <div className="ai-insight-item"><span>Confidence Score</span> <span className="ai-placeholder-text">--</span></div>
            <div className="ai-insight-item"><span>Technical Analysis</span> <span className="ai-placeholder-text">AI Module Not Yet Connected</span></div>
            <div className="ai-insight-item"><span>Communication Analysis</span> <span className="ai-placeholder-text">Coming Soon</span></div>
            <div className="ai-insight-item"><span>Behavioral Analysis</span> <span className="ai-placeholder-text">Coming Soon</span></div>
            <div className="ai-insight-item"><span>Final Recommendation</span> <span className="ai-placeholder-text">--</span></div>
          </div>
          <div className="ai-insights-footer">
            <p>AI-powered interview evaluation and recommendations will become available after integrating the AI evaluation engine.</p>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}

export default AIInterviewResults;