import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import {useEffect,useState} from "react";
import API from "../../../api/api";

import {

FaFilePdf,
FaRobot,
FaUpload,
FaStar,
FaCheckCircle,
FaBrain,
FaChartLine,
FaTrash

} from "react-icons/fa";




function Resume(){



const email =
localStorage.getItem("email");



const [resumeName,setResumeName]=useState("");

const [analysis,setAnalysis]=useState(null);

const [uploading,setUploading]=useState(false);





useEffect(()=>{

loadResume();

},[]);





const loadResume=async()=>{


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








const handleUpload=async(e)=>{


const file =
e.target.files[0];



if(!file)
return;



setUploading(true);





const aiAnalysis={


skills:[

"React",
"JavaScript",
"HTML",
"CSS",
"FastAPI"

],


experience:"2 Years",


education:"B.Sc Computer Science",


score:92


};






const resumeData={


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
"Upload Failed"
);


}

finally{


setUploading(false);


}


};








const handleDeleteResume = async()=>{


const confirmDelete =
window.confirm(
"Are you sure you want to delete this resume?"
);



if(!confirmDelete)
return;






try{


await API.delete(

`/resumes/${email}`

);





setResumeName("");

setAnalysis(null);




alert(
"Resume Deleted Successfully"
);



}

catch(error){


console.log(error);



alert(
"Resume Delete Failed"
);


}


};







return (


<DashboardLayout>






<div className="candidate-banner">



<div>



<h1>
AI Resume Studio
</h1>



<p>
Upload, analyze and optimize your resume with AI
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
AI Analysis
</h3>



<h2>
Active
</h2>



</div>



</div>









<div className="candidate-stat">



<div className="stat-icon green">


<FaCheckCircle/>


</div>





<div>



<h3>
Resume Status
</h3>




<h2>


{
resumeName
?
"Ready"
:
"Upload"

}



</h2>



</div>



</div>










<div className="candidate-stat">



<div className="stat-icon purple">


<FaChartLine/>


</div>





<div>



<h3>
ATS Score
</h3>



<h2>


{
analysis?.score || 0
}%



</h2>



</div>



</div>





</div>













<div className="candidate-panel">





<h2>
Upload Resume
</h2>








<label


style={{


height:"220px",


border:"2px dashed #60A5FA",


borderRadius:"25px",


display:"flex",


flexDirection:"column",


alignItems:"center",


justifyContent:"center",


cursor:"pointer",


background:
"rgba(96,165,250,.08)"


}}



>







<FaUpload


style={{

fontSize:"55px",

color:"#60A5FA"

}}


/>








<h3>


{


uploading

?

"AI is scanning..."

:

"Drop your resume here"



}



</h3>







<p>

PDF, DOC, DOCX supported

</p>






<input


type="file"


hidden


accept=".pdf,.doc,.docx"


onChange={handleUpload}


/>






</label>













{


resumeName &&





<div className="application-item">






<FaFilePdf


style={{


fontSize:"35px",

color:"#ef4444"


}}



/>







<div style={{
flex:1
}}>




<h3>

{resumeName}

</h3>




<p>

Resume uploaded successfully

</p>




</div>









<button



onClick={handleDeleteResume}



style={{


background:"#ef4444",


border:"none",


padding:"12px 18px",


borderRadius:"12px",


color:"white",


display:"flex",


alignItems:"center",


gap:"8px"


}}



>




<FaTrash/>


Delete



</button>








</div>





}






</div>













{



analysis &&




<div className="candidate-panel">





<h2>

AI Resume Insights

</h2>









<div className="candidate-stats">







<div className="candidate-stat">



<div className="stat-icon green">


<FaStar/>


</div>





<div>



<h3>

ATS Score

</h3>




<h2>


{analysis.score}%


</h2>




</div>



</div>












<div className="candidate-stat">



<div className="stat-icon blue">


<FaBrain/>


</div>





<div>



<h3>

Experience

</h3>





<h2

style={{
fontSize:"18px"
}}

>


{analysis.experience}



</h2>






</div>



</div>









</div>









<h3>

Detected Skills

</h3>








<div

style={{


display:"flex",

gap:"10px",

flexWrap:"wrap"


}}



>







{


analysis.skills.map(

(skill,index)=>(




<span


key={index}


className="blue-badge"



>


{skill}



</span>





)



)



}







</div>









</div>





}









</DashboardLayout>


);


}




export default Resume;