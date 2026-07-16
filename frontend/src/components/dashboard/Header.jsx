import { useNavigate } from "react-router-dom";
import { FaCalendarAlt } from "react-icons/fa";

function Header({ userName, role, customTitle, customSubtitle }) {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    if (role === "recruiter") {
      navigate("/recruiter/profile");
    } else if (role === "admin") {
      navigate("/admin/settings");
    } else {
      navigate("/candidate/profile");
    }
  };

  // Get page title based on current route
  const getPageTitle = () => {
    // If custom title is provided, use it
    if (customTitle) return customTitle;

    const path = window.location.pathname;

    // Dashboard
    if (path === "/recruiter/dashboard" || path === "/recruiter/dashboard/")
      return "Recruiter Dashboard";

    if (path === "/admin/dashboard" || path === "/admin/dashboard/")
      return "Admin Dashboard";

    if (path === "/candidate/dashboard" || path === "/candidate/dashboard/")
      return "Candidate Dashboard";

    // Recruiter Jobs
    if (path === "/recruiter/jobs" || path === "/recruiter/jobs/")
      return "Jobs";

    if (path.includes("/recruiter/jobs/create"))
      return "Create New Job";

    if (path.includes("/recruiter/jobs/edit"))
      return "Edit Job";

    if (path.includes("/recruiter/jobs/"))
      return "Job Details";

    // Recruiter Candidates
    if (path === "/recruiter/candidates" || path === "/recruiter/candidates/")
      return "Candidates";

    if (
      path.startsWith("/recruiter/candidates/") &&
      path !== "/recruiter/candidates"
    )
      return "Candidate Profile";

    if (path.includes("/recruiter/resume-screening"))
      return "Resume Screening";

    // Interviews
    if (
      path === "/recruiter/interviews" ||
      path === "/recruiter/interviews/"
    )
      return "Interview Calendar";

    if (
      path === "/candidate/interviews" ||
      path === "/candidate/interviews/"
    )
      return "Interviews";

    if (
      path === "/recruiter/interview-results" ||
      path === "/recruiter/interview-results/"
    )
      return "Interview Results";

    if (path === "/recruiter/reports" || path === "/recruiter/reports/")
      return "Reports";

    if (path === "/recruiter/messages" || path === "/recruiter/messages/")
      return "Messages";

    if (path === "/recruiter/activity" || path === "/recruiter/activity/")
      return "Activities";

    if (
      path === "/recruiter/notifications" ||
      path === "/recruiter/notifications/"
    )
      return "Notifications";

    if (path === "/recruiter/templates" || path === "/recruiter/templates/")
      return "Templates";

    if (path === "/recruiter/settings" || path === "/recruiter/settings/")
      return "Settings";

    if (path === "/recruiter/profile" || path === "/recruiter/profile/")
      return "My Profile";

    // Candidate Pages
    if (path === "/candidate/profile" || path === "/candidate/profile/")
      return "My Profile";

    if (
      path === "/candidate/applications" ||
      path === "/candidate/applications/"
    )
      return "My Applications";

    if (path === "/candidate/jobs" || path === "/candidate/jobs/")
      return "Available Jobs";

    if (path === "/candidate/saved-jobs" || path === "/candidate/saved-jobs/")
      return "Saved Jobs";

    if (path === "/candidate/resume" || path === "/candidate/resume/")
      return "Resume";

    if (path === "/candidate/messages" || path === "/candidate/messages/")
      return "Messages";

    if (path === "/candidate/activity" || path === "/candidate/activity/")
      return "My Activity";

    if (
        path === "/candidate/notifications" ||
        path === "/candidate/notifications/"
      ) {
        return "Notifications";
      }

    return "Dashboard";
  };

  // Get subtitle based on role and page
  const getSubtitle = () => {
    if (customSubtitle) return customSubtitle;

    const path = window.location.pathname;

    if (role === "recruiter") {
      if (path === "/recruiter/dashboard" || path === "/recruiter/dashboard/") {
        return `Welcome back, ${userName}! Here's what's happening with your jobs today.`;
      }

      if (path === "/recruiter/jobs" || path === "/recruiter/jobs/") {
        return "Manage your job postings and requirements.";
      }

      if (path.includes("/recruiter/jobs/create")) {
        return "Jobs > Create New Job";
      }

      if (path.includes("/recruiter/jobs/edit")) {
        return "Jobs > Edit Job";
      }

      if (path.includes("/recruiter/jobs/")) {
        return "Jobs > Job Details";
      }

      if (
        path === "/recruiter/candidates" ||
        path === "/recruiter/candidates/"
      ) {
        return "Manage all candidates and their applications";
      }

      if (
        path.startsWith("/recruiter/candidates/") &&
        path !== "/recruiter/candidates"
      ) {
        return "Candidates > Candidate Profile";
      }

      if (path.includes("/recruiter/resume-screening")) {
        return "AI powered resume analysis and candidate evaluation";
      }

      if (
        path === "/recruiter/interviews" ||
        path === "/recruiter/interviews/"
      ) {
        return "Schedule and manage candidate interviews";
      }

      if (
        path === "/recruiter/interview-results" ||
        path === "/recruiter/interview-results/"
      ) {
        return "Review completed interview evaluations";
      }

      if (path === "/recruiter/reports" || path === "/recruiter/reports/") {
        return "View hiring analytics and reports";
      }

      if (path === "/recruiter/messages" || path === "/recruiter/messages/") {
        return "Communicate with candidates and team";
      }

      if (path === "/recruiter/activity" || path === "/recruiter/activity/") {
        return "Track your recent hiring activities and updates";
      }

      if (
        path === "/recruiter/notifications" ||
        path === "/recruiter/notifications/"
      ) {
        return "Stay updated with latest activities";
      }

      if (path === "/recruiter/templates" || path === "/recruiter/templates/") {
        return "Manage email and assessment templates";
      }

      if (path === "/recruiter/settings" || path === "/recruiter/settings/") {
        return "Configure your account and preferences";
      }

      if (path === "/recruiter/profile" || path === "/recruiter/profile/") {
        return "View and manage your profile";
      }

      return `Welcome back, ${userName}!`;
    }

    if (role === "admin") {
      if (path === "/admin/dashboard" || path === "/admin/dashboard/") {
        return `Welcome back, ${userName}! Manage your organization and users.`;
      }

      if (path === "/admin/organizations") {
        return "Manage all organizations";
      }

      if (path === "/admin/users") {
        return "Manage all users";
      }

      if (path === "/admin/roles") {
        return "Manage permissions and roles";
      }

      if (path === "/admin/analytics") {
        return "View platform analytics";
      }

      return `Welcome back, ${userName}!`;
    }

    if (role === "candidate") {
      if (path === "/candidate/dashboard") {
        return `Welcome back, ${userName}! Track your applications and interviews.`;
      }

      if (path === "/candidate/applications") {
        return "Track the status of jobs you've applied for";
      }

      if (path === "/candidate/jobs") {
        return "Browse and apply for available positions";
      }

      if (path === "/candidate/saved-jobs") {
        return "Manage your saved job listings";
      }

      if (path === "/candidate/interviews") {
        return "View your scheduled interviews";
      }

      if (path === "/candidate/resume") {
        return "Manage your resume";
      }

      if (path === "/candidate/profile") {
        return "View and manage your profile";
      }

      if (path === "/candidate/messages") {
        return "Communicate with recruiters";
      }

      if (path === "/candidate/activity") {
        return "Track your application journey and interview progress";
      }

      if (path === "/candidate/notifications"){
        return "Stay updated with latest activities";
      }

      return `Welcome back, ${userName}!`;
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
            {new Date().toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>

        <div
          className="profile-card-new"
          onClick={handleProfileClick}
        >
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