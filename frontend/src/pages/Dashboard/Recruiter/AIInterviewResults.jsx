import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import {useEffect,useState} from "react";
import API from "../../../api/api";

import {
FaRobot,
FaCheckCircle,
FaTimesCircle,
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


setResults(
Array.isArray(res.data)
?
res.data
:
[]
);


}

catch(err){

console.log(err);

setResults([]);

}

finally{

setLoading(false);

}

};




const recommended =
results.filter(
r=>r.verdict==="Hire"
).length;



const consider =
results.filter(
r=>r.verdict==="Consider"
).length;



const rejected =
results.filter(
r=>r.verdict==="Reject"
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





{
loading ?


<div className="candidate-panel">

<h2>
Loading AI Results...
</h2>

</div>



:

results.length===0 ?



<div className="candidate-panel empty-state">


<FaRobot size={60}/>


<h2>
No Interview Results Yet
</h2>


<p>
AI analysis will appear here after a candidate completes an interview.
</p>


</div>



:



<>


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
{rejected}
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
Job
</th>

<th>
Overall
</th>

<th>
Technical
</th>

<th>
Communication
</th>

<th>
Confidence
</th>

<th>
Verdict
</th>


</tr>


</thead>






<tbody>



{
results.map((item,index)=>(


<tr
key={
item._id || index
}
>



<td>

{
item.candidateName
||
"Unknown"
}

</td>





<td>

{
item.jobTitle
||
"-"
}

</td>





<td>

<span className="blue-badge">

{
item.overall
||
0
}%

</span>

</td>





<td>

{
item.technical
||
0
}%

</td>





<td>

{
item.communication
||
0
}%

</td>





<td>

{
item.confidence
||
0
}%

</td>






<td>


{
item.verdict==="Hire"

?

<span className="green-badge">

Hire

</span>



:

item.verdict==="Consider"



?

<span className="orange-badge">

Consider

</span>



:


<span className="red-badge">

Reject

</span>



}



</td>






</tr>


))


}





</tbody>



</table>




</div>



</>



}




</DashboardLayout>


);


}



export default AIInterviewResults;