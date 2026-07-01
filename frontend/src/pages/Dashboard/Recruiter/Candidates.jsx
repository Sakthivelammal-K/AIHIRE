import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

const navigate = useNavigate();
const [applications,setApplications] = useState([]);
const [searchTerm,setSearchTerm] = useState("");
const [selectedCandidate,setSelectedCandidate] = useState("");
const [interviewType,setInterviewType] = useState("");
const [interviewDate,setInterviewDate] = useState("");

useEffect(()=>{

loadCandidates();

},[]);


const loadCandidates = async()=>{

try{

const response =
await API.get("/applications");

console.log("Applications:", response.data);

const data =
Array.isArray(response.data)
? response.data
: response.data.applications || [];

setApplications(data);

}

catch(error){

console.log(error);

setApplications([]);

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





const scheduleInterview = async()=>{


if(!interviewType || !interviewDate){

alert("Please select interview type and date");

return;

}


try{


await API.post(
"/interviews/create",
{

candidateName:selectedCandidate.candidateName,

jobTitle:selectedCandidate.jobTitle,

date:interviewDate,

type:interviewType,

status:"Scheduled",

meetingLink:"",

instructions:"",

notes:""

}
);




await API.put(

`/applications/${selectedCandidate._id}`,

{
status:"Scheduled"
}

);



setApplications(prev =>

prev.map(app =>

app._id === selectedCandidate._id

?

{
...app,
status:"Scheduled"
}

:

app

)

);



setSelectedCandidate(null);

setInterviewType("");

setInterviewDate("");

alert("Interview Scheduled");


}

catch(error){

console.log(error);

alert("Failed scheduling interview");

}


};





const safeApplications =
Array.isArray(applications)
? applications
: [];

const filteredApplications =
safeApplications.filter(app=>

(app.candidateName || "")
.toLowerCase()
.includes(searchTerm.toLowerCase())

||

(app.jobTitle || "")
.toLowerCase()
.includes(searchTerm.toLowerCase())

);




const total =
safeApplications.length;


const shortlisted =
safeApplications.filter(
a=>a.status==="Shortlisted"
).length;



const rejected =
safeApplications.filter(
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
{safeApplications.filter(
a=>a.status==="Scheduled"
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
color:"black"
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

app.status==="Scheduled" ?

<span className="blue-badge">
Scheduled
</span>


:

<span className="blue-badge">
{app.status || "Applied"}
</span>


}



</td>




<td>

<div className="action-buttons">

<button
className="action-btn approve-btn"
title="Shortlist Candidate"
onClick={() =>
updateStatus(app._id,"Shortlisted")
}
>
<FaCheck/>
</button>

<button
className="action-btn reject-btn"
title="Reject Candidate"
onClick={() =>
updateStatus(app._id,"Rejected")
}
>
<FaTimes/>
</button>

{

app.status==="Scheduled"

?

<button
className="action-btn interview-btn disabled-btn"
disabled
title="Interview Already Scheduled"
>

<FaVideo/>

</button>


:

<button
className="action-btn interview-btn"
title="Schedule Interview"
onClick={() => {

setSelectedCandidate(app);

setInterviewType("");

}}
>

<FaVideo/>

</button>

}

</div>


</td>

<td>

<button
 className="resume-btn"
 onClick={()=>navigate(`/resume-screening/${app._id}`)}
>

 AI Resume

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

{
selectedCandidate && (

<div
className="candidate-panel"
style={{
position:"fixed",
top:"20%",
left:"35%",
width:"400px",
zIndex:1000
}}
>


<h2>
Schedule Interview
</h2>


<p>

Candidate:

<strong>
{" "}
{selectedCandidate.candidateName}
</strong>

</p>



<div className="input-group">


<label>
Interview Type
</label>


<select

value={interviewType}

onChange={(e)=>
setInterviewType(e.target.value)
}

>


<option value="">
Select Type
</option>


<option value="Video Interview">
Video Interview
</option>


<option value="Online Assessment">
Online Assessment
</option>


</select>


</div>

<div className="input-group">

<label>
Interview Date
</label>

<input
type="date"
value={interviewDate}
onChange={(e)=>setInterviewDate(e.target.value)}
/>

</div>



<div
style={{
display:"flex",
gap:"15px",
marginTop:"20px"
}}
>


<button

className="profile-save-btn"

onClick={scheduleInterview}

>

Schedule

</button>




<button

className="profile-cancel-btn"

onClick={()=>setSelectedCandidate(null)}

>

Cancel

</button>


</div>


</div>

)

}


</DashboardLayout>


);


}


export default Candidates;