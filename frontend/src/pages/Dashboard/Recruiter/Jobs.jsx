import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../api/api";

import {
  FaBriefcase,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSpinner,
  FaSearch,
  FaMapMarkerAlt,
  FaBuilding,
  FaCalendarAlt,
  FaUsers,
  FaEye,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaArrowUp,
  FaArrowDown,
  FaCrown,
  FaTimes,
  FaUserTie,
  FaClipboardList,
  FaThumbsUp,
  FaFileAlt,
  FaFilter,
  FaChevronDown,
  FaChevronUp,
  FaExternalLinkAlt
} from "react-icons/fa";

function Jobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedJob, setSelectedJob] = useState(null);
  const [recentActivityData, setRecentActivityData] = useState([]);
  const [mostAppliedData, setMostAppliedData] = useState([]);
  const [sortOrder, setSortOrder] = useState("newest");
  const [viewMode, setViewMode] = useState("list");

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch Jobs
      const res = await API.get("/jobs/");
      const jobsData = Array.isArray(res.data) ? res.data : [];
      setJobs(jobsData);
      
      // 2. Immediately update real application counts
      if (jobsData.length > 0) {
        await updateJobCounts(jobsData);
      }
    } catch (error) {
      console.error("Error loading jobs:", error);
      setError("Failed to load jobs. Please try again.");
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  // --- FIX: Separate function to refresh application counts from the database ---
  const updateJobCounts = async (currentJobs) => {
    try {
      // Fetch all applications to get real-time counts
      const appsRes = await API.get("/applications/");
      const allApplications = Array.isArray(appsRes.data) ? appsRes.data : [];

      // Calculate count for each job
      const updatedJobs = currentJobs.map(job => {
        const count = allApplications.filter(app => app.jobId === job._id || app.job_id === job._id).length;
        return { ...job, applicationsCount: count };
      });

      // Update the state with real counts
      setJobs(updatedJobs);

      // Update recent activity and most applied sidebars
      const sortedJobs = [...updatedJobs].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      const recentActivity = sortedJobs.slice(0, 5).map(job => ({
        title: job.title || 'Untitled',
        applications: job.applicationsCount || 0,
        time: job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'N/A'
      }));
      setRecentActivityData(recentActivity);

      const sortedByApps = [...updatedJobs].sort((a, b) => (b.applicationsCount || 0) - (a.applicationsCount || 0));
      const mostApplied = sortedByApps.slice(0, 5).map(job => ({
        title: job.title || 'Untitled',
        count: job.applicationsCount || 0
      }));
      setMostAppliedData(mostApplied);

    } catch (error) {
      console.error("Error updating job counts:", error);
    }
  };

  // --- Handle Delete ---
  const deleteJob = async (id) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        await API.delete(`/jobs/${id}`);
        // Re-fetch everything from scratch
        loadJobs();
        if (selectedJob?._id === id) {
          setSelectedJob(null);
        }
      } catch (error) {
        console.error("Error deleting job:", error);
        alert("Failed to delete job. Please try again.");
      }
    }
  };

  const toggleDetails = (job) => {
    setSelectedJob(selectedJob?._id === job._id ? null : job);
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.location?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || job.status?.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const statusMap = {
      'active': 'status-active',
      'open': 'status-active',
      'published': 'status-active',
      'draft': 'status-draft',
      'closed': 'status-closed',
      'paused': 'status-paused'
    };
    return statusMap[status?.toLowerCase()] || 'status-active';
  };

  const getStatusIcon = (status) => {
    const statusMap = {
      'active': <FaCheckCircle />,
      'open': <FaCheckCircle />,
      'published': <FaCheckCircle />,
      'draft': <FaClock />,
      'closed': <FaTimesCircle />,
      'paused': <FaClock />
    };
    return statusMap[status?.toLowerCase()] || <FaCheckCircle />;
  };

  const totalJobs = jobs.length;
  const activeJobs = jobs.filter(j => j.status?.toLowerCase() === 'active' || j.status?.toLowerCase() === 'open' || j.status?.toLowerCase() === 'published').length;
  const draftJobs = jobs.filter(j => j.status?.toLowerCase() === 'draft').length;
  const closedJobs = jobs.filter(j => j.status?.toLowerCase() === 'closed').length;

  const getDaysLeft = (deadline) => {
    if (!deadline) return null;
    const today = new Date();
    const endDate = new Date(deadline);
    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleViewAllJobs = () => {
    navigate('/recruiter/jobs');
  };

  const handleViewJob = (jobId) => {
    navigate(`/job-details/${jobId}`);
  };

  const handleEditJob = (jobId) => {
    navigate(`/recruiter/jobs/edit/${jobId}`);
  };

  const handleCreateJob = () => {
    navigate('/recruiter/jobs/create');
  };

  const handleViewAllActivity = () => {
    navigate('/recruiter/activity');
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="jobs-loading"><FaSpinner className="spin" /><p>Loading jobs...</p></div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="jobs-error"><p>{error}</p><button onClick={loadJobs}>Retry</button></div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="jobs-page-redesign">
        {/* Header Section */}
        <div className="jobs-header-redesign">
          <div>
            <h1>Job Management</h1>
            <p>Create and manage all your job postings in one place</p>
          </div>
          <button className="jobs-create-btn-redesign" onClick={handleCreateJob}>
            <FaPlus /> Create Job
          </button>
        </div>

        {/* Stats Section */}
        <div className="jobs-stats-redesign">
          <div className="jobs-stat-redesign" onClick={() => navigate('/recruiter/jobs')}>
            <div className="jobs-stat-icon-redesign blue"><FaBriefcase /></div>
            <div>
              <div className="jobs-stat-value-redesign">{totalJobs}</div>
              <div className="jobs-stat-label-redesign">Total Jobs</div>
            </div>
          </div>
          <div className="jobs-stat-redesign" onClick={() => setFilterStatus('active')}>
            <div className="jobs-stat-icon-redesign green"><FaCheckCircle /></div>
            <div>
              <div className="jobs-stat-value-redesign">{activeJobs}</div>
              <div className="jobs-stat-label-redesign">Active Jobs</div>
            </div>
          </div>
          <div className="jobs-stat-redesign" onClick={() => setFilterStatus('draft')}>
            <div className="jobs-stat-icon-redesign orange"><FaClock /></div>
            <div>
              <div className="jobs-stat-value-redesign">{draftJobs}</div>
              <div className="jobs-stat-label-redesign">Draft Jobs</div>
            </div>
          </div>
          <div className="jobs-stat-redesign" onClick={() => setFilterStatus('closed')}>
            <div className="jobs-stat-icon-redesign red"><FaTimesCircle /></div>
            <div>
              <div className="jobs-stat-value-redesign">{closedJobs}</div>
              <div className="jobs-stat-label-redesign">Closed Jobs</div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <div className="jobs-filters-redesign">
          <div className="jobs-search-redesign">
            <FaSearch className="jobs-search-icon-redesign" />
            <input
              type="text"
              placeholder="Search jobs by title, department, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="jobs-filters-actions-redesign">
            <select className="jobs-filter-select-redesign" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="open">Open</option>
              <option value="draft">Draft</option>
              <option value="closed">Closed</option>
              <option value="paused">Paused</option>
            </select>
            <button className="jobs-filter-btn-redesign">
              <FaFilter /> Filter
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="jobs-main-grid-redesign">
          {/* Table Section */}
          <div className="jobs-table-section-redesign">
            <div className="jobs-table-header-redesign">
              <span>{filteredJobs.length} Jobs Found</span>
              <div className="jobs-table-header-actions-redesign">
                <button 
                  className={`jobs-view-btn-redesign ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                >
                  <FaBriefcase /> List
                </button>
                <button 
                  className={`jobs-view-btn-redesign ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                >
                  <FaThumbsUp /> Grid
                </button>
              </div>
            </div>

            {/* Table View */}
            {viewMode === 'list' && (
              <div className="jobs-table-responsive-redesign">
                <table className="jobs-table-redesign">
                  <thead>
                    <tr>
                      <th>Job Title</th>
                      <th>Department</th>
                      <th>Location</th>
                      <th>Applications</th>
                      <th>Deadline</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredJobs.length > 0 ? (
                      filteredJobs.map((job) => {
                        const daysLeft = getDaysLeft(job.applicationDeadline);
                        const isExpanded = selectedJob?._id === job._id;
                        return (
                          <tr key={job._id} className={`jobs-table-row-redesign ${isExpanded ? 'expanded' : ''}`}>
                            <td>
                              <div className="jobs-cell-redesign">
                                <div className="jobs-icon-redesign"><FaBriefcase /></div>
                                <span className="jobs-title-redesign">{job.title || 'Untitled'}</span>
                              </div>
                            </td>
                            <td><span className="jobs-dept-redesign">{job.department || 'N/A'}</span></td>
                            <td><span className="jobs-location-redesign"><FaMapMarkerAlt /> {job.location || 'Remote'}</span></td>
                            <td><span className="jobs-apps-redesign">{job.applicationsCount || 0}</span></td>
                            <td>
                              <span className={`jobs-deadline-redesign ${daysLeft !== null && daysLeft < 0 ? 'expired' : daysLeft !== null && daysLeft < 7 ? 'urgent' : ''}`}>
                                {job.applicationDeadline ? (
                                  <>
                                    {new Date(job.applicationDeadline).toLocaleDateString()}
                                    {daysLeft !== null && (
                                      <span className="jobs-days-left-redesign">
                                        {daysLeft < 0 ? ' (Expired)' : ` (${daysLeft}d)`}
                                      </span>
                                    )}
                                  </>
                                ) : 'N/A'}
                              </span>
                            </td>
                            <td>
                              <span className={`jobs-badge-redesign ${getStatusBadge(job.status)}`}>
                                {getStatusIcon(job.status)} {job.status || 'Active'}
                              </span>
                            </td>
                            <td>
                              <div className="jobs-actions-redesign">
                                <button 
                                  className={`jobs-action-redesign view ${isExpanded ? 'active' : ''}`} 
                                  onClick={() => toggleDetails(job)}
                                  title={isExpanded ? "Hide Details" : "View Details"}
                                >
                                  <FaEye />
                                </button>
                                <button className="jobs-action-redesign edit" onClick={() => handleEditJob(job._id)}><FaEdit /></button>
                                <button className="jobs-action-redesign delete" onClick={() => deleteJob(job._id)}><FaTrash /></button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="7" className="jobs-empty-redesign">
                          <div className="jobs-empty-content-redesign">
                            <FaBriefcase className="jobs-empty-icon-redesign" />
                            <h3>No jobs found</h3>
                            <p>Try adjusting your search or filters</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* Grid View */}
            {viewMode === 'grid' && (
              <div className="jobs-grid-redesign">
                {filteredJobs.length > 0 ? (
                  filteredJobs.map((job) => {
                    const daysLeft = getDaysLeft(job.applicationDeadline);
                    return (
                      <div key={job._id} className="jobs-grid-card-redesign">
                        <div className="jobs-grid-header-redesign">
                          <div className="jobs-grid-icon-redesign"><FaBriefcase /></div>
                          <span className={`jobs-grid-status-redesign ${getStatusBadge(job.status)}`}>
                            {job.status || 'Active'}
                          </span>
                        </div>
                        <h3 className="jobs-grid-title-redesign">{job.title || 'Untitled'}</h3>
                        <div className="jobs-grid-meta-redesign">
                          <span><FaBuilding /> {job.department || 'N/A'}</span>
                          <span><FaMapMarkerAlt /> {job.location || 'Remote'}</span>
                        </div>
                        <div className="jobs-grid-stats-redesign">
                          <div><FaUsers /> {job.applicationsCount || 0} Applications</div>
                          <div><FaCalendarAlt /> {job.applicationDeadline ? new Date(job.applicationDeadline).toLocaleDateString() : 'No deadline'}</div>
                        </div>
                        <div className="jobs-grid-actions-redesign">
                          <button className="jobs-grid-action-redesign view" onClick={() => toggleDetails(job)}><FaEye /> View</button>
                          <button className="jobs-grid-action-redesign edit" onClick={() => handleEditJob(job._id)}><FaEdit /> Edit</button>
                          <button className="jobs-grid-action-redesign delete" onClick={() => deleteJob(job._id)}><FaTrash /> Delete</button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="jobs-empty-redesign">
                    <FaBriefcase className="jobs-empty-icon-redesign" />
                    <h3>No jobs found</h3>
                    <p>Try adjusting your search or filters</p>
                  </div>
                )}
              </div>
            )}

            {/* Expanded Job Details */}
            {selectedJob && (
              <div className="jobs-details-redesign">
                <div className="jobs-details-header-redesign">
                  <div className="jobs-details-title-redesign">
                    <h3>{selectedJob.title}</h3>
                    <span className={`jobs-badge-redesign ${getStatusBadge(selectedJob.status)}`}>
                      {getStatusIcon(selectedJob.status)} {selectedJob.status || 'Active'}
                    </span>
                  </div>
                  <button className="jobs-details-close-redesign" onClick={() => setSelectedJob(null)}>
                    <FaTimes /> Close
                  </button>
                </div>

                <div className="jobs-details-grid-redesign">
                  <div className="jobs-details-column-redesign">
                    <div className="jobs-details-card-redesign">
                      <h4><FaBriefcase className="jobs-details-icon-redesign" /> Job Overview</h4>
                      <div className="jobs-details-overview-redesign">
                        <div><span>Department</span><strong>{selectedJob.department || 'N/A'}</strong></div>
                        <div><span>Employment Type</span><strong>{selectedJob.employmentType || 'Full Time'}</strong></div>
                        <div><span>Experience Level</span><strong>{selectedJob.experienceLevel || 'Mid Level'}</strong></div>
                        <div><span>Location</span><strong>{selectedJob.location || 'N/A'}</strong></div>
                        <div><span>Work Mode</span><strong>{selectedJob.workMode || 'Hybrid'}</strong></div>
                        <div><span>Posted On</span><strong>{selectedJob.createdAt ? new Date(selectedJob.createdAt).toLocaleDateString() : 'N/A'}</strong></div>
                        <div>
                          <span>Deadline</span>
                          <strong>
                            {selectedJob.applicationDeadline ? (
                              <>
                                {new Date(selectedJob.applicationDeadline).toLocaleDateString()}
                                {(() => {
                                  const daysLeft = getDaysLeft(selectedJob.applicationDeadline);
                                  return daysLeft !== null && (
                                    <span className={`jobs-deadline-days ${daysLeft < 0 ? 'expired' : daysLeft < 7 ? 'urgent' : ''}`}>
                                      {daysLeft < 0 ? ' (Expired)' : ` (${daysLeft} days left)`}
                                    </span>
                                  );
                                })()}
                              </>
                            ) : 'Not set'}
                          </strong>
                        </div>
                      </div>
                    </div>

                    <div className="jobs-details-card-redesign">
                      <h4><FaClipboardList className="jobs-details-icon-redesign" /> Key Skills</h4>
                      <div className="jobs-details-skills-redesign">
                        {Array.isArray(selectedJob.requiredSkills) && selectedJob.requiredSkills.length > 0 ? (
                          selectedJob.requiredSkills.map((skill, i) => (
                            <span key={i} className="jobs-details-skill-redesign">{skill}</span>
                          ))
                        ) : (
                          <span className="jobs-details-no-data">No skills listed</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="jobs-details-column-redesign">
                    <div className="jobs-details-card-redesign">
                      <h4><FaFileAlt className="jobs-details-icon-redesign" /> Job Description</h4>
                      <p className="jobs-details-description-redesign">
                        {selectedJob.description || 'No description provided'}
                      </p>
                      <button className="jobs-details-view-more-redesign" onClick={() => handleViewJob(selectedJob._id)}>
                        View Full Description →
                      </button>
                    </div>

                    <div className="jobs-details-card-redesign">
                      <h4><FaUserTie className="jobs-details-icon-redesign" /> Job Details</h4>
                      <div className="jobs-details-info-redesign">
                        <div>
                          <span>Applications</span>
                          <strong>{selectedJob.applicationsCount || 0}</strong>
                        </div>
                        <div>
                          <span>Openings</span>
                          <strong>{selectedJob.openings || 1}</strong>
                        </div>
                        <div>
                          <span>Status</span>
                          <strong className={`jobs-details-status-redesign ${selectedJob.status?.toLowerCase()}`}>
                            {selectedJob.status || 'Active'}
                          </strong>
                        </div>
                        <div>
                          <span>Job ID</span>
                          <strong>{selectedJob._id?.slice(-6) || 'N/A'}</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="jobs-sidebar-redesign">
            <div className="jobs-sidebar-card-redesign">
              <h4>Recent Activity</h4>
              {recentActivityData.map((item, i) => (
                <div key={i} className="jobs-activity-item-redesign">
                  <div className="jobs-activity-title-redesign">{item.title}</div>
                  <div className="jobs-activity-detail-redesign">
                    <span>{item.applications} new applications</span>
                    <span className="jobs-activity-time-redesign">{item.time}</span>
                  </div>
                </div>
              ))}
              <button className="jobs-sidebar-link-redesign" onClick={handleViewAllActivity}>View All Activity →</button>
            </div>

            <div className="jobs-sidebar-card-redesign">
              <h4>Most Applied</h4>
              {mostAppliedData.map((item, i) => (
                <div key={i} className="jobs-most-item-redesign">
                  <span>{item.title}</span>
                  <span className="jobs-most-count-redesign">{item.count}</span>
                </div>
              ))}
              {/*<button className="jobs-sidebar-link-redesign" onClick={handleViewAllJobs}>View All Jobs →</button>*/}
            </div>

            <div className="jobs-premium-redesign">
              <FaCrown />
              <div>
                <h4>Upgrade to Premium</h4>
                <p>Unlock advanced features and analytics.</p>
              </div>
              <button onClick={() => navigate('/recruiter/profile')}>Upgrade Now</button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Jobs;