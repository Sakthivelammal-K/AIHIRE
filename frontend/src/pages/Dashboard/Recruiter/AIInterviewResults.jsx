import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import {useEffect,useState} from "react";
import API from "../../../api/api";


function AIInterviewResults(){


const [results,setResults]=useState([]);



useEffect(()=>{

loadResults();

},[]);



const loadResults=async()=>{


try{

const response =
await API.get("/interviews/results");


setResults(response.data);


}

catch(error){

console.log(error);

}


};



return(

<DashboardLayout>


<h1>
AI Interview Results
</h1>



<div className="activity-card">


<table>


<thead>

<tr>

<th>
Candidate
</th>

<th>
Interview Score
</th>

<th>
Recommendation
</th>


</tr>

</thead>



<tbody>


{

results.length>0 ?


results.map((item)=>(


<tr key={item._id}>


<td>
{item.candidateName}
</td>



<td>
{item.score}%
</td>



<td>

{
item.score>=80
?
"Recommended"
:
"Not Recommended"
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