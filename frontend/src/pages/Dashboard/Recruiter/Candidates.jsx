import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../api/api";

import {
FaUsers,
FaUserCheck,
FaUserTimes,
FaCalendarCheck,
FaSearch,
FaRobot,
FaCheck,
FaTimes,
FaVideo
} from "react-icons/fa";



function Candidates(){


const navigate = useNavigate();


const [applications,setApplications]=useState([]);

const [atsScores, setAtsScores]=useState({});

const [searchTerm,setSearchTerm]=useState("");

const [selectedCandidate,setSelectedCandidate]=useState(null);

const [interviewType,setInterviewType]=useState("");

const [interviewDate,setInterviewDate]=useState("");


useEffect(()=>{

loadCandidates();

},[]);





const loadCandidates=async()=>{

try{


const response =
await API.get("/applications");



const data =

Array.isArray(response.data)

?

response.data

:

response.data.applications || [];



setApplications(data);

const scores = {};

for (const app of data) {

    try {

        const report = await API.get(
            `/resumes/report/${app.job_id}/${app.email}`
        );

        scores[app._id] = report.data.atsScore || 0;

    }

    catch {

        scores[app._id] = 0;

    }

}

setAtsScores(scores);

}

catch(error){

console.log(error);

setApplications([]);

}

};







const updateStatus=async(id,status)=>{


try{


await API.put(

`/applications/${id}`,

{
status
}

);



loadCandidates();


}


catch(error){

console.log(error);

}


};









const scheduleInterview=async()=>{


if(!interviewType || !interviewDate){

alert("Select interview type and date");

return;

}



try{


await API.post(

"/interviews/create",

{

candidateName:selectedCandidate.candidateName,

jobTitle:selectedCandidate.jobTitle,


applicationId:selectedCandidate._id,


date:interviewDate,


type:interviewType,


status:"Scheduled"

}


);





await API.put(

`/applications/${selectedCandidate._id}`,

{

status:"Scheduled"

}

);





setSelectedCandidate(null);

setInterviewType("");

setInterviewDate("");



loadCandidates();



alert("Interview Scheduled");


}



catch(error){

console.log(error);

alert("Failed");

}


};









const safeApplications =

Array.isArray(applications)

?

applications

:

[];



const filteredApplications =

safeApplications

.filter(app=>

(app.candidateName || "")
.toLowerCase()
.includes(searchTerm.toLowerCase())

||

(app.jobTitle || "")
.toLowerCase()
.includes(searchTerm.toLowerCase())

)

.sort((a,b)=>

(atsScores[b._id] || 0)

-

(atsScores[a._id] || 0)

);



const total=safeApplications.length;





const shortlisted =

safeApplications.filter(

a=>a.status==="Shortlisted"

).length;





const rejected =

safeApplications.filter(

a=>a.status==="Rejected"

).length;







const interviews =

safeApplications.filter(

a=>

a.status==="Scheduled"

||

a.status==="Completed"

).length;








const selected =

safeApplications.filter(

a=>a.status==="Selected"

).length;







const statusBadge=(status)=>{


switch(status){



case "Shortlisted":

return(

<span className="green-badge">

Shortlisted

</span>

);



case "Scheduled":

return(

<span className="blue-badge">

Interview Scheduled

</span>

);



case "Completed":

return(

<span className="purple-badge">

Completed

</span>

);



case "Selected":

return(

<span className="green-badge">

Selected

</span>

);



case "Hold":

return(

<span className="orange-badge">

Hold

</span>

);



case "Rejected":

return(

<span className="red-badge">

Rejected

</span>

);



default:

return(

<span className="blue-badge">

Applied

</span>

);


}


};

return(

<DashboardLayout>



<div className="candidate-banner">


<div>

<h1>
Candidate Pipeline
</h1>


<p>
Manage applicants with AI hiring workflow
</p>


</div>



<div className="banner-icon">

<FaRobot/>

</div>


</div>






<div className="candidate-stats">



<div className="candidate-stat">


<div className="stat-icon blue">

<FaUsers/>

</div>


<div>

<h3>
Total Candidates
</h3>


<h2>
{total}
</h2>


</div>


</div>





<div className="candidate-stat">


<div className="stat-icon green">

<FaUserCheck/>

</div>


<div>

<h3>
Shortlisted
</h3>


<h2>
{shortlisted}
</h2>


</div>


</div>







<div className="candidate-stat">


<div className="stat-icon orange">

<FaUserTimes/>

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






<div className="candidate-stat">


<div className="stat-icon purple">

<FaCalendarCheck/>

</div>


<div>

<h3>
Interviews
</h3>


<h2>
{interviews}
</h2>


</div>


</div>






<div className="candidate-stat">


<div className="stat-icon green">


<FaCheck/>


</div>



<div>


<h3>
Selected
</h3>


<h2>

{selected}

</h2>


</div>


</div>



</div>









<div className="candidate-panel hover-card">



<div className="panel-header">


<h2>

Applications

</h2>




<div>


<FaSearch/>



<input


style={{

marginLeft:"10px",

background:"transparent",

border:"1px solid #334155",

padding:"10px",

borderRadius:"10px",

color:"black"

}}



placeholder="Search candidate..."



value={searchTerm}



onChange={e=>
setSearchTerm(e.target.value)
}



/>



</div>



</div>









<table className="recruiter-table">


<thead>


<tr>


<th>
Candidate
</th>


<th>
Role
</th>


<th>
Location
</th>


<th>
Status
</th>


<th>
ATS Score
</th>


<th>
Resume Screening
</th>


<th>
Actions
</th>


</tr>


</thead>







<tbody>




{

filteredApplications.length ?



filteredApplications.map(app=>(



<tr key={app._id}>


<td>


<h3>

{app.candidateName}

</h3>



</td>





<td>

{app.jobTitle}

</td>





<td>

{app.location}

</td>






<td>

{statusBadge(app.status)}

</td>



<td>

<span>

{atsScores[app._id] || 0}%

</span>

</td>


<td>

<button

className="resume-btn"

onClick={() =>
navigate(`/resume-screening/${app.job_id}/${app.email}`)
}

>

View Screening

</button>

</td>


<td>

<div className="action-buttons">


{/* Applied */}

{
app.status==="Applied" &&

<>

<button

className="action-btn approve-btn"

title="Shortlist Candidate"

onClick={()=>updateStatus(app._id,"Shortlisted")}

>

<FaCheck/>

</button>

<button

className="action-btn reject-btn"

title="Reject Candidate"

onClick={()=>updateStatus(app._id,"Rejected")}

>

<FaTimes/>

</button>
</>

}



{/* Shortlisted */}


{
app.status==="Shortlisted" &&

<>

<button

className="action-btn interview-btn"

title="Schedule Interview"

onClick={()=>{

setSelectedCandidate(app);

setInterviewType("");

setInterviewDate("");

}}

>

<FaVideo/>

</button>

</>

}



{/* Scheduled */}

{
app.status==="Scheduled" &&

<button

className="resume-btn"

onClick={()=>navigate("/recruiter-interviews")}

>

View Interview

</button>

}






{/* Completed */}

{
app.status==="Completed" &&

<button

className="resume-btn"

onClick={()=>navigate("/ai-results")}

>

View Result

</button>

}







{/* Final decisions */}

{
app.status==="Selected" &&

<span className="green-badge">

Hired

</span>

}



{
app.status==="Hold" &&

<span className="orange-badge">

Hold

</span>

}



{
app.status==="Rejected" &&

<span className="red-badge">

Rejected

</span>

}



</div>

</td>





</tr>



))





:




<tr>

<td colSpan="5">

No candidates found

</td>

</tr>



}





</tbody>



</table>






</div>









{

selectedCandidate &&



<div


className="candidate-panel"


style={{


position:"fixed",


top:"20%",


left:"35%",


width:"400px",


zIndex:1000


}}


>



<h2>

Schedule Interview

</h2>





<p>

Candidate:

<b>

{" "}

{selectedCandidate.candidateName}

</b>

</p>






<label>

Interview Type

</label>





<select


value={interviewType}



onChange={e=>

setInterviewType(e.target.value)

}



>


<option value="">

Select

</option>



<option value="Video Interview">

Video Interview

</option>



<option value="Online Assessment">

Online Assessment

</option>



</select>







<label>

Interview Date

</label>





<input


type="date"


value={interviewDate}



onChange={e=>

setInterviewDate(e.target.value)

}


/>








<div

style={{

display:"flex",

gap:"15px",

marginTop:"20px"

}}

>





<button


className="profile-save-btn"


onClick={scheduleInterview}


>

Schedule

</button>







<button


className="profile-cancel-btn"


onClick={()=>setSelectedCandidate(null)}


>

Cancel

</button>






</div>







</div>



}





</DashboardLayout>


);


}



export default Candidates;