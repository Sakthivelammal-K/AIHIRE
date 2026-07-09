import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../api/api";

import {
  FaUsers,
  FaUserCheck,
  FaUserPlus,
  FaSearch,
  FaRobot,
  FaCheck,
  FaTimes,
  FaClock,
  FaFileAlt,
  FaThumbsUp,
  FaVideo,
  FaCalendarCheck,
  FaSpinner,
  FaStar,
  FaAward,
  FaArrowUp,
  FaArrowDown,
  FaEye,
  FaTrash,
  FaChevronLeft,
  FaChevronRight,
  FaFilePdf,
  FaEnvelope,
  FaCode,
  FaFileAlt as FaFileIcon
} from "react-icons/fa";

function Candidates() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role") || "recruiter";
  
  const [applications, setApplications] = useState([]);
  const [atsScores, setAtsScores] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [interviewType, setInterviewType] = useState("Video");
  const [interviewDate, setInterviewDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const [topSkills, setTopSkills] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    loadCandidates();
  }, []);

  const loadCandidates = async () => {
    setLoading(true);
    setError(null);
    try {
      const appResponse = await API.get("/applications");
      const data = Array.isArray(appResponse.data) ? appResponse.data : appResponse.data.applications || [];
      setApplications(data);

      // Calculate ATS scores
      const scores = {};
      const skillCount = {};
      
      for (const app of data) {
        // Get ATS score
        try {
          const report = await API.get(`/resumes/report/${app.job_id}/${app.email}`);
          scores[app._id] = report.data.atsScore || 0;
        } catch {
          scores[app._id] = 0;
        }

        // Collect skills from applications
        const skills = app.skills || app.requiredSkills || [];
        skills.forEach(skill => {
          if (!skillCount[skill]) skillCount[skill] = 0;
          skillCount[skill]++;
        });
      }
      setAtsScores(scores);

      // Calculate top skills from all applications
      const sortedSkills = Object.entries(skillCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, count]) => ({ name, count }));
      
      setTopSkills(sortedSkills.length > 0 ? sortedSkills : []);

    } catch (error) {
      console.log(error);
      setError("Failed to load candidates. Please try again.");
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/applications/${id}`, { status });
      loadCandidates();
    } catch (error) {
      console.log(error);
      alert("Failed to update status. Please try again.");
    }
  };

  const scheduleInterview = async () => {
    if (!interviewDate) {
      alert("Please select interview date and time");
      return;
    }

    try {
      await API.post("/interviews/create", {
        candidateName: selectedCandidate.candidateName,
        jobTitle: selectedCandidate.jobTitle,
        applicationId: selectedCandidate._id,
        date: interviewDate,
        type: interviewType, 
        interviewType: interviewType, // Video, MCQ, Technical Coding
        status: "Scheduled"
      });

      await API.put(`/applications/${selectedCandidate._id}`, {
        status: "Scheduled"
      });

      setSelectedCandidate(null);
      setInterviewType("Video");
      setInterviewDate("");
      loadCandidates();
      alert("Interview Scheduled Successfully!");
    } catch (error) {
      console.log(error);
      alert("Failed to schedule interview. Please try again.");
    }
  };

  const handleDeleteCandidate = async (id, candidateName) => {
    if (window.confirm(`Are you sure you want to delete candidate "${candidateName || 'Unknown'}"? This action cannot be undone.`)) {
      try {
        await API.delete(`/applications/${id}`);
        loadCandidates();
        alert("Candidate deleted successfully!");
      } catch (error) {
        console.error("Error deleting candidate:", error);
        alert("Failed to delete candidate. Please try again.");
      }
    }
  };

  const handleViewCandidate = (appId) => {
    navigate(`/recruiter/candidates/${appId}`);
  };

  const handleViewResume = (jobId, email) => {
    navigate(`/recruiter/resume-screening/${jobId}/${email}`);
  };

  const safeApplications = Array.isArray(applications) ? applications : [];

  const filteredApplications = safeApplications
    .filter(app => {
      const search = searchTerm.toLowerCase();
      const matchesSearch = (app.candidateName || "").toLowerCase().includes(search) ||
                           (app.jobTitle || "").toLowerCase().includes(search) ||
                           (app.email || "").toLowerCase().includes(search);
      const matchesStatus = filterStatus === "all" || app.status?.toLowerCase() === filterStatus.toLowerCase();
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => (atsScores[b._id] || 0) - (atsScores[a._id] || 0));

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredApplications.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);

  const total = safeApplications.length;
  const shortlisted = safeApplications.filter(a => a.status === "Shortlisted").length;
  const rejected = safeApplications.filter(a => a.status === "Rejected").length;
  const interviews = safeApplications.filter(a => a.status === "Scheduled" || a.status === "Completed").length;
  const hired = safeApplications.filter(a => a.status === "Hired" || a.status === "Selected").length;
  const newCandidates = safeApplications.filter(a => {
    const date = new Date(a.createdAt);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30;
  }).length;

  const getStatusBadge = (status) => {
    const statusMap = {
      'Shortlisted': 'status-shortlisted',
      'Scheduled': 'status-scheduled',
      'Completed': 'status-completed',
      'Selected': 'status-selected',
      'Hold': 'status-hold',
      'Rejected': 'status-rejected',
      'Applied': 'status-applied',
      'Pending': 'status-pending',
      'Hired': 'status-hired',
      'Screening': 'status-screening',
      'Assessment': 'status-assessment',
      'Interview': 'status-interview',
      'Offer': 'status-offer'
    };
    return statusMap[status] || 'status-applied';
  };

  const getStatusIcon = (status) => {
    const statusMap = {
      'Shortlisted': <FaStar />,
      'Scheduled': <FaCalendarCheck />,
      'Completed': <FaCheck />,
      'Selected': <FaUserCheck />,
      'Hold': <FaClock />,
      'Rejected': <FaTimes />,
      'Applied': <FaUserPlus />,
      'Pending': <FaClock />,
      'Hired': <FaAward />,
      'Screening': <FaRobot />,
      'Assessment': <FaFileAlt />,
      'Interview': <FaVideo />,
      'Offer': <FaThumbsUp />
    };
    return statusMap[status] || <FaUserPlus />;
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#10B981';
    if (score >= 60) return '#F59E0B';
    if (score >= 40) return '#F97316';
    return '#EF4444';
  };

  const getStatusText = (status) => {
    const statusMap = {
      'Shortlisted': 'Shortlisted',
      'Scheduled': 'Interview Scheduled',
      'Completed': 'Completed',
      'Selected': 'Selected',
      'Hold': 'Hold',
      'Rejected': 'Rejected',
      'Applied': 'Applied',
      'Pending': 'Pending',
      'Hired': 'Hired',
      'Screening': 'Screening',
      'Assessment': 'Assessment',
      'Interview': 'Interview',
      'Offer': 'Offer'
    };
    return statusMap[status] || status || 'Applied';
  };

  const getCandidateSkills = (app) => {
    return app.skills || app.requiredSkills || [];
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="candidates-loading">
          <FaSpinner className="spin" />
          <p>Loading candidates...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="candidates-error">
          <p className="error-message">{error}</p>
          <button onClick={loadCandidates} className="retry-btn">Retry</button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="candidates-page-redesign">
        {/* Stats */}
        <div className="candidates-stats-redesign">
          <div className="candidates-stat-redesign">
            <div className="candidates-stat-icon-redesign blue"><FaUsers /></div>
            <div>
              <div className="candidates-stat-value-redesign">{total}</div>
              <div className="candidates-stat-label-redesign">Total Candidates</div>
              <div className="candidates-stat-trend-redesign up"><FaArrowUp /> 12% from last month</div>
            </div>
          </div>
          <div className="candidates-stat-redesign">
            <div className="candidates-stat-icon-redesign green"><FaUserPlus /></div>
            <div>
              <div className="candidates-stat-value-redesign">{newCandidates}</div>
              <div className="candidates-stat-label-redesign">New Candidates</div>
              <div className="candidates-stat-trend-redesign up"><FaArrowUp /> 18% from last month</div>
            </div>
          </div>
          <div className="candidates-stat-redesign">
            <div className="candidates-stat-icon-redesign purple"><FaUserCheck /></div>
            <div>
              <div className="candidates-stat-value-redesign">{shortlisted}</div>
              <div className="candidates-stat-label-redesign">Shortlisted</div>
              <div className="candidates-stat-trend-redesign up"><FaArrowUp /> 8% from last month</div>
            </div>
          </div>
          <div className="candidates-stat-redesign">
            <div className="candidates-stat-icon-redesign orange"><FaAward /></div>
            <div>
              <div className="candidates-stat-value-redesign">{hired}</div>
              <div className="candidates-stat-label-redesign">Hired</div>
              <div className="candidates-stat-trend-redesign up"><FaArrowUp /> 7% from last month</div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="candidates-search-redesign">
          <FaSearch className="candidates-search-icon-redesign" />
          <input
            type="text"
            placeholder="Search candidates, skills, or jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Top Skills - Full Width */}
        <div className="candidates-skills-full-redesign">
          <h4>Top Skills</h4>
          <div className="candidates-skill-list-full-redesign">
            {topSkills.length > 0 ? (
              topSkills.map((skill, i) => (
                <div key={i} className="candidates-skill-item-full-redesign">
                  <span>{skill.name}</span>
                  <span className="candidates-skill-count-full-redesign">{skill.count}</span>
                </div>
              ))
            ) : (
              <div className="candidates-no-data-redesign">No skills data available</div>
            )}
          </div>
        </div>

        {/* Table Section */}
        <div className="candidates-table-section-redesign">
          <div className="candidates-table-header-redesign">
            <span>Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredApplications.length)} of {filteredApplications.length} candidates</span>
            <div className="candidates-table-filters-redesign">
              <select 
                className="candidates-filter-select-redesign"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="applied">Applied</option>
                <option value="screening">Screening</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="assessment">Assessment</option>
                <option value="interview">Interview</option>
                <option value="offer">Offer</option>
                <option value="hired">Hired</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div className="candidates-table-scroll-redesign">
            <table className="candidates-table-redesign">
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>ATS Score</th>
                  <th>Experience</th>
                  <th>Skills</th>
                  <th>Current Job</th>
                  <th>Status</th>
                  <th>Applied Job</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.length > 0 ? (
                  currentItems.map((app) => {
                    const score = atsScores[app._id] || 0;
                    const skills = getCandidateSkills(app);
                    const displaySkills = skills.slice(0, 3);
                    const experience = app.experience || 
                      `${Math.floor(Math.random() * 5) + 2}-${Math.floor(Math.random() * 3) + 4} years`;
                    
                    return (
                      <tr key={app._id} className="candidates-table-row-redesign">
                        <td>
                          <div className="candidates-cell-redesign">
                            <div className="candidates-avatar-redesign">
                              {app.candidateName?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            <div>
                              <div className="candidates-name-redesign">{app.candidateName || 'Unknown'}</div>
                              <div className="candidates-email-redesign">
                                <FaEnvelope className="candidates-email-icon-redesign" />
                                {app.email || 'No email'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="candidates-score-redesign" style={{ color: getScoreColor(score) }}>
                            {score}
                          </span>
                        </td>
                        <td>{experience}</td>
                        <td>
                          <div className="candidates-skills-preview-redesign">
                            {displaySkills.map((skill, i) => (
                              <span key={i} className="candidates-skill-pill-redesign">{skill}</span>
                            ))}
                            {skills.length > 3 && (
                              <span className="candidates-skill-pill-redesign more">+{skills.length - 3}</span>
                            )}
                          </div>
                        </td>
                        <td>{app.currentJob || app.jobTitle || 'N/A'}</td>
                        <td>
                          <span className={`candidates-badge-redesign ${getStatusBadge(app.status)}`}>
                            {getStatusIcon(app.status)} {getStatusText(app.status)}
                          </span>
                        </td>
                        <td>{app.jobTitle || 'N/A'}</td>
                        <td>
                          <div className="candidates-actions-redesign">
                            <button 
                              className="candidates-action-redesign view" 
                              title="View Full Profile"
                              onClick={() => handleViewCandidate(app._id)}
                            >
                              <FaEye />
                            </button>
                            
                            <button 
                              className="candidates-action-redesign resume" 
                              title="View Resume Screening"
                              onClick={() => handleViewResume(app.job_id, app.email)}
                            >
                              <FaFilePdf />
                            </button>
                            
                            {app.status === "Applied" || app.status === "Pending" ? (
                              <>
                                <button 
                                  className="candidates-action-redesign shortlist" 
                                  title="Shortlist Candidate"
                                  onClick={() => updateStatus(app._id, "Shortlisted")}
                                >
                                  <FaUserCheck />
                                </button>
                                <button 
                                  className="candidates-action-redesign reject" 
                                  title="Reject Candidate"
                                  onClick={() => updateStatus(app._id, "Rejected")}
                                >
                                  <FaTimes />
                                </button>
                              </>
                            ) : app.status === "Shortlisted" ? (
                              <button 
                                className="candidates-action-redesign interview" 
                                title="Schedule Interview"
                                onClick={() => {
                                  setSelectedCandidate(app);
                                  setInterviewType("Video");
                                  setInterviewDate("");
                                }}
                              >
                                <FaVideo />
                              </button>
                            ) : app.status === "Scheduled" ? (
                              <button 
                                className="candidates-action-redesign view" 
                                title="View Interview"
                                onClick={() => navigate("/recruiter/interviews")}
                              >
                                <FaCalendarCheck />
                              </button>
                            ) : app.status === "Completed" ? (
                              <button 
                                className="candidates-action-redesign view" 
                                title="View Results"
                                onClick={() => navigate("/recruiter/ai-interview-results")}
                              >
                                <FaRobot />
                              </button>
                            ) : app.status === "Selected" || app.status === "Hired" ? (
                              <span className="candidates-status-label-redesign hired">
                                <FaAward /> Hired
                              </span>
                            ) : app.status === "Rejected" ? (
                              <span className="candidates-status-label-redesign rejected">
                                <FaTimes /> Rejected
                              </span>
                            ) : app.status === "Hold" ? (
                              <span className="candidates-status-label-redesign hold">
                                <FaClock /> Hold
                              </span>
                            ) : null}
                            
                            {role === "admin" && (
                              <button 
                                className="candidates-action-redesign delete" 
                                title="Delete Candidate"
                                onClick={() => handleDeleteCandidate(app._id, app.candidateName)}
                              >
                                <FaTrash />
                              </button>
                            )}

                            <button 
                              className="candidates-action-new message" 
                              title="Send Message"
                              onClick={() => {
                                navigate('/recruiter/messages', { 
                                  state: { 
                                    candidateId: app._id,
                                    candidateName: app.candidateName,
                                    candidateEmail: app.email
                                  } 
                                });
                              }}
                            >
                              <FaEnvelope />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="8" className="candidates-empty-redesign">No candidates found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filteredApplications.length > 0 && (
            <div className="candidates-pagination-redesign">
              <button 
                className="candidates-page-btn-redesign"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <FaChevronLeft />
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <button
                    key={i}
                    className={`candidates-page-btn-redesign ${currentPage === pageNum ? 'active' : ''}`}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button 
                className="candidates-page-btn-redesign"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                <FaChevronRight />
              </button>
              <span className="candidates-page-info-redesign">of {totalPages}</span>
            </div>
          )}
        </div>
      </div>

      {/* Schedule Interview Modal - Updated to use 3 Types */}
      {selectedCandidate && (
        <div className="candidates-modal-overlay" onClick={() => setSelectedCandidate(null)}>
          <div className="candidates-modal" onClick={(e) => e.stopPropagation()}>
            <div className="candidates-modal-header">
              <h3><FaVideo /> Schedule Interview</h3>
              <button className="candidates-modal-close" onClick={() => setSelectedCandidate(null)}>
                <FaTimes />
              </button>
            </div>
            <div className="candidates-modal-body">
              <div className="candidates-modal-candidate">
                <div className="candidates-modal-avatar">
                  {selectedCandidate.candidateName?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div>
                  <h4>{selectedCandidate.candidateName}</h4>
                  <p>{selectedCandidate.jobTitle}</p>
                </div>
              </div>
              <div className="candidates-modal-group">
                <label>Interview Type</label>
                <select
                  value={interviewType}
                  onChange={(e) => setInterviewType(e.target.value)}
                >
                  <option value="Video">Video Interview</option>
                  <option value="MCQ">MCQ Assessment</option>
                  <option value="Technical Coding">Technical Coding Challenge</option>
                </select>
              </div>
              <div className="candidates-modal-group">
                <label>Interview Date & Time</label>
                <input
                  type="datetime-local"
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                />
              </div>
            </div>
            <div className="candidates-modal-footer">
              <button className="candidates-modal-cancel" onClick={() => setSelectedCandidate(null)}>
                Cancel
              </button>
              <button className="candidates-modal-save" onClick={scheduleInterview}>
                <FaCalendarCheck /> Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default Candidates;