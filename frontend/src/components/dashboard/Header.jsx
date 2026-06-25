import { useNavigate } from "react-router-dom";

function Header({ userName, role }) {

  const navigate = useNavigate();

  const greeting = () => {

    const hour = new Date().getHours();

    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";

    return "Good Evening";
  };

  const handleProfileClick = () => {

    if (role === "recruiter") {
      navigate("/recruiter-profile");
    } else {
      navigate("/profile");
    }

  };

  return (

    <header className="dashboard-header">

      <div className="welcome">

        <h2>
          {greeting()}, {userName} 👋
        </h2>

        <p>
          {
            role === "recruiter"
              ? "Manage jobs, candidates and hiring activities."
              : "Track applications, interviews and career growth."
          }
        </p>

      </div>

      <div
        className="profile-card clickable-profile"
        onClick={handleProfileClick}
      >

        <div className="avatar">
          {userName?.charAt(0)?.toUpperCase()}
        </div>

        <div>

          <h4
            style={{
              margin: 0
            }}
          >
            {userName}
          </h4>

          <p
            style={{
              margin: 0,
              textTransform: "capitalize",
              color: "#94A3B8",
              fontSize: "13px"
            }}
          >
            {role}
          </p>

        </div>

      </div>

    </header>

  );

}

export default Header;