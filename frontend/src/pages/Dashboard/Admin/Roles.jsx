import DashboardLayout from "../../../components/dashboard/DashboardLayout";

function Roles() {

  return (
    <DashboardLayout>

      <h1>Roles & Permissions</h1>

      <div className="activity-card">

        <table>

          <thead>
            <tr>
              <th>Role</th>
              <th>Responsibilities</th>
              <th>Access Level</th>
            </tr>
          </thead>

          <tbody>

            <tr>
              <td>Admin</td>
              <td>
                Manage Users, Analytics, Settings,
                Organizations
              </td>
              <td>Full Access</td>
            </tr>

            <tr>
              <td>Recruiter</td>
              <td>
                Create Jobs, Manage Candidates,
                Schedule Interviews
              </td>
              <td>Recruitment Access</td>
            </tr>

            <tr>
              <td>Candidate</td>
              <td>
                Apply Jobs, Upload Resume,
                Attend Interviews
              </td>
              <td>Candidate Access</td>
            </tr>

          </tbody>

        </table>

      </div>

      <div className="activity-card">

        <h2>Role Overview</h2>

        <ul>

          <li>
            Admin controls the entire AIHIRE platform.
          </li>

          <li>
            Recruiters manage hiring activities.
          </li>

          <li>
            Candidates apply and attend interviews.
          </li>

        </ul>

      </div>

    </DashboardLayout>
  );
}

export default Roles;