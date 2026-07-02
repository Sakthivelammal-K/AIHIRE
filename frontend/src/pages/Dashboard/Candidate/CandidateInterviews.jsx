import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import {useEffect,useState} from "react";
import API from "../../../api/api";
import {useNavigate} from "react-router-dom";

import {
FaVideo,
FaCalendarCheck,
FaRobot,
FaBrain,
FaMicrophone,
FaChartLine,
FaLightbulb,
FaClipboardCheck
} from "react-icons/fa";



function CandidateInterviews(){


const navigate = useNavigate();


const [interviews,setInterviews]=useState([]);

const [results,setResults]=useState([]);

const [selectedInterview,setSelectedInterview]=useState(null);

const [selectedResult,setSelectedResult]=useState(null);





useEffect(()=>{

loadInterviews();

loadResults();

},[]);






const loadInterviews=async()=>{


try{


const res =
await API.get("/interviews/");


setInterviews(
res.data.scheduled || []
);


}

catch(error){

console.log(error);

setInterviews([]);

}

};







const loadResults=async()=>{


try{


const res =
await API.get("/interviews/results");


const username =
localStorage.getItem("username");



const myResults =
res.data.filter(

item=>
item.candidateName===username

);



setResults(myResults);



}

catch(error){

console.log(error);

setResults([]);

}


};








const username =
localStorage.getItem("username");



const myInterviews =
interviews.filter(

item=>
item.candidateName===username

);







return(


<DashboardLayout>



<div className="candidate-banner">


<div>

<h1>
My Interviews
</h1>


<p>
Video and Online Assessment status
</p>


</div>



<div className="banner-icon">

<FaRobot/>

</div>


</div>








<div className="candidate-stats">





<div className="candidate-stat">

<div className="stat-icon blue">

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
Completed
</h3>


<h2>
{results.length}
</h2>


</div>


</div>








<div className="candidate-stat">


<div className="stat-icon purple">

<FaChartLine/>

</div>


<div>

<h3>
Results
</h3>


<h2>
{results.length}
</h2>


</div>


</div>





</div>









<div className="candidate-panel">


<h3>
Scheduled Interviews
</h3>




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


<tr

key={item._id}

onClick={()=>setSelectedInterview(item)}

style={{
cursor:"pointer"
}}

>


<td>
{item.jobTitle}
</td>


<td>
{item.date}
</td>





<td>


<span className="blue-badge">


{

item.type==="Online Assessment"

?

<>

<FaClipboardCheck/>

&nbsp;

Online Assessment

</>


:


item.type==="Video Interview"

?


<>

<FaVideo/>

&nbsp;

Video

</>


:


<>

<FaRobot/>

&nbsp;

AI Interview

</>


}



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

No Interviews

</td>

</tr>


}



</tbody>



</table>






<br/>
<br/>





<h3>
Interview Results
</h3>





<table className="recruiter-table">


<thead>

<tr>


<th>
Type
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


results.length ?


results.map(item=>(



<tr key={item._id}>


<td>


<span className="blue-badge">

{item.type}

</span>


</td>




<td>


<span className="green-badge">

{item.overall || item.score || 0}%

</span>


</td>





<td>

{item.verdict || "Pending"}

</td>





<td>


<button

className="profile-save-btn"

onClick={()=>setSelectedResult(item)}

>

View

</button>


</td>




</tr>



))


:


<tr>

<td colSpan="5">

No Results

</td>

</tr>


}



</tbody>


</table>






</div>









{
selectedInterview && (



<div className="candidate-panel">


<h2>
Interview Details
</h2>




<p>

<strong>
Job:
</strong>

{" "}

{selectedInterview.jobTitle}

</p>





<p>

<strong>
Type:
</strong>

{" "}

{selectedInterview.type}

</p>





<p>

<strong>
Date:
</strong>

{" "}

{selectedInterview.date}

</p>







<button

className="profile-save-btn"

onClick={()=>{


 if(
selectedInterview.type==="Video Interview"
){

navigate("/video-interview");

}


else if(
selectedInterview.type==="Online Assessment"
){

navigate("/online-assessment");

}



}}


>


Start Interview


</button>






</div>



)

}




{
selectedResult && (

<div className="candidate-panel">

<h2>Interview Report</h2>

{/* ===================== */}
{/* VIDEO INTERVIEW */}
{/* ===================== */}
{selectedResult.type === "Video Interview" && (
<>
<div className="candidate-stats">

<div className="candidate-stat">
<FaBrain />
<div>
<h3>Technical</h3>
<h2>{selectedResult.technical || 0}%</h2>
</div>
</div>

<div className="candidate-stat">
<FaMicrophone />
<div>
<h3>Communication</h3>
<h2>{selectedResult.communication || 0}%</h2>
</div>
</div>

<div className="candidate-stat">
<FaChartLine />
<div>
<h3>Confidence</h3>
<h2>{selectedResult.confidence || 0}%</h2>
</div>
</div>

</div>

<h3><FaLightbulb /> Feedback</h3>

<ul>
{selectedResult.strengths?.map((s,i)=>(
<li key={i}>✅ {s}</li>
))}
</ul>

<ul>
{selectedResult.improvements?.map((s,i)=>(
<li key={i}>⚠️ {s}</li>
))}
</ul>
</>
)}

{/* ===================== */}
{/* ONLINE ASSESSMENT */}
{/* ===================== */}
{selectedResult.type === "Online Assessment" && (
<>
<div className="candidate-stats">

{/* SCORE */}
<div className="candidate-stat">
<FaChartLine />
<div>
<h3>Score</h3>
<h2>{selectedResult.overall || selectedResult.score || 0}%</h2>
</div>
</div>

{/* CORRECT ANSWERS */}
<div className="candidate-stat">
<FaBrain />
<div>
<h3>Correct</h3>
<h2>
{selectedResult.questions?.filter((q, i) =>
selectedResult.answers?.[i] === q.answer
).length || 0}
</h2>
</div>
</div>

{/* WRONG ANSWERS */}
<div className="candidate-stat">
<FaMicrophone />
<div>
<h3>Wrong</h3>
<h2>
{selectedResult.questions?.length -
(selectedResult.questions?.filter((q, i) =>
selectedResult.answers?.[i] === q.answer
).length || 0)}
</h2>
</div>
</div>

</div>

<h3><FaLightbulb /> Result Summary</h3>

<p>
You answered{" "}
<b>
{selectedResult.questions?.filter((q, i) =>
selectedResult.answers?.[i] === q.answer
).length || 0}
</b>{" "}
correct out of{" "}
<b>{selectedResult.questions?.length || 0}</b> questions.
</p>

</>
)}

{/* CLOSE BUTTON */}
<button
className="profile-cancel-btn"
onClick={() => setSelectedResult(null)}
>
Close
</button>

</div>
)
}





</DashboardLayout>


);


}



export default CandidateInterviews;