import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import {useEffect,useState} from "react";
import {useNavigate} from "react-router-dom";
import API from "../../../api/api";


import {
FaBriefcase,
FaPlus,
FaEdit,
FaTrash
} from "react-icons/fa";


function Jobs(){


const navigate=useNavigate();

const [jobs,setJobs]=useState([]);



useEffect(()=>{

loadJobs();

},[]);



const loadJobs=async()=>{

const res =
await API.get("/jobs/");

setJobs(res.data);

};



const deleteJob=async(id)=>{

await API.delete(
`/jobs/${id}`
);

loadJobs();

};



return (

<DashboardLayout>



<div className="candidate-banner">


<div>

<h1>
Job Management
</h1>

<p>
Create and manage open positions
</p>


</div>


<div className="banner-icon">

<FaBriefcase/>

</div>


</div>



<br /><br />


<div className="candidate-panel hover-card">



<div className="panel-header">


<h2>
Active Jobs
</h2>


<button
onClick={()=>navigate("/create-job")}
>

<FaPlus/>
 Create Job

</button>


</div>





<table className="recruiter-table animated-table">


<thead>

<tr>

<th>
Title
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
Actions
</th>


</tr>


</thead>



<tbody>


{
jobs.map(job=>(


<tr key={job._id}>


<td>
{job.title}
</td>


<td>
{job.department}
</td>


<td>
{job.location}
</td>


<td>

<span className="green-badge">
{job.status}
</span>

</td>


<td>


<button
onClick={()=>navigate(`/edit-job/${job._id}`)}
>

<FaEdit/>

</button>



<button
onClick={()=>deleteJob(job._id)}
>

<FaTrash/>

</button>


</td>



</tr>


))

}



</tbody>


</table>



</div>




</DashboardLayout>

);


}


export default Jobs;