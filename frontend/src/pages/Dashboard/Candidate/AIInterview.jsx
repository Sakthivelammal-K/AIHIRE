import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import {useState,useEffect} from "react";
import API from "../../../api/api";

import {
FaRobot,
FaBrain,
FaMicrophone,
FaCheckCircle,
FaChartLine,
FaLightbulb
} from "react-icons/fa";



function AIInterview(){



const [submitted,setSubmitted]=useState(false);

const [result,setResult]=useState(null);



const [answer1,setAnswer1]=useState("");

const [answer2,setAnswer2]=useState("");

const [answer3,setAnswer3]=useState("");



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





const currentUser =
localStorage.getItem("username");




const myInterview =
interviews.find(

item=>

item.candidateName===currentUser

);




const jobTitle =
myInterview?.jobTitle ||
"Frontend Developer";







const questions={


"Frontend Developer":[

"Explain React Hooks.",

"What is Virtual DOM?",

"Difference between useState and useEffect?"

],



"Backend Developer":[

"Explain REST API.",

"What is JWT?",

"SQL vs NoSQL?"

],



"Full Stack Developer":[

"Explain MERN stack.",

"How frontend communicates with backend?",

"What is API integration?"

]


};





const interviewQuestions =
questions[jobTitle] ||
questions["Frontend Developer"];









const handleSubmit=async(e)=>{


e.preventDefault();



const length =
answer1.length+
answer2.length+
answer3.length;




let communication=50;

let technical=50;

let confidence=50;



if(length>300){

communication=85;
technical=90;
confidence=88;

}

else if(length>150){

communication=75;
technical=80;
confidence=78;

}

else{

communication=60;
technical=65;
confidence=62;

}





const overall =
Math.round(

(
communication+
technical+
confidence

)/3

);





const verdict =

overall>=80

?"Hire"

:

overall>=65

?"Consider"

:

"Reject";





const interviewResult={


candidateName:currentUser,

jobTitle,


communication,

technical,

confidence,

overall,

verdict,


strengths:

[
"Problem solving ability",
"Technical understanding"
],


improvements:

[
"Improve depth of answers",
"Add more examples"
]


};






try{


await API.post(

"/interviews/result",

interviewResult

);



setResult(interviewResult);


setSubmitted(true);


}

catch(error){

console.log(error);

}



};







return (


<DashboardLayout>






<div className="candidate-banner">


<div>


<h1>
AI Interview Assistant
</h1>


<p>
Complete your AI powered technical evaluation
</p>


</div>



<div className="banner-icon">

<FaRobot/>

</div>


</div>









<div className="candidate-stats">





<div className="candidate-stat">


<div className="stat-icon blue">

<FaBrain/>

</div>


<div>


<h3>
Role
</h3>


<h2 style={{fontSize:"20px"}}>

{jobTitle}

</h2>


</div>


</div>






<div className="candidate-stat">


<div className="stat-icon purple">

<FaChartLine/>

</div>


<div>


<h3>
AI Evaluation
</h3>


<h2>

100%

</h2>


</div>


</div>







</div>







{

!submitted ?


<div className="candidate-panel">


<h2>

Interview Questions

</h2>





<form onSubmit={handleSubmit}>



<div className="application-item">


<FaMicrophone/>


<div>


<label>

{interviewQuestions[0]}

</label>


<textarea

rows="4"

value={answer1}

onChange={
e=>setAnswer1(e.target.value)
}

required


/>


</div>


</div>







<div className="application-item">


<FaMicrophone/>


<div>


<label>

{interviewQuestions[1]}

</label>


<textarea

rows="4"

value={answer2}

onChange={
e=>setAnswer2(e.target.value)
}

required


/>


</div>


</div>







<div className="application-item">


<FaMicrophone/>


<div>


<label>

{interviewQuestions[2]}

</label>


<textarea

rows="4"

value={answer3}

onChange={
e=>setAnswer3(e.target.value)
}

required


/>


</div>


</div>






<button className="premium-btn">


Submit Interview


</button>





</form>





</div>





:

<div className="candidate-panel">





<h2>

AI Interview Report

</h2>






<div className="candidate-stats">



<div className="candidate-stat">

<div className="stat-icon green">

<FaCheckCircle/>

</div>


<div>

<h3>
Overall Score
</h3>

<h2>

{result.overall}%

</h2>

</div>

</div>





<div className="candidate-stat">

<div className="stat-icon purple">

<FaRobot/>

</div>


<div>

<h3>
Verdict
</h3>


<h2>

{result.verdict}

</h2>

</div>


</div>



</div>






<h3>

<FaLightbulb/>

 AI Feedback

</h3>





<ul>

{

result.strengths.map(
(s,i)=>

<li key={i}>

✅ {s}

</li>

)

}


</ul>





<ul>

{

result.improvements.map(
(s,i)=>

<li key={i}>

⚠️ {s}

</li>

)

}


</ul>






</div>



}



</DashboardLayout>


);


}



export default AIInterview;