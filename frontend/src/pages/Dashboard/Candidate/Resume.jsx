import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import { useEffect, useState, useRef } from "react";
import API from "../../../api/api";

import {
  FaRobot,
  FaStar,
  FaCheckCircle,
  FaBrain,
  FaCalendarAlt,
  FaEye,
  FaEdit,
  FaUser,
  FaUpload,
  FaDownload,
  FaArrowRight,
  FaLightbulb,
  FaEllipsisV,
  FaMapPin,
  FaEnvelope,
  FaPhone,
  FaCode,
  FaFilePdf,
  FaExternalLinkAlt,
  FaTimes
} from "react-icons/fa";


function Resume() {
  const email = localStorage.getItem("email");
  const username = localStorage.getItem("username") || "Candidate";
  const role = localStorage.getItem("role") || "Candidate";

  const [resumeData, setResumeData] = useState(null);
  const [atsReport, setAtsReport] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // State to toggle the PDF Overlay
  const [showPdfOverlay, setShowPdfOverlay] = useState(false);
  
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadResume();
  }, []);

  const loadResume = async () => {
    setLoading(true);
    try {
      const resumeRes = await API.get(`/resumes/${email}`);
      if (resumeRes.data && Object.keys(resumeRes.data).length > 0) {
        setResumeData(resumeRes.data);
      } else {
        setResumeData(null);
      }

      try {
        const screeningRes = await API.get(`/resumes/screening/${email}`);
        if (screeningRes.data && screeningRes.data.atsScore !== undefined) {
          setAtsReport(screeningRes.data);
        }
      } catch (e) {
        setAtsReport(null);
      }
    } catch (error) {
      console.log("Error loading resume data:", error);
      setResumeData(null);
    } finally {
      setLoading(false);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current.click();
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("email", email);
    formData.append("file", file);

    try {
      await API.post("/resumes/upload", formData);
      alert("Resume Uploaded Successfully");
      loadResume();
    } catch (error) {
      console.log("Upload Error:", error);
      alert("Upload Failed");
    }
  };

  const handleDeleteResume = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this resume?");
    if (!confirmDelete) return;

    try {
      await API.delete(`/resumes/${email}`);
      setResumeData(null);
      setAtsReport(null);
      setShowPdfOverlay(false); // Close overlay if open
      alert("Resume Deleted Successfully");
    } catch (error) {
      console.log("Delete Error:", error);
      alert("Resume Delete Failed");
    }
  };

  const getAtsScore = () => atsReport?.atsScore || 0;
  const getSkills = () => resumeData?.skills || atsReport?.candidateSkills || [];
  const getResumeName = () => resumeData?.resumeName || "No file uploaded";
  const getUploadDate = () => resumeData?.uploadedAt ? new Date(resumeData.uploadedAt).toLocaleDateString() : "N/A";
  
  // ==========================================
  // SEPARATE URLS FOR VIEWING AND DOWNLOADING
  // ==========================================
  const getViewUrl = () => `http://localhost:8000/resumes/view/${email}`;   // For Preview / Overlay
  const getDownloadUrl = () => `http://localhost:8000/resumes/download/${email}`; // For Download Button

  // ==========================================
  // VIEW PDF (Shows the Overlay - NEVER downloads)
  // ==========================================
  const handleViewPdf = () => {
    if (!resumeData) {
      alert("No resume found to view.");
      return;
    }
    setShowPdfOverlay(true);
  };

  // ==========================================
  // CLOSE PDF OVERLAY
  // ==========================================
  const handleClosePdfOverlay = () => {
    setShowPdfOverlay(false);
  };

  // ==========================================
  // DOWNLOAD PDF (ALWAYS downloads immediately)
  // ==========================================
  const handleDownloadPdf = () => {
    if (!resumeData) {
      alert("No resume to download.");
      return;
    }
    
    const pdfUrl = getDownloadUrl();
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = getResumeName();
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- CALCULATE PROFILE COMPLETENESS ---
  const completionItems = [
    { label: "Resume File Uploaded", done: !!resumeData },
    { label: "Skills Extracted", done: getSkills().length > 0 },
    { label: "ATS Score Generated", done: (atsReport?.atsScore || 0) > 0 },
  ];
  const completedCount = completionItems.filter(i => i.done).length;
  const completionPercent = Math.round((completedCount / completionItems.length) * 100);

  const atsScore = getAtsScore();
  const skills = getSkills();

  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (atsScore / 100) * circumference;

  return (
    <DashboardLayout>
      <div className="cand-res-page">
        
        {/* TOP HEADER REMOVED - ONLY BUTTONS REMAIN */}
        <div className="cand-res-header-actions-only">
          <div className="cand-res-actions">
            <button className="cand-res-btn-preview" onClick={handleViewPdf}>
              <FaEye /> Preview
            </button>
            <button className="cand-res-btn-edit" onClick={triggerFileUpload}>
              <FaUpload /> Upload Resume
            </button>
          </div>
          <input type="file" ref={fileInputRef} onChange={handleUpload} style={{ display: 'none' }} />
        </div>

        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Loading resume data...</div>
        ) : (
          <>
            {/* STATS ROW */}
            <div className="cand-res-stats-row">
              <div className="cand-res-stat-card">
                <div className="cand-res-stat-content-wide">
                  <h4>Resume Strength</h4>
                  <div className="cand-res-ring-container">
                    <div className="cand-res-ring-chart">
                      <svg width="100" height="100">
                        <circle className="cand-res-ring-bg" cx="50" cy="50" r={radius} />
                        <circle 
                          className="cand-res-ring-progress" 
                          cx="50" cy="50" r={radius} 
                          strokeDasharray={circumference} 
                          strokeDashoffset={strokeDashoffset} 
                        />
                      </svg>
                      <div className="cand-res-ring-text">
                        <span>{atsScore}%</span>
                        <span>{atsScore >= 80 ? 'Excellent' : atsScore >= 50 ? 'Good' : 'Needs Work'}</span>
                      </div>
                    </div>
                    <div className="cand-res-ring-info">
                      <h5>{atsScore >= 80 ? 'Great job! Your resume is strong.' : 'Keep improving your resume.'}</h5>
                      <p className="cand-res-link">View suggestions <FaArrowRight style={{ fontSize: '10px' }} /></p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="cand-res-stat-card">
                <div className="cand-res-stat-content">
                  <h4>Profile Completeness</h4>
                  <div className="cand-res-simple-progress">
                    <h2>{completionPercent}%</h2>
                    <div className="cand-res-progress-bar-bg">
                      <div className="cand-res-progress-bar-fill" style={{ width: `${completionPercent}%` }}></div>
                    </div>
                  </div>
                  <div className="cand-res-checklist">
                    {completionItems.map((item, idx) => (
                      <p key={idx}>
                        <FaCheckCircle className={item.done ? "icon-check" : "icon-check-gray"} /> 
                        {item.label}
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              <div className="cand-res-stat-card">
                <div className="cand-res-stat-content wide-layout">
                  <div className="icon-wrapper purple"><FaCalendarAlt /></div>
                  <div>
                    <h4>Last Updated</h4>
                    <h2>{getUploadDate()}</h2>
                    <p>{resumeData ? "Recently updated" : "Not uploaded"}</p>
                  </div>
                </div>
              </div>

              <div className="cand-res-stat-card">
                <div className="cand-res-stat-content wide-layout">
                  <div className="icon-wrapper orange"><FaStar /></div>
                  <div>
                    <h4>AI Review</h4>
                    <h2>{atsScore > 0 ? "Reviewed" : "Pending"}</h2>
                    <p>{atsScore > 0 ? `Score: ${atsScore}%` : "Upload resume for review"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* MAIN GRID */}
            <div className="cand-res-grid">
              
              {/* LEFT COLUMN */}
              <div className="cand-res-left-col">
                <div className="cand-res-card">
                  
                  <div className="cand-res-preview-header">
                    <div>
                      <h3>{username}</h3>
                      <h4 className="role-title">{role}</h4>
                    </div>
                    <div className="cand-res-preview-actions">
                      <button className="btn-outline" onClick={handleDownloadPdf}>
                        <FaDownload /> Download
                      </button>
                      {resumeData && (
                        <button className="btn-outline" onClick={handleDeleteResume} style={{ color: '#ef4444', borderColor: '#fecaca' }}>
                          <FaEllipsisV /> Delete
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="cand-res-preview-contact">
                    <span><FaMapPin /> Location not set</span>
                    <span><FaEnvelope /> {email}</span>
                    <span><FaPhone /> Phone not set</span>
                    <span><FaCode /> LinkedIn not set</span>
                  </div>

                  <hr className="section-divider" />

                  {/* DEFAULT RESUME CONTENT CARD */}
                  <div className="cand-res-section-title">
                    <FaFilePdf /> RESUME CONTENT
                  </div>
                  
                  <div className="cand-res-view-resume-card">
                    <div className="cand-res-view-resume-icon">
                      <FaFilePdf />
                    </div>
                    <div className="cand-res-view-resume-info">
                      <h4>{getResumeName()}</h4>
                      <p>Uploaded on {getUploadDate()}</p>
                    </div>
                    <button className="cand-res-view-btn" onClick={handleViewPdf}>
                      View Full Resume <FaExternalLinkAlt />
                    </button>
                  </div>

                  <div className="cand-res-section-title"><FaCode /> SKILLS</div>
                  <div className="cand-res-skills-tags">
                    {skills.length > 0 ? (
                      skills.map((skill, i) => <span key={i} className="cand-res-skill-tag">{skill}</span>)
                    ) : (
                      <p style={{ fontSize: '13px', color: '#718096' }}>Upload a resume to extract your skills.</p>
                    )}
                  </div>

                </div>
              </div>

              {/* RIGHT COLUMN (Sidebar) */}
              <div className="cand-res-sidebar">
                <div className="cand-res-sidebar-card">
                  <div className="cand-res-sidebar-header">
                    <h4>Resume Tools</h4>
                  </div>
                  <div className="cand-res-tool-item">
                    <div className="cand-res-tool-icon purple"><FaRobot /></div>
                    <div className="cand-res-tool-text">
                      <h5>AI Resume Review</h5>
                      <p>Get AI-powered feedback to improve your resume</p>
                    </div>
                    <FaArrowRight className="arrow-icon" />
                  </div>
                  <div className="cand-res-tool-item">
                    <div className="cand-res-tool-icon blue"><FaFilePdf /></div>
                    <div className="cand-res-tool-text">
                      <h5>Resume Templates</h5>
                      <p>Choose from professional ATS-friendly templates</p>
                    </div>
                    <FaArrowRight className="arrow-icon" />
                  </div>
                  <div className="cand-res-tool-item">
                    <div className="cand-res-tool-icon green"><FaCheckCircle /></div>
                    <div className="cand-res-tool-text">
                      <h5>ATS Score Checker</h5>
                      <p>Check if your resume passes ATS systems</p>
                    </div>
                    <FaArrowRight className="arrow-icon" />
                  </div>
                  <div className="cand-res-tool-item border-none">
                    <div className="cand-res-tool-icon blue-light"><FaUser /></div>
                    <div className="cand-res-tool-text">
                      <h5>Keywords Optimizer</h5>
                      <p>Optimize your resume with job-specific keywords</p>
                    </div>
                    <FaArrowRight className="arrow-icon" />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ==========================================
          FULL PAGE PDF OVERLAY
          Uses the NEW /view/ endpoint so it NEVER downloads
      ========================================== */}
      {showPdfOverlay && (
        <div className="cand-res-pdf-overlay">
          <div className="cand-res-pdf-modal">
            
            <div className="cand-res-pdf-header">
              <h4 className="pdf-title"><FaFilePdf /> {getResumeName()}</h4>
              <button className="btn-close-pdf" onClick={handleClosePdfOverlay}>
                <FaTimes /> Close
              </button>
            </div>
            
            <div className="cand-res-pdf-iframe-wrapper">
              <iframe 
                src={`${getViewUrl()}#toolbar=0`} /* <--- THIS NOW USES getViewUrl() */
                type="application/pdf"
                className="cand-res-pdf-iframe"
              >
                <p>Your browser does not support PDFs. <a href={getViewUrl()} target="_blank" rel="noreferrer">View the PDF</a>.</p>
              </iframe>
            </div>

          </div>
        </div>
      )}

    </DashboardLayout>
  );
}

export default Resume;