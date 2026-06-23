import DashboardLayout from "../../../components/dashboard/DashboardLayout";

function Settings() {

  const users =
    JSON.parse(localStorage.getItem("users")) || [];

  const jobs =
    JSON.parse(localStorage.getItem("jobs")) || [];

  const applications =
    JSON.parse(localStorage.getItem("applications")) || [];

  return (
    <DashboardLayout>

      <h1>Platform Settings</h1>

      <div className="dashboard-stats">

        <div className="stat-card">
          <h2>{users.length}</h2>
          <p>Total Users</p>
        </div>

        <div className="stat-card">
          <h2>{jobs.length}</h2>
          <p>Total Jobs</p>
        </div>

        <div className="stat-card">
          <h2>{applications.length}</h2>
          <p>Applications</p>
        </div>

      </div>

      <div className="activity-card">

        <h2>Platform Information</h2>

        <table>

          <tbody>

            <tr>
              <td>Platform Name</td>
              <td>AIHIRE</td>
            </tr>

            <tr>
              <td>Version</td>
              <td>1.0.0</td>
            </tr>

            <tr>
              <td>Support Email</td>
              <td>support@aihire.com</td>
            </tr>

            <tr>
              <td>Environment</td>
              <td>Development</td>
            </tr>

          </tbody>

        </table>

      </div>

      <div className="activity-card">

        <h2>System Status</h2>

        <p>🟢 Application Status : Running</p>

        <p>🟢 Database Status : Local Storage Active</p>

        <p>🟢 AI Modules : Enabled</p>

      </div>

    </DashboardLayout>
  );
}

export default Settings;