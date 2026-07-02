import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../../api/api";

import {
FaUser,
FaBrain,
FaCheckCircle,
FaExclamationTriangle,
FaChartLine
} from "react-icons/fa";

function ResumeScreening(){

const { jobId, email } = useParams();

const [candidate,setCandidate] = useState(null);
const [loading,setLoading] = useState(true);

useEffect(()=>{

    loadAnalysis();

},[jobId,email]);

const loadAnalysis = async()=>{

    try{

        const res = await API.get(
            `/resumes/report/${jobId}/${email}`
        );

        console.log("Resume Report :",res.data);

        setCandidate(res.data);

    }

    catch(error){

        console.log(error);

    }

    finally{

        setLoading(false);

    }

};

if(loading){

    return(

        <DashboardLayout>

            <div className="loading-card">

                Loading Resume Analysis...

            </div>

        </DashboardLayout>

    );

}

if(!candidate || candidate.message){

    return(

        <DashboardLayout>

            <div className="empty-state">

                Resume Report Not Found

            </div>

        </DashboardLayout>

    );

}

return(

<DashboardLayout>

<div className="resume-screening">

{/* HEADER */}

<div className="resume-banner">

<div>

<h1>AI Resume Screening</h1>

<p>AI powered resume analysis and candidate evaluation</p>

</div>

<FaBrain className="resume-banner-icon"/>

</div>



{/* PROFILE */}

<div className="resume-profile-card">

<div className="candidate-avatar">

<FaUser/>

</div>

<div>

<h2>{candidate.email}</h2>

<p>{candidate.jobTitle}</p>

<span>Candidate Resume Analysis</span>

</div>

<div className="ats-score">

<h4>ATS Score</h4>

<h1>{candidate.atsScore}%</h1>

</div>

</div>



{/* MATCH */}

<div className="analysis-card">

<h2>Resume Match</h2>

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



{/* MATCHED + MISSING */}

<div className="resume-grid">

<div className="skill-card">

<h2>

<FaCheckCircle/>

Matched Skills

</h2>

<div className="chips">

{

candidate.matchedSkills?.map((skill,index)=>(

<span

key={index}

className="success-chip"

>

{skill}

</span>

))

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

candidate.missingSkills?.map((skill,index)=>(

<span

key={index}

className="warning-chip"

>

{skill}

</span>

))

}

</div>

</div>

</div>



{/* CANDIDATE SKILLS */}

<div className="detail-card">

<h2>Candidate Skills</h2>

<div

style={{

display:"flex",

gap:"10px",

flexWrap:"wrap"

}}

>

{

candidate.candidateSkills?.map((skill,index)=>(

<span

key={index}

className="blue-badge"

>

{skill}

</span>

))

}

</div>

</div>



{/* REQUIRED SKILLS */}

<div className="detail-card">

<h2>Required Skills</h2>

<div

style={{

display:"flex",

gap:"10px",

flexWrap:"wrap"

}}

>

{

candidate.requiredSkills?.map((skill,index)=>(

<span

key={index}

className="warning-chip"

>

{skill}

</span>

))

}

</div>

</div>



{/* RECOMMENDATION */}

<div className="recommend-card">

<FaChartLine/>

<div>

<h2>AI Recommendation</h2>

<h1>{candidate.recommendation}</h1>

</div>

</div>

</div>

</DashboardLayout>

);

}

export default ResumeScreening;