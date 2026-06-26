import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import { useEffect, useState } from "react";
import API from "../../../api/api";

import {
FaBriefcase,
FaCheckCircle,
FaTimesCircle,
FaBuilding,
FaMapMarkerAlt,
FaUsers
} from "react-icons/fa";



function Organizations(){


const [jobs,setJobs]=useState([]);



useEffect(()=>{

loadJobs();

},[]);




const loadJobs = async()=>{


try{


const response =
await API.get("/jobs/");


setJobs(response.data);


}
catch(error){

console.log(error);

}


};




const activeJobs =
jobs.filter(
job=>job.status==="Open"
).length;




const closedJobs =
jobs.filter(
job=>job.status!=="Open"
).length;






return(


<DashboardLayout>


<div className="admin-dashboard">





{/* HEADER */}


<div className="dashboard-header">


<div>


<h1>

Organization Management

</h1>


<p>

Manage AIHIRE company jobs and recruitment activity

</p>


</div>



<FaBuilding className="dashboard-icon"/>


</div>









{/* CARDS */}



<div className="cards">





<div className="admin-card">


<FaBuilding className="dashboard-icon"/>


<h3>
Total Jobs
</h3>


<h2>
{jobs.length}
</h2>


</div>








<div className="admin-card">


<FaCheckCircle className="dashboard-icon"/>


<h3>
Active Jobs
</h3>


<h2>
{activeJobs}
</h2>


</div>








<div className="admin-card">


<FaTimesCircle className="dashboard-icon"/>


<h3>
Closed Jobs
</h3>


<h2>
{closedJobs}
</h2>


</div>





<div className="admin-card">


<FaUsers className="dashboard-icon"/>


<h3>
Applicants
</h3>


<h2>

{
jobs.reduce(
(total,job)=>
total+(job.applicants || 0),
0
)
}

</h2>


</div>





</div>









{/* JOB TABLE */}



<div className="activity-card">



<h2>

Organization Jobs

</h2>





<table className="recruiter-table">



<thead>


<tr>


<th>
Job Title
</th>


<th>
Department
</th>


<th>
Location
</th>


<th>
Status
</th>


<th>
Applicants
</th>


</tr>


</thead>







<tbody>



{


jobs.length > 0 ? (


jobs.map(job=>(


<tr key={job._id || job.id}>


<td>

{job.title || "N/A"}

</td>





<td>

{job.department || "N/A"}

</td>







<td>


<FaMapMarkerAlt/>


{" "}

{job.location || "N/A"}


</td>







<td>


<span

className={
job.status==="Open"
?
"green-badge"
:
"red-badge"
}

>


{
job.status || "Closed"
}


</span>


</td>








<td>


<FaUsers/>


{" "}

{
job.applicants || 0
}


</td>





</tr>


))


):(



<tr>


<td colSpan="5" style={{textAlign:"center"}}>


No Jobs Available


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



export default Organizations;