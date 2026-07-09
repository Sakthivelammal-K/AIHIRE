import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../../api/api";

import {
  FaArrowLeft,
  FaSpinner,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaBriefcase,
  FaBuilding,
  FaCalendarAlt,
  FaClock,
  FaUserPlus,
  FaCheckCircle,
  FaTimesCircle,
  FaStar,
  FaAward,
  FaLinkedin,
  FaGlobe,
  FaFileAlt,
  FaDownload,
  FaEye,
  FaEdit,
  FaTrash,
  FaCrown,
  FaVideo,
  FaCalendarCheck,
  FaPlus,
  FaLightbulb,
  FaChartLine,
  FaUsers,
  FaUserCheck,
  FaUserTie,
  FaThumbsUp
} from "react-icons/fa";

function CandidateDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("about");
  const [interviews, setInterviews] = useState([]);
  const [downloading, setDownloading] = useState(false);
  const [hasResume, setHasResume] = useState(false);
  const [resumeFileName, setResumeFileName] = useState("");
  const [resumePath, setResumePath] = useState("");

  // API base URL - hardcode or use environment variable
  const API_BASE_URL = 'http://127.0.0.1:8000';

  useEffect(() => {
    loadCandidate();
  }, [id]);

  const loadCandidate = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.get("/applications/");
      const allApplications = Array.isArray(response.data) ? response.data : response.data.applications || [];
      
      const foundCandidate = allApplications.find(app => app._id === id);
      
      if (foundCandidate) {
        let atsScore = 0;
        let reportData = null;
        try {
          const report = await API.get(`/resumes/report/${foundCandidate.job_id}/${foundCandidate.email}`);
          reportData = report.data;
          atsScore = report.data.atsScore || 0;
        } catch {
          atsScore = 0;
        }

        let interviewData = [];
        try {
          const interviewRes = await API.get("/interviews/");
          const allInterviews = Array.isArray(interviewRes.data) ? interviewRes.data : interviewRes.data.scheduled || [];
          interviewData = allInterviews.filter(
            int => int.applicationId === foundCandidate._id || int.candidateName === foundCandidate.candidateName
          );
        } catch {
          interviewData = [];
        }
        setInterviews(interviewData);

        // Get resume data using the email
        let hasResumeFile = false;
        let resumeData = null;
        let resumeFileName = "";
        let resumeFilePath = "";

        try {
          const resumeRes = await API.get(`/resumes/${foundCandidate.email}`);
          if (resumeRes.data && resumeRes.data.resumePath) {
            resumeData = resumeRes.data;
            hasResumeFile = true;
            resumeFilePath = resumeRes.data.resumePath;
            resumeFileName = resumeRes.data.resumeName || `${foundCandidate.candidateName || 'candidate'}_resume.pdf`;
          }
        } catch (resumeError) {
          console.log("No resume found for this candidate");
        }

        if (!hasResumeFile && foundCandidate.resumePath) {
          hasResumeFile = true;
          resumeFilePath = foundCandidate.resumePath;
          resumeFileName = foundCandidate.resumeFileName || `${foundCandidate.candidateName || 'candidate'}_resume.pdf`;
        }

        setHasResume(hasResumeFile);
        setResumeFileName(resumeFileName);
        setResumePath(resumeFilePath);

        setCandidate({
          ...foundCandidate,
          name: foundCandidate.candidateName || foundCandidate.name || "Unknown Candidate",
          email: foundCandidate.email || "",
          phone: foundCandidate.phone || "",
          location: foundCandidate.location || "",
          jobTitle: foundCandidate.jobTitle || "N/A",
          source: foundCandidate.source || "N/A",
          candidateId: foundCandidate.candidateId || `CAND-${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
          appliedOn: foundCandidate.createdAt ? new Date(foundCandidate.createdAt).toLocaleDateString() : "N/A",
          atsScore: atsScore,
          skills: reportData?.matchedSkills || foundCandidate.skills || [],
          softSkills: foundCandidate.softSkills || [],
          about: foundCandidate.about || reportData?.summary || foundCandidate.bio || "",
          department: foundCandidate.department || "N/A",
          employmentType: foundCandidate.employmentType || "N/A",
          experienceLevel: foundCandidate.experienceLevel || "N/A",
          attachments: foundCandidate.attachments || [],
          recentActivity: foundCandidate.recentActivity || [],
          journey: foundCandidate.journey || [],
          status: foundCandidate.status || "Applied",
          hasResume: hasResumeFile,
          resumeFileName: resumeFileName,
          resumePath: resumeFilePath
        });
      } else {
        setError("Candidate not found");
        setCandidate(null);
      }
    } catch (error) {
      console.log("Error loading candidate:", error);
      setError("Failed to load candidate details. Please try again.");
      setCandidate(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadResume = async () => {
    if (!candidate) return;
    
    setDownloading(true);
    try {
      let blob = null;
      let fileName = resumeFileName || `${candidate.name || 'candidate'}_resume.pdf`;

      // Method 1: Try to download using the resume path
      if (resumePath) {
        try {
          // Clean the path and construct full URL
          const cleanPath = resumePath.replace(/^\/+/, '');
          const fileUrl = `${API_BASE_URL}/${cleanPath}`;
          
          const response = await fetch(fileUrl);
          if (response.ok) {
            blob = await response.blob();
          }
        } catch (fetchError) {
          console.log("Fetch from path failed:", fetchError);
        }
      }

      // Method 2: If no blob yet, try to get from resume API with email
      if (!blob && candidate.email) {
        try {
          const resumeRes = await API.get(`/resumes/${candidate.email}`);
          if (resumeRes.data && resumeRes.data.resumePath) {
            const cleanPath = resumeRes.data.resumePath.replace(/^\/+/, '');
            const fileUrl = `${API_BASE_URL}/${cleanPath}`;
            
            const response = await fetch(fileUrl);
            if (response.ok) {
              blob = await response.blob();
              fileName = resumeRes.data.resumeName || fileName;
            }
          }
        } catch (apiError) {
          console.log("API fetch failed:", apiError);
        }
      }

      // Method 3: Try to get resume from application attachments
      if (!blob && candidate.attachments) {
        const resumeAttachment = candidate.attachments.find(
          a => a.name?.toLowerCase().includes('resume') || 
               a.type?.toLowerCase().includes('pdf') ||
               a.name?.toLowerCase().includes('cv')
        );
        if (resumeAttachment) {
          const attachPath = resumeAttachment.path || resumeAttachment.url;
          if (attachPath) {
            try {
              const cleanPath = attachPath.replace(/^\/+/, '');
              const fileUrl = `${API_BASE_URL}/${cleanPath}`;
              const response = await fetch(fileUrl);
              if (response.ok) {
                blob = await response.blob();
                fileName = resumeAttachment.name || fileName;
              }
            } catch (attachError) {
              console.log("Attachment fetch failed:", attachError);
            }
          }
        }
      }

      // Method 4: Try to get resume from the resume screening report
      if (!blob && candidate.job_id && candidate.email) {
        try {
          const reportRes = await API.get(`/resumes/report/${candidate.job_id}/${candidate.email}`);
          if (reportRes.data && reportRes.data.resumePath) {
            const cleanPath = reportRes.data.resumePath.replace(/^\/+/, '');
            const fileUrl = `${API_BASE_URL}/${cleanPath}`;
            const response = await fetch(fileUrl);
            if (response.ok) {
              blob = await response.blob();
            }
          }
        } catch (reportError) {
          console.log("Report fetch failed:", reportError);
        }
      }

      // Method 5: Try direct download from resumes endpoint with email
      if (!blob && candidate.email) {
        try {
          // Try to download as blob from the resumes endpoint
          const response = await API.get(`/resumes/${candidate.email}`, {
            responseType: 'blob'
          });
          if (response.data && response.data.size > 0) {
            blob = response.data;
          }
        } catch (directError) {
          console.log("Direct download failed:", directError);
        }
      }

      // If we have a blob, download it
      if (blob && blob.size > 0) {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        alert("No resume file available for this candidate. Please upload a resume first.");
      }
      
    } catch (error) {
      console.error("Download error:", error);
      alert("Failed to download resume. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

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
      'Completed': <FaCheckCircle />,
      'Selected': <FaUserCheck />,
      'Hold': <FaClock />,
      'Rejected': <FaTimesCircle />,
      'Applied': <FaUserPlus />,
      'Pending': <FaClock />,
      'Hired': <FaAward />,
      'Screening': <FaUserCheck />,
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

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Average';
    return 'Needs Review';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
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

  if (loading) {
    return (
      <DashboardLayout>
        <div className="candidate-detail-loading">
          <FaSpinner className="spin" />
          <p>Loading candidate details...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !candidate) {
    return (
      <DashboardLayout>
        <div className="candidate-detail-error">
          <p>{error || "Candidate not found"}</p>
          <button onClick={() => navigate("/recruiter/candidates")}>Back to Candidates</button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="candidate-detail-page">
        {/* Back Button */}
        <button className="candidate-detail-back" onClick={() => navigate("/recruiter/candidates")}>
          <FaArrowLeft /> Back to Candidates
        </button>

        {/* Profile Header */}
        <div className="candidate-detail-header">
          <div className="candidate-detail-profile">
            <div className="candidate-detail-avatar-lg">
              {candidate.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="candidate-detail-info">
              <h1>{candidate.name}</h1>
              <p className="candidate-detail-title">{candidate.jobTitle}</p>
              <div className="candidate-detail-meta">
                {candidate.location && <span><FaMapMarkerAlt /> {candidate.location}</span>}
                {candidate.email && <span><FaEnvelope /> {candidate.email}</span>}
                {candidate.phone && <span><FaPhone /> {candidate.phone}</span>}
              </div>
              {candidate.hasResume && (
                <div className="candidate-resume-indicator">
                  <FaFileAlt /> Resume Available
                </div>
              )}
            </div>
          </div>
          <div className="candidate-detail-actions">
            <button className="candidate-detail-btn primary" onClick={() => navigate(`/recruiter/interviews`)}>
              <FaVideo /> Schedule Interview
            </button>
            <button 
              className="candidate-detail-btn secondary" 
              onClick={handleDownloadResume}
              disabled={downloading}
            >
              {downloading ? <FaSpinner className="spin" /> : <FaDownload />}
              {downloading ? "Downloading..." : "Download Resume"}
            </button>
          </div>
        </div>

        {/* Main Grid - Same as before */}
        <div className="candidate-detail-grid">
          {/* Left Column */}
          <div className="candidate-detail-left">
            {/* Current Stage */}
            <div className="candidate-detail-card">
              <h3>Current Stage</h3>
              <div className="candidate-stage-grid">
                <div>
                  <span className="candidate-stage-label">Applied For</span>
                  <span className="candidate-stage-value">{candidate.jobTitle}</span>
                </div>
                <div>
                  <span className="candidate-stage-label">Applied On</span>
                  <span className="candidate-stage-value">{candidate.appliedOn}</span>
                </div>
                <div>
                  <span className="candidate-stage-label">Source</span>
                  <span className="candidate-stage-value">{candidate.source}</span>
                </div>
                <div>
                  <span className="candidate-stage-label">Candidate ID</span>
                  <span className="candidate-stage-value">{candidate.candidateId}</span>
                </div>
                <div>
                  <span className="candidate-stage-label">Status</span>
                  <span className={`candidate-stage-value status-badge ${getStatusBadge(candidate.status)}`}>
                    {getStatusIcon(candidate.status)} {candidate.status || 'Applied'}
                  </span>
                </div>
              </div>
            </div>

            {/* Overall Score */}
            {candidate.atsScore > 0 && (
              <div className="candidate-detail-card">
                <h3>Overall Score</h3>
                <div className="candidate-score-summary">
                  <div className="candidate-score-circle" style={{ borderColor: getScoreColor(candidate.atsScore) }}>
                    <span className="candidate-score-number">{candidate.atsScore}%</span>
                    <span className="candidate-score-label">{getScoreLabel(candidate.atsScore)}</span>
                  </div>
                  <div className="candidate-score-bars">
                    <div className="candidate-score-bar-item">
                      <span>Skills</span>
                      <div className="candidate-score-bar"><div style={{ width: `${Math.min(candidate.atsScore + 5, 100)}%`, background: '#10B981' }} /></div>
                      <span>{Math.min(candidate.atsScore + 5, 100)}/100</span>
                    </div>
                    <div className="candidate-score-bar-item">
                      <span>Experience</span>
                      <div className="candidate-score-bar"><div style={{ width: `${Math.min(candidate.atsScore - 3, 100)}%`, background: '#F59E0B' }} /></div>
                      <span>{Math.min(candidate.atsScore - 3, 100)}/100</span>
                    </div>
                    <div className="candidate-score-bar-item">
                      <span>Culture Fit</span>
                      <div className="candidate-score-bar"><div style={{ width: `${Math.min(candidate.atsScore + 2, 100)}%`, background: '#8B5CF6' }} /></div>
                      <span>{Math.min(candidate.atsScore + 2, 100)}/100</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Application Details */}
            <div className="candidate-detail-card">
              <h3>Application Details</h3>
              <div className="candidate-app-details">
                <div>
                  <span className="candidate-app-label">Job Title</span>
                  <span className="candidate-app-value">{candidate.jobTitle}</span>
                </div>
                <div>
                  <span className="candidate-app-label">Department</span>
                  <span className="candidate-app-value">{candidate.department}</span>
                </div>
                <div>
                  <span className="candidate-app-label">Employment Type</span>
                  <span className="candidate-app-value">{candidate.employmentType}</span>
                </div>
                <div>
                  <span className="candidate-app-label">Experience Level</span>
                  <span className="candidate-app-value">{candidate.experienceLevel}</span>
                </div>
              </div>
            </div>

            {/* Candidate Journey */}
            {candidate.journey && candidate.journey.length > 0 && (
              <div className="candidate-detail-card">
                <h3>Candidate Journey</h3>
                <div className="candidate-journey">
                  {candidate.journey.map((item, index) => (
                    <div key={index} className="candidate-journey-item">
                      <div className={`candidate-journey-dot ${item.status || 'pending'}`} />
                      <div className="candidate-journey-content">
                        <span className="candidate-journey-stage">{item.stage}</span>
                        <span className="candidate-journey-date">{item.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="candidate-detail-right">
            {/* About */}
            {candidate.about && (
              <div className="candidate-detail-card">
                <h3>About</h3>
                <p className="candidate-about-text">{candidate.about}</p>
              </div>
            )}

            {/* Skills */}
            {candidate.skills && candidate.skills.length > 0 && (
              <div className="candidate-detail-card">
                <h3>Skills</h3>
                <div className="candidate-skills-tags">
                  {candidate.skills.map((skill, index) => (
                    <span key={index} className="candidate-skill-tag">{skill}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Soft Skills */}
            {candidate.softSkills && candidate.softSkills.length > 0 && (
              <div className="candidate-detail-card">
                <h3>Soft Skills</h3>
                <div className="candidate-skills-tags">
                  {candidate.softSkills.map((skill, index) => (
                    <span key={index} className="candidate-skill-tag soft">{skill}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Attachments */}
            {candidate.attachments && candidate.attachments.length > 0 && (
              <div className="candidate-detail-card">
                <h3>Attachments</h3>
                <div className="candidate-attachments">
                  {candidate.attachments.map((file, index) => (
                    <div key={index} className="candidate-attachment-item">
                      <FaFileAlt className="candidate-attachment-icon" />
                      <div>
                        <div className="candidate-attachment-name">{file.name}</div>
                        <div className="candidate-attachment-size">{file.type || 'File'} - {file.size || 'N/A'}</div>
                      </div>
                      <button className="candidate-attachment-download"><FaDownload /></button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Activity */}
            {candidate.recentActivity && candidate.recentActivity.length > 0 && (
              <div className="candidate-detail-card">
                <h3>Recent Activity</h3>
                <div className="candidate-activity">
                  {candidate.recentActivity.map((item, index) => (
                    <div key={index} className="candidate-activity-item">
                      <div className="candidate-activity-dot" />
                      <div>
                        <div className="candidate-activity-action">{item.action}</div>
                        <div className="candidate-activity-date">{item.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Premium Banner */}
            <div className="candidate-premium-banner">
              <FaCrown />
              <div>
                <h4>Upgrading to Premium</h4>
                <p>Unlock advanced features and analytics.</p>
              </div>
              <button onClick={() => navigate('/recruiter/profile')}>Upgrade Now</button>
            </div>

            {/* Interviews */}
            {interviews.length > 0 && (
              <div className="candidate-detail-card">
                <div className="candidate-interviews-header">
                  <h3>Interviews</h3>
                  <button className="candidate-view-all" onClick={() => navigate('/recruiter/interviews')}>View All Interviews</button>
                </div>
                <table className="candidate-interviews-table">
                  <thead>
                    <tr>
                      <th>Interview Type</th>
                      <th>Date & Time</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {interviews.map((interview, index) => (
                      <tr key={index}>
                        <td>{interview.type || 'AI Interview'}</td>
                        <td>{formatDate(interview.date)}</td>
                        <td>
                          <span className={`candidate-status-badge ${interview.status?.toLowerCase() || 'scheduled'}`}>
                            {interview.status || 'Scheduled'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default CandidateDetail;