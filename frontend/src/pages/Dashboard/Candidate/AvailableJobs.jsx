import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../api/api";

import {
  FaBriefcase,
  FaMapMarkerAlt,
  FaCode,
  FaPaperPlane,
  FaBuilding,
  FaCheckCircle,
  FaSearch,
  FaClock,
  FaStar,
  FaBookmark,
  FaRegBookmark,
  FaFilter,
  FaMapPin,
  FaLaptopCode,
  FaUserTie,
  FaDollarSign
} from "react-icons/fa";

function AvailableJobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [jobScores, setJobScores] = useState({});
  const [trendingSkills, setTrendingSkills] = useState([]);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("relevance");
  const [loading, setLoading] = useState(true);

  // --- NEW FILTER STATES ---
  const [filterLocation, setFilterLocation] = useState("");
  const [filterExperience, setFilterExperience] = useState("");
  const [filterEmployment, setFilterEmployment] = useState("");
  const [filterSalary, setFilterSalary] = useState("");
  const [filterRemote, setFilterRemote] = useState("");

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const candidateName = localStorage.getItem("username");
      const email = localStorage.getItem("email");

      const [jobsRes, applicationsRes, interviewsRes] = await Promise.all([
        API.get("/jobs/"),
        API.get("/applications/"),
        API.get("/interviews/")
      ]);

      const allJobs = jobsRes.data || [];
      setJobs(allJobs);

      const myApplications = applicationsRes.data.filter(
        app => app.candidateName === candidateName || app.email === email
      );
      const appliedIds = myApplications.map(app => app.job_id);
      setAppliedJobs(appliedIds);

      const allInterviews = Array.isArray(interviewsRes.data.scheduled) 
        ? interviewsRes.data.scheduled 
        : interviewsRes.data || [];
      
      const myInterviews = allInterviews.filter(
        int => int.candidateName === candidateName || int.email === email
      );
      setInterviews(myInterviews);

      // Load Saved Jobs
      const savedKey = `savedJobs_${email || candidateName}`;
      const savedIds = JSON.parse(localStorage.getItem(savedKey) || "[]");
      setSavedJobs(savedIds);

      // Trending Skills
      const skillCount = {};
      allJobs.forEach(job => {
        if (Array.isArray(job.requiredSkills)) {
          job.requiredSkills.forEach(skill => {
            skillCount[skill] = (skillCount[skill] || 0) + 1;
          });
        }
      });
      const sortedSkills = Object.entries(skillCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([name]) => name);
      setTrendingSkills(sortedSkills);

      // ATS Scores
      if (email) {
        const scorePromises = allJobs.map(async (job) => {
          try {
            const reportRes = await API.get(`/resumes/report/${job._id}/${email}`);
            return { jobId: job._id, score: reportRes.data.atsScore || 0 };
          } catch {
            return { jobId: job._id, score: 0 };
          }
        });
        const scoresArray = await Promise.all(scorePromises);
        const scoreMap = {};
        scoresArray.forEach(({ jobId, score }) => {
          scoreMap[jobId] = score;
        });
        setJobScores(scoreMap);
      }

    } catch (err) {
      console.log("Error loading jobs data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (job) => {
    if (appliedJobs.includes(job._id)) return;
    const candidateName = localStorage.getItem("username");
    const email = localStorage.getItem("email");

    const application = {
      candidateName,
      email,
      job_id: job._id,
      jobTitle: job.title,
      department: job.department,
      location: job.location,
      company: job.company || "AIHIRE",
      status: "Applied",
      appliedDate: new Date().toISOString()
    };

    try {
      await API.post("/applications/create", application);
      await API.post("/resumes/screen", { email, jobId: job._id });
      await API.put(`/jobs/${job._id}/applicant`);
      setAppliedJobs(prev => [...prev, job._id]);
      alert("Application Submitted Successfully");
    } catch (error) {
      console.log("Application Error:", error.response?.data || error);
      alert("Application failed");
    }
  };

  const toggleSaveJob = (jobId) => {
    const email = localStorage.getItem("email");
    const candidateName = localStorage.getItem("username");
    const savedKey = `savedJobs_${email || candidateName}`;
    let newSaved = [...savedJobs];
    if (newSaved.includes(jobId)) {
      newSaved = newSaved.filter(id => id !== jobId);
    } else {
      newSaved.push(jobId);
    }
    setSavedJobs(newSaved);
    localStorage.setItem(savedKey, JSON.stringify(newSaved));
  };

  // --- REAL FILTER LOGIC ---
  const filteredJobs = jobs
    .filter(job => {
      // Search Term
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = job.title?.toLowerCase().includes(searchLower) ||
                            job.location?.toLowerCase().includes(searchLower) ||
                            job.company?.toLowerCase().includes(searchLower) ||
                            job.department?.toLowerCase().includes(searchLower);

      // Location Filter
      const matchesLocation = !filterLocation || job.location?.toLowerCase().includes(filterLocation.toLowerCase());

      // Employment Type Filter
      const matchesEmployment = !filterEmployment || job.employmentType === filterEmployment;

      // Experience Filter (Simulated based on level strings)
      const matchesExperience = !filterExperience || job.experienceLevel === filterExperience;

      // Remote Filter (String match)
      const matchesRemote = !filterRemote || job.workMode === filterRemote;

      // Salary Filter (Simulated / Placeholder logic)
      let matchesSalary = true;
      if (filterSalary) {
        const salaryNum = parseInt(filterSalary);
        // Mock logic: Check if minSalary or maxSalary fits the range
        const min = parseInt(job.minSalary) || 0;
        const max = parseInt(job.maxSalary) || 0;
        if (salaryNum === 50) matchesSalary = min <= 50000;
        else if (salaryNum === 100) matchesSalary = min <= 100000 && max >= 80000;
        else if (salaryNum === 150) matchesSalary = max >= 120000;
      }

      return matchesSearch && matchesLocation && matchesEmployment && matchesExperience && matchesRemote && matchesSalary;
    })
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
      const aApplied = appliedJobs.includes(a._id) ? 1 : 0;
      const bApplied = appliedJobs.includes(b._id) ? 1 : 0;
      if (aApplied !== bApplied) return bApplied - aApplied;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  const stats = {
    available: jobs.length,
    applied: appliedJobs.length,
    saved: savedJobs.length,
    interviews: interviews.length
  };

  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5;
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const currentJobs = filteredJobs.slice((currentPage - 1) * jobsPerPage, currentPage * jobsPerPage);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="avail-jobs-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <FaClock className="spin" style={{ fontSize: '40px', color: '#e67e22' }} />
          <p style={{ marginLeft: '15px', color: '#718096' }}>Loading job opportunities...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="avail-jobs-page">
        
        {/* BANNER */}
        <div className="avail-banner">
          <div className="avail-banner-left">
            <h1>Find Your Next Opportunity</h1>
            <p>Explore thousands of jobs and find the perfect role for your career.</p>
          </div>
        </div>

        {/* STATS ROW */}
        <div className="avail-stats-row">
          <div className="avail-stat-card">
            <div className="avail-stat-icon blue"><FaBriefcase /></div>
            <div className="avail-stat-content">
              <h3>Available Jobs</h3>
              <h2>{stats.available}</h2>
            </div>
          </div>
          <div className="avail-stat-card">
            <div className="avail-stat-icon green"><FaCheckCircle /></div>
            <div className="avail-stat-content">
              <h3>Applied Jobs</h3>
              <h2>{stats.applied}</h2>
            </div>
          </div>
          <div className="avail-stat-card">
            <div className="avail-stat-icon orange"><FaStar /></div>
            <div className="avail-stat-content">
              <h3>Saved Jobs</h3>
              <h2>{stats.saved}</h2>
            </div>
          </div>
          <div className="avail-stat-card">
            <div className="avail-stat-icon purple"><FaClock /></div>
            <div className="avail-stat-content">
              <h3>Interview Invites</h3>
              <h2>{stats.interviews}</h2>
            </div>
          </div>
        </div>

        {/* ADVANCED FILTERS (EXACT MATCH TO IMAGE) */}
        <div className="avail-filters-wrapper">
          <div className="avail-search-bar">
            <FaSearch />
            <input 
              type="text" 
              placeholder="Search by job title, skills or company..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="avail-advanced-filters">
            <div className="avail-filter-select-wrapper">
              <FaMapPin />
              <select value={filterLocation} onChange={(e) => setFilterLocation(e.target.value)}>
                <option value="">Location</option>
                <option value="San Francisco">San Francisco</option>
                <option value="Remote">Remote</option>
                <option value="New York">New York</option>
                <option value="Austin">Austin</option>
              </select>
            </div>

            <div className="avail-filter-select-wrapper">
              <FaLaptopCode />
              <select value={filterExperience} onChange={(e) => setFilterExperience(e.target.value)}>
                <option value="">Experience</option>
                <option value="Entry Level">Entry Level</option>
                <option value="Mid Level">Mid Level</option>
                <option value="Senior Level">Senior Level</option>
              </select>
            </div>

            <div className="avail-filter-select-wrapper">
              <FaUserTie />
              <select value={filterEmployment} onChange={(e) => setFilterEmployment(e.target.value)}>
                <option value="">Employment Type</option>
                <option value="Full Time">Full Time</option>
                <option value="Part Time">Part Time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            <div className="avail-filter-select-wrapper">
              <FaDollarSign />
              <select value={filterSalary} onChange={(e) => setFilterSalary(e.target.value)}>
                <option value="">Salary</option>
                <option value="50">$0 - $50k</option>
                <option value="100">$50k - $100k</option>
                <option value="150">$100k+</option>
              </select>
            </div>

            <div className="avail-filter-select-wrapper">
              <FaMapMarkerAlt />
              <select value={filterRemote} onChange={(e) => setFilterRemote(e.target.value)}>
                <option value="">Work Mode</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
              </select>
            </div>
          </div>
        </div>

        {/* JOB LIST HEADER */}
        <div className="avail-job-list-header">
          <span>{filteredJobs.length} jobs found</span>
          <div>
            <span style={{ fontSize: '13px', color: '#718096', marginRight: '10px' }}>Sort by:</span>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="relevance">Most Relevant</option>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="avail-main-layout">
          
          {/* LEFT COLUMN: JOBS LIST */}
          <div className="avail-job-list">
            {currentJobs.length > 0 ? (
              currentJobs.map((job) => {
                const isApplied = appliedJobs.includes(job._id);
                const isSaved = savedJobs.includes(job._id);
                const matchScore = jobScores[job._id] || 0;
                return (
                  <div key={job._id} className="avail-job-card">
                    <div 
                      className="avail-company-logo"
                      style={{ 
                        background: ['#fdf2e9', '#e0f2fe', '#ecfdf5', '#f3e8ff'][Math.floor(Math.random() * 4)],
                        color: ['#e67e22', '#0d6efd', '#10b981', '#8b5cf6'][Math.floor(Math.random() * 4)]
                      }}
                    >
                      {job.company?.charAt(0) || job.title?.charAt(0) || 'J'}
                    </div>
                    <div className="avail-job-info">
                      <div className="avail-job-title-row">
                        <span className="avail-job-title">{job.title}</span>
                        {matchScore > 0 && (
                          <span className="avail-match-badge">{Math.min(matchScore, 100)}% Match</span>
                        )}
                      </div>
                      <div className="avail-company-name">
                        <FaBuilding /> {job.company || 'AIHIRE Corp'}
                      </div>
                      <div className="avail-job-meta">
                        <span><FaMapMarkerAlt /> {job.location || 'Remote'}</span>
                        <span><FaCode /> {job.department || 'Technology'}</span>
                        <span><FaBriefcase /> {job.employmentType || 'Full-time'}</span>
                      </div>
                      <div className="avail-skill-tags">
                        {Array.isArray(job.requiredSkills) ? (
                          job.requiredSkills.slice(0, 4).map((skill, i) => (
                            <span key={i} className="avail-skill-tag">{skill}</span>
                          ))
                        ) : (
                          <span className="avail-skill-tag">{job.requiredSkills}</span>
                        )}
                      </div>
                      <div className="avail-job-actions">
                        <button 
                          className="avail-apply-btn"
                          onClick={() => handleApply(job)}
                          disabled={isApplied}
                        >
                          {isApplied ? <><FaCheckCircle /> Applied</> : <><FaPaperPlane /> Apply Now</>}
                        </button>
                        <button 
                          className="avail-save-btn"
                          onClick={() => toggleSaveJob(job._id)}
                        >
                          {isSaved ? <FaBookmark style={{ color: '#e67e22' }} /> : <FaRegBookmark />}
                          {isSaved ? 'Saved' : 'Save'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="avail-job-card" style={{ justifyContent: 'center', padding: '40px', color: '#718096' }}>
                <p>No jobs found matching your criteria.</p>
              </div>
            )}
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="avail-sidebar">
            
            {/* Recommended For You (Real Data - Excluding saved) */}
            <div className="avail-sidebar-card">
              <div className="avail-sidebar-header">
                <h4>Recommended For You</h4>
                <button onClick={() => navigate("/candidate/jobs")}>View all</button>
              </div>
              {jobs.filter(j => !savedJobs.includes(j._id)).slice(0, 3).map((job, i) => {
                const colors = ['#e67e22', '#0d6efd', '#10b981', '#8b5cf6'];
                return (
                  <div key={i} className="avail-sidebar-item">
                    <div className="avail-sidebar-icon" style={{ background: colors[i % colors.length], color: 'white' }}>
                      {job.company?.charAt(0)?.toUpperCase() || job.title?.charAt(0)?.toUpperCase() || 'J'}
                    </div>
                    <div className="avail-sidebar-text">
                      <h5>{job.title}</h5>
                      <p>{job.location || 'Remote'} • {job.department}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Application Tips */}
            <div className="avail-sidebar-card">
              <div className="avail-sidebar-header">
                <h4>Application Tips</h4>
                <button>View all</button>
              </div>
              <div className="avail-sidebar-item">
                <div className="avail-sidebar-icon" style={{ background: '#fef3c7', color: '#d97706' }}><FaCode /></div>
                <div className="avail-sidebar-text">
                  <h5>Customize your resume</h5>
                  <p>Tailor your resume to match the job description.</p>
                </div>
              </div>
              <div className="avail-sidebar-item">
                <div className="avail-sidebar-icon" style={{ background: '#f3e8ff', color: '#8b5cf6' }}><FaStar /></div>
                <div className="avail-sidebar-text">
                  <h5>Highlight key skills</h5>
                  <p>Focus on the most relevant skills.</p>
                </div>
              </div>
              <div className="avail-sidebar-item">
                <div className="avail-sidebar-icon" style={{ background: '#ecfdf5', color: '#10b981' }}><FaCheckCircle /></div>
                <div className="avail-sidebar-text">
                  <h5>Follow up smartly</h5>
                  <p>Send a polite follow-up within a week.</p>
                </div>
              </div>
            </div>

            {/* Trending Skills (Real Data) */}
            <div className="avail-sidebar-card">
              <div className="avail-sidebar-header">
                <h4>Trending Skills</h4>
                <button>View all skills</button>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {trendingSkills.length > 0 ? (
                  trendingSkills.map((skill, i) => (
                    <span key={i} className="avail-trend-tag">{skill}</span>
                  ))
                ) : (
                  <span style={{ color: '#718096', fontSize: '13px' }}>No skills data available</span>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="avail-pagination">
            <button 
              className="avail-page-btn"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              &lt;
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum = i + 1;
              if (totalPages > 5 && currentPage > 3) {
                pageNum = currentPage - 3 + i;
              }
              return (
                <button
                  key={i}
                  className={`avail-page-btn ${currentPage === pageNum ? 'active' : ''}`}
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}
            <button 
              className="avail-page-btn"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              &gt;
            </button>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}

export default AvailableJobs;