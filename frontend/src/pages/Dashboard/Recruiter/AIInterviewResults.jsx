import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import {useEffect,useState} from "react";
import API from "../../../api/api";

import {
FaRobot,
FaCheckCircle,
FaTimesCircle
} from "react-icons/fa";


function AIInterviewResults(){


const [results,setResults]=useState([]);
const [loading,setLoading]=useState(true);



useEffect(()=>{

loadResults();

},[]);



const loadResults=async()=>{

try{

const res =
await API.get("/interviews/results");

setResults(res.data || []);

}

catch(err){

console.log(err);

}

finally{

setLoading(false);

}

};



const recommended =
results.filter(
r=>(r.score||0)>=80
).length;



return (

<DashboardLayout>



<div className="candidate-banner">


<div>

<h1>
AI Interview Analytics
</h1>

<p>
AI generated candidate evaluation reports
</p>


</div>


<div className="banner-icon">

<FaRobot/>

</div>


</div>





<div className="candidate-stats">


<div className="candidate-stat">

<div className="stat-icon blue">

<FaRobot/>

</div>

<div>

<h3>Total Interviews</h3>

<h2>
{results.length}
</h2>

</div>

</div>




<div className="candidate-stat">

<div className="stat-icon green">

<FaCheckCircle/>

</div>

<div>

<h3>Recommended</h3>

<h2>
{recommended}
</h2>

</div>

</div>



<div className="candidate-stat">

<div className="stat-icon orange">

<FaTimesCircle/>

</div>

<div>

<h3>Rejected</h3>

<h2>
{results.length-recommended}
</h2>

</div>

</div>


</div>






<div className="candidate-panel hover-card">


<h2>
Interview Results
</h2>


<table className="recruiter-table animated-table">


<thead>

<tr>

<th>
Candidate
</th>

<th>
Score
</th>

<th>
Decision
</th>

</tr>

</thead>



<tbody>


{
loading ?


<tr>
<td colSpan="3">
Loading...
</td>
</tr>


:

results.length ?


results.map(item=>(


<tr key={item._id}>


<td>
{item.candidateName || "Unknown"}
</td>



<td>

<span className="blue-badge">

{item.score || 0}%

</span>

</td>



<td>


{
(item.score||0)>=80 ?

<span className="green-badge">
Recommended
</span>

:

<span className="red-badge">
Not Recommended
</span>

}



</td>



</tr>


))


:

<tr>

<td colSpan="3">
No Results
</td>

</tr>


}



</tbody>


</table>


</div>




</DashboardLayout>

);

}


export default AIInterviewResults;