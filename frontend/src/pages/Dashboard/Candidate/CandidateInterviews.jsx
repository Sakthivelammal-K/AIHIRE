import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import {useEffect,useState} from "react";
import API from "../../../api/api";


import {
FaVideo,
FaCalendarCheck,
FaRobot
} from "react-icons/fa";



function CandidateInterviews(){



const [interviews,setInterviews]=useState([]);




useEffect(()=>{

loadInterviews();

},[]);





const loadInterviews=async()=>{


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

item=>

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
Interview Timeline
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



<tr key={item._id}>


<td>

{item.jobTitle}

</td>



<td>

{item.date}

</td>



<td>


<span className="blue-badge">

{item.type}

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

No interviews scheduled

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