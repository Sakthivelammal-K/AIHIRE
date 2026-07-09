import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import { useEffect, useState, useRef } from "react";
import API from "../../../api/api";
import "../../../styles/dashboard.css"; 

import {
  FaUserTie,
  FaBuilding,
  FaEnvelope,
  FaMapMarkerAlt,
  FaEdit,
  FaBriefcase,
  FaPhone,
  FaCheckCircle,
  FaCalendarAlt,
  FaIdCard,
  FaCrown,
  FaShieldAlt,
  FaLock,
  FaChevronRight,
  FaUserCheck,
  FaFileAlt,
  FaCalendarCheck,
  FaCamera,
  FaLinkedin
} from "react-icons/fa";

function RecruiterProfile() {
  const [user, setUser] = useState({});
  const [editing, setEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("Personal Information");
  const [formData, setFormData] = useState({});
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    setFormData({
      // Personal & Work
      name: user.name || "",
      company: user.company || "",
      industry: user.industry || "",
      location: user.location || "",
      phone: user.phone || "",
      linkedin: user.linkedin || "",
      website: user.website || "",
      about: user.about || "",
      department: user.department || "Talent Acquisition",
      joinDate: user.joinDate || "2024-01-15",
      role: user.role || "Senior Recruiter",
      
      // Preferences (Newly Added)
      emailNotifications: user.emailNotifications !== undefined ? user.emailNotifications : true,
      twoFactorAuth: user.twoFactorAuth !== undefined ? user.twoFactorAuth : true,
      theme: user.theme || "Light",
      language: user.language || "English",
      jobAlertFrequency: user.jobAlertFrequency || "Daily",
      profileVisibility: user.profileVisibility || "Public",
      timezone: user.timezone || "America/Los_Angeles"
    });
    setPreviewImage(user.profileImage || null);
  }, [user]);

  const loadProfile = async () => {
    try {
      const email = localStorage.getItem("email");
      const res = await API.get(`/users/profile?email=${email}`);
      setUser(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // Handles text inputs, dropdowns, AND checkboxes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const triggerFileUpload = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveProfile = async () => {
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });
      formDataToSend.append('email', user.email);
      if (profileImage) {
        formDataToSend.append('profileImage', profileImage);
      }

      await API.put("/users/profile", formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      alert("Profile Updated Successfully");
      setEditing(false);
      loadProfile();
    } catch (err) {
      console.log(err);
      alert("Update Failed");
    }
  };

  const renderFormFields = () => {
    switch(activeTab) {
      case "Personal Information":
        return (
          <>
            <div className="p-form-group">
              <label>Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} />
            </div>
            <div className="p-form-group">
              <label>Email Address</label>
              <input type="email" value={user.email || ''} disabled style={{backgroundColor:'#f8f9fa'}} />
            </div>
            <div className="p-form-group">
              <label>Phone Number</label>
              <div style={{display:'flex', gap:'8px'}}>
                 <select style={{width:'80px', padding:'10px', borderRadius:'8px', border:'1px solid #e2e8f0', background:'white'}}><option>🇺🇸 +1</option></select>
                 <input type="text" name="phone" value={formData.phone} onChange={handleChange} style={{flex:1}} />
              </div>
            </div>
            <div className="p-form-group">
              <label>Location</label>
              <input type="text" name="location" value={formData.location} onChange={handleChange} />
            </div>
            <div className="p-form-group">
              <label>Date of Birth</label>
              <input type="date" defaultValue="1990-05-12" />
            </div>
            <div className="p-form-group">
              <label>Gender</label>
              <select><option>Male</option><option>Female</option></select>
            </div>
            <div className="p-form-group p-full-width">
              <label>About Me</label>
              <textarea 
                name="about" 
                value={formData.about} 
                onChange={handleChange}
                maxLength="200"
              />
            </div>
          </>
        );

      case "Work Information":
        return (
          <>
            <div className="p-form-group">
              <label>Company Name</label>
              <input type="text" name="company" value={formData.company} onChange={handleChange} />
            </div>
            <div className="p-form-group">
              <label>Industry</label>
              <input type="text" name="industry" value={formData.industry} onChange={handleChange} />
            </div>
            <div className="p-form-group">
              <label>Department</label>
              <input type="text" name="department" value={formData.department} onChange={handleChange} />
            </div>
            <div className="p-form-group">
              <label>Role / Job Title</label>
              <input type="text" name="role" value={formData.role} onChange={handleChange} />
            </div>
            <div className="p-form-group p-full-width">
              <label>Company Website</label>
              <input type="text" name="website" value={formData.website} onChange={handleChange} placeholder="https://..." />
            </div>
          </>
        );

      case "Preferences":
        return (
          <>
            {/* LinkedIn */}
            <div className="p-form-group p-full-width">
              <label>LinkedIn Profile URL</label>
              <input 
                type="text" 
                name="linkedin" 
                value={formData.linkedin} 
                onChange={handleChange} 
                placeholder="https://linkedin.com/in/yourprofile" 
              />
            </div>

            {/* Divider */}
            <div className="p-full-width" style={{borderTop:'1px solid #eef2f6', margin: '10px 0'}}></div>

            {/* Theme Preference */}
            <div className="p-form-group">
              <label>Theme Preference</label>
              <select name="theme" value={formData.theme} onChange={handleChange}>
                <option value="Light">Light Mode</option>
                <option value="Dark">Dark Mode</option>
                <option value="System">System Default</option>
              </select>
            </div>

            {/* Language */}
            <div className="p-form-group">
              <label>Language</label>
              <select name="language" value={formData.language} onChange={handleChange}>
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
                <option value="German">German</option>
              </select>
            </div>

            {/* Job Alert Frequency */}
            <div className="p-form-group">
              <label>Job Alert Frequency</label>
              <select name="jobAlertFrequency" value={formData.jobAlertFrequency} onChange={handleChange}>
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
                <option value="Monthly">Monthly</option>
                <option value="Never">Never</option>
              </select>
            </div>

            {/* Profile Visibility */}
            <div className="p-form-group">
              <label>Profile Visibility</label>
              <select name="profileVisibility" value={formData.profileVisibility} onChange={handleChange}>
                <option value="Public">Public</option>
                <option value="Private">Private</option>
                <option value="Recruiters Only">Recruiters Only</option>
              </select>
            </div>

            {/* Time Zone */}
            <div className="p-form-group p-full-width">
              <label>Time Zone</label>
              <input 
                type="text" 
                name="timezone" 
                value={formData.timezone} 
                onChange={handleChange}
                placeholder="e.g. America/New_York, Asia/Kolkata"
              />
            </div>
            
            <div className="p-full-width" style={{borderTop:'1px solid #eef2f6', margin: '10px 0'}}></div>

            {/* Toggles */}
            <div className="p-form-group p-full-width" style={{display:'flex', alignItems:'flex-start', gap:'12px', paddingTop:'10px'}}>
               <label style={{display:'flex', alignItems:'center', gap:'12px', width:'100%', cursor:'pointer'}}>
                  <input 
                    type="checkbox" 
                    name="emailNotifications" 
                    checked={formData.emailNotifications} 
                    onChange={handleChange} 
                    style={{width:'18px', height:'18px', cursor:'pointer'}}
                  />
                  <div>
                    <strong>Enable Email Notifications</strong>
                    <p style={{fontSize:'12px', color:'#718096', margin:'2px 0 0 0', fontWeight:'400'}}>
                      Receive updates about new candidates and job applications.
                    </p>
                  </div>
               </label>
            </div>

            <div className="p-form-group p-full-width" style={{display:'flex', alignItems:'flex-start', gap:'12px'}}>
               <label style={{display:'flex', alignItems:'center', gap:'12px', width:'100%', cursor:'pointer'}}>
                  <input 
                    type="checkbox" 
                    name="twoFactorAuth" 
                    checked={formData.twoFactorAuth} 
                    onChange={handleChange} 
                    style={{width:'18px', height:'18px', cursor:'pointer'}}
                  />
                  <div>
                    <strong>Enable Two-Factor Authentication</strong>
                    <p style={{fontSize:'12px', color:'#718096', margin:'2px 0 0 0', fontWeight:'400'}}>
                      Add an extra layer of security to your account.
                    </p>
                  </div>
               </label>
            </div>
          </>
        );
      
      case "Security":
        return (
          <>
            <div className="p-form-group p-full-width">
              <label>Current Password</label>
              <input type="password" placeholder="Enter current password" />
            </div>
            <div className="p-form-group p-full-width">
              <label>New Password</label>
              <input type="password" placeholder="Enter new password" />
            </div>
            <div className="p-form-group p-full-width">
              <label>Confirm New Password</label>
              <input type="password" placeholder="Confirm new password" />
            </div>
            <div className="p-form-group p-full-width">
              <p style={{fontSize:'13px', color:'#718096', background:'#fdf2e9', padding:'12px', borderRadius:'6px', border:'1px solid #f0d5b4'}}>
                <strong>Note:</strong> Changing your password will log you out of all active sessions.
              </p>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  // Get first letter for default avatar
  const getInitial = (name) => {
    if (!name) return "?";
    return name.charAt(0).toUpperCase();
  };

  return (
    <DashboardLayout>
      <div className="profile-page-container">
        <div className="profile-grid">
          
          {/* Left Column */}
          <div>
            {/* Header Card */}
            <div className="p-card profile-header-card">
              
              <div className="profile-avatar-wrapper">
                {previewImage ? (
                  <img src={previewImage} alt="Profile" />
                ) : (
                  <div className="profile-avatar-letter">
                    {getInitial(formData.name || user.name)}
                  </div>
                )}
                
                <div className="profile-avatar-edit" onClick={triggerFileUpload}>
                  <FaCamera />
                </div>
                
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden-file-input" 
                  accept="image/*" 
                  onChange={handleImageChange} 
                />
              </div>
              
              <div className="profile-header-info">
                <div className="p-name-section">
                  <h2>{user.name || "Recruiter"} <FaCheckCircle style={{color: '#e67e22'}}/></h2>
                  <div className="p-role">{user.role || "Senior Recruiter"}</div>
                  
                  <div className="p-contact-grid">
                    <div className="p-contact-item"><FaMapMarkerAlt /> {user.location || "Location not added"}</div>
                    <div className="p-contact-item"><FaBriefcase /> {user.department || "Talent Acquisition"}</div>
                    <div className="p-contact-item"><FaEnvelope /> {user.email || "Email not added"}</div>
                    <div className="p-contact-item"><FaCalendarAlt /> Member Since <br/> {user.joinDate ? new Date(user.joinDate).toLocaleDateString() : "Jan 15, 2024"}</div>
                    <div className="p-contact-item"><FaPhone /> {user.phone || "Phone not added"}</div>
                    <div className="p-contact-item"><FaIdCard /> {user.role || "Senior Recruiter"}</div>
                  </div>
                  <div className="p-id-badge">Employee ID: REC-1024</div>
                </div>

                <div className="p-header-right">
                  <button className="btn-edit-profile" onClick={() => setEditing(!editing)}>
                    <FaEdit /> {editing ? "Cancel Edit" : "Edit Profile"}
                  </button>
                  <div className="p-meta-grid">
                    <div className="p-meta-item"><strong>Department</strong><span>{user.department || "Talent Acquisition"}</span></div>
                    <div className="p-meta-item"><strong>Member Since</strong><span>{user.joinDate ? new Date(user.joinDate).toLocaleDateString() : "Jan 15, 2024"}</span></div>
                    <div className="p-meta-item"><strong>Role</strong><span>{user.role || "Senior Recruiter"}</span></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabbed Form Card */}
            {editing && (
              <div className="p-card">
                <div className="p-tabs">
                  {['Personal Information', 'Work Information', 'Preferences', 'Security'].map(tab => {
                    let icon;
                    if(tab === 'Personal Information') icon = <FaUserTie />;
                    if(tab === 'Work Information') icon = <FaBriefcase />;
                    if(tab === 'Preferences') icon = <FaCrown />;
                    if(tab === 'Security') icon = <FaShieldAlt />;
                    
                    return (
                      <div 
                        key={tab}
                        className={`p-tab ${activeTab === tab ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab)}
                      >
                        {icon} {tab}
                      </div>
                    );
                  })}
                </div>

                <form>
                  <div className="p-form-grid">
                    {renderFormFields()}
                  </div>
                  <div className="p-form-actions">
                    <button type="button" className="btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
                    <button type="button" className="btn-primary" onClick={saveProfile}>Save Changes</button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div>
            {/* Profile Completion */}
            <div className="p-card p-card-right">
              <div className="p-card-header">Profile Completion</div>
              <div className="p-completion-circle">
                <div className="p-circle-chart">
                  <div className="p-circle-inner">
                    <span>85%</span>
                    <span>Complete</span>
                  </div>
                </div>
                <div className="p-checklist">
                  <div className="p-check-item"><FaCheckCircle /> Personal information</div>
                  <div className="p-check-item"><FaCheckCircle /> Contact information</div>
                  <div className="p-check-item"><FaCheckCircle /> Work Information</div>
                  <div className="p-check-item"><FaCheckCircle /> Preferences</div>
                  <div className={`p-check-item ${previewImage ? '' : 'incomplete'}`}><FaCheckCircle /> Profile Picture</div>
                </div>
                <button className="btn-complete-profile" onClick={() => { setEditing(true); setActiveTab("Personal Information"); }}>Complete Your Profile <FaChevronRight style={{fontSize:'10px'}}/></button>
              </div>
            </div>

            {/* Account Information */}
            <div className="p-card p-card-right">
              <div className="p-card-header" style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                Account Information
                <FaLock style={{color:'#e67e22', fontSize:'14px'}}/>
              </div>
              <div className="p-account-row">
                <span className="p-account-label">Username</span>
                <span className="p-account-value">{user.name ? user.name.toLowerCase().replace(' ', '.') : 'recruiter'}</span>
              </div>
              <div className="p-account-row">
                <span className="p-account-label">Password</span>
                <span className="p-account-value">******** <a onClick={() => { setEditing(true); setActiveTab("Security"); }}>Change</a></span>
              </div>
              <div className="p-account-row">
                <span className="p-account-label">Two-Factor Authentication</span>
                <span className="p-account-value"><span className="p-badge-orange">{formData.twoFactorAuth ? 'Enabled' : 'Disabled'}</span></span>
              </div>
              <div className="p-account-row">
                <span className="p-account-label">Email Notifications</span>
                <span className="p-account-value"><span className="p-badge-orange">{formData.emailNotifications ? 'Enabled' : 'Disabled'}</span></span>
              </div>
              <div className="p-account-row">
                <span className="p-account-label">Last Login</span>
                <span className="p-account-value" style={{fontWeight: '400', color: '#718096'}}>May 15, 2024, 10:30 AM</span>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="p-card p-card-right">
              <div className="p-card-header" style={{display:'flex', justifyContent:'space-between'}}>
                Recent Activity
                <span className="p-view-all">View All</span>
              </div>
              
              <div className="p-activity-item">
                <div className="p-activity-icon" style={{color:'#e67e22'}}><FaFileAlt /></div>
                <div className="p-activity-text">
                  <strong>Posted a new job</strong><br />Frontend Developer <span>2 hours ago</span>
                </div>
              </div>
              
              <div className="p-activity-item">
                <div className="p-activity-icon" style={{color:'#e67e22'}}><FaUserCheck /></div>
                <div className="p-activity-text">
                  <strong>Reviewed 15 applications</strong><br />UX/UI Designer <span>5 hours ago</span>
                </div>
              </div>
              
              <div className="p-activity-item" style={{borderBottom:'none'}}>
                <div className="p-activity-icon" style={{color:'#e67e22'}}><FaCalendarCheck /></div>
                <div className="p-activity-text">
                  <strong>Scheduled an interview</strong><br />Technical Interview with Olivia Martin <span>1 day ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default RecruiterProfile;