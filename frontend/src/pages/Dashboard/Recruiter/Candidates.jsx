import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import { useEffect, useState } from "react";
import API from "../../../api/api";

import {
  FaUsers,
  FaUserCheck,
  FaUserTimes,
  FaCalendarCheck,
  FaSearch,
  FaRobot,
  FaCheck,
  FaTimes,
  FaVideo
} from "react-icons/fa";


function Candidates() {


const [applications,setApplications] = useState([]);
const [searchTerm,setSearchTerm] = useState("");



useEffect(()=>{

loadCandidates();

},[]);



const loadCandidates = async()=>{

try{

const response =
await API.get("/applications");


setApplications(response.data);


}
catch(error){

console.log(error);

}

};




const updateStatus = async(id,status)=>{


try{

await API.put(
`/applications/${id}`,
{
status
}
);


loadCandidates();


}
catch(error){

console.log(error);

}

};





const scheduleInterview = async(candidate)=>{


try{


await API.post(
"/interviews/create",
{

candidateName:candidate.candidateName,

jobTitle:candidate.jobTitle,

date:"25-Jun-2026",

type:"AI Video",

status:"Scheduled"

}

);


alert("Interview Scheduled");


}
catch(error){

console.log(error);

}

};






const filteredApplications =
applications.filter(app=>

(app.candidateName || "")
.toLowerCase()
.includes(searchTerm.toLowerCase())

||

(app.jobTitle || "")
.toLowerCase()
.includes(searchTerm.toLowerCase())

);




const total =
applications.length;


const shortlisted =
applications.filter(
a=>a.status==="Shortlisted"
).length;



const rejected =
applications.filter(
a=>a.status==="Rejected"
).length;




return (

<DashboardLayout>


<div className="candidate-banner">


<div>

<h1>
Candidate Pipeline
</h1>

<p>
Manage applicants with AI powered hiring workflow
</p>


</div>



<div className="banner-icon">

<FaRobot/>

</div>


</div>





<div className="candidate-stats">



<div className="candidate-stat">

<div className="stat-icon blue">

<FaUsers/>

</div>

<div>

<h3>Total Candidates</h3>

<h2>{total}</h2>

</div>

</div>





<div className="candidate-stat">

<div className="stat-icon green">

<FaUserCheck/>

</div>

<div>

<h3>Shortlisted</h3>

<h2>{shortlisted}</h2>

</div>

</div>






<div className="candidate-stat">

<div className="stat-icon orange">

<FaUserTimes/>

</div>

<div>

<h3>Rejected</h3>

<h2>{rejected}</h2>

</div>

</div>






<div className="candidate-stat">

<div className="stat-icon purple">

<FaCalendarCheck/>

</div>

<div>

<h3>Interviews</h3>

<h2>
{applications.filter(
a=>a.status==="Interview"
).length}
</h2>

</div>

</div>




</div>






<div className="candidate-panel hover-card">



<div className="panel-header">


<h2>
Applications
</h2>


<div>


<FaSearch/>


<input

style={{
marginLeft:"10px",
background:"transparent",
border:"1px solid #334155",
padding:"10px",
borderRadius:"10px",
color:"white"
}}

placeholder="Search candidate..."

value={searchTerm}

onChange={
e=>setSearchTerm(e.target.value)
}


/>


</div>


</div>








<table className="recruiter-table animated-table">


<thead>

<tr>

<th>Candidate</th>

<th>Role</th>

<th>Location</th>

<th>Status</th>

<th>Actions</th>


</tr>

</thead>




<tbody>


{

filteredApplications.length ?


filteredApplications.map(app=>(


<tr key={app._id}>


<td>

<h3>
{app.candidateName}
</h3>

<p>
{app.email}
</p>

</td>




<td>

{app.jobTitle}

</td>



<td>

{app.location}

</td>




<td>


{

app.status==="Shortlisted" ?


<span className="green-badge">
Shortlisted
</span>


:


app.status==="Rejected" ?


<span className="red-badge">
Rejected
</span>


:


<span className="blue-badge">

{app.status || "Applied"}

</span>


}



</td>




<td>



<button

className="panel-header button"

style={{
marginRight:"8px"
}}

onClick={()=>updateStatus(
app._id,
"Shortlisted"
)}

>

<FaCheck/>

</button>





<button

style={{
background:"#7f1d1d",
color:"white",
border:"none",
padding:"10px",
borderRadius:"10px",
marginRight:"8px"
}}

onClick={()=>updateStatus(
app._id,
"Rejected"
)}

>

<FaTimes/>

</button>






<button

style={{
background:"linear-gradient(135deg,#2563eb,#6366f1)",
color:"white",
border:"none",
padding:"10px",
borderRadius:"10px"
}}

onClick={()=>scheduleInterview(app)}

>

<FaVideo/>

</button>



</td>



</tr>


))


:


<tr>

<td colSpan="5">

No candidates found

</td>

</tr>


}



</tbody>



</table>




</div>




</DashboardLayout>


);


}


export default Candidates;