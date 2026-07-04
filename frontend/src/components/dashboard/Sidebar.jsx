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
  MdAutoAwesome,
  MdOutlineAnalytics,
  MdOutlineSmartToy,
  MdOutlineLightbulb,
  MdOutlineTrendingUp
} from "react-icons/md";

import { FaBrain, FaMicrochip, FaRocket, FaMagic } from "react-icons/fa";

function Sidebar() {
  const role = localStorage.getItem("role");
  const location = useLocation();

  const menus = {
    admin: [
      { name: "Dashboard", icon: <MdDashboard />, path: "/admin-dashboard" },
      { name: "Organizations", icon: <MdBusiness />, path: "/organizations" },
      { name: "Users", icon: <MdPeople />, path: "/users" },
      { name: "Permissions", icon: <MdSecurity />, path: "/roles" },
      { name: "Analytics", icon: <MdAnalytics />, path: "/analytics" },
      { name: "Settings", icon: <MdSettings />, path: "/settings" }
    ],

    recruiter: [
      // MAIN SECTION
      { name: "Dashboard", icon: <MdDashboard />, path: "/recruiter-dashboard" },
      { name: "Jobs", icon: <MdWork />, path: "/jobs" },
      { name: "Candidates", icon: <MdPeople />, path: "/candidates" },
      { name: "Interview Calendar", icon: <MdCalendarToday />, path: "/recruiter-interviews" },
      { name: "Assessments", icon: <MdAssessment />, path: "/online-assessment" },
      // AI Interviews - Using multiple AI-related icon options (choose one)
      // Option 1: Psychology (brain/AI thinking)
      { name: "AI Interviews", icon: <MdPsychology />, path: "/ai-interview-results" },
      // Option 2: Auto Awesome (AI magic/sparkle)
      //{ name: "AI Interviews", icon: <MdAutoAwesome />, path: "/ai-interview-results" },
      // Option 3: Lightbulb (AI insights)
      //{ name: "AI Interviews", icon: <MdOutlineLightbulb />, path: "/ai-interview-results" },
      // Option 4: Brain (Font Awesome)
      //{ name: "AI Interviews", icon: <FaBrain />, path: "/ai-interview-results" },
      // Option 5: Rocket (AI innovation)
      //{ name: "AI Interviews", icon: <FaRocket />, path: "/ai-interview-results" },
      // Option 6: Smart Toy (robot)
      // { name: "AI Interviews", icon: <MdOutlineSmartToy />, path: "/ai-interview-results" },
      { name: "Reports", icon: <MdOutlineTrendingUp />, path: "/reports" },
      // OTHERS SECTION
      { name: "Messages", icon: <MdChat />, path: "/messages", isOther: true },
      { name: "Notifications", icon: <MdNotifications />, path: "/notifications", isOther: true },
      { name: "Templates", icon: <MdFileCopy />, path: "/templates", isOther: true },
      { name: "Settings", icon: <MdSettings />, path: "/recruiter-profile", isOther: true }
    ],

    candidate: [
      { name: "Dashboard", icon: <MdDashboard />, path: "/candidate-dashboard" },
      { name: "Applications", icon: <MdDescription />, path: "/applications" },
      { name: "Jobs", icon: <MdWork />, path: "/available-jobs" },
      { name: "Interviews", icon: <MdRecordVoiceOver />, path: "/interviews" },
      { name: "Resume", icon: <MdFolder />, path: "/resume" },
      { name: "Profile", icon: <MdPerson />, path: "/profile" }
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