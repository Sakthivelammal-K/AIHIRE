import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import {useEffect,useState} from "react";
import API from "../../../api/api";


import {
FaBriefcase,
FaUsers,
FaCalendarCheck,
FaChartLine
} from "react-icons/fa";



function Reports(){


const [jobs,setJobs]=useState([]);

const [applications,setApplications]=useState([]);

const [interviews,setInterviews]=useState([]);





useEffect(()=>{

loadReports();

},[]);




const loadReports=async()=>{


try{


const j =
await API.get("/jobs/");


const a =
await API.get("/applications/");


const i =
await API.get("/interviews/");



setJobs(j.data);

setApplications(a.data);

setInterviews(i.data);



}

catch(err){

console.log(err);

}


};





const shortlisted =
applications.filter(
a=>a.status==="Shortlisted"
).length;





return (

<DashboardLayout>





<div className="candidate-banner">


<div>

<h1>
Recruitment Analytics
</h1>

<p>
Track hiring performance
</p>


</div>


<div className="banner-icon">

<FaChartLine/>

</div>


</div>








<div className="candidate-stats">



<div className="candidate-stat">

<div className="stat-icon blue">

<FaBriefcase/>

</div>


<div>

<h3>
Jobs
</h3>

<h2>
{jobs.length}
</h2>

</div>

</div>






<div className="candidate-stat">

<div className="stat-icon green">

<FaUsers/>

</div>


<div>

<h3>
Applications
</h3>

<h2>
{applications.length}
</h2>

</div>

</div>






<div className="candidate-stat">

<div className="stat-icon purple">

<FaUsers/>

</div>


<div>

<h3>
Shortlisted
</h3>

<h2>
{shortlisted}
</h2>

</div>

</div>






<div className="candidate-stat">

<div className="stat-icon orange">

<FaCalendarCheck/>

</div>


<div>

<h3>
Interviews
</h3>

<h2>
{interviews.length}
</h2>

</div>

</div>




</div>






<div className="candidate-panel hover-card">


<h2>
Hiring Overview
</h2>



<div className="application-item">

<div>

<h3>
Hiring Pipeline
</h3>


<p>
AIHIRE recruitment statistics
</p>


</div>


</div>



</div>





</DashboardLayout>


);


}


export default Reports;