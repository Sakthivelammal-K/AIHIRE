import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../api/api";

import {
  FaBriefcase,
  FaCheckCircle,
  FaCalendarAlt,
  FaFileAlt,
  FaArrowRight,
  FaChartLine,
  FaUser,
  FaSpinner,
  FaUserCheck,
  FaClock,
  FaVideo,
  FaStar,
  FaFilePdf,
  FaCircle
} from "react-icons/fa";

function CandidateDashboard() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [resumeExists, setResumeExists] = useState(false);
  const [loading, setLoading] = useState(true);

  const username = localStorage.getItem("username") || "Candidate";
  const userEmail = localStorage.getItem("email");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // 1. Load Real Applications
      const appRes = await API.get("/applications/");
      const allApps = Array.isArray(appRes.data) ? appRes.data : appRes.data.applications || [];
      
      // Filter applications specifically for this logged-in candidate
      const myApps = allApps.filter(
        (item) => item.candidateName === username || item.email === userEmail
      );
      setApplications(myApps);

      // 2. Load Real Interviews
      const intRes = await API.get("/interviews/");
      const allInts = Array.isArray(intRes.data.scheduled) ? intRes.data.scheduled : intRes.data || [];
      
      // Filter interviews specifically for this logged-in candidate
      const myInts = allInts.filter(
        (item) => item.candidateName === username || item.email === userEmail
      );
      setInterviews(myInts);

      // 3. Load Real Jobs for "Recommended for you"
      try {
        const jobRes = await API.get("/jobs/");
        const jobsData = Array.isArray(jobRes.data) ? jobRes.data : [];
        setRecommendedJobs(jobsData.slice(0, 4)); // Show top 4 jobs
      } catch (jobError) {
        console.log("Could not load jobs:", jobError);
        setRecommendedJobs([]);
      }

      // 4. Check if Resume exists in Database (For Profile Completion)
      try {
        const resumeRes = await API.get(`/resumes/${userEmail}`);
        if (resumeRes.data && resumeRes.data._id) {
          setResumeExists(true);
        }
      } catch (resumeError) {
        setResumeExists(false);
      }

    } catch (error) {
      console.log("Error loading candidate data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Stats Calculations based on REAL data
  const stats = {
    applications: applications.length,
    assessments: applications.filter(a => a.status === "Assessment" || a.status === "Pending").length,
    interviews: interviews.length,
    offers: applications.filter(a => a.status === "Offer" || a.status === "Selected" || a.status === "Hired").length,
  };

  // Calculate REAL Profile Completion
  const profileItems = [
    { label: "Personal Information", complete: username !== "Candidate" },
    { label: "Work Experience", complete: false }, // You can replace with real data if available
    { label: "Skills & Expertise", complete: false },
    { label: "Resume", complete: resumeExists },
    { label: "Profile Picture", complete: false },
  ];
  const completionPercent = Math.round((profileItems.filter(i => i.complete).length / profileItems.length) * 100);

  // Helper to get Status Badge Style based on real statuses
  const getStatusStyle = (status) => {
    const map = {
      'Interview Scheduled': 'interview',
      'Scheduled': 'interview',
      'Assessment Pending': 'pending',
      'Pending': 'pending',
      'Under Review': 'under-review',
      'Application Submitted': 'submitted',
      'Rejected': 'rejected',
      'Shortlisted': 'under-review',
      'Hired': 'submitted',
      'Offered': 'pending'
    };
    return map[status] || 'pending';
  };

  // Helper to format real dates
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <FaSpinner className="spin" style={{ fontSize: '32px', color: '#e67e22' }} />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="candidate-dashboard">
        {/* STATS ROW (Based on Real Data) */}
        <div className="candidate-stats">
          <div className="stat-card" onClick={() => navigate("/candidate/applications")}>
            <div className="stat-icon blue"><FaBriefcase /></div>
            <div className="stat-content">
              <h3>Applications</h3>
              <h2>{stats.applications}</h2>
            </div>
          </div>
          <div className="stat-card" onClick={() => navigate("/candidate/applications")}>
            <div className="stat-icon green"><FaCheckCircle /></div>
            <div className="stat-content">
              <h3>Assessments</h3>
              <h2>{stats.assessments}</h2>
            </div>
          </div>
          <div className="stat-card" onClick={() => navigate("/candidate/interviews")}>
            <div className="stat-icon orange"><FaCalendarAlt /></div>
            <div className="stat-content">
              <h3>Interviews</h3>
              <h2>{stats.interviews}</h2>
            </div>
          </div>
          <div className="stat-card" onClick={() => navigate("/candidate/applications")}>
            <div className="stat-icon purple"><FaStar /></div>
            <div className="stat-content">
              <h3>Offers</h3>
              <h2>{stats.offers}</h2>
            </div>
          </div>
        </div>

        {/* MAIN GRID LAYOUT */}
        <div className="candidate-grid">
          
          {/* LEFT COLUMN */}
          <div className="candidate-left-col">
            
            {/* RECENT APPLICATIONS (Table View) */}
            <div className="dash-card">
              <div className="card-header">
                <h3>My Applications</h3>
                <button onClick={() => navigate("/candidate/applications")}>
                  View All Applications <FaArrowRight />
                </button>
              </div>
              
              <table className="app-table">
                <thead>
                  <tr>
                    <th>Job Title</th>
                    <th>Company</th>
                    <th>Status</th>
                    <th>Applied On</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.length > 0 ? (
                    applications.slice(-5).reverse().map((app) => (
                      <tr key={app._id} onClick={() => navigate("/candidate/applications")} style={{cursor: 'pointer'}}>
                        <td>
                          <div className="app-company-cell">
                            <div className="app-logo">
                              {app.companyName?.charAt(0) || app.jobTitle?.charAt(0) || 'J'}
                            </div>
                            <div>
                              <div className="app-title">{app.jobTitle}</div>
                              <div className="app-sub">{app.location || 'Remote'} • {app.employmentType || 'Full-time'}</div>
                            </div>
                          </div>
                        </td>
                        <td>{app.companyName || 'Unknown Co.'}</td>
                        <td>
                          <span className={`app-status ${getStatusStyle(app.status)}`}>
                            {app.status || 'Applied'}
                          </span>
                        </td>
                        <td style={{color: '#718096'}}>
                          {formatDate(app.createdAt || app.appliedDate)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan="4" style={{textAlign:'center', padding:'20px', color:'#718096'}}>No applications yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* RECOMMENDED FOR YOU (Horizontal Scroll) */}
            <div className="dash-card">
              <div className="card-header">
                <h3>Recommended for you</h3>
                <button onClick={() => navigate("/candidate/jobs")}>
                  View All Jobs <FaArrowRight />
                </button>
              </div>
              <div className="job-scroll-container">
                {recommendedJobs.length > 0 ? (
                  recommendedJobs.map((job, i) => (
                    <div key={job._id || i} className="job-rec-card" onClick={() => navigate("/candidate/jobs")}>
                      <div className="job-rec-header">
                        <div className="job-rec-icon" style={{background: ['#fef3c7', '#e0f2fe', '#ecfdf5', '#f3e8ff'][i % 4]}}>
                          {job.company?.charAt(0) || job.title?.charAt(0) || 'J'}
                        </div>
                        <div>
                          <span className="job-rec-title">{job.title}</span>
                          <span className="job-rec-company">{job.company || 'Company'}</span>
                        </div>
                      </div>
                      <div className="job-rec-company">{job.location || 'Remote'}</div>
                      <span className="job-rec-badge">{job.employmentType || job.workMode || 'Full-time'}</span>
                    </div>
                  ))
                ) : (
                  <div style={{padding:'10px', color:'#718096'}}>No job recommendations available.</div>
                )}
              </div>
            </div>

          </div>

          {/* RIGHT SIDEBAR */}
          <div className="candidate-sidebar">
            
            {/* PROFILE COMPLETION (Based on Real Resume Existence) */}
            <div className="profile-completion-card">
              <div className="completion-header">
                <h3>Profile Completion</h3>
              </div>
              <div className="completion-chart-wrapper">
                <div className="circular-progress">
                  <svg width="100" height="100" viewBox="0 0 100 100">
                    <circle className="bg" cx="50" cy="50" r="42" />
                    <circle 
                      className="progress" 
                      cx="50" 
                      cy="50" 
                      r="42" 
                      strokeDasharray="263.89" 
                      strokeDashoffset={263.89 - (263.89 * completionPercent / 100)}
                    />
                  </svg>
                  <div className="progress-text">
                    <span>{completionPercent}%</span>
                    <span>Complete</span>
                  </div>
                </div>
                <div className="completion-checklist">
                  {profileItems.map((item, i) => (
                    <div key={i} className={`checklist-item ${item.complete ? '' : 'incomplete'}`}>
                      <FaCheckCircle />
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <button className="complete-btn" onClick={() => navigate("/candidate/profile")}>
                Complete Profile
              </button>
            </div>

            {/* UPCOMING INTERVIEWS (Real Interviews) */}
            <div className="act-card">
              <div className="card-header">
                <h3>Upcoming Interviews</h3>
                <button onClick={() => navigate("/candidate/interviews")}>View All</button>
              </div>
              {interviews.length > 0 ? (
                interviews.slice(0, 3).map((item, i) => (
                  <div key={i} className="act-item" onClick={() => navigate("/candidate/interviews")}>
                    <div className="act-icon interview"><FaCalendarAlt /></div>
                    <div className="act-content">
                      <h4>{item.jobTitle}</h4>
                      <p>
                        {formatDate(item.date)}
                        <span className="act-badge video">
                          {item.type === "Video" ? <FaVideo style={{marginRight:'4px'}}/> : null}
                          {item.interviewType || item.type || 'Video Interview'}
                        </span>
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{textAlign:'center', padding:'20px', color:'#718096', fontSize:'14px'}}>
                  <FaCalendarAlt style={{fontSize:'24px', marginBottom:'8px'}} />
                  <p style={{margin:0}}>No upcoming interviews</p>
                </div>
              )}
            </div>

            {/* RECENT ACTIVITY (Based on Real Applications) */}
            <div className="act-card">
              <div className="card-header">
                <h3>Recent Activity</h3>
                <button onClick={() => navigate("/candidate/activity")}>View All</button>
              </div>
              {applications.length > 0 ? (
                applications.slice(-3).reverse().map((app, i) => {
                   let icon = <FaFileAlt />;
                   let iconClass = 'application';
                   let title = `Application for ${app.jobTitle}`;
                   let subText = `Status: ${app.status || 'Applied'}`;
                   
                   if(app.status === "Interview Scheduled" || app.status === "Scheduled"){
                     icon = <FaClock />;
                     iconClass = 'interview';
                   } else if (app.status === "Assessment" || app.status === "Pending") {
                     icon = <FaUserCheck />;
                     iconClass = 'assessment';
                   }

                   return (
                    <div key={i} className="act-item">
                      <div className={`act-icon ${iconClass}`}>{icon}</div>
                      <div className="act-content">
                        <h4>{title}</h4>
                        <p>{subText}</p>
                      </div>
                    </div>
                   );
                })
              ) : (
                <div style={{textAlign:'center', padding:'20px', color:'#718096', fontSize:'14px'}}>
                  <p style={{margin:0}}>No recent activity</p>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}

export default CandidateDashboard;