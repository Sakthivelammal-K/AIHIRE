import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import { useEffect, useState } from "react";
import API from "../../../api/api";

import {
  FaCheckCircle,
  FaClock,
  FaList
} from "react-icons/fa";


function OnlineAssessment(){


const [data,setData]=useState(null);
const [answers,setAnswers]=useState([]);
const [loading,setLoading]=useState(true);
const [submitted,setSubmitted]=useState(false);
const [score,setScore]=useState(null);



useEffect(()=>{

loadAssessment();

},[]);




const loadAssessment=async()=>{

try{

const username =
localStorage.getItem("username");


const res =
await API.get(
`/assessments/${username}`
);


setData(res.data);


setAnswers(
res.data.questions.map(()=> "")
);


}

catch(error){

console.log(error);

alert(
"Assessment loading failed"
);

}

finally{

setLoading(false);

}

};





const handleAnswer=(index,value)=>{


const updated=[
...answers
];


updated[index]=value;


setAnswers(updated);


};



const submitAssessment = async () => {

    if(!data){
        alert("Assessment not loaded");
        return;
    }

    try{

        const res = await API.put(
            `/assessments/${data._id}/submit`,
            {
                answers
            }
        );

        setScore(res.data.score);
        setSubmitted(true);

    }
    catch(error){
        console.log(error);
        alert("Submit failed");
    }
};




if(loading){


return (

<DashboardLayout>

<div className="candidate-panel">

<h2>
Loading Assessment...
</h2>

</div>

</DashboardLayout>

);


}





return (

<DashboardLayout>


<div className="candidate-banner">


<div>

<h1>
Online Assessment
</h1>


<p>
MCQ Technical Test
</p>


</div>


<div className="banner-icon">

<FaList/>

</div>


</div>





<div className="candidate-panel">



{
submitted ?


<>


<h2>
Assessment Completed
</h2>


<div className="candidate-stat">


<FaCheckCircle/>


<div>

<h3>
Score
</h3>


<h2>
{score}%
</h2>


</div>


</div>


</>



:


<>


<div
style={{
display:"flex",
justifyContent:"space-between"
}}
>


<h2>
Questions
</h2>


<h3>

<FaClock/>

&nbsp;

20 min

</h3>


</div>





{
data?.questions?.map(
(q,index)=>(


<div

key={index}

className="application-item"

>


<h3>
Question {index+1}
</h3>


<p>
{q.question}
</p>




{
q.options?.map(

(option,i)=>(


<label

key={i}

style={{
display:"block",
margin:"10px"
}}

>


<input

type="radio"

name={`question-${index}`}

value={option}

checked={
answers[index]===option
}

onChange={
(e)=>
handleAnswer(
index,
e.target.value
)
}

/>


&nbsp;

{option}


</label>


)

)

}




</div>


)

)
}



<br/>


<button

className="profile-save-btn"

onClick={submitAssessment}

>

Submit Assessment

</button>



</>


}



</div>



</DashboardLayout>

);


}



export default OnlineAssessment;