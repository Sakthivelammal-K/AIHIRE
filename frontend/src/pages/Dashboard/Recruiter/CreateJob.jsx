import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../api/api";

import {
  FaPlus,
  FaBriefcase,
  FaBuilding,
  FaMapMarkerAlt,
  FaSpinner,
  FaArrowLeft,
  FaCheckCircle,
  FaCrown,
  FaLinkedin,
  FaGlobe,
  FaUsers,
  FaCalendarAlt,
  FaDollarSign,
  FaLightbulb,
  FaTimesCircle,
  FaInfoCircle,
  FaSave,
  FaTimes
} from "react-icons/fa";

function CreateJob() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [draftSaving, setDraftSaving] = useState(false);
  
  // --- State ---
  const [formData, setFormData] = useState({
    title: "",
    department: "",
    employmentType: "Full Time",
    experienceLevel: "Mid Level (2-5 years)",
    location: "",
    workMode: "Hybrid",
    summary: "",
    description: "",
    minExperience: "",
    maxExperience: "",
    minSalary: "",
    maxSalary: "",
    applicationDeadline: "",
    openings: "",
    benefits: ""
  });

  // 🟢 NEW STATES FOR JOB TEMPLATES
  const [jobTemplates, setJobTemplates] = useState([]);
  const [showTemplateDropdown, setShowTemplateDropdown] = useState(false);
  const [loadingTemplates, setLoadingTemplates] = useState(false);

  // NEW SKILL STATES
  const [skillArray, setSkillArray] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [initialFormData, setInitialFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isDirty, setIsDirty] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const myEmail = localStorage.getItem("email");

  // Store initial form data on mount
  useEffect(() => {
    setInitialFormData({ ...formData });
  }, []);

  // Check if form is dirty whenever formData changes
  useEffect(() => {
    if (hasInteracted) {
      const isFormDirty = Object.keys(formData).some(key => {
        if (key === 'skills') {
          // We compare arrays deeply instead of strings
          return JSON.stringify(skillArray) !== JSON.stringify(initialFormData.skills || []);
        }
        return formData[key] !== initialFormData[key];
      });
      setIsDirty(isFormDirty);
    }
  }, [formData, skillArray, initialFormData, hasInteracted]);

  // 🟢 NEW: FETCH JOB TEMPLATES
  const loadJobTemplates = async () => {
    if (jobTemplates.length > 0) {
      setShowTemplateDropdown(!showTemplateDropdown);
      return;
    }
    
    setLoadingTemplates(true);
    try {
      // Only fetch templates with type="job"
      const response = await API.get(`/templates?recruiter_email=${myEmail}&type=job`);
      if (response.data && response.data.length > 0) {
        setJobTemplates(response.data);
      } else {
        alert("No job templates found. Go to Templates page to create one.");
      }
    } catch (error) {
      console.log("Error loading job templates:", error);
      alert("Failed to load job templates.");
    } finally {
      setLoadingTemplates(false);
      setShowTemplateDropdown(true);
    }
  };

  // 🟢 NEW: APPLY TEMPLATE TO FORM (ALL FIELDS INCLUDED)
  const applyJobTemplate = (template) => {
    setFormData({
      ...formData,
      title: template.jobTitle || "",
      department: template.department || "",
      employmentType: template.employmentType || "Full Time",
      experienceLevel: template.experienceLevel || "Mid Level (2-5 years)",
      location: template.location || "",
      workMode: template.workMode || "Hybrid",
      summary: template.summary || "",
      description: template.description || "",
      minExperience: template.minExperience || "",
      maxExperience: template.maxExperience || "",
      minSalary: template.minSalary || "",
      maxSalary: template.maxSalary || "",
      applicationDeadline: template.applicationDeadline || "",
      openings: template.openings || "",
      benefits: template.benefits || ""
    });

    // Auto-fill skills if they exist in the template
    if (template.requirements && Array.isArray(template.requirements) && template.requirements.length > 0) {
      setSkillArray(template.requirements);
    } else {
      setSkillArray([]);
    }

    setShowTemplateDropdown(false);
    setHasInteracted(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (!hasInteracted) setHasInteracted(true);
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
    if (errorMessage) setErrorMessage("");
  };

  // --- CAPITALIZE HELPER ---
  const capitalize = (str) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  // --- NEW SKILL HANDLERS ---
  const handleAddSkill = (e) => {
    e.preventDefault(); // Prevent form submission on Enter key
    const trimmed = newSkill.trim();
    if (trimmed && !skillArray.includes(trimmed)) {
      setSkillArray([...skillArray, trimmed]);
      setNewSkill("");
      if (!hasInteracted) setHasInteracted(true);
      if (errors.skills) setErrors(prev => ({ ...prev, skills: "" }));
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkillArray(skillArray.filter(s => s !== skillToRemove));
    setHasInteracted(true);
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAddSkill(e);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Job title is required";
    if (!formData.department.trim()) newErrors.department = "Department is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.summary.trim()) newErrors.summary = "Job summary is required";
    if (!formData.description.trim()) newErrors.description = "Job description is required";
    if (skillArray.length === 0) newErrors.skills = "At least one skill is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrorMessage("");
    
    // Prepare job object using skillArray for skills
    const job = {
      title: formData.title,
      department: formData.department,
      employmentType: formData.employmentType,
      experienceLevel: formData.experienceLevel,
      location: formData.location,
      workMode: formData.workMode,
      summary: formData.summary,
      description: formData.description,
      requiredSkills: skillArray, // Send the clean array directly
      minExperience: formData.minExperience || null,
      maxExperience: formData.maxExperience || null,
      minSalary: formData.minSalary || null,
      maxSalary: formData.maxSalary || null,
      applicationDeadline: formData.applicationDeadline || null,
      openings: formData.openings || null,
      benefits: formData.benefits || null,
      status: "Active"
    };

    try {
      await API.post("/jobs/create", job);
      setSuccess(true);
      setIsDirty(false);
      setTimeout(() => navigate("/recruiter/jobs"), 1500);
    } catch (error) {
      console.error("Error creating job:", error);
      setErrorMessage(error.response?.data?.message || "Failed to create job. Please try again.");
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = async () => {
    setDraftSaving(true);
    setErrorMessage("");
    
    const job = {
      title: formData.title || "Draft Job",
      department: formData.department || "Uncategorized",
      employmentType: formData.employmentType,
      experienceLevel: formData.experienceLevel,
      location: formData.location || "Remote",
      workMode: formData.workMode,
      summary: formData.summary || "",
      description: formData.description || "",
      requiredSkills: skillArray, // Clean array
      minExperience: formData.minExperience || null,
      maxExperience: formData.maxExperience || null,
      minSalary: formData.minSalary || null,
      maxSalary: formData.maxSalary || null,
      applicationDeadline: formData.applicationDeadline || null,
      openings: formData.openings || null,
      benefits: formData.benefits || null,
      status: "Draft"
    };

    try {
      await API.post("/jobs/create", job);
      alert("Job saved as draft successfully!");
      setIsDirty(false);
      navigate("/recruiter/jobs");
    } catch (error) {
      console.error("Error saving draft:", error);
      setErrorMessage("Failed to save draft. Please try again.");
    } finally {
      setDraftSaving(false);
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      if (window.confirm("You have unsaved changes. Are you sure you want to leave?")) {
        navigate("/recruiter/jobs");
      }
    } else {
      navigate("/recruiter/jobs");
    }
  };

  const handleBack = () => {
    if (isDirty) {
      if (window.confirm("You have unsaved changes. Are you sure you want to leave?")) {
        navigate("/recruiter/jobs");
      }
    } else {
      navigate("/recruiter/jobs");
    }
  };

  // Handle browser back/refresh with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = "You have unsaved changes. Are you sure you want to leave?";
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  return (
    <DashboardLayout>
      <div className="job-create-page-new">
        {/* Back Button */}
        <button className="job-back-new" onClick={handleBack}>
          <FaArrowLeft /> Back to Jobs
        </button>

        {/* Success Message */}
        {success && (
          <div className="job-success-new">
            <FaCheckCircle /> Job Created Successfully! Redirecting...
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="job-error-new-banner">
            <FaTimesCircle /> {errorMessage}
          </div>
        )}

        {/* Main Grid */}
        <div className="job-create-grid-new">
          {/* Form */}
          <form className="job-create-form-new" onSubmit={handleSubmit}>
            
            {/* 🟢 POLISHED TEMPLATE LOADER SECTION */}
            <div style={{ marginBottom: '24px', display: 'flex', gap: '12px', alignItems: 'center', position: 'relative', flexWrap: 'wrap' }}>
              <button 
                type="button" 
                onClick={loadJobTemplates}
                style={{
                  padding: '10px 20px',
                  background: '#F3F4F6',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontWeight: '500',
                  color: '#374151',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.background = '#E5E7EB'}
                onMouseLeave={(e) => e.target.style.background = '#F3F4F6'}
              >
                <FaBriefcase /> 
                {loadingTemplates ? <FaSpinner className="spin" /> : "Load Job Template"}
              </button>

              <span style={{ fontSize: '13px', color: '#9CA3AF' }}>
                {jobTemplates.length > 0 && `(${jobTemplates.length} templates available)`}
              </span>

              {/* 🟢 STYLED DROPDOWN */}
              {showTemplateDropdown && jobTemplates.length > 0 && (
                <div style={{
                  position: 'absolute',
                  top: '48px',
                  left: '0',
                  background: 'white',
                  border: '1px solid #E5E7EB',
                  borderRadius: '12px',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                  padding: '8px 0',
                  maxHeight: '260px',
                  overflowY: 'auto',
                  zIndex: 100,
                  minWidth: '300px',
                }}>
                  {jobTemplates.map(t => (
                    <div 
                      key={t._id} 
                      onClick={() => applyJobTemplate(t)}
                      style={{
                        padding: '10px 16px',
                        cursor: 'pointer',
                        borderBottom: '1px solid #F3F4F6',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2px'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#FFF7ED'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <div style={{ fontWeight: '600', fontSize: '14px', color: '#111827' }}>{t.name}</div>
                      <div style={{ fontSize: '12px', color: '#6B7280', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <FaBriefcase style={{ fontSize: '10px' }} /> {t.jobTitle}
                      </div>
                    </div>
                  ))}
                  <div 
                    onClick={() => setShowTemplateDropdown(false)}
                    style={{
                      padding: '10px 16px',
                      cursor: 'pointer',
                      color: '#ef4444',
                      textAlign: 'center',
                      fontWeight: '500',
                      borderTop: '1px solid #F3F4F6',
                      fontSize: '13px'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = '#FEE2E2'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <FaTimes style={{ fontSize: '12px', marginRight: '6px' }} /> Close
                  </div>
                </div>
              )}
            </div>

            {/* Section 1: Job Information */}
            <div className="job-section-new">
              <h3>1. Job Information</h3>
              
              <div className="job-form-row-new">
                <div className="job-form-group-new">
                  <label>Job Title <span className="required">*</span></label>
                  <input 
                    name="title" 
                    value={formData.title} 
                    onChange={handleChange} 
                    placeholder="e.g. Senior Software Engineer" 
                    className={errors.title ? 'input-error' : ''}
                  />
                  {errors.title && <span className="job-error-new">{errors.title}</span>}
                </div>
                <div className="job-form-group-new">
                  <label>Department <span className="required">*</span></label>
                  <input 
                    name="department" 
                    value={formData.department} 
                    onChange={handleChange} 
                    placeholder="e.g. Engineering, Marketing" 
                    className={errors.department ? 'input-error' : ''}
                  />
                  {errors.department && <span className="job-error-new">{errors.department}</span>}
                </div>
              </div>

              <div className="job-form-row-new">
                <div className="job-form-group-new">
                  <label>Employment Type</label>
                  <select 
                    name="employmentType" 
                    value={formData.employmentType} 
                    onChange={handleChange}
                  >
                    <option>Full Time</option>
                    <option>Part Time</option>
                    <option>Contract</option>
                    <option>Internship</option>
                    <option>Freelance</option>
                  </select>
                </div>
                <div className="job-form-group-new">
                  <label>Experience Level</label>
                  <select 
                    name="experienceLevel" 
                    value={formData.experienceLevel} 
                    onChange={handleChange}
                  >
                    <option>Entry Level</option>
                    <option>Mid Level (2-5 years)</option>
                    <option>Senior Level</option>
                    <option>Lead</option>
                    <option>Manager</option>
                  </select>
                </div>
              </div>

              <div className="job-form-row-new">
                <div className="job-form-group-new">
                  <label>Location <span className="required">*</span></label>
                  <input 
                    name="location" 
                    value={formData.location} 
                    onChange={handleChange} 
                    placeholder="e.g. San Francisco, CA" 
                    className={errors.location ? 'input-error' : ''}
                  />
                  {errors.location && <span className="job-error-new">{errors.location}</span>}
                </div>
                <div className="job-form-group-new">
                  <label>Work Mode</label>
                  <select 
                    name="workMode" 
                    value={formData.workMode} 
                    onChange={handleChange}
                  >
                    <option>Hybrid</option>
                    <option>Remote</option>
                    <option>On-site</option>
                  </select>
                </div>
              </div>

              <div className="job-form-group-new">
                <label>Job Summary <span className="required">*</span></label>
                <textarea 
                  name="summary" 
                  value={formData.summary} 
                  onChange={handleChange} 
                  rows="3" 
                  placeholder="Brief description of the role..." 
                  className={errors.summary ? 'input-error' : ''}
                />
                {errors.summary && <span className="job-error-new">{errors.summary}</span>}
              </div>

              <div className="job-form-group-new">
                <label>Job Description <span className="required">*</span></label>
                <textarea 
                  name="description" 
                  value={formData.description} 
                  onChange={handleChange} 
                  rows="6" 
                  placeholder="Detailed description of responsibilities..." 
                  className={errors.description ? 'input-error' : ''}
                />
                {errors.description && <span className="job-error-new">{errors.description}</span>}
                <span className="char-count">{formData.description.length} characters</span>
              </div>

              {/* --- SKILLS SECTION WITH ADD BUTTON --- */}
              <div className="job-form-group-new">
                <label>Skills <span className="required">*</span></label>
                
                {/* Input + Add Button */}
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <input 
                      placeholder="Type a skill and click Add..." 
                      value={newSkill} 
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyDown={handleSkillKeyDown}
                      className={errors.skills ? 'input-error' : ''}
                    />
                  </div>
                  <button 
                    type="button" 
                    onClick={handleAddSkill}
                    style={{
                      padding: '10px 16px',
                      background: '#e67e22',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontWeight: '500',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <FaPlus /> Add Skill
                  </button>
                </div>

                {/* Error Message */}
                {errors.skills && <span className="job-error-new">{errors.skills}</span>}

                {/* Skills Chip Container - CAPITALIZED + IMPROVED REMOVE BUTTON */}
                <div className="job-skills-preview-new" style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {skillArray.map((s, i) => (
                    <span 
                      key={i} 
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: '#fdf2e9',
                        color: '#e67e22',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '13px',
                        fontWeight: '500'
                      }}
                    >
                      {capitalize(s)} {/* <--- CAPITALIZED HERE */}
                      <button 
                        type="button" 
                        onClick={() => handleRemoveSkill(s)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#e67e22',
                          cursor: 'pointer',
                          padding: '0 2px',
                          fontSize: '12px',
                          fontWeight: 'bold',
                          transition: 'color 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.color = '#d35400'}
                        onMouseLeave={(e) => e.target.style.color = '#e67e22'}
                      >
                        <FaTimes />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="job-form-row-new">
                <div className="job-form-group-new">
                  <label>Years of Experience</label>
                  <div className="job-experience-new">
                    <input 
                      name="minExperience" 
                      value={formData.minExperience} 
                      onChange={handleChange} 
                      placeholder="Min" 
                      type="number" 
                      min="0"
                    />
                    <span>to</span>
                    <input 
                      name="maxExperience" 
                      value={formData.maxExperience} 
                      onChange={handleChange} 
                      placeholder="Max" 
                      type="number" 
                      min="0"
                    />
                  </div>
                </div>
                <div className="job-form-group-new">
                  <label>Salary Range (Optional)</label>
                  <div className="job-salary-new">
                    <FaDollarSign />
                    <input 
                      name="minSalary" 
                      value={formData.minSalary} 
                      onChange={handleChange} 
                      placeholder="80,000" 
                      type="number"
                    />
                    <span>to</span>
                    <FaDollarSign />
                    <input 
                      name="maxSalary" 
                      value={formData.maxSalary} 
                      onChange={handleChange} 
                      placeholder="120,000" 
                      type="number"
                    />
                  </div>
                </div>
              </div>

              <div className="job-premium-banner-new">
                <FaCrown />
                <div>
                  <h4>Upgrade to Premium</h4>
                  <p>Unlock advanced features and analytics.</p>
                </div>
                <button type="button" onClick={() => navigate('/recruiter/profile')}>Upgrade Now</button>
              </div>
            </div>

            {/* Section 2: Additional Information */}
            <div className="job-section-new">
              <h3>2. Additional Information</h3>
              
              <div className="job-form-row-new">
                <div className="job-form-group-new">
                  <label>Application Deadline</label>
                  <input 
                    name="applicationDeadline" 
                    value={formData.applicationDeadline} 
                    onChange={handleChange} 
                    type="date" 
                  />
                </div>
                <div className="job-form-group-new">
                  <label>Number of Openings</label>
                  <input 
                    name="openings" 
                    value={formData.openings} 
                    onChange={handleChange} 
                    type="number" 
                    placeholder="3" 
                    min="1"
                  />
                </div>
              </div>

              <div className="job-form-group-new">
                <label>Benefits (Optional)</label>
                <input 
                  name="benefits" 
                  value={formData.benefits} 
                  onChange={handleChange} 
                  placeholder="Health Insurance, Remote Work, etc." 
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="job-form-actions-new">
              <button 
                type="button" 
                className="job-cancel-new" 
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="job-draft-new"
                onClick={handleSaveDraft}
                disabled={draftSaving}
              >
                {draftSaving ? <FaSpinner className="spin" /> : <FaSave />}
                {draftSaving ? "Saving..." : "Save as Draft"}
              </button>
              <button 
                type="submit" 
                className="job-publish-new" 
                disabled={loading}
              >
                {loading ? <FaSpinner className="spin" /> : <FaPlus />}
                {loading ? "Creating..." : "Publish Job"}
              </button>
            </div>
          </form>

          {/* Preview Sidebar */}
          <div className="job-preview-sidebar-new">
            <div className="job-preview-card-new">
              <h4>Job Preview</h4>
              
              <div className="job-preview-title-new">
                {formData.title || "Frontend Developer"}
              </div>
              
              <div className="job-preview-meta-new">
                <span>{formData.department || "Engineering"}</span>
                <span>{formData.employmentType || "Full Time"}</span>
                <span>{formData.workMode || "Hybrid"}</span>
                <span>{formData.location || "San Francisco, CA"}</span>
                <span>{formData.experienceLevel || "Mid Level (2-5 years)"}</span>
              </div>

              <div className="job-preview-divider-new" />

              <div className="job-preview-summary-new">
                <strong>Job Summary</strong>
                <p>{formData.summary || "We are looking for a skilled Frontend Developer to build responsive and user-friendly web applications."}</p>
              </div>

              <div className="job-preview-divider-new" />

              <div className="job-preview-skills-new">
                <strong>Key Skills</strong>
                <div className="job-preview-tags-new">
                  {skillArray.slice(0, 6).map((s, i) => (
                    <span key={i} className="job-preview-tag-new">{capitalize(s)}</span>
                  ))}
                  {skillArray.length > 6 && (
                    <span className="job-preview-tag-new more">+{skillArray.length - 6} more</span>
                  )}
                </div>
              </div>

              <div className="job-preview-divider-new" />

              <div className="job-preview-deadline-new">
                <strong>Application Deadline</strong>
                <p>{formData.applicationDeadline ? new Date(formData.applicationDeadline).toLocaleDateString() : "Not set"}</p>
              </div>

              <div className="job-preview-divider-new" />

              <div className="job-preview-channels-new">
                <strong>Job Posting Channels</strong>
                <div className="job-channels-new">
                  <span><FaGlobe /> AIHIRE Career Page</span>
                  <span><FaLinkedin /> LinkedIn</span>
                  <span>Indeed</span>
                  <span>Glassdoor</span>
                  <span>Google for Jobs</span>
                </div>
              </div>

              <div className="job-preview-divider-new" />

              <div className="job-preview-team-new">
                <strong>Hiring Team</strong>
                <div className="job-team-members-new">
                  <FaUsers /> 3 Members
                </div>
              </div>

              <div className="job-preview-divider-new" />

              <div className="job-preview-ai-new">
                <button className="job-ai-assistant-new" type="button">
                  <FaLightbulb /> Job Description Assistant
                </button>
                <button className="job-generate-ai-new" type="button">
                  Generate with AI
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default CreateJob;