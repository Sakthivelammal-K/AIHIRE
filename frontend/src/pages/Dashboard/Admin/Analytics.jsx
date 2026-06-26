import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import { useEffect, useState } from "react";
import API from "../../../api/api";

import {
FaUsers,
FaBriefcase,
FaFileAlt,
FaVideo,
FaCheckCircle,
FaTimesCircle,
FaClock,
FaChartLine
} from "react-icons/fa";


function Analytics(){


const [users,setUsers]=useState([]);
const [jobs,setJobs]=useState([]);
const [applications,setApplications]=useState([]);
const [interviews,setInterviews]=useState([]);



useEffect(()=>{

loadData();

},[]);



const loadData = async()=>{

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




const pending =
applications.filter(
app=>app.status==="Pending"
).length;



const shortlisted =
applications.filter(
app=>app.status==="Shortlisted"
).length;



const rejected =
applications.filter(
app=>app.status==="Rejected"
).length;




return (

<DashboardLayout>


<div className="admin-dashboard">



{/* HEADER */}

<div className="dashboard-header">


<div>

<h1>
Analytics Dashboard
</h1>


<p>
Monitor AIHIRE recruitment performance
</p>


</div>



<FaChartLine
className="dashboard-icon"
/>



</div>





{/* STAT CARDS */}


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

<FaBriefcase className="dashboard-icon"/>

<h3>
Jobs
</h3>

<h2>
{jobs.length}
</h2>

</div>





<div className="admin-card">

<FaFileAlt className="dashboard-icon"/>

<h3>
Applications
</h3>

<h2>
{applications.length}
</h2>

</div>





<div className="admin-card">

<FaVideo className="dashboard-icon"/>

<h3>
Interviews
</h3>

<h2>
{interviews.length}
</h2>

</div>



</div>









{/* INSIGHTS */}



<div className="dashboard-grid">



<div className="activity-card">


<h2>
Platform Insights
</h2>



<div className="overview-item">

<FaUsers/>

<span>
Total Users
</span>

<b>
{users.length}
</b>

</div>





<div className="overview-item">

<FaBriefcase/>

<span>
Active Jobs
</span>

<b>
{jobs.length}
</b>

</div>





<div className="overview-item">

<FaFileAlt/>

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
Interviews
</span>

<b>
{interviews.length}
</b>

</div>



</div>









{/* PIPELINE */}



<div className="activity-card">


<h2>
Hiring Pipeline
</h2>



<div className="overview-item">

<FaClock/>

<span>
Pending
</span>

<b>
{pending}
</b>


</div>





<div className="overview-item">


<FaCheckCircle/>

<span>
Shortlisted
</span>


<b>
{shortlisted}
</b>


</div>






<div className="overview-item">

<FaTimesCircle/>

<span>
Rejected
</span>


<b>
{rejected}
</b>


</div>



</div>




</div>











{/* APPLICATION TABLE */}



<div className="activity-card">


<h2>
All Applications
</h2>




<table className="recruiter-table">


<thead>

<tr>

<th>
Candidate
</th>


<th>
Job
</th>


<th>
Status
</th>


</tr>


</thead>





<tbody>


{

applications.length > 0 ? (


applications.map(app=>(


<tr key={app._id || app.id}>


<td>

{
app.candidateName || "N/A"
}

</td>



<td>

{
app.jobTitle || "N/A"
}

</td>



<td>


<span
className={
app.status==="Rejected"
?
"red-badge"
:
app.status==="Shortlisted"
?
"green-badge"
:
"blue-badge"
}
>

{
app.status || "Pending"
}


</span>


</td>



</tr>


))


):(


<tr>

<td colSpan="3">

No Applications Found

</td>

</tr>


)


}



</tbody>



</table>



</div>






</div>


</DashboardLayout>

);


}


export default Analytics;