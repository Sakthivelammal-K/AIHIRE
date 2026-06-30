import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import {useEffect,useState} from "react";
import API from "../../../api/api";

import {
FaRobot,
FaVideo,
FaCheckCircle,
FaTimesCircle
} from "react-icons/fa";


function AIInterviewResults(){


const [results,setResults]=useState([]);

const [loading,setLoading]=useState(true);

const [selectedResult,setSelectedResult]=useState(null);


const [recruiterComment,setRecruiterComment]=useState("");

const [recruiterRating,setRecruiterRating]=useState(0);

const [finalDecision,setFinalDecision]=useState("");





useEffect(()=>{

loadResults();

},[]);




const loadResults=async()=>{

try{


const res =
await API.get("/video-interviews/");


setResults(
Array.isArray(res.data)
?
res.data
:
[]
);



}

catch(error){

console.log(error);

setResults([]);

}


finally{

setLoading(false);

}

};




const saveReview=async()=>{


if(!selectedResult)
return;



try{


await API.put(

`/interviews/result/${selectedResult._id}`,

{

recruiterComment,

recruiterRating,

finalDecision

}

);



alert(
"Review Saved"
);



setSelectedResult(null);


loadResults();



}

catch(error){


console.log(error);


alert(
"Review Failed"
);


}


};







const hired =
results.filter(
r=>r.verdict==="Hire"
).length;



const rejected =
results.filter(
r=>r.verdict==="Reject"
).length;









return(


<DashboardLayout>



<div className="candidate-banner">


<div>

<h1>
Interview Results
</h1>


<p>
AI + Video Interview Evaluation
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
Loading Results...
</h2>

</div>



:

<>



<div className="candidate-stats">



<div className="candidate-stat">

<div className="stat-icon blue">

<FaRobot/>

</div>


<div>

<h3>
Total
</h3>


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

<h3>
Hired
</h3>


<h2>
{hired}
</h2>

</div>


</div>






<div className="candidate-stat">


<div className="stat-icon orange">

<FaTimesCircle/>

</div>



<div>

<h3>
Rejected
</h3>


<h2>
{rejected}
</h2>


</div>


</div>


</div>









<div className="candidate-panel">


<h2>
All Results
</h2>





<table className="recruiter-table">


<thead>

<tr>

<th>
Type
</th>

<th>
Candidate
</th>


<th>
Job
</th>


<th>
Score
</th>


<th>
Verdict
</th>


<th>
Action
</th>


</tr>

</thead>




<tbody>


{

results.length===0 ?

<tr>

<td colSpan="6">

No interview results found

</td>


</tr>


:

results.map(item=>(



<tr key={item._id}>


<td>


{
item.type==="Video Interview"

?

<span className="blue-badge">

<FaVideo/>

Video

</span>


:

<span className="orange-badge">

<FaRobot/>

AI

</span>

}


</td>





<td>

{item.candidateName}

</td>





<td>

{item.jobTitle || "-"}

</td>





<td>

<span className="green-badge">

{item.overall || 0}%

</span>

</td>





<td>


{

item.verdict==="Hire"


?


<span className="green-badge">

Hire

</span>



:


item.verdict==="Reject"


?


<span className="red-badge">

Reject

</span>



:


<span className="orange-badge">

Pending

</span>


}



</td>








<td>


<button

className="profile-save-btn"

onClick={()=>{


setSelectedResult(item);



setRecruiterComment(
item.recruiterComment || ""
);



setRecruiterRating(
item.recruiterRating || 0
);



setFinalDecision(
item.finalDecision || ""
);



}}

>

Review

</button>



</td>





</tr>



))


}



</tbody>


</table>



</div>



</>

}














{
selectedResult &&



<div className="candidate-panel">



<h2>
Candidate Review
</h2>





<h3>
{selectedResult.type}
</h3>




<p>

Candidate :

{selectedResult.candidateName}

</p>





<p>

Role :

{selectedResult.jobTitle}

</p>









{
selectedResult.videoPath &&

<>


<h3>
Recorded Interview
</h3>


<video

width="600"

controls

>


<source

src={

`http://127.0.0.1:8000/${selectedResult.videoPath}`

}

/>


</video>





<h3>

Violations

</h3>


<p>

{selectedResult.violations || 0}

</p>



</>

}








<h3>
Answers
</h3>



<ul>


{

selectedResult.answers?.map(
(a,i)=>(


<li key={i}>


<b>

Q{a.questionNo}

</b>


{" : "}

{a.answer}



</li>


)

)


}


</ul>









<h3>
AI Scores
</h3>


<p>

Technical :

{selectedResult.technical || 0}%

</p>


<p>

Communication :

{selectedResult.communication || 0}%

</p>


<p>

Confidence :

{selectedResult.confidence || 0}%

</p>


<p>

Overall :

{selectedResult.overall || 0}%

</p>









<label>

Recruiter Rating

</label>



<select

value={recruiterRating}

onChange={
e=>
setRecruiterRating(
Number(e.target.value)
)
}

>


<option value="0">
Select
</option>


<option value="1">
1
</option>


<option value="2">
2
</option>


<option value="3">
3
</option>


<option value="4">
4
</option>


<option value="5">
5
</option>


</select>








<textarea

rows="4"

placeholder="Recruiter comment"

value={recruiterComment}

onChange={
e=>
setRecruiterComment(
e.target.value
)
}


/>









<select

value={finalDecision}

onChange={
e=>
setFinalDecision(
e.target.value
)
}

>


<option value="">
Decision
</option>


<option value="Selected">
Selected
</option>


<option value="Hold">
Hold
</option>


<option value="Rejected">
Rejected
</option>


</select>









<button

className="profile-save-btn"

onClick={saveReview}

>

Save Review

</button>





</div>



}





</DashboardLayout>


);


}


export default AIInterviewResults;