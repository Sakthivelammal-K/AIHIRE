import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import {useEffect,useState} from "react";
import API from "../../../api/api";

import {
FaFileAlt,
FaCheckCircle,
FaClock,
FaTimesCircle
} from "react-icons/fa";



function Applications(){


const [applications,setApplications]=useState([]);

const [loading,setLoading]=useState(true);




useEffect(()=>{

loadApplications();

},[]);





const loadApplications=async()=>{


try{


const response =
await API.get("/applications/");


setApplications(response.data);


}

catch(error){

console.log(error);

}

finally{

setLoading(false);

}


};





const username =
localStorage.getItem("username");




const myApplications =
applications.filter(

app=>
app.candidateName===username

);





const pending =
myApplications.filter(
a=>a.status==="Applied"
).length;



const shortlisted =
myApplications.filter(
a=>a.status==="Shortlisted"
).length;





return (


<DashboardLayout>






<div className="candidate-banner">


<div>


<h1>
My Applications
</h1>


<p>
Track your hiring journey
</p>



</div>



<div className="banner-icon">

<FaFileAlt/>

</div>


</div>










<div className="candidate-stats">





<div className="candidate-stat">


<div className="stat-icon blue">

<FaFileAlt/>

</div>


<div>

<h3>
Total Applied
</h3>


<h2>
{myApplications.length}
</h2>


</div>


</div>







<div className="candidate-stat">


<div className="stat-icon orange">

<FaClock/>

</div>


<div>

<h3>
Pending
</h3>


<h2>
{pending}
</h2>


</div>


</div>







<div className="candidate-stat">


<div className="stat-icon green">

<FaCheckCircle/>

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






</div>









<div className="candidate-panel">


<h2>
Application History
</h2>






<table className="recruiter-table">


<thead>


<tr>

<th>
Job
</th>


<th>
Company
</th>


<th>
Date
</th>


<th>
Status
</th>


</tr>


</thead>





<tbody>


{

loading ?


<tr>

<td colSpan="4">

Loading...

</td>

</tr>



:


myApplications.length ?



myApplications.map(app=>(


<tr key={app._id}>


<td>

{app.jobTitle}

</td>




<td>

{app.company}

</td>





<td>

{app.appliedDate}

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


<span className="blue-badge">

Applied

</span>


}



</td>




</tr>


))





:


<tr>


<td colSpan="4">

No applications found

</td>


</tr>


}



</tbody>



</table>





</div>





</DashboardLayout>


);


}



export default Applications;