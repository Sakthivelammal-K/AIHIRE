import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import { useState,useEffect } from "react";
import API from "../../../api/api";


function Resume() {


const email =
localStorage.getItem("email");


const [resumeName,setResumeName] =
useState("");

const [analysis,setAnalysis] =
useState(null);



useEffect(()=>{

loadResume();

},[]);



const loadResume = async()=>{


try{

const response =
await API.get(
`/resumes/${email}`
);


if(response.data.resumeName){

setResumeName(
response.data.resumeName
);


setAnalysis(
response.data.analysis
);

}


}
catch(error){

console.log(error);

}

};





const handleUpload = async(e)=>{


const file =
e.target.files[0];


if(!file)
return;



const aiAnalysis = {


skills:[
"React",
"JavaScript",
"HTML",
"CSS"
],


experience:
"2 Years",


education:
"B.Sc Computer Science",


score:92

};




const resumeData = {


email,

resumeName:file.name,


analysis:aiAnalysis


};



try{


await API.post(
"/resumes/upload",
resumeData
);



setResumeName(
file.name
);



setAnalysis(
aiAnalysis
);



alert(
"Resume Uploaded Successfully"
);



}
catch(error){

console.log(error);

alert(
"Resume upload failed"
);

}


};





return (

<DashboardLayout>


<h1>
AI Resume Analyzer
</h1>



<div className="activity-card">


<h2>
Upload Resume
</h2>



<input

type="file"

accept=".pdf,.doc,.docx"

onChange={handleUpload}

/>



<br/>
<br/>



{
resumeName &&

<div>

<strong>
Uploaded Resume:
</strong>

<p>
{resumeName}
</p>


</div>

}



</div>





{
analysis &&

<div className="activity-card">


<h2>
AI Resume Analysis
</h2>



<p>

<strong>
Resume Score:
</strong>

{analysis.score}%

</p>



<p>

<strong>
Experience:
</strong>

{analysis.experience}

</p>



<p>

<strong>
Education:
</strong>

{analysis.education}

</p>




<h3>
Skills Detected
</h3>



<ul>

{
analysis.skills.map(
(skill,index)=>(

<li key={index}>
{skill}
</li>

))

}

</ul>



</div>

}


</DashboardLayout>

);


}


export default Resume;