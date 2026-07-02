import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import { useEffect, useState } from "react";
import API from "../../../api/api";

import {
  FaUserCircle,
  FaEnvelope,
  FaUserTag,
  FaCode,
  FaBriefcase,
  FaGraduationCap,
  FaEdit,
  FaFileAlt,
  FaMapMarkerAlt,
  FaLinkedin,
  FaGlobe,
  FaUser,
  FaLock,
  FaTools,
  FaCamera,
  FaTimes,
  FaCheck
} from "react-icons/fa";

function CandidateProfile() {

    const [activeTab,setActiveTab] = useState("profile");
    const [editing,setEditing] = useState(false);
    const [formData,setFormData] = useState({});
    const [profileImage, setProfileImage] = useState("");
    const [activities, setActivities] = useState([]);

  const [user, setUser] = useState({});

  useEffect(() => {
    loadProfile();
    loadActivities();
  }, []);

  useEffect(() => {

    setFormData({
  firstName: user.firstName || "",
  lastName: user.lastName || "",
  phone: user.phone || "",
  headline: user.headline || "",
  name: user.name || "",
  skills: user.skills || "",
  education: user.education || "",
  experience: user.experience || "",
  location: user.location || "",
  linkedin: user.linkedin || "",
  portfolio: user.portfolio || "",
  about: user.about || ""
});

}, [user]);

const profileFields = [
  user.name,
  user.skills,
  user.experience,
  user.location,
  user.linkedin,
  user.portfolio,
  user.about
];

const completedFields =
  profileFields.filter(Boolean).length;

const profileCompletion =
  Math.round(
    (completedFields / profileFields.length) * 100
  );

  const loadProfile = async () => {
    try {

      const email =
        localStorage.getItem("email");

      const response =
        await API.get(
          `/users/profile?email=${email}`
        );

      setUser(response.data);

    } catch (error) {
      console.log(error);
    }
  };

 const skills =
  user.skills
    ? user.skills.split(",")
    : [];

  const handleChange = (e) => {

  setFormData({
    ...formData,
    [e.target.name]: e.target.value
  });

};


const saveProfile = async () => {

  try {

await API.put("/users/profile", {
  email: user.email,
  firstName: formData.firstName,
  lastName: formData.lastName,
  phone: formData.phone,
  headline: formData.headline,
  education: formData.education,
  experience: formData.experience,
  location: formData.location,
  skills: formData.skills,
  linkedin: formData.linkedin,
  portfolio: formData.portfolio,
  about: formData.about
});

    alert("Profile Updated");

    setEditing(false);

    loadProfile();

  }
  catch(error){

    console.log(error);

    alert("Update Failed");

  }

};

const handleImageUpload = async (e) => {

  const file = e.target.files[0];

  if (!file) return;

  const imageUrl = URL.createObjectURL(file);

  setProfileImage(imageUrl);

  // Later upload to backend
};


const loadActivities = async () => {

    try{

        const email = localStorage.getItem("email");

        const response = await API.get(
            `/users/activity?email=${email}`
        );

        setActivities(response.data);

    }
    catch(error){

        console.log(error);

    }

};


  return (

    <DashboardLayout>

      {/* HERO */}

      <div className="candidate-banner">

        <div>

          <h1>
            {user.name || "Candidate"}
          </h1>

          <p>
            {user.headline || "Professional Headline Not Added"}
            {" . "} 
            {user.location || "Location Not Added"}
          </p>

          <div
            style={{
              marginTop: "15px"
            }}
          >

            <p>
              Profile Completion: {profileCompletion}%
            </p>

            <div
              style={{
                width: "250px",
                height: "8px",
                background: "rgba(255,255,255,.2)",
                borderRadius: "10px",
                overflow: "hidden"
              }}
            >

              <div
                style={{
                  width: `${profileCompletion}%`,
                  height: "100%",
                  background: "#34d399"
                }}
              />

            </div>

          </div>

        </div>

        <div
          style={{
            textAlign: "center"
          }}
        >

          <FaUserCircle
            style={{
              fontSize: "90px"
            }}
          />

          <br />

<button
className="profile-edit-btn"
onClick={() => setEditing(true)}
>
  <FaEdit />
  Edit Profile
</button>

        </div>

      </div>

      {/* STATS */}

      <div className="candidate-stats">

        <div className="candidate-stat">

          <div className="stat-icon blue">
            <FaBriefcase />
          </div>

          <div>
            <h3>Experience</h3>
            <h2>
              {user.experience || "0"}Y
            </h2>
          </div>

        </div>

        <div className="candidate-stat">

          <div className="stat-icon green">
            <FaCode />
          </div>

          <div>
            <h3>Skills</h3>
            <h2>
              {skills.length > 0 ? (
  skills.map((skill, index) => (
    <span key={index} className="blue-badge">
      {skill.trim()}
    </span>
  ))
) : (
  <p>No skills added.</p>
)}
            </h2>
          </div>

        </div>

        <div className="candidate-stat">

          <div className="stat-icon purple">
            <FaFileAlt />
          </div>

          <div>
            <h3>Resume Score</h3>
            <h2>{user.atsScore || 0}%</h2>
          </div>

        </div>

        <div className="candidate-stat">

          <div className="stat-icon orange">
            <FaGraduationCap />
          </div>

          <div>
            <h3>Education</h3>
            <h2>{user.education || "N/A"}</h2>
          </div>

        </div>

      </div>

      {/* ABOUT */}

      <div className="candidate-panel">

        <h2>
          About Me
        </h2>

        <p
          style={{
            color: "#94A3B8",
            lineHeight: "1.8"
          }}
        >
            {user.about || "Tell recruiters about yourself by updating your profile."}
        </p>

      </div>

      {/* SKILLS */}

      <div className="candidate-panel">

        <h2>
          Skills
        </h2>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
            marginTop: "20px"
          }}
        >

          {skills.map((skill, index) => (

            <span
              key={index}
              className="blue-badge"
            >
              {skill.trim()}
            </span>

          ))}

        </div>

      </div>

      {/* PROFESSIONAL INFO */}

      <div className="candidate-panel">

        <h2>
          Professional Information
        </h2>

        <table className="recruiter-table">

          <tbody>

            <tr>
              <td>
                <FaEnvelope />
                {" "}
                Email
              </td>

              <td>
                {user.email}
              </td>
            </tr>

            <tr>
              <td>
                <FaUserTag />
                {" "}
                Role
              </td>

              <td>
                {user.role || "Candidate"}
              </td>
            </tr>

            <tr>
              <td>
                <FaMapMarkerAlt />
                {" "}
                Location
              </td>

              <td>
                {user.location || "Not Added"}
              </td>
            </tr>

            <tr>
              <td>
                <FaLinkedin /> LinkedIn
              </td>

              <td>
                {user.linkedin || "Not Added"}
              </td>
            </tr>

            <tr>
              <td>
                <FaGlobe />
                {" "}
                Portfolio
              </td>

              <td>
                {user.portfolio || "Not Added"}
              </td>
            </tr>

          </tbody>

        </table>

      </div>

      {/* RESUME */}

      <div className="candidate-panel">

        <h2>
          Resume
        </h2>

        <div className="application-item">

          <div>
            <h3>
              {user.resumeName || "No Resume Uploaded"}
            </h3>

            <p>
              {user.resumeName
              ? "Resume uploaded successfully"
              : "Please upload your resume"}
            </p>

          </div>

          <span className="green-badge">
           ATS Score<br />
            <center>{user.atsScore || 0}%</center>
          </span>

        </div>

      </div>

      {/* ACTIVITY */}

      <div className="candidate-panel">

        <h2>
          Recent Activity
        </h2>

