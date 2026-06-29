import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import {useEffect,useState} from "react";
import API from "../../../api/api";
import { useNavigate } from "react-router-dom";

import {
FaVideo,
FaCalendarCheck,
FaRobot,
FaBrain,
FaMicrophone,
FaChartLine,
FaLightbulb
} from "react-icons/fa";



function CandidateInterviews(){

const navigate = useNavigate();

const [interviews,setInterviews]=useState([]);

const [results,setResults] = useState([]);

const [selectedInterview, setSelectedInterview] = useState(null);

const [selectedResult, setSelectedResult] = useState(null);


useEffect(()=>{

loadInterviews();
loadResult();

},[]);





const loadInterviews = async()=>{

try{

const res = await API.get("/interviews/");


setInterviews(
res.data.scheduled || []
);


setResults(
res.data.results || []
);


}

catch(error){

console.log(error);

setInterviews([]);

setResults([]);

}

};

const loadResult = async()=>{

try{

const response =
await API.get("/interviews/results");


const username =
localStorage.getItem("username");


const existing =
response.data.find(
item =>
item.candidateName===username
);


if(existing){

setResult(existing);
setSubmitted(true);

}


}

catch(error){

console.log(error);

}

};


const username =
localStorage.getItem("username");




const myInterviews = (interviews || []).filter(
item =>
item.candidateName === username
);



const myResults =
(results || []).filter(
item =>
item.candidateName===username
);





return (


<DashboardLayout>





<div className="candidate-banner">


<div>


<h1>
My Interviews
</h1>


<p>
AI interview schedule and status
</p>


</div>



<div className="banner-icon">

<FaRobot/>

</div>


</div>







<div className="candidate-stats">



<div className="candidate-stat">


<div className="stat-icon purple">

<FaVideo/>

</div>



<div>

<h3>
Scheduled
</h3>


<h2>
{myInterviews.length}
</h2>


</div>


</div>
<div className="candidate-stat">


<div className="stat-icon green">

<FaCalendarCheck/>

</div>


<div>

<h3>
Completed
</h3>


<h2>
{myResults.length}
</h2>


</div>


</div>



<div className="candidate-stat">


<div className="stat-icon green">

<FaRobot/>

</div>


<div>


<h3>
Type
</h3>


<h2>
AI
</h2>


</div>


</div>




</div>








<div className="candidate-panel">


<h2>
Scheduled Interviews
</h2>


<table className="recruiter-table">


<thead>

<tr>

<th>
Job
</th>

<th>
Date
</th>

<th>
Type
</th>

<th>
Status
</th>

</tr>

</thead>


<tbody>


{

myInterviews.length ?


myInterviews.map(item=>(


<tr
key={item._id}
onClick={() => setSelectedInterview(item)}
style={{cursor:"pointer"}}
>


<td>
{item.jobTitle}
</td>


<td>
{item.date}
</td>


<td>

<span className="blue-badge">

{item.type || "Interview"}

</span>

</td>


<td>

<span className="green-badge">

{item.status}

</span>

</td>


</tr>


))


:


<tr>

<td colSpan="4">

No scheduled interviews

</td>

</tr>


}


</tbody>


</table>





<br/>
<br/>




<h2>
AI Interview Results
</h2>


<table className="recruiter-table">


<thead>

<tr>

<th>
Job
</th>

<th>
Score
</th>

<th>
Technical
</th>

<th>
Communication
</th>

<th>
Status
</th>

<th>
Action
</th>

</tr>

</thead>



<tbody>


{

myResults.length ?


myResults.map((item,index)=>(


<tr 
key={index}
>


<td>

{item.jobTitle}

</td>



<td>

<span className="blue-badge">

{item.overall}%

</span>

</td>



<td>

{item.technical}%

</td>



<td>

{item.communication}%

</td>



<td>

<span className="green-badge">

Completed

</span>

</td>



<td>


<button

className="profile-save-btn"

onClick={() =>
setSelectedResult(item)
}

>

View Report

</button>


</td>



</tr>


))


:


<tr>

<td colSpan="5">

No AI results available

</td>

</tr>


}


</tbody>


</table>



</div>


{
selectedInterview && (

<div className="candidate-panel" style={{marginTop:"30px"}}>

<h2>Interview Details</h2>

<div className="application-item">
<div>
<h3>Job</h3>
<p>{selectedInterview.jobTitle}</p>
</div>
</div>

<div className="application-item">
<div>
<h3>Date</h3>
<p>{selectedInterview.date}</p>
</div>
</div>

<div className="application-item">
<div>
<h3>Interview Type</h3>
<p>{selectedInterview.type}</p>
</div>
</div>

<div className="application-item">
<div>
<h3>Status</h3>
<p>{selectedInterview.status}</p>
</div>
</div>

<div className="application-item">
<div>
<h3>Meeting Link</h3>
<p>
{selectedInterview.meetingLink || "Not Available"}
</p>
</div>
</div>

<div className="application-item">
<div>
<h3>Instructions</h3>
<p>
{selectedInterview.instructions ||
"No instructions provided"}
</p>
</div>
</div>

<div className="application-item">
<div>
<h3>Recruiter Notes</h3>
<p>
{selectedInterview.notes ||
"No recruiter notes"}
</p>
</div>
</div>

<div
style={{
display:"flex",
gap:"20px",
marginTop:"30px"
}}
>

{
selectedInterview.meetingLink && (

<button
className="profile-save-btn"
onClick={()=>
window.open(
selectedInterview.meetingLink,
"_blank"
)
}
>

Join Interview

</button>

)
}

<button
className="profile-save-btn"
onClick={()=>{


const type =
selectedInterview.type;


if(type==="AI Interview"){

navigate("/ai-interview");

}


else if(type==="Video Interview"){

navigate("/video-interview");

}


else if(type==="Voice Interview"){

navigate("/voice-interview");

}


else{

alert("Interview type not selected");

}


}}
>

Start Interview

</button>

</div>

</div>

)
}

{
selectedResult && (

<div
className="candidate-panel"
style={{
marginTop:"30px"
}}
>


<h2>
AI Interview Report
</h2>


<div className="candidate-stats">


<div className="candidate-stat">

<div className="stat-icon blue">

<FaBrain/>

</div>


<div>

<h3>
Technical
</h3>

<h2>
{selectedResult.technical}%
</h2>

</div>

</div>




<div className="candidate-stat">

<div className="stat-icon purple">

<FaMicrophone/>

</div>


<div>

<h3>
Communication
</h3>

<h2>
{selectedResult.communication}%
</h2>

</div>

</div>





<div className="candidate-stat">

<div className="stat-icon green">

<FaChartLine/>

</div>


<div>

<h3>
Confidence
</h3>

<h2>
{selectedResult.confidence}%
</h2>

</div>

</div>



</div>



<h3>

<FaLightbulb/>

 AI Feedback

</h3>



<ul>

{
selectedResult.strengths?.map(
(s,i)=>

<li key={i}>

✅ {s}

</li>

)
}

</ul>



<ul>

{
selectedResult.improvements?.map(
(s,i)=>

<li key={i}>

⚠️ {s}

</li>

)
}

</ul>



<button

className="profile-cancel-btn"

onClick={() => setSelectedResult(null)}

>

Close Report

</button>



</div>

)

}

</DashboardLayout>


);


}



export default CandidateInterviews;