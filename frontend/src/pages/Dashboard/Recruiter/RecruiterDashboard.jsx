import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import API from "../../../api/api";
import { useEffect, useState } from "react";

import {
  FaUsers,
  FaUserCheck,
  FaCalendarAlt,
  FaChartLine,
  FaBriefcase,
  FaFileAlt,
  FaUserTie,
  FaCheckCircle,
  FaClock,
  FaArrowDown,
  FaClipboardList,
  FaPhone,
  FaVideo,
  FaThumbsUp,
  FaSpinner,
  FaBrain,
  FaMicrochip,
  FaRocket,
  FaMagic,
  FaLightbulb,
  FaCogs
} from "react-icons/fa";

import { MdPsychology, MdAutoAwesome, MdOutlineLightbulb, MdOutlineSmartToy } from "react-icons/md";

function RecruiterDashboard() {
  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [appResponse, interviewResponse, jobsResponse] = await Promise.all([
        API.get("/applications/"),
        API.get("/interviews/"),
        API.get("/jobs/")
      ]);

      setApplications(Array.isArray(appResponse.data) ? appResponse.data : []);
      setInterviews(Array.isArray(interviewResponse.data) ? interviewResponse.data : []);
      setJobs(Array.isArray(jobsResponse.data) ? jobsResponse.data : []);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      setError("Failed to load dashboard data. Please try again.");
      setApplications([]);
      setInterviews([]);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  // Calculate pipeline metrics from dynamic data
  const totalApplications = applications.length;
  const screening = applications.filter(a => a.status?.toLowerCase() === "screening" || a.status?.toLowerCase() === "applied").length;
  const shortlisted = applications.filter(a => a.status?.toLowerCase() === "shortlisted").length;
  const aiInterview = applications.filter(a => a.status?.toLowerCase() === "ai interview" || a.status?.toLowerCase() === "ai screening").length;
  const assessment = applications.filter(a => a.status?.toLowerCase() === "assessment" || a.status?.toLowerCase() === "technical").length;
  const interview = applications.filter(a => a.status?.toLowerCase() === "interview" || a.status?.toLowerCase() === "hr round").length;
  const offer = applications.filter(a => a.status?.toLowerCase() === "offer" || a.status?.toLowerCase() === "offer extended").length;
  const hired = applications.filter(a => a.status?.toLowerCase() === "hired" || a.status?.toLowerCase() === "joined").length;
  const rejected = applications.filter(a => a.status?.toLowerCase() === "rejected").length;

  // Calculate percentages
  const getPercentage = (count) => {
    if (totalApplications === 0) return 0;
    return Math.round((count / totalApplications) * 100);
  };

  // Calculate trend percentages (mock - you can replace with actual trend data from API)
  const getTrend = (index) => {
    const trends = [64.6, 59.3, 67.7, 43.1, 25, 71.4];
    return trends[index % trends.length];
  };

  // Pipeline data with dynamic values
  const pipelineData = [
    { 
      label: 'Applications', 
      count: totalApplications,
      icon: FaFileAlt,
      color: '#3B82F6',
      hasTrend: false,
      percentage: 100
    },
    { 
      label: 'Screening', 
      count: screening, 
      icon: FaUserCheck, 
      color: '#8B5CF6',
      hasTrend: true,
      trend: getTrend(0),
      percentage: getPercentage(screening)
    },
    { 
      label: 'AI Interview', 
      count: aiInterview, 
      // AI Icon Options - Choose one by uncommenting:
      //icon: FaBrain,        // Option 1: Brain icon (Recommended)
      icon: MdPsychology,   // Option 2: Psychology/Brain (Material Design)
      //icon: FaMicrochip,    // Option 3: Microchip/AI processing
      // icon: FaRocket,       // Option 4: Rocket/AI innovation
      //icon: FaMagic,        // Option 5: Magic/AI automation
      // icon: FaLightbulb,    // Option 6: Lightbulb/AI insights
      //icon: MdAutoAwesome,  // Option 7: Auto awesome/sparkle
      // icon: FaCogs,         // Option 8: Cogs/AI automation
      // icon: MdOutlineSmartToy, // Option 9: Smart toy (robot)
      color: '#10B981',
      hasTrend: true,
      trend: getTrend(1),
      percentage: getPercentage(aiInterview)
    },
    { 
      label: 'Assessment', 
      count: assessment, 
      icon: FaClipboardList, 
      color: '#F59E0B',
      hasTrend: true,
      trend: getTrend(2),
      percentage: getPercentage(assessment)
    },
    { 
      label: 'Interview', 
      count: interview, 
      icon: FaUserTie, 
      color: '#EF4444',
      hasTrend: true,
      trend: getTrend(3),
      percentage: getPercentage(interview)
    },
    { 
      label: 'Offer', 
      count: offer, 
      icon: FaThumbsUp, 
      color: '#06B6D4',
      hasTrend: true,
      trend: getTrend(4),
      percentage: getPercentage(offer)
    },
    { 
      label: 'Hired', 
      count: hired, 
      icon: FaCheckCircle, 
      color: '#8B5CF6',
      hasTrend: true,
      trend: getTrend(5),
      percentage: getPercentage(hired)
    },
  ];

  // Quick stats data
  const quickStats = [
    { label: 'Active Jobs', value: jobs.length, icon: FaBriefcase, color: '#3B82F6', bg: '#EFF6FF' },
    { label: 'Total Candidates', value: totalApplications, icon: FaUsers, color: '#10B981', bg: '#ECFDF5' },
    { label: 'Shortlisted', value: shortlisted, icon: FaUserCheck, color: '#8B5CF6', bg: '#EDE9FE' },
    { label: 'Upcoming Interviews', value: interviews.length, icon: FaCalendarAlt, color: '#F59E0B', bg: '#FEF3C7' },
  ];

  // Recent applications
  const recentApplications = applications.slice(0, 5);

  // Upcoming interviews
  const upcomingInterviews = interviews.slice(0, 5);

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'TBD';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // Loading state
  if (loading) {
    return (
      <DashboardLayout>
        <div className="loading-container">
          <FaSpinner className="loading-spinner" />
          <p>Loading dashboard data...</p>
        </div>
      </DashboardLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <DashboardLayout>
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={loadData} className="retry-btn">Retry</button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="recruiter-dashboard-final">
        {/* QUICK STATS - TOP */}
        <div className="quick-stats-final">
          {quickStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div className="stat-card-final" key={index}>
                <div className="stat-icon-final" style={{ background: stat.bg, color: stat.color }}>
                  <Icon />
                </div>
                <div className="stat-info-final">
                  <div className="stat-value-final">{stat.value}</div>
                  <div className="stat-label-final">{stat.label}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* PIPELINE OVERVIEW */}
        <div className="pipeline-final">
          <h2 className="pipeline-title-final">Hiring Pipeline Overview</h2>
          <div className="pipeline-grid-final">
            {pipelineData.map((item, index) => {
              const Icon = item.icon;
              return (
                <div className="pipeline-item-final" key={index}>
                  <div className="pipeline-top-final">
                    <div className="pipeline-icon-final" style={{ color: item.color, background: item.color + '15' }}>
                      <Icon />
                    </div>
                    {item.hasTrend && item.count > 0 && (
                      <div className="pipeline-trend-final down">
                        <FaArrowDown />
                        <span>{item.trend}%</span>
                      </div>
                    )}
                  </div>
                  <div className="pipeline-count-final">{item.count}</div>
                  <div className="pipeline-label-final">{item.label}</div>
                  <div className="pipeline-percent-final">{item.percentage}%</div>
                  <div className="pipeline-bar-final">
                    <div 
                      className="pipeline-bar-fill-final" 
                      style={{ 
                        width: `${item.percentage}%`, 
                        background: item.percentage > 0 ? item.color : '#E5E7EB' 
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI HIRING ASSISTANT */}
        <div className="ai-assistant-final">
          <div className="ai-icon-final">
            {/* AI Assistant Icon - Choose one */}
            {/* <FaBrain />        Option 1: Brain */}
            {/* <MdPsychology />   Option 2: Psychology */}
            {/* <FaMicrochip />    Option 3: Microchip */}
             <FaRocket />       {/*Option 4: Rocket */}
            {/* <FaMagic />       Option 5: Magic */}
            {/* <FaLightbulb />    Option 6: Lightbulb */}
          </div>
          <div className="ai-content-final">
            <h3>AI Hiring Assistant</h3>
            <p>
              {shortlisted > 0 
                ? `Review ${shortlisted} shortlisted candidates first. AI recommends focusing on candidates with strong skill matches and high cultural fit scores.`
                : 'No candidates currently shortlisted. AI will analyze new applications as they come in.'}
            </p>
            <div className="ai-tags-final">
              {shortlisted > 0 && <span className="ai-tag-final">{shortlisted} new matches</span>}
              {interviews.length > 0 && <span className="ai-tag-final">{interviews.length} upcoming interviews</span>}
              {screening > 0 && <span className="ai-tag-final">{screening} pending review</span>}
              <span className="ai-tag-final primary">View recommendations</span>
            </div>
          </div>
        </div>

        {/* TABLES */}
        <div className="tables-final">
          <div className="table-card-final">
            <div className="table-header-final">
              <h3>Recent Applications</h3>
              <button className="view-btn-final">View All</button>
            </div>
            <table className="recruiter-table-final">
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Role</th>
                  <th>Location</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentApplications.length > 0 ? (
                  recentApplications.map((app, index) => (
                    <tr key={app._id || index}>
                      <td>
                        <div className="candidate-final">
                          <div className="avatar-final">
                            {app.candidateName?.charAt(0)?.toUpperCase() || app.email?.charAt(0)?.toUpperCase() || 'U'}
                          </div>
                          {app.candidateName || app.email || 'Unknown'}
                        </div>
                      </td>
                      <td>{app.jobTitle || 'N/A'}</td>
                      <td>{app.location || app.city || 'Remote'}</td>
                      <td>
                        <span className={`status-final ${app.status?.toLowerCase() || 'pending'}`}>
                          {app.status || 'Pending'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="empty-final">No applications found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="table-card-final">
            <div className="table-header-final">
              <h3>Upcoming Interviews</h3>
              <button className="view-btn-final">Schedule</button>
            </div>
            <table className="recruiter-table-final">
              <thead>
                <tr>
                  <th>Candidate</th>
                  <th>Role</th>
                  <th>Date</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
                {upcomingInterviews.length > 0 ? (
                  upcomingInterviews.map((interview, index) => (
                    <tr key={interview._id || index}>
                      <td>
                        <div className="candidate-final">
                          <div className="avatar-final">
                            {interview.candidateName?.charAt(0)?.toUpperCase() || interview.email?.charAt(0)?.toUpperCase() || 'U'}
                          </div>
                          {interview.candidateName || interview.email || 'Unknown'}
                        </div>
                      </td>
                      <td>{interview.jobTitle || 'N/A'}</td>
                      <td>{formatDate(interview.date)}</td>
                      <td>
                        <span className={`interview-type-final ${interview.type?.toLowerCase() === 'video' ? 'video' : 'phone'}`}>
                          {interview.type?.toLowerCase() === 'video' ? <FaVideo /> : <FaPhone />}
                          {interview.type || 'Phone'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="empty-final">No interviews scheduled</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default RecruiterDashboard;