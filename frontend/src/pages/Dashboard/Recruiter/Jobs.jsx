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
  FaCrown
} from "react-icons/fa";

function Jobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await API.get("/jobs/");
      setJobs(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error loading jobs:", error);
      setError("Failed to load jobs. Please try again.");
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteJob = async (id) => {
    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        await API.delete(`/jobs/${id}`);
        loadJobs();
      } catch (error) {
        console.error("Error deleting job:", error);
        alert("Failed to delete job. Please try again.");
      }
    }
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

  // Mock data for recent activity
  const recentActivity = [
    { title: 'Frontend Developer', applications: 15, time: '10m ago' },
    { title: 'UI/UX Designer', applications: 8, time: '1h ago' },
    { title: 'Product Manager', applications: 5, time: '3h ago' },
    { title: 'Backend Developer', applications: 3, time: '5h ago' },
    { title: 'Data Scientist', applications: 2, time: '1d ago' }
  ];

  const mostApplied = [
    { title: 'Frontend Developer', count: 128 },
    { title: 'UI/UX Designer', count: 96 },
    { title: 'Product Manager', count: 76 },
    { title: 'Backend Developer', count: 64 },
    { title: 'Data Scientist', count: 45 }
  ];

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
      <div className="jobs-page-new">
        {/* Stats */}
        <div className="jobs-stats-new">
          <div className="jobs-stat-new">
            <div className="jobs-stat-icon blue"><FaBriefcase /></div>
            <div>
              <div className="jobs-stat-value">{totalJobs}</div>
              <div className="jobs-stat-label">Total Jobs</div>
              <div className="jobs-stat-trend up"><FaArrowUp /> 12% from last month</div>
            </div>
          </div>
          <div className="jobs-stat-new">
            <div className="jobs-stat-icon green"><FaCheckCircle /></div>
            <div>
              <div className="jobs-stat-value">{activeJobs}</div>
              <div className="jobs-stat-label">Active Jobs</div>
              <div className="jobs-stat-trend up"><FaArrowUp /> 9% from last month</div>
            </div>
          </div>
          <div className="jobs-stat-new">
            <div className="jobs-stat-icon orange"><FaClock /></div>
            <div>
              <div className="jobs-stat-value">{draftJobs}</div>
              <div className="jobs-stat-label">Draft Jobs</div>
              <div className="jobs-stat-trend up"><FaArrowUp /> 4% from last month</div>
            </div>
          </div>
          <div className="jobs-stat-new">
            <div className="jobs-stat-icon red"><FaTimesCircle /></div>
            <div>
              <div className="jobs-stat-value">{closedJobs}</div>
              <div className="jobs-stat-label">Closed Jobs</div>
              <div className="jobs-stat-trend down"><FaArrowDown /> 5% from last month</div>
            </div>
          </div>
        </div>

        {/* Search & Create */}
        <div className="jobs-toolbar-new">
          <div className="jobs-search-new">
            <FaSearch className="jobs-search-icon" />
            <input
              placeholder="Search jobs by title, department, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="jobs-toolbar-right">
            <select className="jobs-filter-new" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="open">Open</option>
              <option value="draft">Draft</option>
              <option value="closed">Closed</option>
              <option value="paused">Paused</option>
            </select>
            <button className="jobs-create-btn" onClick={() => navigate("/create-job")}>
              <FaPlus /> Create Job
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="jobs-content-grid">
          {/* Table */}
          <div className="jobs-table-wrap">
            <div className="jobs-table-header">
              <span>{filteredJobs.length} Jobs Found</span>
            </div>
            <div className="jobs-table-scroll">
              <table className="jobs-table-new">
                <thead>
                  <tr>
                    <th>Job Title</th>
                    <th>Department</th>
                    <th>Location</th>
                    <th>Applications</th>
                    <th>Posted Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredJobs.length > 0 ? (
                    filteredJobs.map((job) => (
                      <tr key={job._id} onClick={() => navigate(`/job-details/${job._id}`)}>
                        <td>
                          <div className="jobs-cell">
                            <div className="jobs-icon"><FaBriefcase /></div>
                            <span className="jobs-title">{job.title || 'Untitled'}</span>
                          </div>
                        </td>
                        <td><span className="jobs-dept">{job.department || 'N/A'}</span></td>
                        <td><span className="jobs-location"><FaMapMarkerAlt /> {job.location || 'Remote'}</span></td>
                        <td><span className="jobs-apps">{job.applicationsCount || 0}</span></td>
                        <td>{job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'N/A'}</td>
                        <td>
                          <span className={`jobs-badge ${getStatusBadge(job.status)}`}>
                            {getStatusIcon(job.status)} {job.status || 'Active'}
                          </span>
                        </td>
                        <td>
                          <div className="jobs-actions" onClick={(e) => e.stopPropagation()}>
                            <button className="jobs-action view" onClick={() => navigate(`/job-details/${job._id}`)}><FaEye /></button>
                            <button className="jobs-action edit" onClick={() => navigate(`/edit-job/${job._id}`)}><FaEdit /></button>
                            <button className="jobs-action delete" onClick={() => deleteJob(job._id)}><FaTrash /></button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="7" className="jobs-empty">No jobs found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sidebar */}
          <div className="jobs-sidebar">
            {/* Recent Activity */}
            <div className="jobs-sidebar-card">
              <h4>Recent Job Activity</h4>
              {recentActivity.map((item, i) => (
                <div key={i} className="jobs-activity-item">
                  <div className="jobs-activity-title">{item.title}</div>
                  <div className="jobs-activity-detail">
                    <span>{item.applications} new applications</span>
                    <span className="jobs-activity-time">{item.time}</span>
                  </div>
                </div>
              ))}
              <button className="jobs-sidebar-link">View All Activity →</button>
            </div>

            {/* Most Applied */}
            <div className="jobs-sidebar-card">
              <h4>Most Applied Jobs</h4>
              {mostApplied.map((item, i) => (
                <div key={i} className="jobs-most-item">
                  <span>{item.title}</span>
                  <span className="jobs-most-count">{item.count}</span>
                </div>
              ))}
              <button className="jobs-sidebar-link">View All Jobs →</button>
            </div>

            {/* Premium */}
            <div className="jobs-premium">
              <FaCrown />
              <div>
                <h4>Upgrade to Premium</h4>
                <p>Unlock advanced features and analytics.</p>
              </div>
              <button>Upgrade Now</button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Jobs;