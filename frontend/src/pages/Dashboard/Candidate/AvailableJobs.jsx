import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import { useEffect, useState } from "react";
import API from "../../../api/api";


function AvailableJobs() {


  const [jobs,setJobs] = useState([]);
  const [resumeAnalysis,setResumeAnalysis] = useState({});


  useEffect(()=>{

    loadJobs();

  },[]);




  const loadJobs = async()=>{


    try{


      const response =
      await API.get("/jobs/");


      setJobs(response.data);


    }
    catch(error){

      console.log(error);

    }


  };

const handleApply = async (job) => {

  const candidateName =
    localStorage.getItem("username");

  console.log(
    "Candidate Name:",
    candidateName
  );

  const application = {

    candidateName,

    jobTitle: job.title,

    department: job.department,

    location: job.location,

    company: "AIHIRE",

    status: "Applied",

    appliedDate:
      new Date().toLocaleDateString()

  };

  try {

    // Create application
    await API.post(
      "/applications/create",
      application
    );

    // Increase applicant count
    await API.put(
      `/jobs/${job._id}/applicant`
    );

    alert(
      "Application Submitted Successfully"
    );

    loadJobs();

  }
  catch (error) {

    console.log(error);

    alert("Application failed");

  }

};


return (

<DashboardLayout>


<h1>
Available Jobs
</h1>



<div className="activity-card">



<table>


<thead>

<tr>

<th>
Job Title
</th>


<th>
Department
</th>


<th>
Location
</th>


<th>
Skills
</th>


<th>
Action
</th>


</tr>

</thead>




<tbody>



{
jobs.length>0 ?


jobs.map((job)=>(


<tr key={job._id}>


<td>

{job.title}

</td>



<td>

{job.department}

</td>



<td>

{job.location}

</td>



<td>

{job.requiredSkills}

</td>



<td>


<button

onClick={()=>
handleApply(job)
}

>

Apply

</button>


</td>



</tr>


))


:

<tr>

<td colSpan="5">

No jobs available

</td>

</tr>


}



</tbody>


</table>



</div>


</DashboardLayout>

);


}


export default AvailableJobs;