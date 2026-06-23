import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import {useEffect,useState} from "react";
import API from "../../../api/api";

function AdminDashboard() {


const [users,setUsers]=useState([]);
const [jobs,setJobs]=useState([]);
const [applications,setApplications]=useState([]);
const [interviews,setInterviews]=useState([]);



useEffect(()=>{

loadData();

},[]);



const loadData=async()=>{

try{

const usersRes = await API.get("/users/");
const jobsRes = await API.get("/jobs/");
const appRes = await API.get("/applications/");
const interviewRes = await API.get("/interviews/");


setUsers(usersRes.data);
setJobs(jobsRes.data);
setApplications(appRes.data);
setInterviews(interviewRes.data);


}
catch(error){

console.log(error);

}

};



const recruiters =
users.filter(
u=>u.role==="recruiter"
).length;


const candidates =
users.filter(
u=>u.role==="candidate"
).length;



return (

<DashboardLayout>


<h1>Platform Admin Dashboard</h1>

<p>
Manage organizations, users and platform activities.
</p>



<div className="cards">


<div className="card">
<h3>Total Users</h3>
<p>{users.length}</p>
</div>



<div className="card">
<h3>Recruiters</h3>
<p>{recruiters}</p>
</div>



<div className="card">
<h3>Candidates</h3>
<p>{candidates}</p>
</div>



<div className="card">
<h3>Total Jobs</h3>
<p>{jobs.length}</p>
</div>


</div>




<div className="activity-card">


<h2>Recent Activities</h2>


<ul>

<li>
Total Applications: {applications.length}
</li>


<li>
Total Interviews: {interviews.length}
</li>


<li>
Total Jobs: {jobs.length}
</li>


<li>
Total Users: {users.length}
</li>


</ul>


</div>


</DashboardLayout>

);


}


export default AdminDashboard;