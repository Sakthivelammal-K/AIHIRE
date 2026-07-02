import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../api/api";

import {
FaBriefcase,
FaCheckCircle,
FaCalendarAlt,
FaFileAlt,
FaArrowRight,
FaChartLine
} from "react-icons/fa";

function CandidateDashboard() {

const navigate = useNavigate();

const [applications,setApplications] = useState([]);
const [interviews,setInterviews] = useState([]);

useEffect(()=>{

loadData();

},[]);

const loadData = async()=>{

try{

const app =
await API.get("/applications/");

setApplications(app.data);

const response =
await API.get("/interviews/");


setInterviews(
Array.isArray(response.data.scheduled)
?
response.data.scheduled
:
[]
);

}
catch(error){

console.log(error);

}

};

const username =
localStorage.getItem("username");

console.log("Username:", username);
console.log("Interviews:", interviews);

const myApplications =
applications.filter(
(item)=>
item.candidateName===username
);

const shortlisted =
myApplications.filter(
item=>item.status==="Shortlisted"
);

const myInterviews =
(interviews || []).filter(
item =>{
    console.log(item.candidateName, username);
return item.candidateName===username;
});

console.log("Filtered:", myInterviews);

return (

<DashboardLayout>

<div className="candidate-dashboard">

{/* Banner */}

<div className="candidate-banner">

<div>

<h1>
Welcome back, {username}
</h1>

<p>
Track applications, interviews and your hiring journey.
</p>

</div>

<div className="banner-icon">
<FaChartLine />
</div>

</div>

{/* Stats */}

<div className="candidate-stats">

<div
className="candidate-stat"
onClick={()=>navigate("/applications")}
style={{cursor:"pointer"}}
>

<div className="stat-icon blue">
<FaBriefcase/>
</div>

<div>
<h3>Applications</h3>
<h2>{myApplications.length}</h2>
</div>

</div>

<div
className="candidate-stat"
onClick={()=>navigate("/applications")}
style={{cursor:"pointer"}}
>

<div className="stat-icon green">
<FaCheckCircle/>
</div>

<div>
<h3>Shortlisted</h3>
<h2>{shortlisted.length}</h2>
</div>

</div>

<div
className="candidate-stat"
onClick={()=>navigate("/interviews")}
style={{cursor:"pointer"}}
>

<div className="stat-icon orange">
<FaCalendarAlt/>
</div>

<div>
<h3>Interviews</h3>
<h2>{myInterviews.length}</h2>
</div>

</div>

<div
className="candidate-stat"
onClick={()=>navigate("/resume")}
style={{cursor:"pointer"}}
>

<div className="stat-icon purple">
<FaFileAlt/>
</div>

<div>
<h3>Resume</h3>
<h2>Ready</h2>
</div>

</div>

</div>

{/* Applications */}

<div className="candidate-panel">

<div className="panel-header">

<h2>
Recent Applications
</h2>

<button
onClick={()=>navigate("/applications")}
>

View All

<FaArrowRight
style={{
marginLeft:"8px"
}}
/>

</button>

</div>

<div className="application-list">

{
myApplications.length===0 ?

(

<p>
No applications yet.
</p>

)

:

(

myApplications
.slice(-5)
.reverse()
.map(app=>(

<div
className="application-item"
key={app._id}
>

<div>

<h3>
{app.jobTitle}
</h3>

<p>
Applied on {app.appliedDate}
</p>

</div>

<span
className={
app.status==="Shortlisted"
?
"green-badge"
:
"blue-badge"
}
>

{app.status || "Applied"}

</span>

</div>

))

)

}

</div>

</div>

{/* Interviews */}

<div className="candidate-panel">

<div className="panel-header">

<h2>
Upcoming Interviews
</h2>

<button
onClick={()=>navigate("/interviews")}
>

View All

<FaArrowRight
style={{
marginLeft:"8px"
}}
/>

</button>

</div>

{

myInterviews.length===0 ?

(

<div className="empty-state">

<FaCalendarAlt
style={{
fontSize:"40px",
marginBottom:"10px"
}}
/>

<p>
No interviews scheduled yet
</p>

</div>

)

:

(

myInterviews.map(item=>(

<div
className="interview-card"
key={item._id}
onClick={()=>navigate("/interviews")}
style={{
cursor:"pointer",
marginTop:"15px"
}}
>

<h3>
{item.jobTitle}
</h3>

<p>
{item.date}
</p>

<span className="green-badge">
{item.status || "Scheduled"}
</span>

</div>

))

)

}

</div>

</div>

</DashboardLayout>

);

}

export default CandidateDashboard;