import DashboardLayout from "../../../components/dashboard/DashboardLayout";

function Analytics() {

  const users =
  JSON.parse(localStorage.getItem("users")) || [];

  const jobs =
  JSON.parse(localStorage.getItem("jobs")) || [];

  const applications =
  JSON.parse(localStorage.getItem("applications")) || [];

  const interviews =
  JSON.parse(localStorage.getItem("interviews")) || [];

  const shortlisted =
  applications.filter((app) => app.status === "Shortlisted").length;

  const rejected =
  applications.filter((app) => app.status === "Rejected").length;

  const pending =
  applications.filter((app) => app.status === "Applied").length;

  return (
    <DashboardLayout>

      <h1>Analytics Dashboard</h1>

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

        <div className="stat-card">
          <h2>{interviews.length}</h2>
          <p>Interviews</p>
        </div>

      </div>

      <div className="activity-card">
        <h2>Platform Insights</h2>
        <p>
          👥 Total Users: {users.length}
        </p>

        <p>
          💼 Active Jobs: {jobs.length}
        </p>

        <p>
          📄 Applications Submitted: {applications.length}
        </p>

        <p>
          🎤 Interviews Scheduled: {interviews.length}
        </p>

      </div>

      <div className="activity-card">
        <h2>Hiring Pipeline</h2>
        <table>
          <thead>
            <tr>
              <th>Status</th>
              <th>Count</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>Applied</td>
              <td>{pending}</td>
            </tr>

            <tr>
              <td>Shortlisted</td>
              <td>{shortlisted}</td>
            </tr>

            <tr>
              <td>Rejected</td>
              <td>{rejected}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="activity-card">
        <h2>All Applications</h2>
        <table>
          <thead>
            <tr>
              <th>Candidate</th>
              <th>Job Title</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {applications.length > 0 ? (
              applications.map((app) => (
                <tr key={app.id}>
                  <td>{app.candidateName}</td>
                  <td>{app.jobTitle}</td>
                  <td>{app.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" style={{ textAlign: "center" }}>
                  No Applications Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </DashboardLayout>
  );
}

export default Analytics;