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


const res =
await API.get("/jobs/");


setJobs(res.data);



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




const application={


candidateName,

jobTitle:job.title,

department:job.department,

location:job.location,

company:"AIHIRE",

status:"Applied",

appliedDate:
new Date().toLocaleDateString()



};






try{



await API.post(

"/applications/create",

application

);





await API.put(

`/jobs/${job._id}/applicant`

);






setAppliedJobs(

prev => [

...prev,

job._id

]

);






alert(
"Application Submitted Successfully"
);




}

catch(error){

console.log(error);


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


<span className="blue-badge">


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

"linear-gradient(135deg,#10b981,#059669)"


:

"linear-gradient(135deg,#2563eb,#7c3aed)",






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
"0 15px 30px rgba(37,99,235,.25)",



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