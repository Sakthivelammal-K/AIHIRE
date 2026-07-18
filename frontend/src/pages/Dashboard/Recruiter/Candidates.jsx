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
  FaFileAlt as FaFileIcon,
  FaFilter,
  FaSortAmountDown,
  FaSortAmountUp
} from "react-icons/fa";

function Candidates() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role") || "recruiter";
  
  const [applications, setApplications] = useState([]);
  const [atsScores, setAtsScores] = useState({});
  const [candidateProfiles, setCandidateProfiles] = useState({}); 
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
  
  // --- Sorting State ---
  const [sortBy, setSortBy] = useState("ats"); 
  const [sortOrder, setSortOrder] = useState("desc"); 

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

      const scores = {};
      const skillCount = {};
      const profiles = {};
      
      for (const app of data) {
        try {
          const report = await API.get(`/resumes/report/${app.job_id}/${app.email}`);
          scores[app._id] = report.data.atsScore || 0;
        } catch {
          scores[app._id] = 0;
        }

        if (app.email) {
          try {
            const profileRes = await API.get(`/users/profile?email=${app.email}`);
            if (profileRes.data) {
              profiles[app._id] = profileRes.data;
            }
          } catch (err) {
            console.log(`Could not fetch profile for ${app.email}`);
          }
        }

        const skills = app.skills || app.requiredSkills || [];
        skills.forEach(skill => {
          if (!skillCount[skill]) skillCount[skill] = 0;
          skillCount[skill]++;
        });
      }
      setAtsScores(scores);
      setCandidateProfiles(profiles);

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
        interviewType: interviewType,
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

  const processedApplications = safeApplications
    .filter(app => {
      const search = searchTerm.toLowerCase();
      const matchesSearch = (app.candidateName || "").toLowerCase().includes(search) ||
                           (app.jobTitle || "").toLowerCase().includes(search) ||
                           (app.email || "").toLowerCase().includes(search) ||
                           (app.skills || []).some(skill => skill.toLowerCase().includes(search));
      const matchesStatus = filterStatus === "all" || app.status?.toLowerCase() === filterStatus.toLowerCase();
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let valA, valB;
      switch(sortBy) {
        case 'ats':
          valA = atsScores[a._id] || 0;
          valB = atsScores[b._id] || 0;
          break;
        case 'name':
          valA = (a.candidateName || "").toLowerCase();
          valB = (b.candidateName || "").toLowerCase();
          break;
        case 'date':
          valA = new Date(a.createdAt || 0);
          valB = new Date(b.createdAt || 0);
          break;
        default: return 0;
      }
      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = processedApplications.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(processedApplications.length / itemsPerPage);

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

  const getRealExperience = (appId) => {
    const profile = candidateProfiles[appId];
    return profile?.experience;
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
            </div>
          </div>
          <div className="candidates-stat-redesign">
            <div className="candidates-stat-icon-redesign green"><FaUserPlus /></div>
            <div>
              <div className="candidates-stat-value-redesign">{newCandidates}</div>
              <div className="candidates-stat-label-redesign">New Candidates</div>
            </div>
          </div>
          <div className="candidates-stat-redesign">
            <div className="candidates-stat-icon-redesign purple"><FaUserCheck /></div>
            <div>
              <div className="candidates-stat-value-redesign">{shortlisted}</div>
              <div className="candidates-stat-label-redesign">Shortlisted</div>
            </div>
          </div>
          <div className="candidates-stat-redesign">
            <div className="candidates-stat-icon-redesign orange"><FaAward /></div>
            <div>
              <div className="candidates-stat-value-redesign">{hired}</div>
              <div className="candidates-stat-label-redesign">Hired</div>
            </div>
          </div>
        </div>

        {/* Search & Advanced Filters Row */}
        <div className="candidates-controls-redesign">
          <div className="candidates-search-redesign">
            <FaSearch className="candidates-search-icon-redesign" />
            <input
              type="text"
              placeholder="Search candidates, skills, or jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="candidates-advanced-filters-redesign">
            <div className="candidates-filter-group-redesign">
              <FaFilter className="candidates-filter-icon-redesign" />
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

            <div className="candidates-filter-group-redesign">
              <span className="candidates-sort-label-redesign">Sort by:</span>
              <select 
                className="candidates-filter-select-redesign small"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="ats">ATS Score</option>
                <option value="name">Name</option>
                <option value="date">Date Applied</option>
              </select>
              <button 
                className="candidates-sort-toggle-redesign"
                onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                title={sortOrder === 'asc' ? "Ascending" : "Descending"}
              >
                {sortOrder === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />}
              </button>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="candidates-table-section-redesign">
          <div className="candidates-table-header-redesign">
            <span>Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, processedApplications.length)} of {processedApplications.length} candidates</span>
          </div>

          <div className="candidates-table-scroll-redesign">
            <table className="candidates-table-redesign">
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Current Job</th>
                  <th>ATS Score</th>
                  <th>Experience</th>
                  {/* 🛑 SKILLS COLUMN COMMENTED OUT */}
                  {/* <th>Skills</th> */}
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
                    // const displaySkills = skills.slice(0, 3);
                    const experience = getRealExperience(app._id);
                    
                    return (
                      <tr key={app._id} className="candidates-table-row-redesign">
                        {/* 1. Candidate */}
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

                        <td>{app.currentJob || app.jobTitle || 'N/A'}</td>

                        <td>
                          <div className="candidates-ats-badge-redesign" style={{ background: getScoreColor(score) + '20', color: getScoreColor(score) }}>
                            {score}%
                          </div>
                        </td>

                        <td>{experience || ''}</td>

                        {/* 🛑 SKILLS COLUMN COMMENTED OUT */}
                        {/* <td>
                          <div className="candidates-skills-preview-redesign">
                            {displaySkills.length > 0 ? (
                              displaySkills.map((skill, i) => (
                                <span key={i} className="candidates-skill-pill-redesign">{skill}</span>
                              ))
                            ) : null}
                            {skills.length > 3 && (
                              <span className="candidates-skill-pill-redesign more">+{skills.length - 3}</span>
                            )}
                          </div>
                        </td> */}

                        <td>
                          <span className={`candidates-badge-redesign ${getStatusBadge(app.status)}`}>
                            {getStatusIcon(app.status)} {getStatusText(app.status)}
                          </span>
                        </td>

                        <td>{app.jobTitle || 'N/A'}</td>

                        {/* Actions: Exact Dynamic Logic */}
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
                            
                            {/* Envelope Icon for Direct Messaging */}
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

                            {role === "admin" && (
                              <button 
                                className="candidates-action-redesign delete" 
                                title="Delete Candidate"
                                onClick={() => handleDeleteCandidate(app._id, app.candidateName)}
                              >
                                <FaTrash />
                              </button>
                            )}
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
          {processedApplications.length > 0 && (
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

      {/* Schedule Interview Modal */}
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