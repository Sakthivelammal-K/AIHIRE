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
  FaEdit
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

  const hired = results.filter(r => r.finalDecision === "Selected" || r.finalDecision === "Hired").length;
  const rejected = results.filter(r => r.finalDecision === "Rejected").length;
  const total = results.length;
  const pending = results.filter(r => !r.finalDecision || r.finalDecision === "Pending").length;

  const currentItem = selectedResult || assessment;

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

  // Detail View
  if (currentItem) {
    const candidate = candidateDetails || {
      candidateName: currentItem.candidateName || "Unknown Candidate",
      jobTitle: currentItem.jobTitle || "N/A",
      email: currentItem.email || "",
      phone: currentItem.phone || "",
      location: currentItem.location || ""
    };

    // Get sections from data
    const sections = currentItem.sections || [];
    const answers = currentItem.answers || [];
    const transcript = currentItem.transcript || [];
    const overall = currentItem.resultType === "video" ? currentItem.overall : currentItem.score || 0;
    const communication = currentItem.communication || 0;
    const technical = currentItem.technical || 0;
    const problemSolving = currentItem.problemSolving || 0;
    const cultureFit = currentItem.cultureFit || 0;
    const strengths = currentItem.strengths || [];
    const improvements = currentItem.improvements || [];

    return (
      <DashboardLayout>
        <div className="ai-results-detail-page">
          <button className="back-btn" onClick={handleBack}>
            <FaArrowLeft /> Back to Results
          </button>

          <div className="ai-detail-header">
            <div className="ai-detail-profile">
              <div className="ai-detail-avatar">
                {candidate.candidateName?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="ai-detail-info">
                <h1>{candidate.candidateName || "Unknown"}</h1>
                <p className="ai-detail-title">{candidate.jobTitle || "N/A"}</p>
                <div className="ai-detail-meta">
                  {candidate.location && <span><FaMapMarkerAlt /> {candidate.location}</span>}
                  {candidate.email && <span><FaEnvelope /> {candidate.email}</span>}
                  {candidate.phone && <span><FaPhone /> {candidate.phone}</span>}
                </div>
                <div className="ai-detail-links">
                 {/*} <button
  className="ai-view-application-btn"
  onClick={() =>
    currentItem.applicationId &&
    navigate(`/recruiter/candidates/${currentItem.applicationId}`)
  }
>
  <FaExternalLinkAlt /> View Application
</button>*/}
                </div>
              </div>
            </div>
          </div>

          <div className="ai-detail-tabs">
            <button className={`ai-tab ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
              Overview
            </button>
            <button className={`ai-tab ${activeTab === 'qa' ? 'active' : ''}`} onClick={() => setActiveTab('qa')}>
              Questions & Answers
            </button>
            <button className={`ai-tab ${activeTab === 'evaluation' ? 'active' : ''}`} onClick={() => setActiveTab('evaluation')}>
              Evaluation
            </button>
            <button className={`ai-tab ${activeTab === 'feedback' ? 'active' : ''}`} onClick={() => setActiveTab('feedback')}>
              Feedback
            </button>
            <button className={`ai-tab ${activeTab === 'transcript' ? 'active' : ''}`} onClick={() => setActiveTab('transcript')}>
              Transcript
            </button>
            <button className={`ai-tab ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => setActiveTab('analytics')}>
              Analytics
            </button>
          </div>

          <div className="ai-detail-content">
            {activeTab === 'overview' && (
              <>
                <div className="ai-section-card">
                  <h3>Interview Overview</h3>
                  <p className="ai-overview-text">
                    This AI interview was conducted to evaluate the candidate's technical knowledge, 
                    problem-solving abilities, communication skills, and overall suitability for the role.
                  </p>
                  <div className="ai-overview-grid">
                    <div className="ai-overview-item">
                      <span className="ai-overview-label">Interview Type</span>
                      <span className="ai-overview-value">
                        {currentItem.resultType === "video" ? "AI Interview" : "Assessment"}
                      </span>
                    </div>
                    <div className="ai-overview-item">
                      <span className="ai-overview-label">Duration</span>
                      <span className="ai-overview-value">
                        {currentItem.duration || "N/A"}
                      </span>
                    </div>
                    <div className="ai-overview-item">
                      <span className="ai-overview-label">Total Questions</span>
                      <span className="ai-overview-value">
                        {answers.length || 0}
                      </span>
                    </div>
                    <div className="ai-overview-item">
                      <span className="ai-overview-label">Completion Time</span>
                      <span className="ai-overview-value">
                        {currentItem.createdAt ? new Date(currentItem.createdAt).toLocaleDateString() : "N/A"}
                      </span>
                    </div>
                    <div className="ai-overview-item full">
                      <span className="ai-overview-label">Platform</span>
                      <span className="ai-overview-value">AIHIRE AI Interviewer</span>
                    </div>
                  </div>
                </div>

                {sections.length > 0 && (
                  <div className="ai-section-card">
                    <h3>Interview Sections</h3>
                    <table className="ai-sections-table">
                      <thead>
                        <tr>
                          <th>Section</th>
                          <th>Questions</th>
                          <th>Score</th>
                          <th>Performance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sections.map((section, index) => (
                          <tr key={index}>
                            <td>{section.name || `Section ${index + 1}`}</td>
                            <td>{section.questions || 0}</td>
                            <td>
                              <span className="ai-score-badge">
                                {section.score || 0}/100
                              </span>
                            </td>
                            <td>
                              <span className={`ai-performance-badge ${(section.performance || 'good').toLowerCase()}`}>
                                {section.performance || "Good"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                <div className="ai-section-card">
                  <div className="ai-completed-header">
                    <FaCheckCircle className="ai-completed-icon" />
                    <h3>AI Interview Completed</h3>
                  </div>
                  <div className="ai-candidate-summary">
                    <div className="ai-candidate-avatar-lg">
                      {candidate.candidateName?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div className="ai-candidate-details">
                      <h4>{candidate.candidateName || "Unknown"}</h4>
                      <p>{candidate.jobTitle || "N/A"}</p>
                      <div className="ai-candidate-meta">
                        {candidate.location && <span><FaMapMarkerAlt /> {candidate.location}</span>}
                        {candidate.email && <span><FaEnvelope /> {candidate.email}</span>}
                        {candidate.phone && <span><FaPhone /> {candidate.phone}</span>}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="ai-section-card">
                  <h3>Overall Score</h3>
                  <div className="ai-overall-score">
                    <div className="ai-score-circle" style={{ borderColor: overall >= 70 ? '#10B981' : '#F59E0B' }}>
                      <span className="ai-score-number">{overall}%</span>
                      <span className="ai-score-label">{overall >= 70 ? "Great Fit" : "Good Fit"}</span>
                    </div>
                    <div className="ai-score-details">
                      <div className="ai-score-item">
                        <span className="ai-score-item-label">Communication</span>
                        <div className="ai-score-bar">
                          <div className="ai-score-bar-fill" style={{ width: `${communication}%`, background: '#10B981' }} />
                        </div>
                        <span className="ai-score-item-value">{communication}/100</span>
                      </div>
                      <div className="ai-score-item">
                        <span className="ai-score-item-label">Technical</span>
                        <div className="ai-score-bar">
                          <div className="ai-score-bar-fill" style={{ width: `${technical}%`, background: '#3B82F6' }} />
                        </div>
                        <span className="ai-score-item-value">{technical}/100</span>
                      </div>
                      <div className="ai-score-item">
                        <span className="ai-score-item-label">Problem Solving</span>
                        <div className="ai-score-bar">
                          <div className="ai-score-bar-fill" style={{ width: `${problemSolving}%`, background: '#F59E0B' }} />
                        </div>
                        <span className="ai-score-item-value">{problemSolving}/100</span>
                      </div>
                      <div className="ai-score-item">
                        <span className="ai-score-item-label">Culture Fit</span>
                        <div className="ai-score-bar">
                          <div className="ai-score-bar-fill" style={{ width: `${cultureFit}%`, background: '#8B5CF6' }} />
                        </div>
                        <span className="ai-score-item-value">{cultureFit}/100</span>
                      </div>
                    </div>
                  </div>
                </div>

                {strengths.length > 0 && (
                  <div className="ai-section-card">
                    <h3><FaThumbsUp className="ai-section-icon green" /> Key Strengths</h3>
                    <ul className="ai-strengths-list">
                      {strengths.map((strength, index) => (
                        <li key={index}>{strength}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {improvements.length > 0 && (
                  <div className="ai-section-card">
                    <h3><FaThumbsDown className="ai-section-icon orange" /> Areas for Improvement</h3>
                    <ul className="ai-improvements-list">
                      {improvements.map((improvement, index) => (
                        <li key={index}>{improvement}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {currentItem.videoPath && (
                  <div className="ai-section-card">
                    <h3><FaVideo className="ai-section-icon" /> AI Interview Recording</h3>
                    <div className="ai-recording-box">
                      <FaPlay className="ai-recording-icon" />
                      <div>
                        <h4>Recording Available</h4>
                        <p>The full interview recording is ready to view.</p>
                      </div>
                      <a href={`http://127.0.0.1:8000/${currentItem.videoPath}`} target="_blank" rel="noopener noreferrer" className="ai-recording-btn">
                        Watch Recording
                      </a>
                    </div>
                  </div>
                )}

                <div className="ai-section-card">
                  <h3><FaShare className="ai-section-icon" /> Next Steps</h3>
                  <p className="ai-next-steps-text">
                    Share feedback with the hiring team and move candidate to the next stage.
                  </p>
                  <button className="ai-share-feedback-btn" onClick={() => setActiveTab('feedback')}>
                    <FaShare /> Share Feedback
                  </button>
                </div>
              </>
            )}

            {activeTab === 'qa' && (
              <div className="ai-section-card">
                <h3>Questions & Answers</h3>
                <div className="ai-qa-list">
                  {answers.length > 0 ? (
                    answers.map((answer, index) => (
                      <div key={index} className="ai-qa-item">
                        <div className="ai-qa-question">
                          <span className="ai-qa-number">Q{index + 1}.</span>
                          <span>{answer.question || `Question ${index + 1}`}</span>
                        </div>
                        <div className="ai-qa-answer">
                          <span className="ai-qa-answer-label">Answer:</span>
                          <p>{answer.answer || "No answer provided"}</p>
                        </div>
                        {answer.score && (
                          <div className="ai-qa-score">
                            <span className="ai-qa-score-label">Score:</span>
                            <span className="ai-qa-score-value">{answer.score}/100</span>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="ai-empty">No questions and answers available</div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'evaluation' && (
              <div className="ai-section-card">
                <h3>Evaluation</h3>
                <div className="ai-evaluation-grid">
                  {sections.length > 0 ? (
                    sections.map((section, index) => (
                      <div key={index} className="ai-evaluation-item">
                        <h4>{section.name || `Section ${index + 1}`}</h4>
                        <div className="ai-evaluation-score">{section.score || 0}/100</div>
                        <p>{section.feedback || "No feedback available"}</p>
                      </div>
                    ))
                  ) : (
                    <div className="ai-empty">No evaluation data available</div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'feedback' && (
              <div className="ai-section-card">
                <h3>Feedback</h3>
                <div className="ai-feedback-form">
                  <div className="ai-feedback-group">
                    <label>Recruiter Rating</label>
                    <select value={recruiterRating} onChange={(e) => setRecruiterRating(Number(e.target.value))}>
                      <option value="0">Select Rating</option>
                      <option value="1">1 - Poor</option>
                      <option value="2">2 - Below Average</option>
                      <option value="3">3 - Average</option>
                      <option value="4">4 - Good</option>
                      <option value="5">5 - Excellent</option>
                    </select>
                  </div>
                  <div className="ai-feedback-group">
                    <label>Recruiter Comment</label>
                    <textarea
                      rows="4"
                      placeholder="Add your feedback about the candidate..."
                      value={recruiterComment}
                      onChange={(e) => setRecruiterComment(e.target.value)}
                    />
                  </div>
                  <div className="ai-feedback-group">
                    <label>Final Decision</label>
                    <select value={finalDecision} onChange={(e) => setFinalDecision(e.target.value)}>
                      <option value="">Select Decision</option>
                      <option value="Selected">✅ Selected</option>
                      <option value="Hold">⏳ Hold</option>
                      <option value="Rejected">❌ Rejected</option>
                    </select>
                  </div>
                  <div className="ai-feedback-actions">
                    <button className="ai-feedback-cancel" onClick={handleBack}>Cancel</button>
                    <button className="ai-feedback-save" onClick={saveReview}>
                      <FaCheckCircle /> Save Review
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'transcript' && (
              <div className="ai-section-card">
                <h3>Transcript</h3>
                <div className="ai-transcript">
                  {transcript.length > 0 ? (
                    transcript.map((item, index) => (
                      <div key={index} className="ai-transcript-item">
                        <div className={`ai-transcript-speaker ${item.speaker === 'interviewer' ? 'ai-interviewer' : 'ai-candidate'}`}>
                          <span className="ai-transcript-avatar">
                            {item.speaker === 'interviewer' ? 'AI' : 'C'}
                          </span>
                          <div>
                            <span className="ai-transcript-name">
                              {item.speaker === 'interviewer' ? 'Interviewer' : 'Candidate'}
                            </span>
                            <p>{item.text || "No transcript available"}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="ai-empty">No transcript available</div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="ai-section-card">
                <h3>Analytics</h3>
                <div className="ai-analytics-grid">
                  <div className="ai-analytics-item">
                    <FaChartLine className="ai-analytics-icon" />
                    <div>
                      <span className="ai-analytics-label">Total Questions</span>
                      <span className="ai-analytics-value">{answers.length || 0}</span>
                    </div>
                  </div>
                  <div className="ai-analytics-item">
                    <FaClock className="ai-analytics-icon" />
                    <div>
                      <span className="ai-analytics-label">Duration</span>
                      <span className="ai-analytics-value">{currentItem.duration || "N/A"}</span>
                    </div>
                  </div>
                  <div className="ai-analytics-item">
                    <FaStar className="ai-analytics-icon" />
                    <div>
                      <span className="ai-analytics-label">Overall Score</span>
                      <span className="ai-analytics-value">{overall}%</span>
                    </div>
                  </div>
                  <div className="ai-analytics-item">
                    <FaCheckCircle className="ai-analytics-icon" />
                    <div>
                      <span className="ai-analytics-label">Status</span>
                      <span className="ai-analytics-value completed">{currentItem.status || "Completed"}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // List View
  return (
    <DashboardLayout>
      <div className="ai-results-page">
        <div className="ai-stats">
          <div className="ai-stat">
            <div className="ai-stat-icon blue"><FaRobot /></div>
            <div>
              <div className="ai-stat-value">{total}</div>
              <div className="ai-stat-label">Total</div>
            </div>
          </div>
          <div className="ai-stat">
            <div className="ai-stat-icon green"><FaCheckCircle /></div>
            <div>
              <div className="ai-stat-value">{hired}</div>
              <div className="ai-stat-label">Selected</div>
            </div>
          </div>
          <div className="ai-stat">
            <div className="ai-stat-icon orange"><FaTimesCircle /></div>
            <div>
              <div className="ai-stat-value">{rejected}</div>
              <div className="ai-stat-label">Rejected</div>
            </div>
          </div>
          <div className="ai-stat">
            <div className="ai-stat-icon purple"><FaClock /></div>
            <div>
              <div className="ai-stat-value">{pending}</div>
              <div className="ai-stat-label">Pending Review</div>
            </div>
          </div>
        </div>

        <div className="ai-results-table">
          <div className="ai-table-header">
            <h2>All Results</h2>
            <span className="ai-table-count">{total} results</span>
          </div>

          <div className="table-responsive">
            <table className="ai-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Candidate</th>
                  <th>Score</th>
                  <th>AI Result</th>
                  <th>Recruiter Decision</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {results.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="ai-empty">No Results Found</td>
                  </tr>
                ) : (
                  results.map((item) => (
                    <tr key={item._id}>
                      <td>
                        <span className={item.resultType === "video" ? "badge-video" : "badge-assessment"}>
                          {item.resultType === "video" ? <FaVideo /> : <FaRobot />}
                          {item.resultType === "video" ? " Video" : " Assessment"}
                        </span>
                      </td>
                      <td>{item.candidateName || "Unknown"}</td>
                      <td>
                        <span className="score-badge">
                          {item.resultType === "video" ? item.overall || 0 : item.score || 0}%
                        </span>
                      </td>
                      <td>
                        {item.resultType === "video" ? (
                          item.verdict === "Hire" ? (
                            <span className="badge-hire">Hire</span>
                          ) : item.verdict === "Reject" ? (
                            <span className="badge-reject">Reject</span>
                          ) : (
                            <span className="badge-review">Review</span>
                          )
                        ) : (
                          (item.score || 0) >= 75 ? (
                            <span className="badge-hire">Hire</span>
                          ) : (item.score || 0) < 50 ? (
                            <span className="badge-reject">Reject</span>
                          ) : (
                            <span className="badge-review">Review</span>
                          )
                        )}
                      </td>
                      <td>
                        <span className="decision-badge">
                          {item.finalDecision || "Pending"}
                        </span>
                      </td>
                      <td>
                        <button className="review-btn" onClick={() => handleViewDetails(item)}>
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AIInterviewResults;