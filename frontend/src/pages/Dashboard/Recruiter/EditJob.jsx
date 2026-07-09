import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import API from "../../../api/api";

import {
  FaArrowLeft,
  FaSpinner,
  FaSave,
  FaCheckCircle,
  FaUsers,
  FaLinkedin,
  FaGlobe,
  FaUser,
  FaClock,
  FaEnvelope,
  FaBriefcase,
  FaBuilding,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaDollarSign,
  FaTimesCircle,
  FaPlus,
  FaTimes
} from "react-icons/fa";

function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [draftSaving, setDraftSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isDirty, setIsDirty] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [initialFormData, setInitialFormData] = useState({});
  
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
    benefits: "",
    status: "Active"
  });

  // --- NEW SKILL STATES ---
  const [skillArray, setSkillArray] = useState([]);
  const [newSkill, setNewSkill] = useState("");

  useEffect(() => {
    loadJob();
  }, [id]);

  // Check if form is dirty whenever formData changes
  useEffect(() => {
    if (hasInteracted && Object.keys(initialFormData).length > 0) {
      const isFormDirty = Object.keys(formData).some(key => {
        if (key === 'skills') {
          // Compare arrays deeply
          return JSON.stringify(skillArray) !== JSON.stringify(initialFormData.skills || []);
        }
        return formData[key] !== initialFormData[key];
      });
      setIsDirty(isFormDirty);
    }
  }, [formData, skillArray, initialFormData, hasInteracted]);

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

  const loadJob = async () => {
    setLoading(true);
    try {
      const response = await API.get("/jobs/");
      const found = response.data.find((item) => item._id === id);
      if (found) {
        setJob(found);
        const newFormData = {
          title: found.title || "",
          department: found.department || "",
          employmentType: found.employmentType || "Full Time",
          experienceLevel: found.experienceLevel || "Mid Level (2-5 years)",
          location: found.location || "",
          workMode: found.workMode || "Hybrid",
          summary: found.summary || "",
          description: found.description || "",
          minExperience: found.minExperience || "",
          maxExperience: found.maxExperience || "",
          minSalary: found.minSalary || "",
          maxSalary: found.maxSalary || "",
          applicationDeadline: found.applicationDeadline || "",
          openings: found.openings || "",
          benefits: found.benefits || "",
          status: found.status || "Active"
        };
        setFormData(newFormData);
        setInitialFormData(newFormData);
        
        // Handle Skills properly: If it's an array, use it directly. If string, split it.
        const skillsData = Array.isArray(found.requiredSkills) 
          ? found.requiredSkills 
          : (found.requiredSkills ? found.requiredSkills.split(',').map(s => s.trim()).filter(Boolean) : []);
        setSkillArray(skillsData);
      }
    } catch (error) {
      console.log(error);
      setErrorMessage("Failed to load job details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (!hasInteracted) setHasInteracted(true);
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

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMessage("");
    try {
      const updatedJob = {
        title: formData.title,
        department: formData.department,
        employmentType: formData.employmentType,
        experienceLevel: formData.experienceLevel,
        location: formData.location,
        workMode: formData.workMode,
        summary: formData.summary,
        description: formData.description,
        requiredSkills: skillArray, // Send clean array
        minExperience: formData.minExperience || null,
        maxExperience: formData.maxExperience || null,
        minSalary: formData.minSalary || null,
        maxSalary: formData.maxSalary || null,
        applicationDeadline: formData.applicationDeadline || null,
        openings: formData.openings || null,
        benefits: formData.benefits || null,
        status: formData.status
      };
      await API.put(`/jobs/${id}`, updatedJob);
      setSuccess(true);
      setIsDirty(false);
      setTimeout(() => navigate("/recruiter/jobs"), 1500);
    } catch (error) {
      console.log(error);
      setErrorMessage(error.response?.data?.message || "Update failed. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveDraft = async () => {
    setDraftSaving(true);
    setErrorMessage("");
    try {
      const updatedJob = {
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
      await API.put(`/jobs/${id}`, updatedJob);
      alert("Job saved as draft successfully!");
      setIsDirty(false);
      navigate("/recruiter/jobs");
    } catch (error) {
      console.log(error);
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

  if (loading) {
    return (
      <DashboardLayout>
        <div className="edit-loading"><FaSpinner className="spin" /> Loading job...</div>
      </DashboardLayout>
    );
  }

  if (!job) {
    return (
      <DashboardLayout>
        <div className="edit-error">Job not found</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="edit-job-page-new">
        {/* Back Button */}
        <button className="edit-back-new" onClick={handleCancel}>
          <FaArrowLeft /> Back to Jobs
        </button>

        {/* Success Message */}
        {success && (
          <div className="edit-success-new">
            <FaCheckCircle /> Job Updated Successfully! Redirecting...
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="edit-error-new-banner">
            <FaTimesCircle /> {errorMessage}
          </div>
        )}

        {/* Main Grid */}
        <div className="edit-grid-new">
          {/* Form */}
          <form className="edit-form-new" onSubmit={handleUpdate}>
            {/* Section 1: Job Information */}
            <div className="edit-section-new">
              <h3>1. Job Information</h3>
              
              <div className="edit-form-row-new">
                <div className="edit-form-group-new">
                  <label>Job Title <span className="required">*</span></label>
                  <input 
                    name="title" 
                    value={formData.title} 
                    onChange={handleChange} 
                    placeholder="Frontend Developer" 
                  />
                </div>
                <div className="edit-form-group-new">
                  <label>Department <span className="required">*</span></label>
                  <input 
                    name="department" 
                    value={formData.department} 
                    onChange={handleChange} 
                    placeholder="Engineering" 
                  />
                </div>
              </div>

              <div className="edit-form-row-new">
                <div className="edit-form-group-new">
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
                <div className="edit-form-group-new">
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

              <div className="edit-form-row-new">
                <div className="edit-form-group-new">
                  <label>Location <span className="required">*</span></label>
                  <input 
                    name="location" 
                    value={formData.location} 
                    onChange={handleChange} 
                    placeholder="San Francisco, California, USA" 
                  />
                </div>
                <div className="edit-form-group-new">
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

              <div className="edit-form-group-new">
                <label>Job Summary <span className="required">*</span></label>
                <textarea 
                  name="summary" 
                  value={formData.summary} 
                  onChange={handleChange} 
                  rows="3" 
                  placeholder="We are looking for a skilled Frontend Developer..." 
                />
              </div>

              <div className="edit-form-group-new">
                <label>Job Description <span className="required">*</span></label>
                <textarea 
                  name="description" 
                  value={formData.description} 
                  onChange={handleChange} 
                  rows="6" 
                  placeholder="As a Frontend Developer, you will be responsible for..." 
                />
              </div>

              {/* --- SKILLS SECTION WITH ADD BUTTON --- */}
              <div className="edit-form-group-new">
                <label>Skills <span className="required">*</span></label>
                
                {/* Input + Add Button - UPDATED FOR RESPONSIVENESS */}
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <input 
                      placeholder="Type a skill and click Add..." 
                      value={newSkill} 
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyDown={handleSkillKeyDown}
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

                {/* Skills Chip Container - CAPITALIZED + IMPROVED REMOVE BUTTON */}
                <div className="edit-skills-preview-new" style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
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

              <div className="edit-form-row-new">
                <div className="edit-form-group-new">
                  <label>Years of Experience</label>
                  <div className="edit-experience-new">
                    <input 
                      name="minExperience" 
                      value={formData.minExperience} 
                      onChange={handleChange} 
                      placeholder="Min" 
                      type="number" 
                    />
                    <span>to</span>
                    <input 
                      name="maxExperience" 
                      value={formData.maxExperience} 
                      onChange={handleChange} 
                      placeholder="Max" 
                      type="number" 
                    />
                  </div>
                </div>
                <div className="edit-form-group-new">
                  <label>Salary Range (Optional)</label>
                  <div className="edit-salary-new">
                    <FaDollarSign />
                    <input 
                      name="minSalary" 
                      value={formData.minSalary} 
                      onChange={handleChange} 
                      placeholder="80,000" 
                    />
                    <span>to</span>
                    <FaDollarSign />
                    <input 
                      name="maxSalary" 
                      value={formData.maxSalary} 
                      onChange={handleChange} 
                      placeholder="120,000" 
                    />
                  </div>
                </div>
              </div>

              <div className="edit-form-row-new">
                <div className="edit-form-group-new">
                  <label>Status</label>
                  <select 
                    name="status" 
                    value={formData.status} 
                    onChange={handleChange}
                  >
                    <option>Active</option>
                    <option>Draft</option>
                    <option>Closed</option>
                    <option>Paused</option>
                  </select>
                </div>
                <div className="edit-form-group-new">
                  <label>Application Deadline</label>
                  <input 
                    name="applicationDeadline" 
                    value={formData.applicationDeadline} 
                    onChange={handleChange} 
                    type="date" 
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Additional Information */}
            <div className="edit-section-new">
              <h3>2. Additional Information</h3>
              
              <div className="edit-form-row-new">
                <div className="edit-form-group-new">
                  <label>Number of Openings</label>
                  <input 
                    name="openings" 
                    value={formData.openings} 
                    onChange={handleChange} 
                    type="number" 
                    placeholder="3" 
                  />
                </div>
                <div className="edit-form-group-new">
                  <label>Benefits (Optional)</label>
                  <input 
                    name="benefits" 
                    value={formData.benefits} 
                    onChange={handleChange} 
                    placeholder="e.g. Health Insurance, Remote Work, etc." 
                  />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="edit-actions-new">
              <button 
                type="button" 
                className="edit-cancel-new" 
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="edit-draft-new"
                onClick={handleSaveDraft}
                disabled={draftSaving}
              >
                {draftSaving ? <FaSpinner className="spin" /> : <FaSave />}
                {draftSaving ? "Saving..." : "Save as Draft"}
              </button>
              <button 
                type="submit" 
                className="edit-update-new" 
                disabled={saving}
              >
                {saving ? <FaSpinner className="spin" /> : <FaSave />}
                {saving ? "Updating..." : "Update Job"}
              </button>
            </div>
          </form>

          {/* Preview Sidebar */}
          <div className="edit-preview-sidebar-new">
            <div className="edit-preview-card-new">
              <h4>Job Preview</h4>
              
              <div className="edit-preview-title-new">
                {formData.title || "Frontend Developer"}
              </div>
              
              <div className="edit-preview-meta-new">
                <span>{formData.department || "Engineering"}</span>
                <span>{formData.employmentType || "Full Time"}</span>
                <span>{formData.workMode || "Hybrid"}</span>
                <span>{formData.location || "San Francisco, California, USA"}</span>
                <span>{formData.experienceLevel || "Mid Level (2-5 years)"}</span>
              </div>

              <div className="edit-preview-divider-new" />

              <div className="edit-preview-summary-new">
                <strong>Job Summary</strong>
                <p>{formData.summary || "We are looking for a skilled Frontend Developer..."}</p>
              </div>

              <div className="edit-preview-divider-new" />

              <div className="edit-preview-skills-new">
                <strong>Key Skills</strong>
                <div className="edit-preview-tags-new">
                  {skillArray.slice(0, 6).map((s, i) => (
                    <span key={i} className="edit-preview-tag-new">{capitalize(s)}</span>
                  ))}
                  {skillArray.length > 6 && (
                    <span className="edit-preview-tag-new more">+{skillArray.length - 6} more</span>
                  )}
                </div>
              </div>

              <div className="edit-preview-divider-new" />

              <div className="edit-preview-channels-new">
                <strong>Job Posting Channels</strong>
                <div className="edit-channels-new">
                  <span><FaGlobe /> AIHIRE Career Page</span>
                  <span><FaLinkedin /> LinkedIn</span>
                  <span>Indeed</span>
                  <span>Glassdoor</span>
                  <span>Google for Jobs</span>
                </div>
              </div>

              <div className="edit-preview-divider-new" />

              <div className="edit-preview-team-new">
                <strong>Hiring Team</strong>
                <div className="edit-team-members-new">
                  <FaUsers /> 3 Members
                </div>
              </div>

              <div className="edit-preview-divider-new" />

              <div className="edit-preview-activity-new">
                <strong>Job Activity</strong>
                <div className="edit-activity-item-new">
                  <FaUser /> <span>Created by</span> <strong>Alex Johnson</strong>
                </div>
                <div className="edit-activity-item-new">
                  <FaClock /> <span>Last updated by</span> <strong>Alex Johnson</strong>
                </div>
                <div className="edit-activity-item-new">
                  <FaCheckCircle /> <span>Status</span> 
                  <span className={`edit-status-badge-new ${formData.status?.toLowerCase()}`}>
                    {formData.status || "Active"}
                  </span>
                </div>
              </div>

              <div className="edit-preview-divider-new" />

              <button className="edit-email-team-new" type="button">
                <FaEnvelope /> Send email to team members
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default EditJob;