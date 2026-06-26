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
FaClipboardList,
FaUserPlus
} from "react-icons/fa";


function AdminDashboard(){


const [users,setUsers]=useState([]);
const [jobs,setJobs]=useState([]);
const [applications,setApplications]=useState([]);
const [interviews,setInterviews]=useState([]);



useEffect(()=>{

loadData();

},[]);



const loadData=async()=>{

try{

const [
usersRes,
jobsRes,
appRes,
interviewRes

]=await Promise.all([

API.get("/users/"),
API.get("/jobs/"),
API.get("/applications/"),
API.get("/interviews/")

]);


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



return(

<DashboardLayout>


<div className="admin-dashboard">


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



<div className="admin-card">

<FaUsers className="dashboard-icon"/>

<h3>
Total Users
</h3>

<h2>
{users.length}
</h2>

</div>




<div className="admin-card">

<FaUserTie className="dashboard-icon"/>

<h3>
Recruiters
</h3>

<h2>
{recruiters}
</h2>

</div>





<div className="admin-card">

<FaUserGraduate className="dashboard-icon"/>

<h3>
Candidates
</h3>

<h2>
{candidates}
</h2>

</div>





<div className="admin-card">

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

<FaClipboardList/>

<span>
Applications
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
Accounts
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

AIHIRE manages {applications.length}
applications across {jobs.length} jobs.

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
Recent Activity
</h2>



<ul>


<li>

<FaUserPlus/>

{users.length} users registered

</li>



<li>

<FaBriefcase/>

{jobs.length} jobs created

</li>




<li>

<FaFileAlt/>

{applications.length} applications submitted

</li>




<li>

<FaVideo/>

{interviews.length} interviews completed

</li>



</ul>



</div>




</div>


</DashboardLayout>

);


}


export default AdminDashboard;