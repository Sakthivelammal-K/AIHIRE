import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import {useEffect,useState} from "react";
import API from "../../../api/api";


function CandidateDashboard(){

const [applications,setApplications]=useState([]);
const [interviews,setInterviews]=useState([]);



useEffect(()=>{

loadData();

},[]);



const loadData=async()=>{

try{

const app =
await API.get("/applications/");

setApplications(app.data);



const interview =
await API.get("/interviews/");

setInterviews(interview.data);


}

catch(error){

console.log(error);

}

};



const username =
localStorage.getItem("username");



const myApplications =
applications.filter(
(item)=>
item.candidateName === username
);



const shortlisted =
myApplications.filter(
(item)=>
item.status==="Shortlisted"
);



const myInterviews =
interviews.filter(
(item)=>
item.candidateName===username
);



return (

<DashboardLayout>


<h1>
Candidate Dashboard
</h1>


<p>
Track your applications and interviews
</p>



<div className="cards">


<div className="card">
<h3>Applications</h3>
<p>{myApplications.length}</p>
</div>



<div className="card">
<h3>Shortlisted</h3>
<p>{shortlisted.length}</p>
</div>



<div className="card">
<h3>Interviews</h3>
<p>{myInterviews.length}</p>
</div>



<div className="card">

<h3>Resume</h3>

<p>
✓
</p>

</div>


</div>





<div className="activity-card">

<h2>
Recent Activity
</h2>


<ul>


{
myApplications.slice(-3).map(app=>(


<li key={app._id}>

Applied for {app.jobTitle}

</li>


))

}


</ul>


</div>


</DashboardLayout>


);


}


export default CandidateDashboard;