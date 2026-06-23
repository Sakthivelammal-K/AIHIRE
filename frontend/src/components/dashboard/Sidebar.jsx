import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const role = localStorage.getItem("role");
  const location = useLocation();

  const menus = {
    admin: [
      { name: "🏠 Dashboard", path: "/admin-dashboard" },
      { name: "🏢 Organizations", path: "/organizations" },
      { name: "👥 Users", path: "/users" },
      { name: "🔐 Roles & Permissions", path: "/roles" },
      { name: "📊 Analytics", path: "/analytics" },
      { name: "⚙️ Settings", path: "/settings" },
    ],

    recruiter: [
      { name: "🏠 Dashboard", path: "/recruiter-dashboard" },
      { name: "💼 Jobs", path: "/jobs" },
      { name: "👥 Candidates", path: "/candidates" },
      { name: "🎤 Interviews", path: "/recruiter-interviews" },
      { name: "🤖 AI Results", path: "/ai-interview-results" },
      { name: "📈 Reports", path: "/reports" },
      { name: "👤 Profile", path: "/recruiter-profile" },
    ],

    candidate: [
      { name: "🏠 Dashboard", path: "/candidate-dashboard" },
      { name: "📄 Applications", path: "/applications" },
      { name: "💼 Available Jobs", path: "/available-jobs"},
      { name: "🎤 Interviews", path: "/interviews" },
      { name: "📑 Resume", path: "/resume" },
      { name: "👤 Profile", path: "/profile" },
    ],
  };

  return (
    <div className="sidebar">

      <h2>AIHIRE</h2>

      <p className="sidebar-subtitle" 
        style={{
          color: "#94a3b8",
          marginBottom: "20px",
          fontSize: "14px",
        }}
      >
        AI Recruitment Platform
      </p>

      <ul>
        {menus[role]?.map((item, index) => (
          <li key={index}>
            <Link
              to={item.path}
              className={`sidebar-link ${
                location.pathname === item.path ? "active-link" : ""
              }`}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>

    </div>
  );
}

export default Sidebar;