{
activities.length > 0 ? (

    activities.map((activity,index)=>(

        <div
            key={index}
            className="application-item"
        >

            <p>✅ {activity.title}</p>

            <span>
                {activity.date
                    ? new Date(activity.date).toLocaleDateString()
                    : ""}
            </span>

        </div>

    ))

) : (

    <div className="application-item">

        <p>No recent activity available.</p>

    </div>

)
}

      </div>

{
editing && (

<div className="profile-settings-overlay">

  <div className="profile-settings-container">

    {/* LEFT SIDEBAR */}

<div className="profile-sidebar">

  <span className="sidebar-role">
    CANDIDATE
  </span>

  <h2>My Profile</h2>

  <div className="sidebar-section">
    PERSONAL
  </div>

<div
className={`sidebar-menu ${activeTab==="profile"?"active":""}`}
onClick={()=>setActiveTab("profile")}
>
<FaUser />
<span>Profile</span>
</div>


<div
className={`sidebar-menu ${activeTab==="resume"?"active":""}`}
onClick={()=>setActiveTab("resume")}
>
<FaFileAlt />
<span>Resume</span>
</div>


<div
className={`sidebar-menu ${activeTab==="account"?"active":""}`}
onClick={()=>setActiveTab("account")}
>
<FaLock />
<span>Account</span>
</div>



<div className="sidebar-section">
PROFESSIONAL
</div>


<div
className={`sidebar-menu ${activeTab==="education"?"active":""}`}
onClick={()=>setActiveTab("education")}
>
<FaGraduationCap />
<span>Education</span>
</div>


<div
className={`sidebar-menu ${activeTab==="experience"?"active":""}`}
onClick={()=>setActiveTab("experience")}
>
<FaBriefcase />
<span>Experience</span>
</div>


<div
className={`sidebar-menu ${activeTab==="skills"?"active":""}`}
onClick={()=>setActiveTab("skills")}
>
<FaTools />
<span>Skills</span>
</div>
<div className="sidebar-footer">

  <p>
    Profile Completion
    <strong>{profileCompletion}%</strong>
  </p>

  <div className="completion-bar">
    <div
      className="completion-fill"
      style={{
        width: `${profileCompletion}%`
      }}
    />
  </div>

</div>

</div>

    {/* RIGHT CONTENT */}

    <div className="profile-content">

      <button
        className="profile-close-btn"
        onClick={() => setEditing(false)}
      >
        ✕
      </button>
<div className="profile-header">

  <div className="profile-breadcrumb">
    PERSONAL SETTINGS &gt; PROFILE
  </div>

  <button
    className="profile-close-btn"
    onClick={() => setEditing(false)}
  >
    <FaTimes />
  </button>

</div>

<h1 className="profile-title">
  Profile
</h1>

<p className="profile-subtitle">
  Manage your personal information and professional details.
</p>
{
activeTab === "profile" && (
    <>
<div className="profile-avatar-section">

  <div className="profile-avatar">

    {(formData.name?.charAt(0) || username)}

    <input
  type="file"
  id="profileImage"
  accept="image/*"
  style={{ display: "none" }}
  onChange={handleImageUpload}
/>

  <button
    className="avatar-upload-btn"
    onClick={() =>
      document
        .getElementById("profileImage")
        .click()
    }
  >
    <FaCamera />
  </button>

</div>
</div>

<h3 className="section-title">
  PERSONAL INFORMATION
</h3>

<div className="profile-form">

  {/* ROW 1 */}

  <div className="form-group">
    <label>First Name</label>

    <input
      name="name"
      value={formData.name}
      onChange={handleChange}
      placeholder="First name"
    />
  </div>

  <div className="form-group">
    <label>Last Name</label>

    <input
      name="lastname"
      value={formData.lastname || ""}
      onChange={handleChange}
      placeholder="Last name"
    />
  </div>

  {/* EMAIL */}

  <div className="form-group full-width">
    <label>Email Address</label>

    <input
      value={user.email || ""}
      disabled
    />
  </div>

  {/* PHONE */}

  <div className="form-group full-width">
    <label>Phone Number</label>

    <input
      name="phone"
      value={formData.phone || ""}
      onChange={handleChange}
      placeholder="Your phone number"
    />
  </div>

  {/* HEADLINE */}

  <div className="form-group full-width">
    <label>Professional Headline</label>

    <input
      name="headline"
      value={formData.headline || ""}
      onChange={handleChange}
      placeholder="e.g. Senior Software Engineer"
    />
  </div>

  {/* LOCATION */}

  <div className="form-group full-width">
    <label>Location</label>

    <input
      name="location"
      value={formData.location}
      onChange={handleChange}
      placeholder="Chennai, India"
    />
  </div>

  {/* LINKEDIN */}

  <div className="form-group full-width">
    <label>LinkedIn Profile</label>

    <input
      name="linkedin"
      value={formData.linkedin}
      onChange={handleChange}
      placeholder="https://linkedin.com/in/username"
    />
  </div>

  {/* PORTFOLIO */}

  <div className="form-group full-width">
    <label>Portfolio Website</label>

    <input
      name="portfolio"
      value={formData.portfolio}
      onChange={handleChange}
      placeholder="https://yourportfolio.com"
    />
  </div>

    {/* SUMMARY */}

  <div className="form-group full-width">
    <label>Professional Summary</label>

    <textarea
      rows="6"
      name="about"
      value={formData.about}
      onChange={handleChange}
      placeholder="Tell us about your professional background..."
    />
  </div>

</div>
</>
)
}
{
activeTab==="education" && (

<div className="profile-form">


<div className="form-group full-width">

<label>Highest Qualification</label>

<input
name="education"
value={formData.education}
onChange={handleChange}
placeholder="B.Sc Computer Science"
/>

</div>


<div className="form-group">

<label>College / University</label>

<input
name="college"
value={formData.college || ""}
onChange={handleChange}
/>

</div>


<div className="form-group">

<label>Graduation Year</label>

<input
name="graduationYear"
value={formData.graduationYear || ""}
onChange={handleChange}
/>

</div>


</div>

)
}

{
activeTab==="experience" && (

<div className="profile-form">


<div className="form-group">

<label>Total Experience</label>

<input
name="experience"
value={formData.experience}
onChange={handleChange}
placeholder="2 Years"
/>

</div>


<div className="form-group">

<label>Current Position</label>

<input
name="headline"
value={formData.headline}
onChange={handleChange}
/>

</div>


<div className="form-group full-width">

<label>Company</label>

<input
name="company"
value={formData.company || ""}
onChange={handleChange}
/>

</div>


</div>

)
}

{
activeTab==="skills" && (

<div className="profile-form">


<div className="form-group full-width">

<label>Your Skills</label>

<textarea

name="skills"

value={formData.skills}

onChange={handleChange}

placeholder="React, JavaScript, FastAPI, MongoDB"

/>

</div>


</div>

)
}

{
activeTab==="resume" && (

<div className="resume-box">


<FaFileAlt size={50}/>


<h2>
{user.resumeName || "No Resume Uploaded"}
</h2>

<p>
ATS Score : {user.atsScore || 0}%
</p>


<button className="profile-save-btn">
Upload Resume
</button>


</div>

)
}

{
activeTab==="account" && (

<div className="profile-form">


<div className="form-group full-width">

<label>Password</label>

<input
type="password"
placeholder="Change password"
/>

</div>



<div className="form-group full-width">

<label>Confirm Password</label>

<input
type="password"
/>

</div>


</div>

)
}

      <div className="profile-modal-actions">

        <button
          className="profile-cancel-btn"
          onClick={() => setEditing(false)}
        >
          Cancel
        </button>

        <button
          className="profile-save-btn"
          onClick={saveProfile}
        >
          <FaCheck />
          Save Changes
        </button>

      </div>

    </div>

  </div>

</div>

)
}
    </DashboardLayout>

  );
}

export default CandidateProfile;