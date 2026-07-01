import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import { useEffect, useState } from "react";
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
const [assessment,setAssessment]=useState(null);


const [reviewType,setReviewType]=useState("");



const [recruiterComment,setRecruiterComment]=useState("");
const [recruiterRating,setRecruiterRating]=useState(0);
const [finalDecision,setFinalDecision]=useState("");





useEffect(()=>{

loadResults();

},[]);


const loadResults = async()=>{

try{


const [videoRes,assessmentRes]=await Promise.all([


API.get("/video-interviews/completed"),


API.get("/assessments/results")


]);




const videos = videoRes.data.map(item=>({


...item,


resultType:"video",

applicationId:item.applicationId


}));





const assessments = assessmentRes.data.map(item=>({


...item,


resultType:"assessment"


}));





setResults([

...videos,

...assessments

]);



console.log(
"Interview Results",
[
...videos,
...assessments
]
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


const saveReview = async()=>{


if(!reviewType)
return;



try{


const payload={

recruiterComment,

recruiterRating,

finalDecision

};





// VIDEO RESULT SAVE

if(reviewType==="video"){



await API.put(


`/video-interviews/${selectedResult._id}/review`,


payload


);



}






// ASSESSMENT RESULT SAVE

else if(reviewType==="assessment"){



await API.put(


`/assessments/${assessment._id}/review`,


payload


);



}






// update application status

const selected =

reviewType==="video"

?

selectedResult

:

assessment;






if(selected.applicationId){


let status="";



if(finalDecision==="Selected"){

status="Selected";

}


else if(finalDecision==="Rejected"){

status="Rejected";

}


else if(finalDecision==="Hold"){

status="Hold";

}





if(status){


await API.put(

`/applications/${selected.applicationId}`,

{

status

}

);


}



}







alert("Review Saved");



setSelectedResult(null);

setAssessment(null);

setReviewType("");

setRecruiterComment("");

setRecruiterRating(0);

setFinalDecision("");



loadResults();



}



catch(error){


console.log(error);


alert("Review Failed");


}



};







const hired =

results.filter(

r=>

r.finalDecision==="Selected"

).length;





const rejected =

results.filter(

r=>

r.finalDecision==="Rejected"

).length;





const total = results.length;





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

{total}

</h2>


</div>


</div>







<div className="candidate-stat">


<div className="stat-icon green">


<FaCheckCircle/>


</div>


<div>


<h3>

Selected

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

Score

</th>


<th>

AI Result

</th>


<th>

Recruiter Decision

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

No Results Found

</td>

</tr>



:



results.map(item=>(


<tr key={item._id}>



<td>


{

item.resultType==="video"


?


<span className="blue-badge">

<FaVideo/>

Video

</span>



:


<span className="green-badge">

<FaRobot/>

Assessment

</span>


}


</td>






<td>

{item.candidateName}

</td>





<td>


<span className="green-badge">


{

item.resultType==="video"

?

item.overall || 0

:

item.score || 0


}%


</span>


</td>






<td>


{

item.resultType==="video"


?


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

Review

</span>





:




item.score>=75


?

<span className="green-badge">

Hire

</span>


:


item.score<50


?

<span className="red-badge">

Reject

</span>


:


<span className="orange-badge">

Review

</span>



}


</td>





<td>


{

item.finalDecision


?

item.finalDecision


:

"Pending"


}


</td>





<td>


<button


className="profile-save-btn"



onClick={()=>{


if(item.resultType==="video"){


setSelectedResult(item);

setReviewType("video");

setAssessment(null);


}



else{


setAssessment(item);

setReviewType("assessment");

setSelectedResult(null);


}



setRecruiterComment("");

setRecruiterRating(0);

setFinalDecision("");



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

reviewType &&

<div className="candidate-panel">


<h2>

Candidate Review

</h2>





{/* VIDEO REVIEW */}


{

reviewType==="video" && selectedResult &&

<>



<h3>

Video Interview

</h3>



<p>

<b>
Candidate :
</b>

{" "}

{selectedResult.candidateName}

</p>




<p>

<b>
Role :
</b>

{" "}

{selectedResult.jobTitle}

</p>






{

selectedResult.videoPath &&

<video

width="600"

controls

>


<source

src={`http://127.0.0.1:8000/${selectedResult.videoPath}`}

/>


</video>


}





<h3>

Candidate Answers

</h3>




<ul>


{

selectedResult.answers?.map((a,i)=>(


<li key={i}>


<b>

Q{a.questionNo}

</b>


{" : "}


{a.answer}



</li>


))


}


</ul>







<h3>

AI Scores

</h3>




<p>

Technical :

{" "}

{selectedResult.technical}%

</p>



<p>

Communication :

{" "}

{selectedResult.communication}%

</p>




<p>

Confidence :

{" "}

{selectedResult.confidence}%

</p>




<p>

Overall :

{" "}

{selectedResult.overall}%

</p>




<p>

Violations :

{" "}

{selectedResult.violations}

</p>



</>


}









{/* ASSESSMENT REVIEW */}



{

reviewType==="assessment" && assessment &&


<>


<h3>

Online Assessment

</h3>



<p>

<b>

Candidate :

</b>

{" "}

{assessment.candidateName}

</p>





<p>

<b>

Score :

</b>

{" "}

{assessment.score}%

</p>






{

assessment.questions?.map((q,index)=>(


<div

key={index}

className="application-item"

>



<h4>

Question {index+1}

</h4>




<p>

{q.question}

</p>





<p>

<b>

Candidate Answer:

</b>

{" "}

{assessment.answers[index]}

</p>





<p>

<b>

Correct Answer:

</b>

{" "}

{q.answer}

</p>






<p>


{

assessment.answers[index]===q.answer


?

"✅ Correct"


:

"❌ Incorrect"


}


</p>




</div>


))


}



</>

}









<label>

Recruiter Rating

</label>



<select


value={recruiterRating}


onChange={(e)=>

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


placeholder="Recruiter Comment"


value={recruiterComment}



onChange={(e)=>

setRecruiterComment(

e.target.value

)

}


/>








<select


value={finalDecision}



onChange={(e)=>

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









<button


className="profile-cancel-btn"



style={{
marginLeft:"15px"
}}



onClick={()=>{


setReviewType("");

setSelectedResult(null);

setAssessment(null);


setRecruiterComment("");

setRecruiterRating(0);

setFinalDecision("");



}}


>


Close


</button>





</div>


}

</DashboardLayout>

);

}

export default AIInterviewResults;