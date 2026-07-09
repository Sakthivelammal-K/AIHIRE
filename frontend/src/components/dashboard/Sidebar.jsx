import { Link, useLocation } from "react-router-dom";
import "../../styles/dashboard.css";

import {
  MdDashboard,
  MdBusiness,
  MdPeople,
  MdSecurity,
  MdAnalytics,
  MdSettings,
  MdWork,
  MdRecordVoiceOver,
  MdDescription,
  MdPerson,
  MdAssessment,
  MdFolder,
  MdLogout,
  MdChat,
  MdNotifications,
  MdFileCopy,
  MdCalendarToday,
  MdPsychology,
  MdOutlineTrendingUp,
  MdLocalActivity,
  MdBookmark,      // NEW: For Saved Jobs
  MdMessage        // NEW: For Candidate Messages
} from "react-icons/md";

function Sidebar() {
  const role = localStorage.getItem("role");
  const location = useLocation();

  const menus = {
    admin: [
      { name: "Dashboard", icon: <MdDashboard />, path: "/admin/dashboard" },
      { name: "Organizations", icon: <MdBusiness />, path: "/admin/organizations" },
      { name: "Users", icon: <MdPeople />, path: "/admin/users" },
      { name: "Permissions", icon: <MdSecurity />, path: "/admin/roles" },
      { name: "Analytics", icon: <MdAnalytics />, path: "/admin/analytics" },
      { name: "Settings", icon: <MdSettings />, path: "/admin/settings" }
    ],

    recruiter: [
      // MAIN SECTION
      { name: "Dashboard", icon: <MdDashboard />, path: "/recruiter/dashboard" },
      { name: "Jobs", icon: <MdWork />, path: "/recruiter/jobs" },
      { name: "Candidates", icon: <MdPeople />, path: "/recruiter/candidates" },
      { name: "Interview Calendar", icon: <MdCalendarToday />, path: "/recruiter/interviews" },
      { name: "Activities", icon: <MdLocalActivity />, path: "/recruiter/activity" },
      { name: "AI Interviews", icon: <MdPsychology />, path: "/recruiter/ai-interview-results" },
      { name: "Reports", icon: <MdOutlineTrendingUp />, path: "/recruiter/reports" },

      // OTHERS SECTION
      { name: "Messages", icon: <MdChat />, path: "/recruiter/messages", isOther: true },
      { name: "Notifications", icon: <MdNotifications />, path: "/recruiter/notifications", isOther: true },
      { name: "Templates", icon: <MdFileCopy />, path: "/recruiter/templates", isOther: true },
      { name: "Settings", icon: <MdSettings />, path: "/recruiter/settings", isOther: true }
    ],

    candidate: [
      // MAIN SECTION
      { name: "Dashboard", icon: <MdDashboard />, path: "/candidate/dashboard" },
      { name: "Jobs", icon: <MdWork />, path: "/candidate/jobs" },
      { name: "Saved Jobs", icon: <MdBookmark />, path: "/candidate/saved-jobs" },       // NEW
      { name: "Applications", icon: <MdDescription />, path: "/candidate/applications" },
      { name: "Interviews", icon: <MdRecordVoiceOver />, path: "/candidate/interviews" },
      { name: "Activity", icon: <MdLocalActivity />, path: "/candidate/activity" },      // NEW
      { name: "Resume", icon: <MdFolder />, path: "/candidate/resume" },
      { name: "Profile", icon: <MdPerson />, path: "/candidate/profile" },
      { name: "Messages", icon: <MdMessage />, path: "/candidate/messages" }             // NEW
    ]
  };

  const currentMenus = menus[role] || [];
  const mainMenus = currentMenus.filter(item => !item.isOther);
  const otherMenus = currentMenus.filter(item => item.isOther);

  return (
    <aside className="sidebar-new">
      <div className="logo-area-new">
        <h1>AIHIRE</h1>
        <p>AI Recruitment Platform</p>
      </div>

      <nav className="sidebar-nav">
        {role === "recruiter" && (
          <>
            <div className="nav-section">
              <span className="section-label">MAIN</span>
              <ul>
                {mainMenus.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={location.pathname === item.path ? "sidebar-link-new active" : "sidebar-link-new"}
                    >
                      <span className="menu-icon-new">{item.icon}</span>
                      <span>{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="nav-section">
              <span className="section-label">OTHERS</span>
              <ul>
                {otherMenus.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={location.pathname === item.path ? "sidebar-link-new active" : "sidebar-link-new"}
                    >
                      <span className="menu-icon-new">{item.icon}</span>
                      <span>{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}

        {role !== "recruiter" && (
          <ul>
            {currentMenus.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={location.pathname === item.path ? "sidebar-link-new active" : "sidebar-link-new"}
                >
                  <span className="menu-icon-new">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </nav>

      <div className="sidebar-bottom-new">
        <Link to="/" className="sidebar-link-new logout-btn">
          <span className="menu-icon-new">
            <MdLogout />
          </span>
          Logout
        </Link>
      </div>
    </aside>
  );
}

export default Sidebar;