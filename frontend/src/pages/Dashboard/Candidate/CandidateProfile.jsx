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
  FaCalendarAlt
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
  
  // MODE SWITCH
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("Personal Information"); // Edit Tab state
  
  // FORM STATES
  const [editForm, setEditForm] = useState({ 
    firstName: "", lastName: "", phone: "", location: "", 
    city: "", state: "", country: "", dob: "", gender: "", bio: "" 
  });
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);

  const email = localStorage.getItem("email");
  const username = localStorage.getItem("username") || "Candidate";
  const role = localStorage.getItem("role") || "Candidate";

  // --- CSS STYLES FOR NEW EDIT LAYOUT (Injected to keep your file standalone) ---
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
      width: 220px;
      min-width: 220px;
      border-right: 1px solid #eef2f6;
      padding: 20px 0;
      background: #fafbfc;
    }
    .cand-edit-sidebar h4 {
      padding: 0 20px 10px 20px;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #a0aec0;
      margin: 0;
    }
    .cand-edit-sidebar ul {
      list-style: none;
      padding: 0 10px;
      margin: 0;
    }
    .cand-edit-sidebar li {
      padding: 8px 12px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 14px;
      color: #4a5568;
      transition: 0.2s;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .cand-edit-sidebar li:hover { background: #f0f2f5; }
    .cand-edit-sidebar li.active {
      background: #fdf2e9;
      color: #e67e22;
      font-weight: 500;
    }
    .cand-edit-main {
      flex: 1;
      padding: 25px 30px;
      overflow-y: auto;
      max-height: 650px;
    }
    .cand-edit-footer {
      border-top: 1px solid #eef2f6;
      padding: 15px 25px;
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      background: white;
    }
    .cand-edit-cancel {
      background: white;
      border: 1px solid #e2e8f0;
      padding: 8px 24px;
      border-radius: 6px;
      color: #4a5568;
      cursor: pointer;
      font-weight: 500;
    }
    .cand-edit-save {
      background: #e67e22;
      border: none;
      padding: 8px 24px;
      border-radius: 6px;
      color: white;
      cursor: pointer;
      font-weight: 600;
    }
    .cand-edit-save:hover { background: #d35400; }
    @media (max-width: 768px) {
      .cand-edit-layout { flex-direction: column; }
      .cand-edit-sidebar { width: 100%; min-width: 100%; border-right: none; border-bottom: 1px solid #eef2f6; }
    }
  `;

  useEffect(() => {
    loadProfileData();
  }, []);

  useEffect(() => {
    // Inject inline CSS for this specific layout
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
      // 1. Profile Data
      const profileRes = await API.get(`/users/profile?email=${email}`);
      const pData = profileRes.data || {};
      setUser(pData);
      setPreviewImage(pData?.profileImage || null);
      
      const fullName = (pData?.name || "").split(" ");
      setEditForm({
        firstName: fullName[0] || "",
        lastName: fullName.slice(1).join(" ") || "",
        phone: pData?.phone || "",
        location: pData?.location || "",
        city: pData?.city || "",
        state: pData?.state || "",
        country: pData?.country || "",
        dob: pData?.dob || "",
        gender: pData?.gender || "Male",
        bio: pData?.bio || pData?.about || ""
      });

      // 2. Resume Data
      try {
        const resumeRes = await API.get(`/resumes/${email}`);
        if (resumeRes.data.resumeName) setResumeName(resumeRes.data.resumeName);
      } catch (e) { /* No resume */ }

      // 3. ATS Analysis
      try {
        const screenRes = await API.get(`/resumes/screening/${email}`);
        if (screenRes.data && screenRes.data.candidateSkills) setAnalysis(screenRes.data);
      } catch (e) { /* No screening */ }

      // 4. Applications & Interviews
      const appRes = await API.get("/applications/");
      const apps = Array.isArray(appRes.data) ? appRes.data : appRes.data.applications || [];
      setApplications(apps.filter(app => app.candidateName === username || app.email === email));

      const intRes = await API.get("/interviews/");
      const allInts = Array.isArray(intRes.data.scheduled) ? intRes.data.scheduled : intRes.data || [];
      setInterviews(allInts.filter(int => int.candidateName === username || int.email === email));

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
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const saveProfile = async () => {
    try {
      const fullName = `${editForm.firstName} ${editForm.lastName}`.trim();
      const formData = new FormData();
      formData.append('email', email);
      formData.append('name', fullName);
      formData.append('phone', editForm.phone);
      formData.append('location', editForm.location);
      formData.append('bio', editForm.bio);
      formData.append('dob', editForm.dob);
      formData.append('gender', editForm.gender);
      if (profileImage) formData.append('profileImage', profileImage);

      await API.put("/users/profile", formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      alert("Profile Updated Successfully");
      setIsEditing(false);
      loadProfileData();
    } catch (err) {
      console.log(err);
      alert("Update Failed");
    }
  };

  const cancelEdit = () => {
    const fullName = (user?.name || "").split(" ");
    setEditForm({
      firstName: fullName[0] || "", lastName: fullName.slice(1).join(" ") || "",
      phone: user?.phone || "", location: user?.location || "",
      city: "", state: "", country: "", dob: "", gender: "Male",
      bio: user?.bio || user?.about || ""
    });
    setPreviewImage(user?.profileImage || null);
    setProfileImage(null);
    setIsEditing(false);
  };

  // --- STATS ---
  const skills = analysis?.candidateSkills || [];
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
              <div className="cand-full-form-group"><label>Professional Headline</label><input type="text" value={role} disabled style={{ background: '#f8f9fa' }} /></div>
              <div className="cand-full-form-group"><label>Email Address</label><input type="text" value={user?.email || ''} disabled style={{ background: '#f8f9fa' }} /></div>
            </div>
            <div className="cand-full-row-2">
              <div className="cand-full-form-group"><label>Phone Number</label><input type="text" name="phone" value={editForm.phone} onChange={handleEditChange} /></div>
              <div className="cand-full-form-group"><label>Location</label><input type="text" name="location" value={editForm.location} onChange={handleEditChange} /></div>
            </div>
            <div className="cand-full-row-2">
              <div className="cand-full-form-group"><label>Date of Birth</label><input type="date" name="dob" value={editForm.dob} onChange={handleEditChange} /></div>
              <div className="cand-full-form-group"><label>Gender</label><select name="gender" value={editForm.gender} onChange={handleEditChange}><option>Male</option><option>Female</option><option>Non-binary</option></select></div>
            </div>
          </div>
        );
      case "Professional Summary":
        return (
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '15px' }}>Professional Summary</h3>
            <div className="cand-full-form-group">
              <label>Summary</label>
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
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '15px' }}>Skills</h3>
            <div className="cand-full-tags">
              {skills.length > 0 ? skills.map((s, i) => <span key={i} className="cand-full-chip">{s}</span>) : <p style={{ color: '#718096', fontSize: '13px' }}>Upload a resume to detect your skills.</p>}
            </div>
          </div>
        );
      case "Experience":
        return (
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '15px' }}>Experience</h3>
            {applications.length > 0 ? applications.slice(0, 2).map((app, i) => (
              <div key={i} className="cand-full-timeline">
                <div className="cand-full-tl-logo" style={{ background: '#fef3c7', color: '#eab308' }}>{app.company?.charAt(0) || 'C'}</div>
                <div className="cand-full-tl-content">
                  <h4>{app.jobTitle}</h4>
                  <p>{app.company || 'Company'} • {app.appliedDate ? new Date(app.appliedDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Recent'}</p>
                  <ul><li>Working on full-stack development using modern frameworks.</li></ul>
                </div>
              </div>
            )) : <p style={{ color: '#718096', fontSize: '13px' }}>No experience recorded yet.</p>}
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
        
        {/* TOP HEADER */}
        <div className="cand-full-header">
          <div className="cand-full-left">
            <h1>{isEditing ? "Edit Profile" : "My Profile"}</h1>
            <p>{isEditing ? "Update your information and manage your professional profile." : "View and manage your profile."}</p>
          </div>
          <div className="cand-full-actions">
            <button className="cand-full-btn-save" onClick={isEditing ? saveProfile : () => setIsEditing(true)}>
              {isEditing ? <><FaSave /> Save Changes</> : <><FaEdit /> Edit Profile</>}
            </button>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="cand-full-grid">
          
          {/* LEFT COLUMN - VIEW MODE */}
          {!isEditing && (
            <div className="cand-full-left-col">
              <div className="cand-full-card cand-full-hero">
                <div className="cand-full-avatar-box">
                  {previewImage ? <img src={previewImage} alt="Profile" /> : <div className="cand-full-avatar-letter">{username.charAt(0).toUpperCase()}</div>}
                </div>
                <div className="cand-full-hero-info">
                  <div className="cand-full-hero-top">
                    <div className="cand-full-name">
                      <h2>{user?.name || username} <FaCheckCircle /></h2>
                      <p>{role}</p>
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
                  <p className="cand-full-bio">{user?.bio || "Passionate candidate with experience in building responsive web applications."}</p>
                </div>
              </div>
              {/* Resume, Skills, Experience, etc for View mode */}
              <div className="cand-full-card">
                <div className="cand-full-card-header"><h3><FaFileAlt /> Resume</h3></div>
                {resumeName ? <p>{resumeName} • AI Score: {atsScore}/100</p> : <p style={{ color: '#718096' }}>No resume uploaded.</p>}
              </div>
              <div className="cand-full-card">
                <div className="cand-full-card-header"><h3><FaCode /> Skills</h3></div>
                <div className="cand-full-tags">{skills.length > 0 ? skills.map((s, i) => <span key={i} className="cand-full-chip">{s}</span>) : <p>No skills detected.</p>}</div>
              </div>
            </div>
          )}

          {/* LEFT COLUMN - EDIT MODE (NEW LAYOUT) */}
          {isEditing && (
            <div className="cand-full-left-col">
              <div className="cand-edit-layout">
                {/* Sidebar Tabs */}
                <div className="cand-edit-sidebar">
                  <h4>Sections</h4>
                  <ul>
                    {['Personal Information', 'Professional Summary', 'Resume', 'Skills', 'Experience'].map((tab) => (
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
                        {tab}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Main Content Area */}
                <div className="cand-edit-main">
                  {renderEditTabContent()}
                </div>
              </div>

              {/* Fixed Footer Actions */}
              <div className="cand-edit-footer">
                <button className="cand-edit-cancel" onClick={cancelEdit}>Cancel</button>
                <button className="cand-edit-save" onClick={saveProfile}>Save Changes</button>
              </div>
            </div>
          )}

          {/* RIGHT COLUMN */}
          <div className="cand-full-right-col">
            <div className="cand-full-card">
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

      </div>
    </DashboardLayout>
  );
}

export default CandidateProfile;