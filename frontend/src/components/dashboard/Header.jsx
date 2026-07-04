import { useNavigate } from "react-router-dom";
import { FaCalendarAlt } from "react-icons/fa";

function Header({ userName, role, currentPage }) {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    if (role === "recruiter") {
      navigate("/recruiter-profile");
    } else {
      navigate("/profile");
    }
  };

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  // Get page title based on current route
  const getPageTitle = () => {
    const path = window.location.pathname;
    if (path.includes("recruiter-dashboard")) return "Recruiter Dashboard";
    if (path.includes("jobs")) return "Jobs";
    if (path.includes("candidates")) return "Candidates";
    if (path.includes("interviews")) return "Interviews";
    if (path.includes("assessments")) return "Assessments";
    if (path.includes("ai-interview-results")) return "AI Interviews";
    if (path.includes("reports")) return "Reports";
    if (path.includes("messages")) return "Messages";
    if (path.includes("notifications")) return "Notifications";
    if (path.includes("templates")) return "Templates";
    if (path.includes("settings")) return "Settings";
    if (path.includes("recruiter-profile")) return "My Profile";
    if (path.includes("admin-dashboard")) return "Admin Dashboard";
    if (path.includes("candidate-dashboard")) return "Candidate Dashboard";
    if (path.includes("candidate-profile")) return "My Profile";
    return "Dashboard";
  };

  // Get subtitle based on role and page
  const getSubtitle = () => {
    const path = window.location.pathname;
    
    if (role === "recruiter") {
      if (path.includes("recruiter-dashboard")) {
        return `Welcome back, ${userName}! Here's what's happening with your jobs today.`;
      }
      if (path.includes("jobs")) return "Manage your job postings and requirements.";
      if (path.includes("candidates")) return "View and manage all candidate applications.";
      if (path.includes("interviews")) return "Schedule and manage interview calendar.";
      if (path.includes("assessments")) return "Create and manage candidate assessments.";
      if (path.includes("ai-interview-results")) return "Review AI-powered interview results.";
      if (path.includes("reports")) return "View hiring analytics and reports.";
      if (path.includes("messages")) return "Communicate with candidates and team.";
      if (path.includes("notifications")) return "Stay updated with latest activities.";
      if (path.includes("templates")) return "Manage email and assessment templates.";
      if (path.includes("settings")) return "Configure your account and preferences.";
      return `Welcome back, ${userName}!`;
    }
    
    if (role === "admin") {
      return `Welcome back, ${userName}! Manage your organization and users.`;
    }
    
    if (role === "candidate") {
      return `Welcome back, ${userName}! Track your applications and interviews.`;
    }
    
    return `Welcome back, ${userName}!`;
  };

  return (
    <header className="dashboard-header-new">
      <div className="header-left-new">
        <h2 className="header-greeting">
          {getPageTitle()}
        </h2>
        <p className="header-subtitle-new">
          {getSubtitle()}
        </p>
      </div>

      <div className="header-right-new">
        <div className="date-badge">
          <FaCalendarAlt />
          <span>
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'short', 
              month: 'short', 
              day: 'numeric' 
            })}
          </span>
        </div>
        
        <div className="profile-card-new" onClick={handleProfileClick}>
          <div className="avatar-new">
            {userName?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="profile-info-new">
            <h4>{userName || "User"}</h4>
            <p>{role || "User"}</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;