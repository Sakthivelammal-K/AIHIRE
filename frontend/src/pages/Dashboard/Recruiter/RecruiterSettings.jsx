import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import { useEffect, useState } from "react";
import API from "../../../api/api";

import {
  FaUser,
  FaBell,
  FaLock,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaBriefcase,
  FaBuilding,
  FaSave,
  FaSpinner,
  FaCheckCircle,
  FaTimesCircle,
  FaCamera,
  FaKey,
  FaCog,
  FaGlobe,
  FaToggleOn,
  FaToggleOff
} from "react-icons/fa";

function Settings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  
  // --- PROFILE STATE ---
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    jobTitle: "",
    department: "",
    company: "",
    bio: "",
    timezone: "Asia/Kolkata",
    language: "en",
    profilePicture: null
  });

  // --- SECURITY STATE ---
  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // --- PREFERENCES STATE (Only ones supported by Backend) ---
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    twoFactorAuth: false
  });

  // --- LOAD DATA ---
  useEffect(() => {
    loadUserProfile();
    loadSettings();
  }, []);

  const loadUserProfile = async () => {
    try {
      const email = localStorage.getItem("email");
      if (!email) return;
      
      const res = await API.get(`/users/profile?email=${email}`);
      
      setProfile(prev => ({
        ...prev,
        name: res.data.name || "",
        email: res.data.email || "",
        phone: res.data.phone || "",
        location: res.data.location || "",
        jobTitle: res.data.jobTitle || res.data.title || "",
        department: res.data.department || "",
        company: res.data.company || "",
        bio: res.data.bio || res.data.about || "",
        timezone: res.data.timezone || "Asia/Kolkata",
        language: res.data.language || "en",
        profilePicture: res.data.profilePicture || null
      }));
    } catch (error) {
      console.log("Error loading user profile:", error);
    }
  };

  const loadSettings = async () => {
    setLoading(true);
    try {
      const email = localStorage.getItem("email");
      
      let settingsData = {};
      try {
        const response = await API.get(`/settings?email=${email}`);
        if (response.data) settingsData = response.data;
      } catch (e) { 
        console.log("Settings collection not found"); 
      }

      if (settingsData.notifications) {
        setPreferences({
          emailNotifications: settingsData.notifications.emailNotifications !== undefined 
            ? settingsData.notifications.emailNotifications 
            : true,
          twoFactorAuth: settingsData.security?.twoFactorAuth || false
        });
      }

    } catch (error) {
      console.log("Error loading settings:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- SAVE PROFILE ---
  const handleSaveProfile = async () => {
    setSaving(true);
    setSuccessMessage("");
    setErrorMessage("");
    
    try {
      const email = localStorage.getItem("email");

      await API.put("/users/profile", {
        email: email,
        name: profile.name,
        phone: profile.phone,
        location: profile.location,
        jobTitle: profile.jobTitle,
        department: profile.department,
        company: profile.company,
        bio: profile.bio,
        timezone: profile.timezone,
        language: profile.language
      });
      
      setSuccessMessage("Profile saved successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.log("Error saving profile:", error);
      setErrorMessage("Failed to save profile.");
      setTimeout(() => setErrorMessage(""), 3000);
    } finally {
      setSaving(false);
    }
  };

  // --- SAVE PREFERENCES ---
  const handleSavePreferences = async () => {
    setSaving(true);
    setSuccessMessage("");
    setErrorMessage("");
    
    try {
      const email = localStorage.getItem("email");

      const settingsData = {
        email: email,
        notifications: {
          emailNotifications: preferences.emailNotifications
        },
        security: {
          twoFactorAuth: preferences.twoFactorAuth
        }
      };
      
      await API.put("/settings", settingsData);
      
      setSuccessMessage("Preferences saved successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.log("Error saving preferences:", error);
      setErrorMessage("Failed to save preferences.");
      setTimeout(() => setErrorMessage(""), 3000);
    } finally {
      setSaving(false);
    }
  };

  // --- PASSWORD CHANGE ---
  const handlePasswordChange = async () => {
    if (security.newPassword !== security.confirmPassword) {
      setErrorMessage("Passwords do not match!");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }
    
    if (security.newPassword.length < 8) {
      setErrorMessage("Password must be at least 8 characters long!");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }
    
    setSaving(true);
    try {
      await API.post("/settings/change-password", {
        email: profile.email,
        currentPassword: security.currentPassword,
        newPassword: security.newPassword
      });
      
      setSecurity({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
      
      setSuccessMessage("Password changed successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setErrorMessage("Failed to change password.");
      setTimeout(() => setErrorMessage(""), 3000);
    } finally {
      setSaving(false);
    }
  };

  // --- PROFILE PICTURE ---
  const handleProfilePictureUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("profilePicture", file);
      formData.append("email", profile.email);
      
      try {
        await API.post("/users/profile-picture", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        
        await loadUserProfile();
        setSuccessMessage("Profile picture updated!");
        setTimeout(() => setSuccessMessage(""), 3000);
      } catch (error) {
        setErrorMessage("Failed to upload image.");
        setTimeout(() => setErrorMessage(""), 3000);
      }
    }
  };

  // --- HANDLERS ---
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handlePreferenceChange = (e) => {
    const { name, checked } = e.target;
    setPreferences({ ...preferences, [name]: checked });
  };

  const handleSecurityChange = (e) => {
    const { name, value } = e.target;
    setSecurity({ ...security, [name]: value });
  };

  // --- RENDER FUNCTIONS ---

  const renderProfileTab = () => (
    <div className="settings-profile-tab">
      {/* Avatar Section */}
      <div className="settings-profile-avatar-section">
        <div className="settings-profile-avatar">
          {profile.profilePicture ? (
            <img src={profile.profilePicture} alt="Profile" />
          ) : (
            <span>{profile.name?.charAt(0)?.toUpperCase() || "U"}</span>
          )}
          <label className="settings-avatar-upload">
            <FaCamera />
            <input type="file" accept="image/*" onChange={handleProfilePictureUpload} />
          </label>
        </div>
        <div className="settings-profile-name">
          <h3>{profile.name}</h3>
          <p>{profile.jobTitle}</p>
        </div>
      </div>

      <div className="settings-form-grid">
        <div className="settings-form-group">
          <label>Full Name</label>
          <input type="text" name="name" value={profile.name} onChange={handleProfileChange} placeholder="Enter your full name" />
        </div>
        <div className="settings-form-group">
          <label>Email Address</label>
          <input type="email" value={profile.email} disabled style={{ backgroundColor: '#f3f4f6', cursor: 'not-allowed' }} />
        </div>
        <div className="settings-form-group">
          <label>Phone Number</label>
          <input type="tel" name="phone" value={profile.phone} onChange={handleProfileChange} placeholder="Enter your phone number" />
        </div>
        <div className="settings-form-group">
          <label>Location</label>
          <input type="text" name="location" value={profile.location} onChange={handleProfileChange} placeholder="Enter your location" />
        </div>
        <div className="settings-form-group">
          <label>Job Title</label>
          <input type="text" name="jobTitle" value={profile.jobTitle} onChange={handleProfileChange} placeholder="Enter your job title" />
        </div>
        <div className="settings-form-group">
          <label>Department</label>
          <input type="text" name="department" value={profile.department} onChange={handleProfileChange} placeholder="Enter your department" />
        </div>
        <div className="settings-form-group full-width">
          <label>Company</label>
          <input type="text" name="company" value={profile.company} onChange={handleProfileChange} placeholder="Enter your company" />
        </div>
        <div className="settings-form-group full-width">
          <label>Bio</label>
          <textarea name="bio" value={profile.bio} onChange={handleProfileChange} rows="3" placeholder="Tell us about yourself..." />
        </div>
        <div className="settings-form-group">
          <label>Time Zone</label>
          <select name="timezone" value={profile.timezone} onChange={handleProfileChange}>
            <option value="America/Los_Angeles">Pacific Time (US & Canada)</option>
            <option value="America/New_York">Eastern Time (US & Canada)</option>
            <option value="Asia/Kolkata">IST (India)</option>
            <option value="Europe/London">GMT (London)</option>
          </select>
        </div>
        <div className="settings-form-group">
          <label>Language</label>
          <select name="language" value={profile.language} onChange={handleProfileChange}>
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
          </select>
        </div>
        
        <div className="settings-form-group full-width" style={{ marginTop: '15px' }}>
          <button className="settings-save-btn-full" onClick={handleSaveProfile} disabled={saving}>
            {saving ? <FaSpinner className="spin" /> : <FaSave />} {saving ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="settings-security-tab">
      <div className="settings-security-section">
        <h4>Change Password</h4>
        <div className="settings-form-grid">
          <div className="settings-form-group full-width">
            <label>Current Password</label>
            <input type="password" name="currentPassword" value={security.currentPassword} onChange={handleSecurityChange} placeholder="Enter current password" />
          </div>
          <div className="settings-form-group">
            <label>New Password</label>
            <input type="password" name="newPassword" value={security.newPassword} onChange={handleSecurityChange} placeholder="Enter new password" />
          </div>
          <div className="settings-form-group">
            <label>Confirm Password</label>
            <input type="password" name="confirmPassword" value={security.confirmPassword} onChange={handleSecurityChange} placeholder="Confirm new password" />
          </div>
          <div className="settings-form-group full-width">
            <button className="settings-save-btn-full" onClick={handlePasswordChange} disabled={saving}>
              {saving ? <FaSpinner className="spin" /> : <FaKey />} {saving ? "Updating..." : "Update Password"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPreferencesTab = () => (
    <div className="settings-preferences-tab">
      <div className="settings-preference-group">
        <h4>Notifications & Security</h4>
        
        <div className="settings-toggle-item">
          <div className="settings-toggle-info">
            <span className="settings-toggle-label">Email Notifications</span>
            <span className="settings-toggle-desc">Receive notifications about applications via email</span>
          </div>
          <label className="settings-toggle">
            <input type="checkbox" name="emailNotifications" checked={preferences.emailNotifications} onChange={handlePreferenceChange} />
            <span className="settings-toggle-slider"></span>
          </label>
        </div>

        <div className="settings-toggle-item">
          <div className="settings-toggle-info">
            <span className="settings-toggle-label">Two-Factor Authentication</span>
            <span className="settings-toggle-desc">Add an extra layer of security to your account</span>
          </div>
          <label className="settings-toggle">
            <input type="checkbox" name="twoFactorAuth" checked={preferences.twoFactorAuth} onChange={handlePreferenceChange} />
            <span className="settings-toggle-slider"></span>
          </label>
        </div>

        <div className="settings-form-group full-width" style={{ marginTop: '15px' }}>
          <button className="settings-save-btn-full" onClick={handleSavePreferences} disabled={saving}>
            {saving ? <FaSpinner className="spin" /> : <FaSave />} {saving ? "Saving..." : "Save Preferences"}
          </button>
        </div>
      </div>
    </div>
  );

  // Main Renderer
  const renderTabContent = () => {
    switch(activeTab) {
      case "profile": return renderProfileTab();
      case "security": return renderSecurityTab();
      case "preferences": return renderPreferencesTab();
      default: return renderProfileTab();
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="settings-loading"><FaSpinner className="spin" /> <p>Loading settings...</p></div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="settings-page">

        {/* Messages */}
        {successMessage && <div className="settings-success-message"><FaCheckCircle /> {successMessage}</div>}
        {errorMessage && <div className="settings-error-message"><FaTimesCircle /> {errorMessage}</div>}

        {/* Tabs */}
        <div className="settings-tabs">
          <button className={`settings-tab ${activeTab === "profile" ? "active" : ""}`} onClick={() => setActiveTab("profile")}><FaUser /> Profile</button>
          <button className={`settings-tab ${activeTab === "security" ? "active" : ""}`} onClick={() => setActiveTab("security")}><FaLock /> Security</button>
          <button className={`settings-tab ${activeTab === "preferences" ? "active" : ""}`} onClick={() => setActiveTab("preferences")}><FaBell /> Preferences</button>
        </div>

        {/* Tab Content */}
        <div className="settings-tab-content">
          {renderTabContent()}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Settings;