import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../api/api";

import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaEdit,
  FaUserTie,
  FaCheckCircle,
  FaBriefcase,
  FaFileAlt,
  FaLinkedin,
  FaUserCheck,
  FaCamera,
  FaCrown,
  FaShieldAlt,
  FaDownload,
  FaTrash,
  FaGithub,
  FaCode,
  FaSave,
  FaSpinner,
  FaEye,
  FaTimesCircle,
  FaGraduationCap,
  FaProjectDiagram,
  FaCertificate,
  FaLanguage,
  FaGlobe,
  FaCalendarAlt,
  FaPlus,
  FaTimes
} from "react-icons/fa";

function CandidateProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [resumeName, setResumeName] = useState("");
  
  // --- DYNAMIC SECTION STATES ---
  const [skills, setSkills] = useState([]);
  const [experience, setExperience] = useState([]);
  const [education, setEducation] = useState([]);
  const [projects, setProjects] = useState([]);
  const [certifications, setCertifications] = useState([]);

  // --- MODE SWITCH & FORM STATE ---
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("Personal Information");
  const [editForm, setEditForm] = useState({ firstName: "", lastName: "", phone: "", location: "", bio: "" });

  // --- MODAL STATES FOR ADD/EDIT ---
  const [editingItem, setEditingItem] = useState(null); // {type: 'experience', index: 0, data: {}}
  const [showItemModal, setShowItemModal] = useState(false);
  const [itemForm, setItemForm] = useState({ title: "", subtitle: "", year: "", description: "", url: "" });

  // --- NEW SKILL INPUT ---
  const [newSkillInput, setNewSkillInput] = useState("");

  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  const email = localStorage.getItem("email");
  const username = localStorage.getItem("username") || "Candidate";
  const role = localStorage.getItem("role") || "Candidate";

  // --- CSS STYLES ---
  const editLayoutStyles = `
    .cand-edit-layout {
      display: flex;
      gap: 25px;
      background: white;
      border-radius: 12px;
      border: 1px solid #eef2f6;
      padding: 0;
      overflow: hidden;
      min-height: 600px;
    }
    .cand-edit-sidebar {
      width: 220px; min-width: 220px; border-right: 1px solid #eef2f6; padding: 20px 0; background: #fafbfc;
    }
    .cand-edit-sidebar h4 { padding: 0 20px 10px 20px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #a0aec0; margin: 0; }
    .cand-edit-sidebar ul { list-style: none; padding: 0 10px; margin: 0; }
    .cand-edit-sidebar li {
      padding: 8px 12px; border-radius: 6px; cursor: pointer; font-size: 14px; color: #4a5568; transition: 0.2s;
      display: flex; align-items: center; gap: 10px;
    }
    .cand-edit-sidebar li:hover { background: #f0f2f5; }
    .cand-edit-sidebar li.active { background: #fdf2e9; color: #e67e22; font-weight: 500; }
    .cand-edit-main { flex: 1; padding: 25px 30px; overflow-y: auto; max-height: 650px; }
    .cand-edit-footer { border-top: 1px solid #eef2f6; padding: 15px 25px; display: flex; justify-content: flex-end; gap: 12px; background: white; }
    .cand-edit-cancel { background: white; border: 1px solid #e2e8f0; padding: 8px 24px; border-radius: 6px; color: #4a5568; cursor: pointer; font-weight: 500; }
    .cand-edit-save { background: #e67e22; border: none; padding: 8px 24px; border-radius: 6px; color: white; cursor: pointer; font-weight: 600; }
    .cand-edit-save:hover { background: #d35400; }

    /* Modal for Adding/Editing Items */
    .cand-item-modal-overlay {
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.5); backdrop-filter: blur(4px);
      display: flex; justify-content: center; align-items: center; z-index: 9999;
    }
    .cand-item-modal-box {
      background: white; border-radius: 16px; padding: 30px; width: 90%; max-width: 500px;
      box-shadow: 0 20px 50px rgba(0,0,0,0.2); position: relative;
    }
    .cand-item-modal-box h3 { margin-top: 0; font-size: 20px; color: #1a202c; }
    .cand-item-modal-box label { display: block; font-size: 13px; font-weight: 600; color: #4a5568; margin-bottom: 6px; margin-top: 12px; }
    .cand-item-modal-box input { width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 14px; outline: none; }
    .cand-item-modal-box .modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; }
    .cand-item-modal-box .btn-close-modal { background: white; border: 1px solid #e2e8f0; padding: 8px 20px; border-radius: 6px; cursor: pointer; }
    .cand-item-modal-box .btn-save-modal { background: #e67e22; border: none; padding: 8px 20px; border-radius: 6px; color: white; cursor: pointer; }

    @media (max-width: 768px) {
      .cand-edit-layout { flex-direction: column; }
      .cand-edit-sidebar { width: 100%; min-width: 100%; border-right: none; border-bottom: 1px solid #eef2f6; }
    }
  `;

  useEffect(() => {
    loadProfileData();
  }, []);

  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = editLayoutStyles;
    document.head.appendChild(styleSheet);
    return () => document.head.removeChild(styleSheet);
  }, []);

  const loadProfileData = async () => {
    setLoading(true);
    setError(null);
    try {
      const profileRes = await API.get(`/users/profile?email=${email}`);
      const pData = profileRes.data || {};
      setUser(pData);
      setPreviewImage(pData?.profileImage || null);
      
      const fullName = (pData?.name || "").split(" ");
      setEditForm({
        firstName: fullName[0] || "", lastName: fullName.slice(1).join(" ") || "",
        phone: pData?.phone || "", location: pData?.location || "",
        bio: pData?.bio || pData?.about || ""
      });

      try {
        const resumeRes = await API.get(`/resumes/${email}`);
        if (resumeRes.data.resumeName) setResumeName(resumeRes.data.resumeName);
      } catch (e) { /* No resume */ }

      try {
        const screenRes = await API.get(`/resumes/screening/${email}`);
        if (screenRes.data && screenRes.data.candidateSkills) {
          // Populate Skills from API
          setSkills(screenRes.data.candidateSkills || []);
          setAnalysis(screenRes.data);
        }
      } catch (e) { /* No screening */ }

      const appRes = await API.get("/applications/");
      const apps = Array.isArray(appRes.data) ? appRes.data : appRes.data.applications || [];
      setApplications(apps.filter(app => app.candidateName === username || app.email === email));

      const intRes = await API.get("/interviews/");
      const allInts = Array.isArray(intRes.data.scheduled) ? intRes.data.scheduled : intRes.data || [];
      setInterviews(allInts.filter(int => int.candidateName === username || int.email === email));

      // --- LOAD LOCAL DATA (Experience, Edu, Projects, Certs) ---
      const loadLocal = (key) => {
        const data = localStorage.getItem(`candidate_${key}_${email}`);
        return data ? JSON.parse(data) : [];
      };
      setExperience(loadLocal('experience'));
      setEducation(loadLocal('education'));
      setProjects(loadLocal('projects'));
      setCertifications(loadLocal('certifications'));

    } catch (err) {
      console.error(err);
      setError("Failed to load profile data.");
    } finally {
      setLoading(false);
    }
  };

  // --- HANDLERS ---
  const triggerFileUpload = () => fileInputRef.current.click();

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
      setProfileImage(file);

      try {
        const imageFormData = new FormData();
        imageFormData.append('email', email);
        imageFormData.append('profileImage', file);
        await API.post("/users/profile-picture", imageFormData, { headers: { 'Content-Type': 'multipart/form-data' } });
        await loadProfileData();
        alert("Profile Picture Updated!");
      } catch (err) {
        console.error(err);
        alert("Failed to update profile picture.");
        setPreviewImage(user?.profileImage || null);
        setProfileImage(null);
      }
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const saveProfile = async () => {
    try {
      const fullName = `${editForm.firstName} ${editForm.lastName}`.trim();
      const textData = {
        email: email,
        name: fullName,
        phone: editForm.phone,
        location: editForm.location,
        about: editForm.bio
      };

      await API.put("/users/profile", textData);

      // --- SAVE ALL LOCAL DATA TO BROWSER ---
      localStorage.setItem(`candidate_skills_${email}`, JSON.stringify(skills));
      localStorage.setItem(`candidate_experience_${email}`, JSON.stringify(experience));
      localStorage.setItem(`candidate_education_${email}`, JSON.stringify(education));
      localStorage.setItem(`candidate_projects_${email}`, JSON.stringify(projects));
      localStorage.setItem(`candidate_certifications_${email}`, JSON.stringify(certifications));

      alert("Profile Updated Successfully");
      setIsEditing(false);
      loadProfileData();
    } catch (err) {
      console.log("Save Error Details:", err.response?.data || err);
      alert(`Update Failed: ${err.response?.data?.detail || "Unknown error"}`);
    }
  };

  const cancelEdit = () => {
    const fullName = (user?.name || "").split(" ");
    setEditForm({
      firstName: fullName[0] || "", lastName: fullName.slice(1).join(" ") || "",
      phone: user?.phone || "", location: user?.location || "",
      bio: user?.bio || user?.about || ""
    });
    setPreviewImage(user?.profileImage || null);
    setProfileImage(null);
    setIsEditing(false);
  };

  // --- SECTION CRUD HANDLERS ---
  const handleAddItem = (type) => {
    setEditingItem({ type, index: -1 });
    setItemForm({ title: "", subtitle: "", year: "", description: "", url: "" });
    setShowItemModal(true);
  };

  const handleEditItem = (type, index, data) => {
    setEditingItem({ type, index });
    setItemForm(data);
    setShowItemModal(true);
  };

  const handleDeleteItem = (type, index) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      if (type === 'skills') setSkills(prev => prev.filter((_, i) => i !== index));
      if (type === 'experience') setExperience(prev => prev.filter((_, i) => i !== index));
      if (type === 'education') setEducation(prev => prev.filter((_, i) => i !== index));
      if (type === 'projects') setProjects(prev => prev.filter((_, i) => i !== index));
      if (type === 'certifications') setCertifications(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSaveItem = () => {
    const { type, index } = editingItem;
    let updatedItems;
    if (type === 'skills') {
      if (index === -1) setSkills(prev => [...prev, itemForm.title]);
      else setSkills(prev => prev.map((item, i) => i === index ? itemForm.title : item));
    } else if (type === 'experience') {
      if (index === -1) setExperience(prev => [...prev, itemForm]);
      else setExperience(prev => prev.map((item, i) => i === index ? itemForm : item));
    } else if (type === 'education') {
      if (index === -1) setEducation(prev => [...prev, itemForm]);
      else setEducation(prev => prev.map((item, i) => i === index ? itemForm : item));
    } else if (type === 'projects') {
      if (index === -1) setProjects(prev => [...prev, itemForm]);
      else setProjects(prev => prev.map((item, i) => i === index ? itemForm : item));
    } else if (type === 'certifications') {
      if (index === -1) setCertifications(prev => [...prev, itemForm]);
      else setCertifications(prev => prev.map((item, i) => i === index ? itemForm : item));
    }
    setShowItemModal(false);
    setEditingItem(null);
  };

  const handleAddSkill = () => {
    if (newSkillInput.trim() !== "") {
      setSkills(prev => [...prev, newSkillInput.trim()]);
      setNewSkillInput("");
    }
  };

  // --- STATS ---
  const atsScore = analysis?.atsScore || 0;
  const totalApps = applications.length;
  const scheduledInterviews = interviews.length;
  const offers = applications.filter(a => a.status === "Offer" || a.status === "Selected").length;
  const profileViews = totalApps * 3 + 50;
  const completionPercent = Math.min(100, 20 + (resumeName ? 20 : 0) + (skills.length > 0 ? 20 : 0) + (user?.name ? 10 : 0) + (user?.bio ? 10 : 0) + (previewImage ? 10 : 0));

  // --- RENDER EDIT TAB CONTENT ---
  const renderEditTabContent = () => {
    switch(activeTab) {
      case "Personal Information":
        return (
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '15px' }}>Personal Information</h3>
            <div className="cand-full-row-2">
              <div className="cand-full-form-group"><label>First Name</label><input type="text" name="firstName" value={editForm.firstName} onChange={handleEditChange} /></div>
              <div className="cand-full-form-group"><label>Last Name</label><input type="text" name="lastName" value={editForm.lastName} onChange={handleEditChange} /></div>
            </div>
            <div className="cand-full-row-2">
              <div className="cand-full-form-group"><label>Email Address</label><input type="text" value={user?.email || ''} disabled style={{ background: '#f8f9fa' }} /></div>
              <div className="cand-full-form-group"><label>Phone Number</label><input type="text" name="phone" value={editForm.phone} onChange={handleEditChange} /></div>
            </div>
            <div className="cand-full-row-2">
              <div className="cand-full-form-group"><label>Location</label><input type="text" name="location" value={editForm.location} onChange={handleEditChange} /></div>
            </div>
          </div>
        );
      case "Professional Summary":
        return (
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '15px' }}>Professional Summary</h3>
            <div className="cand-full-form-group">
              <label>About Me</label>
              <textarea className="cand-full-textarea" name="bio" value={editForm.bio} onChange={handleEditChange} placeholder="Write a short professional summary..." rows={6} />
              <div className="cand-full-char-count">{editForm.bio.length} / 200</div>
            </div>
          </div>
        );
      case "Resume":
        return (
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '15px' }}>Resume</h3>
            {resumeName ? (
              <div>
                <div className="cand-full-resume-box">
                  <FaFileAlt className="cand-full-resume-icon" />
                  <div className="cand-full-resume-info">
                    <h4>{resumeName}</h4>
                    <p>Uploaded • {atsScore > 0 ? `${atsScore}% Match` : 'Not scored'}</p>
                  </div>
                  <span className="cand-full-resume-badge">AI Score: {atsScore}/100</span>
                </div>
                <div className="cand-full-resume-actions">
                  <button><FaDownload /> Download</button>
                  <button className="cand-full-resume-replace-btn" onClick={triggerFileUpload}><FaEdit /> Replace</button>
                  <button style={{ color: '#ef4444' }}><FaTrash /> Delete</button>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px 0', color: '#718096' }}>
                <p>No resume uploaded yet.</p>
                <button onClick={triggerFileUpload} style={{ marginTop: '10px', background: '#e67e22', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '6px', cursor: 'pointer' }}>Upload Resume</button>
              </div>
            )}
          </div>
        );
      case "Skills":
        return (
          <div>
            <div className="cand-full-card-header" style={{ marginBottom: '15px', justifyContent: 'space-between', display: 'flex' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>Skills</h3>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input 
                  type="text" 
                  value={newSkillInput} 
                  onChange={(e) => setNewSkillInput(e.target.value)} 
                  onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                  placeholder="Add a skill..." 
                  style={{ padding: '6px 12px', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '13px', width: '150px' }}
                />
                <button className="action-btn" onClick={handleAddSkill}><FaPlus /> Add</button>
              </div>
            </div>
            <div className="cand-full-tags">
              {skills.length > 0 ? skills.map((s, i) => (
                <span key={i} className="cand-full-chip" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {s}
                  <button onClick={() => handleDeleteItem('skills', i)} style={{ background: 'none', border: 'none', color: '#a0aec0', cursor: 'pointer', fontSize: '12px' }}><FaTimes /></button>
                </span>
              )) : <p style={{ color: '#718096', fontSize: '13px' }}>No skills added yet.</p>}
            </div>
          </div>
        );
      case "Experience":
        return (
          <div>
            <div className="cand-full-card-header" style={{ marginBottom: '15px', justifyContent: 'space-between', display: 'flex' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>Experience</h3>
              <button className="action-btn" onClick={() => handleAddItem('experience')}><FaPlus /> Add Experience</button>
            </div>
            {experience.length > 0 ? experience.map((item, i) => (
              <div key={i} className="cand-full-timeline">
                <div className="cand-full-tl-logo" style={{ background: '#fef3c7', color: '#eab308' }}>{item.subtitle?.charAt(0) || 'E'}</div>
                <div className="cand-full-tl-content" style={{ flex: 1 }}>
                  <h4>{item.title}</h4>
                  <p>{item.subtitle} • {item.year}</p>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                    <button style={{ color: '#e67e22', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px' }} onClick={() => handleEditItem('experience', i, item)}><FaEdit /> Edit</button>
                    <button style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px' }} onClick={() => handleDeleteItem('experience', i)}><FaTrash /> Delete</button>
                  </div>
                </div>
              </div>
            )) : <p style={{ color: '#718096', textAlign: 'center', padding: '20px 0' }}>No experience added yet.</p>}
          </div>
        );
      case "Education":
        return (
          <div>
            <div className="cand-full-card-header" style={{ marginBottom: '15px', justifyContent: 'space-between', display: 'flex' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>Education</h3>
              <button className="action-btn" onClick={() => handleAddItem('education')}><FaPlus /> Add Education</button>
            </div>
            {education.length > 0 ? education.map((item, i) => (
              <div key={i} className="cand-full-timeline">
                <div className="cand-full-tl-logo" style={{ background: '#f3e8ff', color: '#8b5cf6' }}><FaGraduationCap /></div>
                <div className="cand-full-tl-content" style={{ flex: 1 }}>
                  <h4>{item.title}</h4>
                  <p>{item.subtitle} • {item.year}</p>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                    <button style={{ color: '#e67e22', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px' }} onClick={() => handleEditItem('education', i, item)}><FaEdit /> Edit</button>
                    <button style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px' }} onClick={() => handleDeleteItem('education', i)}><FaTrash /> Delete</button>
                  </div>
                </div>
              </div>
            )) : <p style={{ color: '#718096', textAlign: 'center', padding: '20px 0' }}>No education added yet.</p>}
          </div>
        );
      case "Projects":
        return (
          <div>
            <div className="cand-full-card-header" style={{ marginBottom: '15px', justifyContent: 'space-between', display: 'flex' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>Projects</h3>
              <button className="action-btn" onClick={() => handleAddItem('projects')}><FaPlus /> Add Project</button>
            </div>
            {projects.length > 0 ? projects.map((item, i) => (
              <div key={i} className="cand-full-timeline">
                <div className="cand-full-tl-logo" style={{ background: '#eef4ff', color: '#0d6efd' }}><FaCode /></div>
                <div className="cand-full-tl-content" style={{ flex: 1 }}>
                  <h4>{item.title}</h4>
                  <p>{item.subtitle} • {item.year}</p>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                    <button style={{ color: '#e67e22', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px' }} onClick={() => handleEditItem('projects', i, item)}><FaEdit /> Edit</button>
                    <button style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px' }} onClick={() => handleDeleteItem('projects', i)}><FaTrash /> Delete</button>
                  </div>
                </div>
              </div>
            )) : <p style={{ color: '#718096', textAlign: 'center', padding: '20px 0' }}>No projects added yet.</p>}
          </div>
        );
      case "Certifications":
        return (
          <div>
            <div className="cand-full-card-header" style={{ marginBottom: '15px', justifyContent: 'space-between', display: 'flex' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', margin: 0 }}>Certifications</h3>
              <button className="action-btn" onClick={() => handleAddItem('certifications')}><FaPlus /> Add Certification</button>
            </div>
            {certifications.length > 0 ? certifications.map((item, i) => (
              <div key={i} className="cand-full-timeline">
                <div className="cand-full-tl-logo" style={{ background: '#fdf2e9', color: '#e67e22' }}><FaCertificate /></div>
                <div className="cand-full-tl-content" style={{ flex: 1 }}>
                  <h4>{item.title}</h4>
                  <p>{item.subtitle} • {item.year}</p>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                    <button style={{ color: '#e67e22', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px' }} onClick={() => handleEditItem('certifications', i, item)}><FaEdit /> Edit</button>
                    <button style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px' }} onClick={() => handleDeleteItem('certifications', i)}><FaTrash /> Delete</button>
                  </div>
                </div>
              </div>
            )) : <p style={{ color: '#718096', textAlign: 'center', padding: '20px 0' }}>No certifications added yet.</p>}
          </div>
        );
      default:
        return <div style={{ padding: '30px', textAlign: 'center', color: '#718096' }}>Section content placeholder</div>;
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="cand-full-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <FaSpinner className="spin" style={{ fontSize: '36px', color: '#e67e22' }} />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="cand-full-page" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <FaTimesCircle style={{ fontSize: '40px', color: '#ef4444', marginBottom: '15px' }} />
          <p style={{ color: '#718096' }}>{error}</p>
          <button onClick={loadProfileData} style={{ marginTop: '10px', padding: '8px 20px', background: '#e67e22', color: 'white', border: 'none', borderRadius: '6px' }}>Retry</button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="cand-full-page">

        {/* MAIN GRID */}
        <div className="cand-full-grid">
          
          {/* LEFT COLUMN - VIEW MODE */}
          {!isEditing && (
            <div className="cand-full-left-col">
              
              {/* HERO */}
              <div className="cand-full-card cand-full-hero">
                <div className="cand-full-avatar-box">
                  {previewImage ? <img src={previewImage} alt="Profile" /> : <div className="cand-full-avatar-letter">{username.charAt(0).toUpperCase()}</div>}
                  <div className="cand-full-avatar-edit" onClick={triggerFileUpload}><FaCamera /></div>
                  <input type="file" ref={fileInputRef} className="hidden-file-input" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                </div>
                <div className="cand-full-hero-info">
                  <div className="cand-full-hero-top">
                    <div className="cand-full-name">
                      <h2>{user?.name || username} <FaCheckCircle /></h2>
                      <p>{role}</p>
                    </div>
                    <div className="cand-full-actions">
                      <button className="cand-full-btn-save" onClick={() => setIsEditing(true)}><FaEdit /> Edit Profile</button>
                    </div>
                  </div>
                  <div className="cand-full-contact">
                    <span><FaMapMarkerAlt /> {user?.location || 'Location not set'}</span>
                    <span><FaEnvelope /> {user?.email || 'Email not set'}</span>
                    <span><FaPhone /> {user?.phone || 'Phone not set'}</span>
                  </div>
                  <div className="cand-full-social">
                    <a href="#"><FaLinkedin /> LinkedIn</a>
                    <a href="#"><FaGithub /> GitHub</a>
                  </div>
                  <p className="cand-full-bio">{user?.bio || user?.about || "Passionate candidate with experience in building responsive web applications."}</p>
                </div>
              </div>

              {/* RESUME */}
              <div className="cand-full-card">
                <div className="cand-full-card-header"><h3><FaFileAlt /> Resume</h3></div>
                {resumeName ? <p>{resumeName} • AI Score: {atsScore}/100</p> : <p style={{ color: '#718096' }}>No resume uploaded.</p>}
              </div>

              {/* SKILLS */}
              <div className="cand-full-card">
                <div className="cand-full-card-header"><h3><FaCode /> Skills</h3></div>
                <div className="cand-full-tags">{skills.length > 0 ? skills.map((s, i) => <span key={i} className="cand-full-chip">{s}</span>) : <p>No skills detected.</p>}</div>
              </div>

              {/* EXPERIENCE */}
              <div className="cand-full-card">
                <div className="cand-full-card-header"><h3><FaBriefcase /> Experience</h3></div>
                {experience.length > 0 ? experience.slice(0, 3).map((item, i) => (
                  <div key={i} className="cand-full-timeline">
                    <div className="cand-full-tl-logo" style={{ background: '#fef3c7', color: '#eab308' }}>{item.subtitle?.charAt(0) || 'E'}</div>
                    <div className="cand-full-tl-content">
                      <h4>{item.title}</h4>
                      <p>{item.subtitle} • {item.year}</p>
                    </div>
                  </div>
                )) : <p style={{ color: '#718096' }}>No experience added yet.</p>}
              </div>

              {/* EDUCATION */}
              <div className="cand-full-card">
                <div className="cand-full-card-header"><h3><FaGraduationCap /> Education</h3></div>
                {education.length > 0 ? education.slice(0, 3).map((item, i) => (
                  <div key={i} className="cand-full-timeline">
                    <div className="cand-full-tl-logo" style={{ background: '#f3e8ff', color: '#8b5cf6' }}><FaGraduationCap /></div>
                    <div className="cand-full-tl-content">
                      <h4>{item.title}</h4>
                      <p>{item.subtitle} • {item.year}</p>
                    </div>
                  </div>
                )) : <p style={{ color: '#718096' }}>No education added yet.</p>}
              </div>

              {/* PROJECTS */}
              <div className="cand-full-card">
                <div className="cand-full-card-header"><h3><FaProjectDiagram /> Projects</h3></div>
                {projects.length > 0 ? projects.slice(0, 3).map((item, i) => (
                  <div key={i} className="cand-full-timeline">
                    <div className="cand-full-tl-logo" style={{ background: '#eef4ff', color: '#0d6efd' }}><FaCode /></div>
                    <div className="cand-full-tl-content">
                      <h4>{item.title}</h4>
                      <p>{item.subtitle} • {item.year}</p>
                    </div>
                  </div>
                )) : <p style={{ color: '#718096' }}>No projects added yet.</p>}
              </div>

              {/* CERTIFICATIONS */}
              <div className="cand-full-card">
                <div className="cand-full-card-header"><h3><FaCertificate /> Certifications</h3></div>
                {certifications.length > 0 ? certifications.slice(0, 3).map((item, i) => (
                  <div key={i} className="cand-full-timeline">
                    <div className="cand-full-tl-logo" style={{ background: '#fdf2e9', color: '#e67e22' }}><FaCertificate /></div>
                    <div className="cand-full-tl-content">
                      <h4>{item.title}</h4>
                      <p>{item.subtitle} • {item.year}</p>
                    </div>
                  </div>
                )) : <p style={{ color: '#718096' }}>No certifications added yet.</p>}
              </div>
            </div>
          )}

          {/* LEFT COLUMN - EDIT MODE */}
          {isEditing && (
            <div className="cand-full-left-col">
              <div className="cand-edit-layout">
                <div className="cand-edit-sidebar">
                  <h4>Sections</h4>
                  <ul>
                    {['Personal Information', 'Professional Summary', 'Resume', 'Skills', 'Experience', 'Education', 'Projects', 'Certifications'].map((tab) => (
                      <li 
                        key={tab} 
                        className={activeTab === tab ? 'active' : ''} 
                        onClick={() => setActiveTab(tab)}
                      >
                        {tab === 'Personal Information' && <FaUser />}
                        {tab === 'Professional Summary' && <FaEdit />}
                        {tab === 'Resume' && <FaFileAlt />}
                        {tab === 'Skills' && <FaCode />}
                        {tab === 'Experience' && <FaBriefcase />}
                        {tab === 'Education' && <FaGraduationCap />}
                        {tab === 'Projects' && <FaProjectDiagram />}
                        {tab === 'Certifications' && <FaCertificate />}
                        {tab}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="cand-edit-main">
                  {renderEditTabContent()}
                </div>
              </div>

              <div className="cand-edit-footer">
                <button className="cand-edit-cancel" onClick={cancelEdit}>Cancel</button>
                <button className="cand-edit-save" onClick={saveProfile}>Save Changes</button>
              </div>
            </div>
          )}

          {/* RIGHT COLUMN - FIXED / STICKY */}
          <div className="cand-full-right-col">
            <div className="cand-full-card" style={{ position: 'sticky', top: '20px', zIndex: 10 }}>
              <div className="cand-full-card-header"><h3>Profile Completion</h3></div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                <div className="cand-full-avatar-box" style={{ width: '85px', height: '85px', position: 'relative' }}>
                  <svg width="85" height="85" viewBox="0 0 85 85" style={{ transform: 'rotate(-90deg)' }}>
                    <circle cx="42.5" cy="42.5" r="36" fill="none" stroke="#eef2f6" strokeWidth="7" />
                    <circle cx="42.5" cy="42.5" r="36" fill="none" stroke="#e67e22" strokeWidth="7" strokeDasharray="226.19" strokeDashoffset={226.19 - (226.19 * completionPercent / 100)} strokeLinecap="round" />
                  </svg>
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                    <span style={{ display: 'block', fontSize: '18px', fontWeight: '700', color: '#1a202c' }}>{completionPercent}%</span>
                    <span style={{ display: 'block', fontSize: '10px', color: '#718096' }}>Complete</span>
                  </div>
                </div>
                <p style={{ fontSize: '13px', color: '#718096', textAlign: 'center', margin: 0 }}><strong>Great!</strong> Your profile is almost complete.</p>
              </div>
            </div>
          </div>
        </div>

        {/* --- ITEM MODAL (For Adding/Editing) --- */}
        {showItemModal && (
          <div className="cand-item-modal-overlay" onClick={() => setShowItemModal(false)}>
            <div className="cand-item-modal-box" onClick={(e) => e.stopPropagation()}>
              <h3>{editingItem?.index === -1 ? `Add ${editingItem?.type}` : `Edit ${editingItem?.type}`}</h3>
              
              <label>Title / Name</label>
              <input type="text" value={itemForm.title} onChange={(e) => setItemForm({...itemForm, title: e.target.value})} placeholder="e.g. B.Tech CS, AIHIRE Platform, AWS Practitioner" />
              
              <label>Subtitle / Organization</label>
              <input type="text" value={itemForm.subtitle} onChange={(e) => setItemForm({...itemForm, subtitle: e.target.value})} placeholder="e.g. Anna University, React Project" />
              
              <label>Year / Date</label>
              <input type="text" value={itemForm.year} onChange={(e) => setItemForm({...itemForm, year: e.target.value})} placeholder="e.g. 2023, 2024" />
              
              <label>Description (Optional)</label>
              <input type="text" value={itemForm.description} onChange={(e) => setItemForm({...itemForm, description: e.target.value})} placeholder="Short summary..." />

              <div className="modal-actions">
                <button className="btn-close-modal" onClick={() => setShowItemModal(false)}>Cancel</button>
                <button className="btn-save-modal" onClick={handleSaveItem}>Save Item</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}

export default CandidateProfile;