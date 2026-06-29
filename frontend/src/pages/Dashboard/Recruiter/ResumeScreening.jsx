import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import {useEffect,useState} from "react";
import {useParams} from "react-router-dom";
import API from "../../../api/api";

import {
FaUser,
FaFilePdf,
FaBrain,
FaCheckCircle,
FaExclamationTriangle,
FaChartLine,
FaGraduationCap,
FaBriefcase
} from "react-icons/fa";


function ResumeScreening(){


const {id}=useParams();


const [candidate,setCandidate]=useState(null);
const [loading,setLoading]=useState(true);



useEffect(()=>{

loadAnalysis();

},[]);



const loadAnalysis=async()=>{

try{


const res = await API.get(
`/resume/report/${id}`
);


setCandidate(res.data);


}
catch(err){

console.log(err);

}
finally{

setLoading(false);

}

};



if(loading){

return (

<DashboardLayout>

<div className="loading-card">

Loading Resume Analysis...

</div>

</DashboardLayout>

)

}



if(!candidate){

return (

<DashboardLayout>

<div className="empty-state">

No Resume Analysis Found

</div>

</DashboardLayout>

)

}




return (

<DashboardLayout>


<div className="resume-screening">



{/* HEADER */}


<div className="resume-banner">


<div>

<h1>
AI Resume Screening
</h1>


<p>
AI powered resume analysis and candidate evaluation
</p>


</div>


<FaBrain className="resume-banner-icon"/>


</div>






{/* PROFILE */}



<div className="resume-profile-card">


<div className="candidate-avatar">

<FaUser/>

</div>



<div>

<h2>

{candidate.candidateName}

</h2>


<p>

{candidate.jobTitle}

</p>


<span>

{candidate.email}

</span>


</div>





<div className="ats-score">


<h4>
ATS Score
</h4>


<h1>

{candidate.atsScore}%

</h1>


</div>


</div>








{/* MATCH */}



<div className="analysis-card">


<h2>
Resume Match
</h2>



<div className="progress-container">


<div

className="progress-fill"

style={{

width:`${candidate.atsScore}%`

}}

>


</div>


</div>



</div>









{/* SKILLS */}



<div className="resume-grid">



<div className="skill-card">


<h2>

<FaCheckCircle/>

Matched Skills

</h2>



<div className="chips">


{
candidate.matchedSkills?.map(
(skill,index)=>(


<span

className="success-chip"

key={index}

>

{skill}

</span>


)

)

}


</div>


</div>








<div className="skill-card">


<h2>

<FaExclamationTriangle/>

Missing Skills

</h2>



<div className="chips">


{
candidate.missingSkills?.map(
(skill,index)=>(


<span

className="warning-chip"

key={index}

>

{skill}

</span>


)

)

}


</div>


</div>


</div>









{/* EXPERIENCE */}



<div className="detail-card">


<h2>

<FaBriefcase/>

Experience Analysis

</h2>



<div className="detail-grid">



<div>

<label>
Required Experience
</label>

<h3>

{candidate.requiredExperience}

</h3>

</div>




<div>

<label>
Candidate Experience
</label>


<h3>

{candidate.candidateExperience}

</h3>

</div>




</div>


</div>









{/* EDUCATION */}


<div className="detail-card">


<h2>

<FaGraduationCap/>

Education

</h2>


<h3>

{candidate.education}

</h3>


</div>










{/* SUMMARY */}



<div className="summary-card">


<h2>

<FaBrain/>

AI Summary

</h2>



<p>

{candidate.summary}

</p>


</div>










{/* RECOMMENDATION */}



<div className="recommend-card">


<FaChartLine/>


<div>


<h2>

AI Recommendation

</h2>


<h1>

{candidate.recommendation}

</h1>


</div>


</div>










{/* PDF */}



<div className="resume-preview">


<h2>

<FaFilePdf/>

Resume Preview

</h2>



<a
href={candidate.resumeUrl}
target="_blank"
>

<button>

View Resume PDF

</button>


</a>



</div>





</div>



</DashboardLayout>


);


}


export default ResumeScreening;