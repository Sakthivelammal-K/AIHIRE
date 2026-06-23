import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import API from "../../../api/api";
import { useEffect, useState } from "react";

function CandidateDashboard() {

  const [applications, setApplications] = useState([]);
const [interviews, setInterviews] = useState([]);


useEffect(()=>{

    loadData();

},[]);



const loadData = async()=>{

    try{

        const appResponse =
        await API.get("/applications/");


        setApplications(
            appResponse.data
        );


        const interviewResponse =
        await API.get("/interviews/");


        setInterviews(
            interviewResponse.data
        );


    }
    catch(error){

        console.log(error);

    }

};

  const username =
  localStorage.getItem("username");

  const myApplications =
  applications.filter(
    (app) =>
      app.candidateName === username
  );

  const shortlisted =
  myApplications.filter(
    (app) => app.status === "Shortlisted"
  );

  const myInterviews =
  interviews.filter(
    (item) =>
      item.candidatename === username
  );

  return (
    <DashboardLayout>

      <h1>Candidate Dashboard</h1>
      <p>Track your applications and interviews.</p>

      <div className="cards">

        <div className="card">
          <h3>Applications</h3>
          <p>{myApplications.length}</p>
        </div>

        <div className="card">
          <h3>Shortlisted</h3>
          <p>{shortlisted.length}</p>
        </div>

        <div className="card">
          <h3>Interviews</h3>
          <p>{myInterviews.length}</p>
        </div>

        <div className="card">
          <h3>Resume</h3>
          <p>
            {localStorage.getItem("resume")
              ? "✓"
              : "✗"}
          </p>
        </div>

      </div>

      <div className="activity-card">
        <h2>Recent Activity</h2>

        <ul>
          {myApplications.slice(-3).map((app) => (
            <li key={app.id}>
              Applied for {app.jobTitle}
            </li>
          ))}
        </ul>
      </div>

    </DashboardLayout>
  );
}

export default CandidateDashboard;