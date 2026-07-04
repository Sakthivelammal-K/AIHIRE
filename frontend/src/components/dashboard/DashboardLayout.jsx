import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import "../../styles/dashboard.css";
import API from "../../api/api";

function DashboardLayout({ children }) {
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

  // Get current page name from location
  const getCurrentPage = () => {
    const path = location.pathname;
    const pageMap = {
      "/recruiter-dashboard": "Dashboard",
      "/jobs": "Jobs",
      "/candidates": "Candidates",
      "/recruiter-interviews": "Interviews",
      "/assessments": "Assessments",
      "/ai-interview-results": "AI Interviews",
      "/reports": "Reports",
      "/messages": "Messages",
      "/notifications": "Notifications",
      "/templates": "Templates",
      "/settings": "Settings",
      "/admin-dashboard": "Dashboard",
      "/candidate-dashboard": "Dashboard"
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
        />
        <main className="dashboard-content">{children}</main>
      </div>
    </div>
  );
}

export default DashboardLayout;