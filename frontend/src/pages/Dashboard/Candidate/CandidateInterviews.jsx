import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import {useEffect,useState} from "react";
import API from "../../../api/api";


function CandidateInterviews(){


const [interviews,setInterviews] = useState([]);



useEffect(()=>{

loadInterviews();

},[]);



const loadInterviews = async()=>{

try{


const response =
await API.get("/interviews/");


setInterviews(response.data);


}

catch(error){

console.log(error);

}

};



const username =
localStorage.getItem("username");



const myInterviews =
interviews.filter(
(item)=>
item.candidateName === username
);



return (

<DashboardLayout>


<h1>My Interviews</h1>


<div className="activity-card">


<table>


<thead>

<tr>

<th>Job</th>
<th>Date</th>
<th>Type</th>
<th>Status</th>

</tr>

</thead>



<tbody>


{
myInterviews.length > 0 ?


myInterviews.map((item)=>(


<tr key={item._id}>


<td>
{item.jobTitle}
</td>


<td>
{item.date}
</td>


<td>
{item.type}
</td>


<td>
{item.status}
</td>


</tr>


))


:

<tr>

<td colSpan="4">
No Interviews Scheduled
</td>

</tr>

}


</tbody>


</table>


</div>


</DashboardLayout>

);


}


export default CandidateInterviews;