import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import { useEffect, useState } from "react";
import API from "../../../api/api";

import {
  FaUsers,
  FaUserTie,
  FaUserGraduate,
  FaBriefcase,
  FaFileAlt,
  FaVideo,
  FaChartLine,
} from "react-icons/fa";


function AdminDashboard() {


const [users,setUsers]=useState([]);
const [jobs,setJobs]=useState([]);
const [applications,setApplications]=useState([]);
const [interviews,setInterviews]=useState([]);



useEffect(()=>{

loadData();

},[]);



const loadData = async()=>{

try{

const usersRes = await API.get("/users/");
const jobsRes = await API.get("/jobs/");
const appRes = await API.get("/applications/");
const interviewRes = await API.get("/interviews/");


setUsers(usersRes.data);
setJobs(jobsRes.data);
setApplications(appRes.data);
setInterviews(interviewRes.data);


}
catch(error){

console.log(error);

}

};



const recruiters =
users.filter(
user=>user.role==="recruiter"
).length;


const candidates =
users.filter(
user=>user.role==="candidate"
).length;



return (

<DashboardLayout>


<div className="dashboard-header">


<div>

<h1>
Admin Dashboard
</h1>

<p>
Monitor AIHIRE platform performance and activity
</p>

</div>


</div>




<div className="cards">



<div className="card">

<FaUsers className="dashboard-icon"/>

<h3>
Total Users
</h3>

<h2>
{users.length}
</h2>

</div>




<div className="card">

<FaUserTie className="dashboard-icon"/>

<h3>
Recruiters
</h3>

<h2>
{recruiters}
</h2>

</div>




<div className="card">

<FaUserGraduate className="dashboard-icon"/>

<h3>
Candidates
</h3>

<h2>
{candidates}
</h2>

</div>




<div className="card">

<FaBriefcase className="dashboard-icon"/>

<h3>
Active Jobs
</h3>

<h2>
{jobs.length}
</h2>

</div>


</div>





<div className="dashboard-grid">



<div className="activity-card">


<h2>
Platform Overview
</h2>



<div className="overview-item">

<FaFileAlt/>

<span>
Applications Received
</span>


<b>
{applications.length}
</b>


</div>



<div className="overview-item">

<FaVideo/>

<span>
AI Interviews
</span>


<b>
{interviews.length}
</b>


</div>




<div className="overview-item">

<FaBriefcase/>

<span>
Jobs Posted
</span>


<b>
{jobs.length}
</b>


</div>



<div className="overview-item">

<FaUsers/>

<span>
Total Accounts
</span>


<b>
{users.length}
</b>


</div>



</div>







<div className="activity-card">


<h2>
Recruitment Analytics
</h2>


<div className="analytics-box">


<FaChartLine/>


<div>

<h3>
Hiring Activity
</h3>


<p>
AIHIRE is managing {applications.length} applications across {jobs.length} jobs.
</p>


</div>


</div>



<div className="progress-box">


<div>

<span>
Recruiters
</span>

<strong>
{recruiters}
</strong>

</div>



<div>

<span>
Candidates
</span>

<strong>
{candidates}
</strong>

</div>


</div>



</div>



</div>





<div className="activity-card recent">


<h2>
Recent Platform Activity
</h2>


<ul>


<li>
👥 {users.length} users registered
</li>


<li>
💼 {jobs.length} jobs created
</li>


<li>
📄 {applications.length} applications submitted
</li>


<li>
🎥 {interviews.length} interviews completed
</li>


</ul>


</div>



</DashboardLayout>


);


}


export default AdminDashboard;