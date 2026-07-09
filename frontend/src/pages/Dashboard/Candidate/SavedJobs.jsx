import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../api/api";

import {
  FaBookmark,
  FaBriefcase,
  FaBuilding,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaSearch,
  FaSpinner,
  FaStar,
  FaClock,
  FaUsers,
  FaBell,
  FaFileAlt,
  FaLightbulb,
  FaRegBookmark
} from "react-icons/fa";

function SavedJobs() {
  const navigate = useNavigate();
  const [allJobs, setAllJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [savedJobIds, setSavedJobIds] = useState([]);

  const myEmail = localStorage.getItem("email");
  const myName = localStorage.getItem("username") || "Candidate";

  useEffect(() => {
    loadSavedJobs();
  }, []);

  const loadSavedJobs = async () => {
    setLoading(true);
    try {
      const res = await API.get("/jobs/");
      const jobsData = Array.isArray(res.data) ? res.data : [];
      setAllJobs(jobsData);

      const storageKey = `savedJobs_${myEmail || myName}`;
      const storedIds = localStorage.getItem(storageKey);
      
      if (storedIds) {
        setSavedJobIds(JSON.parse(storedIds));
      } else {
        setSavedJobIds([]);
      }

    } catch (error) {
      console.log("Error loading jobs:", error);
      setAllJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const updateLocalStorage = (newIds) => {
    const storageKey = `savedJobs_${myEmail || myName}`;
    localStorage.setItem(storageKey, JSON.stringify(newIds));
    setSavedJobIds(newIds);
  };

  const handleUnsaveJob = (jobId) => {
    const newIds = savedJobIds.filter(id => id !== jobId);
    updateLocalStorage(newIds);
  };

  const toggleSaveJob = (jobId) => {
    let newSaved = [...savedJobIds];
    if (newSaved.includes(jobId)) {
      newSaved = newSaved.filter(id => id !== jobId); // Unsave
    } else {
      newSaved.push(jobId); // Save
    }
    updateLocalStorage(newSaved);
  };

  const handleApply = (job) => {
    navigate(`/candidate/apply/${job._id}`);
  };

  const safeParseSkills = (skills) => {
    if (!skills) return [];
    if (Array.isArray(skills)) return skills;
    if (typeof skills === 'string') {
      return skills.split(',').map(s => s.trim()).filter(Boolean);
    }
    return [];
  };

  // Filter saved jobs
  const savedJobs = allJobs.filter(job => {
    if (!savedJobIds.includes(job._id)) return false;
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = job.title?.toLowerCase().includes(searchLower) ||
                          job.company?.toLowerCase().includes(searchLower) ||
                          job.location?.toLowerCase().includes(searchLower);
    const matchesType = filterType === "all" || job.employmentType === filterType;
    return matchesSearch && matchesType;
  });

  // Stats
  const stats = {
    total: savedJobs.length,
    fullTime: savedJobs.filter(j => j.employmentType === "Full Time").length,
    remote: savedJobs.filter(j => j.workMode === "Remote").length,
    urgent: savedJobs.filter(j => j.applicationDeadline && new Date(j.applicationDeadline) > new Date()).length
  };

  const getIconColor = (index) => {
    const colors = ['#e67e22', '#0d6efd', '#10b981', '#8b5cf6', '#ef4444'];
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="cand-saved-page">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px', flexDirection: 'column' }}>
            <FaSpinner className="spin" style={{ fontSize: '30px', color: '#e67e22', marginBottom: '15px' }} />
            <p style={{ color: '#718096' }}>Loading saved jobs...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="cand-saved-page">

        {/* STATS ROW */}
        <div className="cand-saved-stats-row">
          <div className="cand-saved-stat-card">
            <div className="cand-saved-stat-icon orange"><FaStar /></div>
            <div className="cand-saved-stat-content">
              <h3>Saved Jobs</h3>
              <h2>{stats.total}</h2>
            </div>
          </div>
          <div className="cand-saved-stat-card">
            <div className="cand-saved-stat-icon blue"><FaBriefcase /></div>
            <div className="cand-saved-stat-content">
              <h3>Full-Time</h3>
              <h2>{stats.fullTime}</h2>
            </div>
          </div>
          <div className="cand-saved-stat-card">
            <div className="cand-saved-stat-icon green"><FaUsers /></div>
            <div className="cand-saved-stat-content">
              <h3>Remote</h3>
              <h2>{stats.remote}</h2>
            </div>
          </div>
          <div className="cand-saved-stat-card">
            <div className="cand-saved-stat-icon purple"><FaClock /></div>
            <div className="cand-saved-stat-content">
              <h3>Urgent</h3>
              <h2>{stats.urgent}</h2>
            </div>
          </div>
        </div>

        {/* FILTERS */}
        <div className="cand-saved-filters">
          <div className="cand-saved-filters-left">
            <span className="cand-saved-badge">All Saved ({stats.total})</span>
            <span style={{ fontSize: '14px', color: '#4a5568' }}>Sort by:</span>
            <select 
              className="cand-saved-filter-select"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="Full Time">Full Time</option>
              <option value="Part Time">Part Time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
          </div>
          <span style={{ fontSize: '13px', color: '#718096' }}>
            Showing {savedJobs.length} saved job{savedJobs.length !== 1 && 's'}
          </span>
        </div>

        {/* MAIN SPLIT GRID */}
        <div className="cand-saved-main-layout">
          
          {/* LEFT SIDE: SAVED JOBS LIST */}
          <div className="cand-saved-list">
            {savedJobs.length > 0 ? (
              savedJobs.map((job, index) => {
                const skillsArray = safeParseSkills(job.requiredSkills);
                return (
                  <div key={job._id} className="cand-saved-job-card">
                    <div className="cand-saved-card-logo-wrapper">
                      <div 
                        className="cand-saved-card-logo"
                        style={{ background: getIconColor(index) }}
                      >
                        {job.company?.charAt(0)?.toUpperCase() || job.title?.charAt(0)?.toUpperCase() || 'J'}
                      </div>
                    </div>
                    <div className="cand-saved-card-body">
                      <div className="cand-saved-card-top-row">
                        <h3 className="cand-saved-job-title">{job.title || 'Untitled Position'}</h3>
                        <div className="cand-saved-card-actions">
                          <button 
                            className="cand-saved-unsave-btn"
                            onClick={() => handleUnsaveJob(job._id)}
                            title="Remove from saved"
                          >
                            <FaBookmark style={{ color: '#e67e22' }} />
                          </button>
                        </div>
                      </div>
                      <div className="cand-saved-company">
                        <FaBuilding /> {job.company || 'Unknown Company'}
                      </div>
                      <div className="cand-saved-job-meta">
                        <span><FaMapMarkerAlt /> {job.location || 'Remote'}</span>
                        <span><FaCalendarAlt /> {job.employmentType || 'Full Time'}</span>
                        {job.workMode && <span><FaUsers /> {job.workMode}</span>}
                      </div>
                      <div className="cand-saved-job-skills">
                        {skillsArray.slice(0, 4).map((skill, i) => (
                          <span key={i} className="cand-saved-skill-tag">{skill}</span>
                        ))}
                        {skillsArray.length > 4 && (
                          <span className="cand-saved-skill-tag">+{skillsArray.length - 4}</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="cand-saved-empty">
                <FaBookmark />
                <h3>No saved jobs found</h3>
                <p>Go to the Jobs page and click the bookmark icon to save a job you like.</p>
                <button 
                  onClick={() => navigate("/candidate/jobs")}
                  style={{
                    marginTop: '15px',
                    padding: '10px 20px',
                    background: '#e67e22',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  Browse Jobs
                </button>
              </div>
            )}
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="cand-saved-sidebar">
            
            {/* Recommended For You - WITH SAVE BUTTON */}
            <div className="cand-saved-recommended-box">
              <div className="cand-saved-sidebar-header">
                <h4>Recommended For You</h4>
                <button onClick={() => navigate("/candidate/jobs")}>View all</button>
              </div>
              {allJobs.filter(j => !savedJobIds.includes(j._id)).slice(0, 4).map((job, i) => {
                const colors = ['#e67e22', '#0d6efd', '#10b981', '#8b5cf6'];
                return (
                  <div key={i} className="cand-saved-sidebar-item" style={{ justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                      <div className="cand-saved-rec-icon" style={{ background: colors[i % colors.length] }}>
                        {job.company?.charAt(0)?.toUpperCase() || job.title?.charAt(0)?.toUpperCase() || 'J'}
                      </div>
                      <div className="cand-saved-rec-info">
                        <span className="cand-saved-rec-title">{job.title}</span>
                        <span className="cand-saved-rec-company">{job.company || 'Company'}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => toggleSaveJob(job._id)}
                      title="Save this job"
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#a0aec0',
                        fontSize: '16px',
                        transition: '0.2s'
                      }}
                      onMouseEnter={(e) => e.target.style.color = '#e67e22'}
                      onMouseLeave={(e) => e.target.style.color = '#a0aec0'}
                    >
                      <FaRegBookmark />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Job Alerts UI */}
            <div className="cand-saved-recommended-box">
              <div className="cand-saved-sidebar-header">
                <h4>Job Alerts</h4>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
                <FaBell style={{ color: '#e67e22', fontSize: '18px', marginTop: '2px' }} />
                <div>
                  <p style={{ margin: '0 0 4px 0', fontWeight: '500', fontSize: '14px' }}>Get notified when new jobs match your preferences.</p>
                </div>
              </div>
              <button className="cand-saved-alert-btn" onClick={() => navigate("/candidate/jobs")}>
                Create Job Alert
              </button>
            </div>

            {/* Application Tips */}
            <div className="cand-saved-recommended-box">
              <div className="cand-saved-sidebar-header">
                <h4>Application Tips</h4>
                <button>View all</button>
              </div>
              <div className="cand-saved-tip-item">
                <div className="cand-saved-tip-icon" style={{ background: '#fef3c7', color: '#d97706' }}><FaFileAlt /></div>
                <div className="cand-saved-tip-info">
                  <h5>Customize your resume</h5>
                  <p>Tailor your resume to match the job description and skills.</p>
                </div>
              </div>
              <div className="cand-saved-tip-item">
                <div className="cand-saved-tip-icon" style={{ background: '#f3e8ff', color: '#8b5cf6' }}><FaLightbulb /></div>
                <div className="cand-saved-tip-info">
                  <h5>Highlight key skills</h5>
                  <p>Focus on the most relevant skills employers are looking for.</p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}

export default SavedJobs;