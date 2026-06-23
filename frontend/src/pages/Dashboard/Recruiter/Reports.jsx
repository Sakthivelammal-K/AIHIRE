import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import {useEffect,useState} from "react";
import API from "../../../api/api";


function Reports(){


const [jobs,setJobs]=useState([]);
const [applications,setApplications]=useState([]);
const [interviews,setInterviews]=useState([]);



useEffect(()=>{

loadReports();

},[]);



const loadReports=async()=>{


try{


const jobsRes =
await API.get("/jobs/");


const appsRes =
await API.get("/applications/");


const intRes =
await API.get("/interviews/");



setJobs(jobsRes.data);

setApplications(appsRes.data);

setInterviews(intRes.data);



}
catch(error){

console.log(error);

}

};



const shortlisted =
applications.filter(
(app)=>app.status==="Shortlisted"
);



return (

<DashboardLayout>


<h1>
Recruitment Reports
</h1>



<div className="cards">


<div className="card">

<h3>
Jobs
</h3>

<p>
{jobs.length}
</p>

</div>



<div className="card">

<h3>
Applications
</h3>

<p>
{applications.length}
</p>

</div>



<div className="card">

<h3>
Shortlisted
</h3>

<p>
{shortlisted.length}
</p>

</div>



<div className="card">

<h3>
Interviews
</h3>

<p>
{interviews.length}
</p>

</div>



</div>


</DashboardLayout>


);

}


export default Reports;