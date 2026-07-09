import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../api/api";

import {
  FaFileAlt,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaSearch,
  FaBuilding,
  FaMapMarkerAlt,
  FaStar,
  FaUserCheck,
  FaEllipsisV,
  FaFilter,
  FaBriefcase,
  FaArrowLeft,
  FaCalendarAlt,
  FaEnvelope,
  FaPhone,
  FaTimes,
  FaExternalLinkAlt,
} from "react-icons/fa";

function Applications() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [currentPage, setCurrentPage] = useState(1);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showJobModal, setShowJobModal] = useState(false);
  const itemsPerPage = 6;

  useEffect(() => {
    loadApplications();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openDropdown !== null) {
        const dropdown = document.getElementById(`dropdown-${openDropdown}`);
        if (dropdown && !dropdown.closest('.cand-apps-dropdown').contains(event.target)) {
          setOpenDropdown(null);
        }
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [openDropdown]);

  // Close modals on Escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setShowDetailModal(false);
        setShowJobModal(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const loadApplications = async () => {
    try {
      const response = await API.get("/applications/");
      const data = Array.isArray(response.data) ? response.data : response.data.applications || [];
      setApplications(data);
    } catch (error) {
      console.log("Error loading applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const username = localStorage.getItem("username");

  const myApplications = applications.filter(
    app => app.candidateName === username
  );

  const stats = {
    total: myApplications.length,
    underReview: myApplications.filter(a => a.status === "Shortlisted" || a.status === "Under Review" || a.status === "Screening").length,
    interview: myApplications.filter(a => a.status === "Interview Scheduled" || a.status === "Scheduled" || a.status === "Interview").length,
    offer: myApplications.filter(a => a.status === "Offer" || a.status === "Selected" || a.status === "Hired").length,
    rejected: myApplications.filter(a => a.status === "Rejected" || a.status === "Declined").length,
    withdrawn: myApplications.filter(a => a.status === "Withdrawn" || a.status === "Cancelled").length,
  };

  const getStatusGroup = (status) => {
    if (status === "Shortlisted" || status === "Under Review" || status === "Screening") return "under-review";
    if (status === "Interview Scheduled" || status === "Scheduled" || status === "Interview") return "interview";
    if (status === "Offer" || status === "Selected" || status === "Hired") return "offer";
    if (status === "Rejected" || status === "Declined") return "rejected";
    if (status === "Withdrawn" || status === "Cancelled") return "withdrawn";
    return "applied";
  };

  const filteredApps = myApplications.filter(app => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = app.jobTitle?.toLowerCase().includes(searchLower) ||
                         app.company?.toLowerCase().includes(searchLower) ||
                         app.location?.toLowerCase().includes(searchLower);

    let matchesStatus = true;
    const statusGroup = getStatusGroup(app.status);
    if (activeTab !== "all") {
      matchesStatus = statusGroup === activeTab;
    }

    return matchesSearch && matchesStatus;
  });

  const sortedApps = [...filteredApps].sort((a, b) => {
    if (sortBy === "recent") {
      return new Date(b.createdAt || b.appliedDate) - new Date(a.createdAt || a.appliedDate);
    } else if (sortBy === "oldest") {
      return new Date(a.createdAt || a.appliedDate) - new Date(b.createdAt || b.appliedDate);
    } else if (sortBy === "status") {
      return a.status?.localeCompare(b.status || '');
    }
    return 0;
  });

  const totalPages = Math.ceil(sortedApps.length / itemsPerPage);
  const paginatedApps = sortedApps.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusClass = (status) => {
    const map = {
      'Interview Scheduled': 'interview',
      'Scheduled': 'interview',
      'Interview': 'interview',
      'Shortlisted': 'under-review',
      'Under Review': 'under-review',
      'Screening': 'under-review',
      'Applied': 'applied',
      'Rejected': 'rejected',
      'Declined': 'rejected',
      'Withdrawn': 'withdrawn',
      'Cancelled': 'withdrawn',
      'Offer': 'offer',
      'Selected': 'offer',
      'Hired': 'offer'
    };
    return map[status] || 'applied';
  };

  const getStatusDisplay = (status) => {
    const map = {
      'Interview Scheduled': 'Interview',
      'Scheduled': 'Interview',
      'Shortlisted': 'Under Review',
      'Under Review': 'Under Review',
      'Selected': 'Offer',
      'Hired': 'Offer'
    };
    return map[status] || status || 'Applied';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const date = new Date(dateStr);
      const month = date.toLocaleString('en-US', { month: 'short' });
      const day = date.getDate();
      const year = date.getFullYear();
      return `${month} ${day}, ${year}`;
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
      'sprout social': { bg: '#4a7b9c', text: 'S' },
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

  const handleWithdraw = async (appId) => {
    if (window.confirm('Are you sure you want to withdraw this application?')) {
      try {
        await API.put(`/applications/${appId}/withdraw`);
        loadApplications();
        setOpenDropdown(null);
        setShowDetailModal(false);
      } catch (error) {
        console.log('Error withdrawing application:', error);
      }
    }
  };

  const handleViewDetails = (app) => {
    setSelectedApplication(app);
    setShowDetailModal(true);
    setOpenDropdown(null);
  };

  const handleViewJob = (app) => {
    setSelectedApplication(app);
    setShowJobModal(true);
    setOpenDropdown(null);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="cand-apps-page">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <span>Loading applications...</span>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="cand-apps-page">

        {/* Tabs */}
        <div className="cand-apps-tabs">
          <span className={activeTab === "all" ? "active" : ""} onClick={() => { setActiveTab("all"); setCurrentPage(1); }}>
            All Applications <span>{stats.total}</span>
          </span>
          <span className={activeTab === "under-review" ? "active" : ""} onClick={() => { setActiveTab("under-review"); setCurrentPage(1); }}>
            Under Review <span>{stats.underReview}</span>
          </span>
          <span className={activeTab === "interview" ? "active" : ""} onClick={() => { setActiveTab("interview"); setCurrentPage(1); }}>
            Interview <span>{stats.interview}</span>
          </span>
          <span className={activeTab === "offer" ? "active" : ""} onClick={() => { setActiveTab("offer"); setCurrentPage(1); }}>
            Offer <span>{stats.offer}</span>
          </span>
          <span className={activeTab === "rejected" ? "active" : ""} onClick={() => { setActiveTab("rejected"); setCurrentPage(1); }}>
            Rejected <span>{stats.rejected}</span>
          </span>
          <span className={activeTab === "withdrawn" ? "active" : ""} onClick={() => { setActiveTab("withdrawn"); setCurrentPage(1); }}>
            Withdrawn <span>{stats.withdrawn}</span>
          </span>
        </div>

        {/* Filters */}
        <div className="cand-apps-filters">
          <div className="cand-apps-search-box">
            <FaSearch className="cand-apps-search-icon" />
            <input 
              type="text" 
              placeholder="Search applications..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="cand-apps-filter-actions">
            <FaFilter className="filter-icon" />
            <span>Filters</span>
            <div className="sort-container">
              <FaClock className="sort-icon" />
              <span>Sort by:</span>
              <select value={sortBy} onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}>
                <option value="recent">Recently Applied</option>
                <option value="oldest">Oldest</option>
                <option value="status">Status</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="cand-apps-grid">
          {/* Left: Applications List */}
          <div className="cand-apps-list">
            {paginatedApps.length > 0 ? (
              paginatedApps.map((app, index) => {
                const logo = getCompanyLogo(app.company);
                const statusClass = getStatusClass(app.status);
                const statusDisplay = getStatusDisplay(app.status);
                const location = app.location || 'Remote';
                const skills = app.skills || app.requiredSkills || app.techStack || [];
                const appliedDate = formatDate(app.createdAt || app.appliedDate);

                const isApplied = statusClass !== 'withdrawn' && statusClass !== 'rejected';
                const isScreening = statusClass === 'under-review' || statusClass === 'interview' || statusClass === 'offer';
                const isInterview = statusClass === 'interview' || statusClass === 'offer';
                const isOffer = statusClass === 'offer';

                const dropdownId = app._id || index;

                return (
                  <div 
                    key={dropdownId} 
                    className="cand-apps-card"
                    onClick={() => handleViewDetails(app)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="cand-apps-logo" style={{ backgroundColor: logo.bg }}>
                      {logo.text}
                    </div>
                    
                    <div className="cand-apps-content">
                      <div className="cand-apps-top-row">
                        <div className="cand-apps-title-section">
                          <span className="cand-apps-title">{app.jobTitle || 'Position'}</span>
                          <div className="cand-apps-company">
                            {app.company || 'Unknown Company'} • {location}
                          </div>
                        </div>
                        <div className="cand-apps-status-section">
                          <span className={`cand-apps-status-badge ${statusClass}`}>
                            {statusDisplay}
                          </span>
                        </div>
                      </div>
                      
                      <div className="cand-apps-applied-date-top">
                        Applied on {appliedDate}
                      </div>

                      {skills.length > 0 && (
                        <div className="cand-apps-tags">
                          {skills.slice(0, 3).map((skill, i) => (
                            <span key={i} className="cand-apps-tag">{skill}</span>
                          ))}
                          {skills.length > 3 && (
                            <span className="cand-apps-tag-more">+{skills.length - 3}</span>
                          )}
                        </div>
                      )}

                      <div className="cand-apps-pipeline">
                        <div className="cand-apps-pipeline-step">
                          <div className={`cand-apps-pipeline-dot ${isApplied ? 'active' : ''}`}>
                            <FaCheckCircle />
                          </div>
                          <span className="cand-apps-pipeline-label">Applied</span>
                        </div>

                        <div className={`cand-apps-pipeline-connector ${isScreening ? 'active' : ''}`} />

                        <div className="cand-apps-pipeline-step">
                          <div className={`cand-apps-pipeline-dot ${isScreening ? 'active' : ''}`}>
                            <FaUserCheck />
                          </div>
                          <span className="cand-apps-pipeline-label">Screening</span>
                        </div>

                        <div className={`cand-apps-pipeline-connector ${isInterview ? 'active' : ''}`} />

                        <div className="cand-apps-pipeline-step">
                          <div className={`cand-apps-pipeline-dot ${isInterview ? 'active' : ''}`}>
                            <FaStar />
                          </div>
                          <span className="cand-apps-pipeline-label">Interview</span>
                        </div>

                        <div className={`cand-apps-pipeline-connector ${isOffer ? 'active' : ''}`} />

                        <div className="cand-apps-pipeline-step">
                          <div className={`cand-apps-pipeline-dot ${isOffer ? 'active' : ''}`}>
                            <FaCheckCircle />
                          </div>
                          <span className="cand-apps-pipeline-label">Offer</span>
                        </div>
                      </div>
                    </div>

                    <div className="cand-apps-actions" onClick={(e) => e.stopPropagation()}>
                      <div className="cand-apps-dropdown">
                        <button 
                          className="cand-apps-menu-btn" 
                          title="More options"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenDropdown(openDropdown === dropdownId ? null : dropdownId);
                          }}
                        >
                          <FaEllipsisV />
                        </button>
                        <div 
                          id={`dropdown-${dropdownId}`} 
                          className={`cand-apps-dropdown-menu ${openDropdown === dropdownId ? 'open' : ''}`}
                        >
                          <button onClick={() => handleViewDetails(app)}>
                            View Details
                          </button>
                          <button onClick={() => handleViewJob(app)}>
                            View Job
                          </button>
                          <button 
                            className="withdraw-btn"
                            onClick={() => handleWithdraw(app._id)}
                          >
                            Withdraw Application
                          </button>
                          <button onClick={() => {
                            // Duplicate application logic
                            setOpenDropdown(null);
                          }}>
                            Duplicate Application
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="cand-apps-empty">
                <FaBriefcase className="empty-icon" />
                <h3>No applications found</h3>
                <p>Try adjusting your filters or search terms</p>
              </div>
            )}

            {totalPages > 1 && (
              <div className="cand-apps-pagination">
                <span className="pagination-info">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, sortedApps.length)} of {sortedApps.length} applications
                </span>
                <div className="pagination-controls">
                  <button 
                    className="pagination-btn"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    ‹
                  </button>
                  {[...Array(Math.min(totalPages, 7))].map((_, i) => {
                    let pageNum;
                    if (totalPages <= 7) {
                      pageNum = i + 1;
                    } else if (currentPage <= 4) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 3) {
                      pageNum = totalPages - 6 + i;
                    } else {
                      pageNum = currentPage - 3 + i;
                    }
                    if (pageNum > 0 && pageNum <= totalPages) {
                      return (
                        <button 
                          key={pageNum}
                          className={`pagination-btn ${currentPage === pageNum ? 'active' : ''}`}
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                    return null;
                  })}
                  <button 
                    className="pagination-btn"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    ›
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="cand-apps-sidebar">
            <div className="cand-apps-sidebar-card">
              <div className="cand-apps-sidebar-header">
                <h4>Recent Updates</h4>
                <button className="view-all-btn" onClick={() => navigate('/candidate/activity')}>View all</button>
              </div>
              {myApplications.slice(0, 3).map((app, index) => {
                const colors = ['#e67e22', '#f59e0b', '#0d6efd'];
                return (
                  <div key={index} className="cand-apps-update-item">
                    <div className="cand-apps-update-icon" style={{ backgroundColor: '#fdf2e9' }}>
                      <FaBuilding style={{ color: colors[index % colors.length] }} />
                    </div>
                    <div className="cand-apps-update-text">
                      <h5>{app.company || 'Company'}</h5>
                      <p>{getStatusDisplay(app.status)} for {app.jobTitle}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="cand-apps-sidebar-card">
              <div className="cand-apps-sidebar-header">
                <h4>Application Tips</h4>
                <button className="view-all-btn">View all</button>
              </div>
              <div className="cand-apps-tip-item">
                <div className="cand-apps-tip-icon" style={{ backgroundColor: '#fdf2e9' }}>
                  <FaFileAlt style={{ color: '#e67e22' }} />
                </div>
                <div className="cand-apps-tip-text">
                  <h5>Tailor your resume</h5>
                  <p>Customize your resume for each job to increase your chances.</p>
                </div>
              </div>
              <div className="cand-apps-tip-item">
                <div className="cand-apps-tip-icon" style={{ backgroundColor: '#eef4ff' }}>
                  <FaCheckCircle style={{ color: '#0d6efd' }} />
                </div>
                <div className="cand-apps-tip-text">
                  <h5>Track your applications</h5>
                  <p>Keep track of your applications and follow up at the right time.</p>
                </div>
              </div>
              <div className="cand-apps-tip-item" style={{ borderBottom: 'none' }}>
                <div className="cand-apps-tip-icon" style={{ backgroundColor: '#f3e8ff' }}>
                  <FaStar style={{ color: '#9333ea' }} />
                </div>
                <div className="cand-apps-tip-text">
                  <h5>Prepare for interviews</h5>
                  <p>Practice common questions and research the company.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedApplication && (
        <div className="cand-apps-modal-overlay" onClick={() => setShowDetailModal(false)}>
          <div className="cand-apps-modal" onClick={(e) => e.stopPropagation()}>
            <button className="cand-apps-modal-close" onClick={() => setShowDetailModal(false)}>
              <FaTimes />
            </button>
            
            <div className="cand-apps-modal-content">
              <div className="cand-apps-modal-header">
                <div className="cand-apps-modal-logo" style={{ backgroundColor: getCompanyLogo(selectedApplication.company).bg }}>
                  {getCompanyLogo(selectedApplication.company).text}
                </div>
                <div className="cand-apps-modal-title">
                  <h2>{selectedApplication.jobTitle || 'Position'}</h2>
                  <p>{selectedApplication.company || 'Unknown Company'}</p>
                  <span className="cand-apps-modal-location">
                    <FaMapMarkerAlt /> {selectedApplication.location || 'Remote'}
                  </span>
                </div>
                <div className="cand-apps-modal-status">
                  <span className={`cand-apps-status-badge ${getStatusClass(selectedApplication.status)}`}>
                    {getStatusDisplay(selectedApplication.status)}
                  </span>
                </div>
              </div>

              <div className="cand-apps-modal-body">
                <div className="cand-apps-modal-grid">
                  <div className="cand-apps-modal-info">
                    <label>Applied On</label>
                    <span>{formatDate(selectedApplication.createdAt || selectedApplication.appliedDate)}</span>
                  </div>
                  <div className="cand-apps-modal-info">
                    <label>Status</label>
                    <span>{getStatusDisplay(selectedApplication.status)}</span>
                  </div>
                  {selectedApplication.email && (
                    <div className="cand-apps-modal-info">
                      <label>Email</label>
                      <span>{selectedApplication.email}</span>
                    </div>
                  )}
                  {selectedApplication.phone && (
                    <div className="cand-apps-modal-info">
                      <label>Phone</label>
                      <span>{selectedApplication.phone}</span>
                    </div>
                  )}
                </div>

                {(selectedApplication.skills || selectedApplication.requiredSkills || selectedApplication.techStack) && (
                  <div className="cand-apps-modal-section">
                    <h4>Skills</h4>
                    <div className="cand-apps-modal-skills">
                      {(selectedApplication.skills || selectedApplication.requiredSkills || selectedApplication.techStack || []).map((skill, i) => (
                        <span key={i} className="cand-apps-tag">{skill}</span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedApplication.coverLetter && (
                  <div className="cand-apps-modal-section">
                    <h4>Cover Letter</h4>
                    <p>{selectedApplication.coverLetter}</p>
                  </div>
                )}
              </div>

              <div className="cand-apps-modal-footer">
                <button className="cand-apps-modal-btn primary" onClick={() => handleViewJob(selectedApplication)}>
                  View Job Posting <FaExternalLinkAlt />
                </button>
                <button className="cand-apps-modal-btn secondary" onClick={() => handleWithdraw(selectedApplication._id)}>
                  Withdraw Application
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Job Modal */}
      {showJobModal && selectedApplication && (
        <div className="cand-apps-modal-overlay" onClick={() => setShowJobModal(false)}>
          <div className="cand-apps-modal job-modal" onClick={(e) => e.stopPropagation()}>
            <button className="cand-apps-modal-close" onClick={() => setShowJobModal(false)}>
              <FaTimes />
            </button>
            
            <div className="cand-apps-modal-content">
              <div className="cand-apps-modal-header">
                <div className="cand-apps-modal-logo" style={{ backgroundColor: getCompanyLogo(selectedApplication.company).bg }}>
                  {getCompanyLogo(selectedApplication.company).text}
                </div>
                <div className="cand-apps-modal-title">
                  <h2>{selectedApplication.jobTitle || 'Position'}</h2>
                  <p>{selectedApplication.company || 'Unknown Company'}</p>
                  <span className="cand-apps-modal-location">
                    <FaMapMarkerAlt /> {selectedApplication.location || 'Remote'}
                  </span>
                </div>
                <div className="cand-apps-modal-status">
                  <span className={`cand-apps-status-badge ${getStatusClass(selectedApplication.status)}`}>
                    {getStatusDisplay(selectedApplication.status)}
                  </span>
                </div>
              </div>

              <div className="cand-apps-modal-body">
                <div className="cand-apps-modal-section">
                  <h4>Job Description</h4>
                  <p>{selectedApplication.description || 'No description available for this position.'}</p>
                </div>

                {(selectedApplication.skills || selectedApplication.requiredSkills || selectedApplication.techStack) && (
                  <div className="cand-apps-modal-section">
                    <h4>Required Skills</h4>
                    <div className="cand-apps-modal-skills">
                      {(selectedApplication.skills || selectedApplication.requiredSkills || selectedApplication.techStack || []).map((skill, i) => (
                        <span key={i} className="cand-apps-tag">{skill}</span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedApplication.salary && (
                  <div className="cand-apps-modal-section">
                    <h4>Salary Range</h4>
                    <p>{selectedApplication.salary}</p>
                  </div>
                )}

                {selectedApplication.jobType && (
                  <div className="cand-apps-modal-section">
                    <h4>Job Type</h4>
                    <p>{selectedApplication.jobType}</p>
                  </div>
                )}
              </div>

              <div className="cand-apps-modal-footer">
                <button className="cand-apps-modal-btn primary" onClick={() => {
                  setShowJobModal(false);
                  setShowDetailModal(true);
                }}>
                  Back to Details
                </button>
                <button className="cand-apps-modal-btn secondary" onClick={() => navigate(`/candidate/jobs/${selectedApplication.jobId}`)}>
                  Apply Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default Applications;