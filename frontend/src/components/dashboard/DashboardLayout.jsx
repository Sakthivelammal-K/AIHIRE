import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import "../../styles/dashboard.css";
import API from "../../api/api";

function DashboardLayout({ children, customTitle, customSubtitle }) {
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const email = localStorage.getItem("email");
      const res = await API.get(`/users/profile?email=${email}`);
      setUser(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const getCurrentPage = () => {
    const path = location.pathname;

    const pageMap = {
      // Recruiter
      "/recruiter/dashboard": "Dashboard",
      "/recruiter/jobs": "Jobs",
      "/recruiter/candidates": "Candidates",
      "/recruiter/interviews": "Interviews",
      "/recruiter/assessments": "Assessments",
      "/recruiter/interview-results": "Interview Results",
      "/recruiter/reports": "Reports",
      "/recruiter/messages": "Messages",
      "/recruiter/activity": "Activities",
      "/recruiter/notifications": "Notifications",
      "/recruiter/templates": "Templates",
      "/recruiter/settings": "Settings",
      "/recruiter/profile": "Profile",

      // Admin
      "/admin/dashboard": "Dashboard",
      "/admin/organizations": "Organizations",
      "/admin/users": "Users",
      "/admin/roles": "Permissions",
      "/admin/analytics": "Analytics",
      "/admin/settings": "Settings",

      // Candidate
      "/candidate/dashboard": "Dashboard",
      "/candidate/jobs": "Jobs",
      "/candidate/applications": "Applications",
      "/candidate/interviews": "Interviews",
      "/candidate/resume": "Resume",
      "/candidate/profile": "Profile",
      "/candidate/saved-jobs": "Saved Jobs",        // NEW
      "/candidate/activity": "My Activity",         // NEW
      "/candidate/messages": "Messages"             // NEW
    };

    return pageMap[path] || "Dashboard";
  };

  return (
    <div className="dashboard-container">
      <Sidebar />

      <div className="dashboard-main">
        <Header
          userName={user?.name || "User"}
          role={user?.role || "candidate"}
          currentPage={getCurrentPage()}
          customTitle={customTitle}
          customSubtitle={customSubtitle}
        />

        <main className="dashboard-content">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;