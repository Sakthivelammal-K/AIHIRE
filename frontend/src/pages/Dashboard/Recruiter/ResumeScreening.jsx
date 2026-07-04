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

  useEffect(() => {
    loadAnalysis();
  }, [jobId, email]);

  const loadAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await API.get(`/resumes/report/${jobId}/${email}`);
      console.log("Resume Report :", res.data);
      setCandidate(res.data);
    } catch (error) {
      console.log(error);
      setError("Failed to load resume analysis. Please try again.");
      setCandidate(null);
    } finally {
      setLoading(false);
    }
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

  // Loading state
  if (loading) {
    return (
      <DashboardLayout>
        <div className="resume-loading-container">
          <FaSpinner className="loading-spinner" />
          <p>Analyzing resume with AI...</p>
          <span className="loading-subtitle">This may take a few moments</span>
        </div>
      </DashboardLayout>
    );
  }

  // Error state
  if (error || !candidate || candidate.message) {
    return (
      <DashboardLayout>
        <div className="resume-error-container">
          <div className="resume-error-icon">
            <FaExclamationTriangle />
          </div>
          <h3>Resume Report Not Found</h3>
          <p>{error || candidate?.message || "We couldn't find the resume analysis for this candidate."}</p>
          <button className="back-to-candidates-btn" onClick={() => navigate("/candidates")}>
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
        {/* BACK BUTTON */}
        <button className="back-btn" onClick={() => navigate("/candidates")}>
          <FaArrowLeft />
          <span>Back to Candidates</span>
        </button>

        {/* HEADER */}
        <div className="resume-header">
          <div className="resume-header-left">
            <div className="resume-header-icon">
              <FaBrain />
            </div>
            <div>
              <h1>AI Resume Screening</h1>
              <p className="resume-subtitle">AI-powered resume analysis and candidate evaluation</p>
            </div>
          </div>
          <div className="resume-header-right">
            <button className="download-report-btn">
              <FaFileAlt />
              Download Report
            </button>
          </div>
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

        {/* SCORE PROGRESS */}
        <div className="resume-score-section">
          <div className="score-section-header">
            <h3>
              <FaChartLine className="section-icon" />
              Resume Match Score
            </h3>
            <span className="score-percentage">{candidate.atsScore || 0}%</span>
          </div>
          <div className="score-progress-bar">
            <div 
              className="score-progress-fill" 
              style={{ 
                width: `${candidate.atsScore || 0}%`,
                background: getScoreColor(candidate.atsScore)
              }}
            />
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
          {/* Matched Skills */}
          <div className="skill-card-enhanced">
            <div className="skill-card-header success">
              <FaCheckCircle />
              <h3>Matched Skills</h3>
              <span className="skill-count">{candidate.matchedSkills?.length || 0}</span>
            </div>
            <div className="skill-chips">
              {candidate.matchedSkills?.length > 0 ? (
                candidate.matchedSkills.map((skill, index) => (
                  <span key={index} className="skill-chip success-chip-enhanced">
                    {skill}
                  </span>
                ))
              ) : (
                <p className="no-skills">No matched skills found</p>
              )}
            </div>
          </div>

          {/* Missing Skills */}
          <div className="skill-card-enhanced">
            <div className="skill-card-header danger">
              <FaExclamationTriangle />
              <h3>Missing Skills</h3>
              <span className="skill-count">{candidate.missingSkills?.length || 0}</span>
            </div>
            <div className="skill-chips">
              {candidate.missingSkills?.length > 0 ? (
                candidate.missingSkills.map((skill, index) => (
                  <span key={index} className="skill-chip warning-chip-enhanced">
                    {skill}
                  </span>
                ))
              ) : (
                <p className="no-skills success-text">No missing skills - Great match!</p>
              )}
            </div>
          </div>
        </div>

        {/* SKILLS DETAIL */}
        <div className="resume-details-grid">
          <div className="detail-card-enhanced">
            <h3>
              <FaUser className="section-icon" />
              Candidate Skills
            </h3>
            <div className="skills-list">
              {candidate.candidateSkills?.length > 0 ? (
                candidate.candidateSkills.map((skill, index) => (
                  <span key={index} className="skill-tag candidate-skill">
                    {skill}
                  </span>
                ))
              ) : (
                <p className="no-skills">No candidate skills listed</p>
              )}
            </div>
          </div>

          <div className="detail-card-enhanced">
            <h3>
              <FaBriefcase className="section-icon" />
              Required Skills
            </h3>
            <div className="skills-list">
              {candidate.requiredSkills?.length > 0 ? (
                candidate.requiredSkills.map((skill, index) => (
                  <span key={index} className="skill-tag required-skill">
                    {skill}
                  </span>
                ))
              ) : (
                <p className="no-skills">No required skills listed</p>
              )}
            </div>
          </div>
        </div>

        {/* AI RECOMMENDATION */}
        <div className="resume-recommendation" style={{ 
          borderColor: getRecommendationColor(candidate.recommendation),
          background: `${getRecommendationColor(candidate.recommendation)}10`
        }}>
          <div className="recommendation-icon" style={{ 
            background: getRecommendationColor(candidate.recommendation),
            color: 'white'
          }}>
            {getRecommendationIcon(candidate.recommendation)}
          </div>
          <div className="recommendation-content">
            <h3>
              <FaLightbulb className="recommendation-icon-small" />
              AI Recommendation
            </h3>
            <p className="recommendation-text">{candidate.recommendation || 'No recommendation available'}</p>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="resume-actions">
          <button 
            className="action-btn-primary"
            onClick={() => navigate("/candidates")}
          >
            <FaUserCheck />
            Back to Candidates
          </button>
          <button 
            className="action-btn-secondary"
            onClick={() => window.print()}
          >
            <FaFileAlt />
            Print Report
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default ResumeScreening;