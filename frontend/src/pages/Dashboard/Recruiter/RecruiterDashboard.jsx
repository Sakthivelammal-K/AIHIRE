import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import API from "../../../api/api";
import { useEffect, useState } from "react";

function RecruiterDashboard() {

const [applications, setApplications] = useState([]);
const [interviews, setInterviews] = useState([]);

useEffect(() => {
  loadData();
}, []);

const loadData = async () => {
  try {
    const appResponse = await API.get("/applications/");
    setApplications(appResponse.data);

    const interviewResponse = await API.get("/interviews/");
    setInterviews(interviewResponse.data);
  } catch (error) {
    console.log(error);
  }
};

  const strongHire = 
  applications.filter((app) => app.status === "Shortlisted").length;

  const rejected = 
  applications.filter((app) => app.status === "Rejected").length;

  const totalCandidates =
  applications.length;

  const averageMatchScore =
  applications.length > 0 ? 85 : 0;

  const recentApplications =
  [...applications].sort((a, b) => b.id - a.id).slice(0, 5);

  const upcomingInterviews =
  interviews.slice(0, 5);
  
  return (
    <DashboardLayout>

      <h1>Recruiter Dashboard</h1>
      <p>Manage hiring activities and track recruitment progress.</p>

      <div className="dashboard-stats">

        <div className="stat-card">
          <h2>{totalCandidates}</h2>
          <p>Total Candidates</p>
        </div>

        <div className="stat-card">
          <h2>{strongHire}</h2>
          <p>Shortlisted</p>
        </div>

        <div className="stat-card">
          <h2>{rejected}</h2>
          <p>Rejected</p>
        </div>

        <div className="stat-card">
          <h2>{interviews.length}</h2>
          <p>Interviews Scheduled</p>
        </div>

        <div className="stat-card">
          <h2>{averageMatchScore}%</h2>
          <p>Average Match Score</p>
        </div>

      </div>

      <div className="activity-card">
        <h2>AI Hiring Insights</h2>
        <p>
          ⭐ Top Recommendation:
          Review shortlisted candidates first.
        </p>

        <p>
          📈 Hiring Pipeline:
          {totalCandidates} candidates in process.
        </p>

        <p>
          🤖 AI Suggestion:
          Focus on candidates with match score above 80%.
        </p>

      </div>

      <div className="activity-card">
  <h2>Recruitment Overview</h2>

  <div className="dashboard-stats">

    <div className="stat-card">
      <h2>{totalCandidates}</h2>
      <p>Total Candidates</p>
    </div>

    <div className="stat-card">
      <h2>{strongHire}</h2>
      <p>Shortlisted</p>
    </div>

    <div className="stat-card">
      <h2>{rejected}</h2>
      <p>Rejected</p>
    </div>

  </div>

</div>

      <div className="activity-card">
        <h2>Recent Applications</h2>
        {recentApplications.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Candidate</th>
                <th>Job Title</th>
                <th>Location</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {recentApplications.map((app) => (
                <tr key={app.id}>
                  <td>{app.candidateName}</td>
                  <td>{app.jobTitle}</td>
                  <td>{app.location}</td>
                  <td>
  <span
    className={
      app.status === "Shortlisted"
        ? "status-shortlisted"
        : app.status === "Rejected"
        ? "status-rejected"
        : "status-applied"
    }
  >
    {app.status}
  </span>
</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No Applications Available</p>
        )}
      </div>

      <div className="activity-card">
        <h2>Upcoming Interviews</h2>
        {upcomingInterviews.length > 0 ?(
          <table>
            <thead>
              <tr>
                <th>Candidate</th>
                <th>Job Title</th>
                <th>Date</th>
                <th>Type</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {upcomingInterviews.map((interview) => (
                <tr key={interview.id}>
                  <td>{interview.candidateName}</td>
                  <td>{interview.jobTitle}</td>
                  <td>{interview.date}</td>
                  <td>{interview.type}</td>
                  <td>{interview.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No Interviews Scheduled.</p>
        )}
      </div>

    </DashboardLayout>
  );
}

export default RecruiterDashboard;