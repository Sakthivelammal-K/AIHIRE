import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../../api/api";

import {
  FaUser,
  FaBrain,
  FaCheckCircle,
  FaExclamationTriangle,
  FaChartLine,
  FaSpinner,
  FaArrowLeft,
  FaFileAlt,
  FaUserCheck,
  FaStar,
  FaThumbsUp,
  FaThumbsDown,
  FaLightbulb,
  FaAward,
  FaUserTie,
  FaBriefcase,
  FaEnvelope
} from "react-icons/fa";

function ResumeScreening() {
  const { jobId, email } = useParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [generatingReport, setGeneratingReport] = useState(false);

  useEffect(() => {
    loadAnalysis();
  }, [jobId, email]);

  const loadAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await API.get(`/resumes/report/${jobId}/${email}`);
      console.log("Resume Report :", res.data);
      
      if (res.data && res.data.message) {
        console.warn("Backend says:", res.data.message);
        await generateAndFetchReport();
      } else {
        setCandidate(res.data);
        setLoading(false);
      }
    } catch (error) {
      console.log("Initial fetch error:", error);
      await generateAndFetchReport();
    }
  };

  const generateAndFetchReport = async () => {
    setGeneratingReport(true);
    setError(null);
    try {
      console.log("Triggering /resumes/screen to generate report...");
      
      const screenRes = await API.post("/resumes/screen", {
        email: email,
        jobId: jobId
      });
      
      if (screenRes.data && screenRes.data.message) {
        setError(screenRes.data.message);
        setGeneratingReport(false);
        setLoading(false);
        return;
      }

      console.log("Screening triggered successfully. Waiting 2s for DB...");
      await new Promise(r => setTimeout(r, 2000));
      
      const retryRes = await API.get(`/resumes/report/${jobId}/${email}`);
      
      if (retryRes.data && !retryRes.data.message) {
        setCandidate(retryRes.data);
      } else {
        setError("Report still generating. Please refresh the page in a few seconds.");
      }
    } catch (genError) {
      console.error("Error generating report:", genError);
      setError("Could not generate report. The candidate may not have uploaded a resume.");
    } finally {
      setGeneratingReport(false);
      setLoading(false);
    }
  };

  // --- DOWNLOAD FUNCTION ---
  const handleDownloadReport = async () => {
    if (!candidate) return;
    
    try {
      const res = await API.get(`/resumes/report/${jobId}/${email}`);
      const reportData = res.data;

      const jsonString = JSON.stringify(reportData, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Resume_Report_${candidate.candidateName || email}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading report:", error);
      alert("Failed to download report. Please try again.");
    }
  };

  // --- ULTRA-CLEAN SKILLS PARSER ---
  // This handles ANY weird format your backend throws at it.
  const parseSkillData = (data) => {
    if (!data) return [];
    
    // If it's already a real array, return it as is
    if (Array.isArray(data)) return data;

    // If it's a string, nuke brackets, quotes, and whitespace
    if (typeof data === 'string') {
      // Replace all brackets, square brackets, and single/double quotes
      let cleaned = data.replace(/[\[\]'"“”]/g, '').trim();
      // Split by comma and clean up each part
      return cleaned.split(',').map(s => s.trim()).filter(s => s.length > 0);
    }
    
    return [];
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#10B981';
    if (score >= 60) return '#F59E0B';
    if (score >= 40) return '#F97316';
    return '#EF4444';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent Match';
    if (score >= 60) return 'Good Match';
    if (score >= 40) return 'Average Match';
    return 'Needs Improvement';
  };

  const getRecommendationColor = (recommendation) => {
    if (recommendation?.toLowerCase().includes('highly')) return '#10B981';
    if (recommendation?.toLowerCase().includes('recommend')) return '#F59E0B';
    return '#EF4444';
  };

  const getRecommendationIcon = (recommendation) => {
    if (recommendation?.toLowerCase().includes('highly')) return <FaThumbsUp />;
    if (recommendation?.toLowerCase().includes('recommend')) return <FaUserCheck />;
    return <FaThumbsDown />;
  };

  if (loading || generatingReport) {
    return (
      <DashboardLayout>
        <div className="resume-loading-container">
          <FaSpinner className="loading-spinner" />
          <p>{generatingReport ? "Generating AI screening report..." : "Analyzing resume with AI..."}</p>
          <span className="loading-subtitle">This may take a few moments</span>
        </div>
      </DashboardLayout>
    );
  }

  if (error || !candidate) {
    return (
      <DashboardLayout>
        <div className="resume-error-container">
          <div className="resume-error-icon">
            <FaExclamationTriangle />
          </div>
          <h3>Resume Report Unavailable</h3>
          <p>{error || "We couldn't generate the resume analysis for this candidate."}</p>
          <button className="back-to-candidates-btn" onClick={() => navigate("/recruiter/candidates")}>
            <FaArrowLeft />
            Back to Candidates
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="resume-screening-page">
        {/* TOP ACTIONS */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <button className="back-btn" onClick={() => navigate("/recruiter/candidates")} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#4a5568' }}>
            <FaArrowLeft />
            <span>Back to Candidates</span>
          </button>

          <button 
            className="download-report-btn" 
            onClick={handleDownloadReport}
            style={{ 
              padding: '10px 20px', 
              background: '#e67e22', 
              color: 'white', 
              border: 'none', 
              borderRadius: '6px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              fontSize: '14px', 
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            <FaFileAlt />
            Download Report
          </button>
        </div>

        {/* CANDIDATE PROFILE */}
        <div className="resume-profile-card-enhanced">
          <div className="profile-avatar-large">
            {candidate.email?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="profile-details">
            <h2>{candidate.candidateName || candidate.email || 'Unknown Candidate'}</h2>
            <div className="profile-meta">
              <span className="profile-meta-item">
                <FaBriefcase />
                {candidate.jobTitle || 'N/A'}
              </span>
              <span className="profile-meta-item">
                <FaEnvelope />
                {candidate.email || 'No email'}
              </span>
              <span className="profile-meta-item">
                <FaUserTie />
                {candidate.appliedFor || 'Applied'}
              </span>
            </div>
          </div>
          <div className="ats-score-enhanced" style={{ borderColor: getScoreColor(candidate.atsScore) }}>
            <span className="ats-score-label">ATS Score</span>
            <span className="ats-score-value" style={{ color: getScoreColor(candidate.atsScore) }}>
              {candidate.atsScore || 0}%
            </span>
            <span className="ats-score-badge" style={{ background: getScoreColor(candidate.atsScore) }}>
              {getScoreLabel(candidate.atsScore)}
            </span>
          </div>
        </div>

        <div className="resume-score-section">
          <div className="score-section-header">
            <h3>
              <FaChartLine className="section-icon" />
              Resume Match Score
            </h3>
            <span className="score-percentage">{candidate.atsScore || 0}%</span>
          </div>
          <div className="score-progress-bar">
            <div className="score-progress-fill" style={{ width: `${candidate.atsScore || 0}%`, background: getScoreColor(candidate.atsScore) }} />
          </div>
          <p className="score-description">
            {candidate.atsScore >= 80 
              ? 'Excellent match! This candidate strongly aligns with the job requirements.'
              : candidate.atsScore >= 60
              ? 'Good match. Candidate meets most of the key requirements.'
              : candidate.atsScore >= 40
              ? 'Average match. Candidate meets some requirements but has gaps.'
              : 'Low match. Candidate may not be a good fit for this role.'}
          </p>
        </div>

        {/* SKILLS GRID */}
        <div className="resume-skills-grid">
          <div className="skill-card-enhanced">
            <div className="skill-card-header success">
              <FaCheckCircle />
              <h3>Matched Skills</h3>
              <span className="skill-count">{parseSkillData(candidate.matchedSkills).length}</span>
            </div>
            <div className="skill-chips">
              {parseSkillData(candidate.matchedSkills).length > 0 ? (
                parseSkillData(candidate.matchedSkills).map((skill, index) => (
                  <span key={index} className="skill-chip success-chip-enhanced">{skill}</span>
                ))
              ) : (
                <p className="no-skills">No matched skills found</p>
              )}
            </div>
          </div>

          <div className="skill-card-enhanced">
            <div className="skill-card-header danger">
              <FaExclamationTriangle />
              <h3>Missing Skills</h3>
              <span className="skill-count">{parseSkillData(candidate.missingSkills).length}</span>
            </div>
            <div className="skill-chips">
              {parseSkillData(candidate.missingSkills).length > 0 ? (
                parseSkillData(candidate.missingSkills).map((skill, index) => (
                  <span key={index} className="skill-chip warning-chip-enhanced">{skill}</span>
                ))
              ) : (
                <p className="no-skills success-text">No missing skills - Great match!</p>
              )}
            </div>
          </div>
        </div>

        <div className="resume-details-grid">
          <div className="detail-card-enhanced">
            <h3><FaUser className="section-icon" /> Candidate Skills</h3>
            <div className="skills-list">
              {parseSkillData(candidate.candidateSkills).length > 0 ? (
                parseSkillData(candidate.candidateSkills).map((skill, index) => (
                  <span key={index} className="skill-tag candidate-skill">{skill}</span>
                ))
              ) : (
                <p className="no-skills">No candidate skills listed</p>
              )}
            </div>
          </div>

          <div className="detail-card-enhanced">
            <h3><FaBriefcase className="section-icon" /> Required Skills</h3>
            <div className="skills-list">
              {parseSkillData(candidate.requiredSkills).length > 0 ? (
                parseSkillData(candidate.requiredSkills).map((skill, index) => (
                  <span key={index} className="skill-tag required-skill">{skill}</span>
                ))
              ) : (
                <p className="no-skills">No required skills listed</p>
              )}
            </div>
          </div>
        </div>

        <div className="resume-recommendation" style={{ borderColor: getRecommendationColor(candidate.recommendation), background: `${getRecommendationColor(candidate.recommendation)}10` }}>
          <div className="recommendation-icon" style={{ background: getRecommendationColor(candidate.recommendation), color: 'white' }}>
            {getRecommendationIcon(candidate.recommendation)}
          </div>
          <div className="recommendation-content">
            <h3><FaLightbulb className="recommendation-icon-small" /> AI Recommendation</h3>
            <p className="recommendation-text">{candidate.recommendation || 'No recommendation available'}</p>
          </div>
        </div>

        <div className="resume-actions">
          <button className="action-btn-primary" onClick={() => navigate("/recruiter/candidates")}>
            <FaUserCheck /> Back to Candidates
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default ResumeScreening;