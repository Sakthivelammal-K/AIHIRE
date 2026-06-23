import { useNavigate } from "react-router-dom";

function Header({ userName, role }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("role");

    navigate("/");
  };

  return (
    <div className="dashboard-header">

      <div>
        <h2>Welcome, {userName}</h2>
        <p style={{ color: "#64748b", marginTop: "5px" }}>
          Role: {role?.charAt(0).toUpperCase() + role?.slice(1)}
        </p>
      </div>

      <div className="header-right">

        <div className="profile">
          👤 {userName}
        </div>

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>

      </div>
              
    </div>
  );
}

export default Header;