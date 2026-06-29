import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import API from "../../../api/api";
import { useEffect, useState } from "react";

import {
FaUsers,
FaUserCheck,
FaCalendarAlt,
FaChartLine,
FaRobot
} from "react-icons/fa";


function RecruiterDashboard() {


const [applications,setApplications]=useState([]);
const [interviews,setInterviews]=useState([]);


useEffect(()=>{

loadData();

},[]);



const loadData = async () => {

  try {

    const appResponse = await API.get("/applications/");
    const interviewResponse = await API.get("/interviews/");

    setApplications(
      Array.isArray(appResponse.data)
        ? appResponse.data
        : []
    );

    console.log(interviewResponse.data);

    setInterviews(
      Array.isArray(interviewResponse.data)
        ? interviewResponse.data
        : []
    );

  } catch (error) {

    console.log(error);

    setApplications([]);
    setInterviews([]);

  }

};



const shortlisted =
applications.filter(
a=>a.status==="Shortlisted"
).length;



const rejected =
applications.filter(
a=>a.status==="Rejected"
).length;



const recentApplications =
(Array.isArray(applications) ? applications : []).slice(0,5);



const upcomingInterviews =
(Array.isArray(interviews) ? interviews : []).slice(0,5);




return (

<DashboardLayout>


<div className="recruiter-dashboard">


{/* HEADER */}

<div className="recruiter-header">

<div>

<h1>
Recruiter Overview
</h1>

<p>
Track candidates, interviews and hiring performance
</p>

</div>


</div>




{/* STATS */}


<div className="recruiter-stats">

    <div className="dashboard-stat-card">

        <div className="dashboard-bg-circle"></div>

        <div className="stat-icon-box blue">
            <FaUsers/>
        </div>

        <div className="stat-content">
            <h3>Total Candidates</h3>
            <h1>{applications.length}</h1>
        </div>

    </div>


    <div className="dashboard-stat-card">

        <div className="dashboard-bg-circle"></div>

        <div className="stat-icon-box green">
            <FaUserCheck/>
        </div>

        <div className="stat-content">
            <h3>Shortlisted</h3>
            <h1>{shortlisted}</h1>
        </div>

    </div>


    <div className="dashboard-stat-card">

        <div className="dashboard-bg-circle"></div>

        <div className="stat-icon-box orange">
            <FaChartLine/>
        </div>

        <div className="stat-content">
            <h3>Rejected</h3>
            <h1>{rejected}</h1>
        </div>

    </div>


    <div className="dashboard-stat-card">

        <div className="dashboard-bg-circle"></div>

        <div className="stat-icon-box purple">
            <FaCalendarAlt/>
        </div>

        <div className="stat-content">
            <h3>Interviews</h3>
            <h1>{interviews.length}</h1>
        </div>

    </div>

</div>






{/* AI INSIGHT */}


<div className="recruiter-ai">


<div className="ai-icon">

<FaRobot/>

</div>


<div>

<h2>
AI Hiring Assistant
</h2>


<p>

Review shortlisted candidates first.
AI recommends focusing on candidates
with strong skill matches.

</p>


</div>


</div>






{/* TABLE */}


<div className="recruiter-panel">


<h2>
Recent Applications
</h2>



<table className="recruiter-table">


<thead>

<tr>

<th>
Candidate
</th>

<th>
Role
</th>

<th>
Location
</th>

<th>
Status
</th>

</tr>

</thead>



<tbody>


{
recentApplications.length>0 ?

recentApplications.map((app)=>(


<tr key={app._id}>


<td>
{app.candidateName}
</td>


<td>
{app.jobTitle}
</td>


<td>
{app.location}
</td>



<td>

<span className={
app.status==="Shortlisted"
?
"green-badge"
:
app.status==="Rejected"
?
"red-badge"
:
"blue-badge"
}>


{app.status}


</span>


</td>



</tr>



))


:

<tr>

<td colSpan="4">

No Applications Found

</td>

</tr>


}



</tbody>



</table>


</div>







<div className="recruiter-panel">


<h2>
Upcoming Interviews
</h2>



<table className="recruiter-table">


<thead>

<tr>

<th>
Candidate
</th>

<th>
Role
</th>

<th>
Date
</th>

<th>
Type
</th>


</tr>


</thead>


<tbody>


{

upcomingInterviews.length>0 ?

upcomingInterviews.map(
(interview)=>(


<tr key={interview._id}>


<td>
{interview.candidateName}
</td>


<td>
{interview.jobTitle}
</td>


<td>
{interview.date}
</td>


<td>
{interview.type}
</td>


</tr>


)

)

:

<tr>

<td colSpan="4">

No Interviews Scheduled

</td>

</tr>


}



</tbody>


</table>


</div>



</div>


</DashboardLayout>


);


}


export default RecruiterDashboard;