import DashboardLayout from "../../../components/dashboard/DashboardLayout";

function Organizations() {

  const jobs =
    JSON.parse(localStorage.getItem("jobs")) || [];

  const activeJobs =
    jobs.filter((job) => job.status === "Open").length;

  const closedJobs =
    jobs.filter((job) => job.status !== "Open").length;

  return (
    <DashboardLayout>

      <h1>Organization Management</h1>

      <div className="dashboard-stats">

        <div className="stat-card">
          <h2>{jobs.length}</h2>
          <p>Total Jobs</p>
        </div>

        <div className="stat-card">
          <h2>{activeJobs}</h2>
          <p>Active Jobs</p>
        </div>

        <div className="stat-card">
          <h2>{closedJobs}</h2>
          <p>Closed Jobs</p>
        </div>

      </div>

      <div className="activity-card">

        <h2>Organization Jobs</h2>

        <table>

          <thead>
            <tr>
              <th>Job Title</th>
              <th>Department</th>
              <th>Location</th>
              <th>Status</th>
              <th>Applicants</th>
            </tr>
          </thead>

          <tbody>

            {jobs.length > 0 ? (

              jobs.map((job) => (

                <tr key={job.id}>
                  <td>{job.title}</td>
                  <td>{job.department}</td>
                  <td>{job.location}</td>
                  <td>{job.status}</td>
                  <td>{job.applicants || 0}</td>
                </tr>

              ))

            ) : (

              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  No Jobs Available
                </td>
              </tr>

            )}

          </tbody>

        </table>

      </div>

    </DashboardLayout>
  );
}

export default Organizations;