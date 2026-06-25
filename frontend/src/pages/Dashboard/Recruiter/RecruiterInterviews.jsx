import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import {useEffect,useState} from "react";
import API from "../../../api/api";

import {
FaVideo,
FaCalendar
} from "react-icons/fa";



function RecruiterInterviews(){


const [interviews,setInterviews]=useState([]);



useEffect(()=>{

load();

},[]);



const load=async()=>{

const res =
await API.get("/interviews");

setInterviews(res.data);

};





return (

<DashboardLayout>




<div className="candidate-banner">


<div>

<h1>
Interview Management
</h1>

<p>
AI interview scheduling
</p>


</div>


<div className="banner-icon">

<FaVideo/>

</div>


</div>



<br /><br />



<div className="candidate-panel hover-card">


<table className="recruiter-table animated-table">


<thead>

<tr>

<th>
Candidate
</th>

<th>
Role
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
interviews.length ?

interviews.map(i=>(


<tr key={i._id}>


<td>
{i.candidateName}
</td>


<td>
{i.jobTitle}
</td>


<td>

<FaCalendar/>

 {i.date}

</td>


<td>

<span className="blue-badge">

{i.type}

</span>

</td>


<td>

<span className="green-badge">

{i.status}

</span>

</td>


</tr>


))

:

<tr>

<td colSpan="5">
No Interviews
</td>

</tr>


}



</tbody>


</table>


</div>




</DashboardLayout>

);


}


export default RecruiterInterviews;