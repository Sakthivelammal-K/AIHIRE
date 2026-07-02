import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import {useEffect,useState} from "react";
import API from "../../../api/api";

import {
FaBriefcase,
FaMapMarkerAlt,
FaCode,
FaPaperPlane,
FaBuilding,
FaCheckCircle
} from "react-icons/fa";



function AvailableJobs(){


const [jobs,setJobs]=useState([]);

const [appliedJobs,setAppliedJobs]=useState([]);




useEffect(()=>{

loadJobs();

},[]);





const loadJobs=async()=>{


try{


const [
jobsRes,
applicationsRes

]=await Promise.all([


API.get("/jobs/"),

API.get("/applications/")

]);





setJobs(jobsRes.data);





const candidateName =
localStorage.getItem("username");



const myApplications =
applicationsRes.data.filter(
app =>
app.candidateName === candidateName
);





const appliedIds =
myApplications.map(
app=>app.job_id
);




setAppliedJobs(appliedIds);




}

catch(err){

console.log(err);

}


};




const handleApply=async(job)=>{



if(appliedJobs.includes(job._id))
return;

const candidateName =
localStorage.getItem("username");

const email = localStorage.getItem("email");

const application = {

    candidateName,

    email,

    job_id: job._id,

    jobTitle: job.title,

    department: job.department,

    location: job.location,

    company: "AIHIRE",

    status: "Applied",

    appliedDate: new Date().toLocaleDateString()

};



try{


await API.post(

"/applications/create",

application

);

// Run Resume Screening
await API.post(

"/resumes/screen",

{

email,

jobId: job._id

}

);

// Increase Applicant Count
await API.put(

`/jobs/${job._id}/applicant`

);



setAppliedJobs(

prev=>[

...prev,

job._id

]

);






alert(
"Application Submitted Successfully"
);



}

catch(error){


console.log(
"Application Error:",
error.response?.data || error
);


alert(
"Application failed"
);


}



};









return (


<DashboardLayout>





<div className="candidate-banner">



<div>



<h1>
Find Your Next Role
</h1>



<p>
AI powered job matching platform
</p>



</div>





<div className="banner-icon">


<FaBriefcase/>


</div>



</div>












<div className="candidate-stats">





<div className="candidate-stat">


<div className="stat-icon blue">


<FaBriefcase/>


</div>




<div>


<h3>
Available Jobs
</h3>



<h2>
{jobs.length}
</h2>



</div>


</div>







<div className="candidate-stat">


<div className="stat-icon green">


<FaCode/>


</div>




<div>


<h3>
AI Matching
</h3>


<h2>
95%
</h2>


</div>



</div>







<div className="candidate-stat">


<div className="stat-icon purple">


<FaBuilding/>


</div>



<div>


<h3>
Company
</h3>



<h2>
AIHIRE
</h2>



</div>



</div>





</div>









<div className="candidate-panel">






<h2>
Recommended Jobs
</h2>







<table className="recruiter-table">






<thead>


<tr>


<th>
Role
</th>


<th>
Department
</th>


<th>
Location
</th>


<th>
Skills
</th>


<th>
Action
</th>



</tr>



</thead>









<tbody>





{

jobs.length ?



jobs.map(job=>(





<tr key={job._id}>


<td>


<h3>

{job.title}

</h3>


</td>







<td>

{job.department}

</td>








<td>


<FaMapMarkerAlt/>

&nbsp;

{job.location}


</td>









<td>


<span>


{job.requiredSkills}


</span>



</td>









<td>








<button





onClick={()=>handleApply(job)}

disabled={
appliedJobs.includes(job._id)
}





style={{

background:

appliedJobs.includes(job._id)

?

"linear-gradient(135deg,#22C55E,#16A34A)"

:

"linear-gradient(135deg,#F97316,#EA580C)",



border:"none",


padding:"12px 20px",


borderRadius:"14px",


color:"white",


fontWeight:"700",


display:"flex",


alignItems:"center",


gap:"10px",


cursor:

appliedJobs.includes(job._id)

?

"default"

:

"pointer",


boxShadow:
"0 15px 30px rgba(249,115,22,.30)",


transition:"0.3s"


}}





>




{


appliedJobs.includes(job._id)



?

<>

<FaCheckCircle/>

Applied

</>



:


<>


<FaPaperPlane/>

Apply Now


</>


}



</button>









</td>









</tr>






))






:





<tr>


<td colSpan="5">


No jobs available


</td>



</tr>





}





</tbody>









</table>








</div>







</DashboardLayout>


);



}



export default AvailableJobs;