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

  useEffect(() => {
    loadProfileData();
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
            {isEditing && <button className="cand-full-btn-preview" onClick={cancelEdit}><FaEye /> Preview Profile</button>}
            <button className="cand-full-btn-save" onClick={isEditing ? saveProfile : () => setIsEditing(true)}>
              {isEditing ? <><FaSave /> Save Changes</> : <><FaEdit /> Edit Profile</>}
            </button>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="cand-full-grid">
          
          {/* LEFT COLUMN */}
          <div className="cand-full-left-col">
            
            {/* HERO CARD */}
            <div className="cand-full-card">
              {!isEditing ? (
                <div className="cand-full-hero">
                  <div className="cand-full-avatar-box">
                    {previewImage ? <img src={previewImage} alt="Profile" /> : <div className="cand-full-avatar-letter">{username.charAt(0).toUpperCase()}</div>}
                    <div className="cand-full-avatar-edit" onClick={() => setIsEditing(true)}><FaCamera /></div>
                  </div>
                  <div className="cand-full-hero-info">
                    <div className="cand-full-hero-top">
                      <div className="cand-full-name">
                        <h2>{user?.name || username} <FaCheckCircle /></h2>
                        <p>{role}</p>
                      </div>
                      <button className="cand-full-card-header action-btn" onClick={() => setIsEditing(true)}><FaEdit /> Edit Profile</button>
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
              ) : (
                <div className="cand-full-edit-hero">
                  <div className="cand-full-edit-avatar-box">
                    {previewImage ? <img src={previewImage} alt="Profile" /> : <div className="cand-full-edit-avatar-letter">{username.charAt(0).toUpperCase()}</div>}
                    <div className="cand-full-edit-avatar-upload" onClick={triggerFileUpload}><FaCamera /></div>
                    <input type="file" ref={fileInputRef} className="hidden-file-input" accept="image/*" onChange={handleImageChange} />
                  </div>
                  <div className="cand-full-edit-form">
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
                    <div className="cand-full-form-group">
                      <label>Professional Summary</label>
                      <textarea className="cand-full-textarea" name="bio" value={editForm.bio} onChange={handleEditChange} placeholder="Write a short professional summary..." />
                      <div className="cand-full-char-count">{editForm.bio.length} / 200</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* RESUME CARD */}
            <div className="cand-full-card">
              <div className="cand-full-card-header">
                <h3><FaFileAlt /> Resume</h3>
                {isEditing && <button className="action-btn" onClick={triggerFileUpload}><FaEdit /> Replace</button>}
              </div>
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
                    {isEditing && <button className="cand-full-resume-replace-btn" onClick={triggerFileUpload}><FaEdit /> Replace</button>}
                    {isEditing && <button style={{ color: '#ef4444' }}><FaTrash /> Delete</button>}
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '20px 0', color: '#718096' }}>
                  <p>No resume uploaded yet.</p>
                  {isEditing && <button onClick={triggerFileUpload} style={{ marginTop: '10px', background: '#e67e22', color: 'white', border: 'none', padding: '8px 20px', borderRadius: '6px', cursor: 'pointer' }}>Upload Resume</button>}
                </div>
              )}
            </div>

            {/* SKILLS CARD */}
            <div className="cand-full-card">
              <div className="cand-full-card-header">
                <h3><FaCode /> Skills</h3>
                {isEditing && <button className="action-btn" onClick={() => navigate('/candidate/resume')}><FaEdit /> Add Skill</button>}
              </div>
              <div className="cand-full-tags">
                {skills.length > 0 ? skills.map((s, i) => <span key={i} className="cand-full-chip">{s}</span>) : <p style={{ color: '#718096', fontSize: '13px' }}>Upload a resume to detect your skills.</p>}
              </div>
            </div>

            {/* EXPERIENCE CARD */}
            <div className="cand-full-card">
              <div className="cand-full-card-header">
                <h3><FaBriefcase /> Experience</h3>
                {isEditing && <button className="action-btn" onClick={() => navigate('/candidate/resume')}><FaEdit /> Add Experience</button>}
              </div>
              {applications.length > 0 ? applications.slice(0, 2).map((app, i) => (
                <div key={i} className="cand-full-timeline">
                  <div className="cand-full-tl-logo" style={{ background: '#fef3c7', color: '#eab308' }}>{app.company?.charAt(0) || 'C'}</div>
                  <div className="cand-full-tl-content">
                    <h4>{app.jobTitle}</h4>
                    <p>{app.company || 'Company'} • {app.appliedDate ? new Date(app.appliedDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Recent'}</p>
                    <ul><li>Working on full-stack development using modern frameworks.</li></ul>
                  </div>
                </div>
              )) : <p style={{ color: '#718096', fontSize: '13px', padding: '10px 0' }}>No experience recorded yet.</p>}
            </div>

            {/* EXACT UI COPY: PROJECTS (MOCK) */}
            <div className="cand-full-card">
              <div className="cand-full-card-header"><h3><FaProjectDiagram /> Projects</h3>{isEditing && <button className="action-btn"><FaEdit /> Add Project</button>}</div>
              <div className="cand-full-timeline">
                <div className="cand-full-tl-logo" style={{ background: '#eef4ff', color: '#0d6efd' }}><FaCode /></div>
                <div className="cand-full-tl-content">
                  <h4>AIHIRE - AI Powered Recruitment Platform</h4>
                  <p>A full-stack recruitment platform with AI resume screening and interview scheduling.</p>
                  <div className="cand-full-tags" style={{ marginTop: '6px' }}><span className="cand-full-chip" style={{ background: '#eef4ff', color: '#0d6efd' }}>React</span><span className="cand-full-chip" style={{ background: '#eef4ff', color: '#0d6efd' }}>FastAPI</span></div>
                </div>
              </div>
            </div>

            {/* EXACT UI COPY: EDUCATION (MOCK) */}
            <div className="cand-full-card">
              <div className="cand-full-card-header"><h3><FaGraduationCap /> Education</h3>{isEditing && <button className="action-btn"><FaEdit /> Add Education</button>}</div>
              <div className="cand-full-timeline">
                <div className="cand-full-tl-logo" style={{ background: '#f3e8ff', color: '#8b5cf6' }}><FaGraduationCap /></div>
                <div className="cand-full-tl-content">
                  <h4>B.Tech in Computer Science</h4>
                  <p>Anna University, Chennai • 2019 - 2023 • CGPA: 8.7 / 10.0</p>
                </div>
              </div>
            </div>

            {/* EXACT UI COPY: CERTIFICATIONS (MOCK) */}
            <div className="cand-full-card">
              <div className="cand-full-card-header"><h3><FaCertificate /> Certifications</h3>{isEditing && <button className="action-btn"><FaEdit /> Add Certification</button>}</div>
              <div className="cand-full-timeline">
                <div className="cand-full-tl-logo" style={{ background: '#fdf2e9', color: '#e67e22' }}><FaCrown /></div>
                <div className="cand-full-tl-content">
                  <h4>AWS Cloud Practitioner</h4>
                  <p>Amazon Web Services • Issued Feb 2024 • <a href="#" style={{ color: '#e67e22' }}>View Credential</a></p>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN */}
          <div className="cand-full-right-col">
            
            {/* PROFILE COMPLETION */}
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

            {/* APPLICATION STATISTICS */}
            <div className="cand-full-card">
              <div className="cand-full-card-header"><h3><FaFileAlt /> Application Statistics</h3></div>
              <div className="cand-full-stat-item"><div className="cand-full-stat-icon"><FaBriefcase /></div><span className="cand-full-stat-text">Jobs Applied</span><span className="cand-full-stat-val">{totalApps}</span></div>
              <div className="cand-full-stat-item"><div className="cand-full-stat-icon"><FaCalendarAlt /></div><span className="cand-full-stat-text">Saved Jobs</span><span className="cand-full-stat-val">18</span></div>
              <div className="cand-full-stat-item"><div className="cand-full-stat-icon"><FaUserCheck /></div><span className="cand-full-stat-text">Interviews</span><span className="cand-full-stat-val">{scheduledInterviews}</span></div>
              <div className="cand-full-stat-item" style={{ borderBottom: 'none' }}><div className="cand-full-stat-icon"><FaEye /></div><span className="cand-full-stat-text">Profile Views</span><span className="cand-full-stat-val">{profileViews}</span></div>
            </div>

            {/* AI INSIGHTS */}
            <div className="cand-full-card">
              <div className="cand-full-card-header"><h3><FaUserTie /> AI Insights</h3></div>
              <div className="cand-full-progress-wrap">
                <div className="cand-full-progress-row"><span>Resume Match Score</span><span>{atsScore}%</span></div>
                <div className="cand-full-progress-bar"><div className="cand-full-progress-fill" style={{ width: `${atsScore}%` }}></div></div>
              </div>
              <div className="cand-full-progress-wrap">
                <div className="cand-full-progress-row"><span>Interview Readiness</span><span>78%</span></div>
                <div className="cand-full-progress-bar"><div className="cand-full-progress-fill" style={{ width: '78%' }}></div></div>
              </div>
            </div>

            {/* JOB PREFERENCES */}
            <div className="cand-full-card">
              <div className="cand-full-card-header"><h3><FaCrown /> Job Preferences</h3>{isEditing && <button className="action-btn"><FaEdit /> Edit</button>}</div>
              <div style={{ fontSize: '14px', color: '#4a5568', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div><strong>Preferred Role:</strong> Full Stack Developer</div>
                <div><strong>Work Mode:</strong> Remote / Hybrid</div>
                <div><strong>Employment Type:</strong> Full Time</div>
              </div>
            </div>

            {/* ACCOUNT SETTINGS */}
            <div className="cand-full-card">
              <div className="cand-full-card-header"><h3><FaShieldAlt /> Account & Settings</h3></div>
              <div className="cand-full-toggle-row"><span>Email Notifications</span><div className="cand-full-toggle on"></div></div>
              <div className="cand-full-toggle-row"><span>Open to Work</span><div className="cand-full-toggle on"></div></div>
              <div className="cand-full-toggle-row" style={{ borderBottom: 'none' }}><span>Profile Visibility</span><span style={{ fontSize: '13px', color: '#718096' }}>Public</span></div>
              <button className="cand-full-resume-replace-btn" style={{ width: '100%', marginTop: '15px', justifyContent: 'center', display: 'flex' }}>Change Password</button>
            </div>

          </div>
        </div>

        {/* FLOATING SAVE BAR */}
        {isEditing && (
          <div className="cand-full-save-bar">
            <span>⚠️ Don't forget to save your changes</span>
            <div><button className="fb-cancel" onClick={cancelEdit}>Cancel</button><button className="fb-save" onClick={saveProfile} style={{ marginLeft: '10px' }}>Save Changes</button></div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}

export default CandidateProfile;