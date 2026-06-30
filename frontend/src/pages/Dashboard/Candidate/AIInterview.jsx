import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import {useState,useEffect} from "react";
import API from "../../../api/api";

import {
FaRobot,
FaBrain,
FaVideo,
FaMicrophone,
FaCheckCircle,
FaChartLine,
FaLightbulb,
FaClock,
FaArrowLeft,
FaArrowRight,
FaFlagCheckered
} from "react-icons/fa";



function AIInterview(){



const [submitted,setSubmitted]=useState(false);

const [result,setResult]=useState(null);

const [started, setStarted] = useState(false);

const [currentQuestion, setCurrentQuestion] = useState(0);

const [timeLeft,setTimeLeft]=useState(20*60);

const [answers, setAnswers] = useState([
"",
"",
""
]);



const [interviews,setInterviews]=useState([]);

const [interviewQuestions,setInterviewQuestions] = useState([]);



useEffect(()=>{

loadInterviews();
loadResult();

},[]);


useEffect(()=>{

if(!started || submitted) return;

if(timeLeft===0){

handleSubmit({
preventDefault:()=>{}
});

return;

}

const timer=setInterval(()=>{

setTimeLeft(prev=>prev-1);

},1000);

return ()=>clearInterval(timer);

},[started,timeLeft,submitted]);


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


const loadResult = async()=>{

try{

const response =
await API.get("/interviews/results");


const username =
localStorage.getItem("username");


const existing =
response.data.find(
item =>
item.candidateName===username
);


if(existing){

setResult(existing);
setSubmitted(true);

}


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



const loadQuestions = async()=>{


try{


const response = await API.post(
"/ai/questions",
{
jobTitle
}
);



setInterviewQuestions(
response.data.questions
);



setAnswers(
response.data.questions.map(
()=> ""
)
);



}

catch(error){

console.log(
"Question loading error",
error
);


}


};





const handleAnswerChange = (value) => {

const updatedAnswers = [...answers];

updatedAnswers[currentQuestion] = value;

setAnswers(updatedAnswers);

};



const nextQuestion = () => {

if(currentQuestion < interviewQuestions.length - 1){

setCurrentQuestion(currentQuestion + 1);

}

};



const previousQuestion = () => {

if(currentQuestion > 0){

setCurrentQuestion(currentQuestion - 1);

}

};





const handleSubmit = async(e)=>{

e.preventDefault();


try{


// send answers to AI backend

const aiResponse = await API.post(
"/ai/evaluate",
{
answers,
jobTitle,
candidateName: currentUser
}
);


const interviewResult = aiResponse.data;


setResult(interviewResult);



// save result in database

await API.post(
"/interviews/result",
interviewResult
);



setResult(interviewResult);


setSubmitted(true);



}

catch(error){

console.log(
"AI Evaluation Error:",
error
);


alert(
"AI evaluation failed"
);


}


};

const minutes=
String(Math.floor(timeLeft/60)).padStart(2,"0");

const seconds=
String(timeLeft%60).padStart(2,"0");

const progress =
interviewQuestions.length
?
((currentQuestion+1)/interviewQuestions.length)*100
:
0;


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
!started ?

<div className="candidate-panel">

    <h2>Welcome to AI Interview</h2>

    <br/>

    <div className="candidate-stats">

        <div className="candidate-stat">

            <div className="stat-icon blue">
                <FaBrain/>
            </div>

            <div>
                <h3>Role</h3>
                <h2 style={{fontSize:"20px"}}>
                    {jobTitle}
                </h2>
            </div>

        </div>

        <div className="candidate-stat">

            <div className="stat-icon purple">
                <FaVideo/>
            </div>

            <div>
                <h3>Questions</h3>
                <h2>3</h2>
            </div>

        </div>

        <div className="candidate-stat">

            <div className="stat-icon green">
                <FaChartLine/>
            </div>

            <div>
                <h3>Duration</h3>
                <h2>20 Min</h2>
            </div>

        </div>

    </div>

    <br/>

    <h3>Interview Instructions</h3>

    <ul className="interview-rules">

        <li>✅ Keep your browser window open.</li>

        <li>✅ Answer every question carefully.</li>

        <li>✅ Do not refresh the page.</li>

        <li>✅ Your answers will be evaluated by AI.</li>

        <li>✅ Interview will be submitted automatically after completion.</li>

    </ul>

    <br/>

    <button
className="premium-btn"
onClick={async()=>{

await loadQuestions();

setStarted(true);

}}
>

        Start Interview

    </button>

</div>

:

!submitted ?


<div className="candidate-panel">
    


<div
style={{
display:"flex",
justifyContent:"space-between",
alignItems:"center"
}}
>

<h2>

Interview Question

</h2>

<h3 style={{color:"#2563eb"}}>

<FaClock/>

{" "}

{minutes}:{seconds}

</h3>

</div>

<br/>

<div
style={{
height:"8px",
background:"#e5e7eb",
borderRadius:"10px",
overflow:"hidden"
}}
>

<div
style={{
width:`${progress}%`,
height:"100%",
background:"#2563eb",
transition:"0.4s"
}}
>

</div>

</div>

<br/>





<form onSubmit={handleSubmit}>


<div className="application-item">

    <FaMicrophone />


    <div style={{ width: "100%" }}>
<br/>
<h3>

Question

{currentQuestion+1}

/

{interviewQuestions.length}

</h3>

        <br />

        <label>

            {interviewQuestions[currentQuestion]}

        </label>

        <textarea
            rows="6"
            value={answers[currentQuestion]}
            onChange={(e)=>handleAnswerChange(e.target.value)}
            required
            style={{marginTop:"15px",width:"100%"}}
        />

    </div>

</div>


<div
style={{
display:"flex",
justifyContent:"space-between",
marginTop:"30px"
}}
>

<button
type="button"
className="profile-cancel-btn"
onClick={previousQuestion}
disabled={currentQuestion===0}
>

<>

<FaArrowLeft/>

&nbsp;

Previous

</>

</button>


{
currentQuestion < interviewQuestions.length-1 ?

<button
type="button"
className="profile-save-btn"
onClick={nextQuestion}
>

<>

Next

&nbsp;

<FaArrowRight/>

</>

</button>

:

<button
type="submit"
className="profile-save-btn"
>

<>

<FaFlagCheckered/>

&nbsp;

Finish Interview

</>

</button>

}

</div>


</form>





</div>





:


<div className="candidate-panel">


{
result ? (

<>

<button
className="premium-btn"
onClick={()=>window.location.href="/interviews"}
>

Back to Interviews

</button>


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

<div className="stat-icon blue">

<FaBrain/>

</div>

<div>

<h3>
Technical
</h3>

<h2>
{result.technical}%
</h2>

</div>

</div>





<div className="candidate-stat">

<div className="stat-icon purple">

<FaMicrophone/>

</div>


<div>

<h3>
Communication
</h3>

<h2>
{result.communication}%
</h2>

</div>

</div>






<div className="candidate-stat">

<div className="stat-icon green">

<FaRobot/>

</div>


<div>

<h3>
Confidence
</h3>

<h2>
{result.confidence}%
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



</>

)

:

(

<h2>
Generating AI Report...
</h2>

)

}


</div>



}



</DashboardLayout>


);


}



export default AIInterview;