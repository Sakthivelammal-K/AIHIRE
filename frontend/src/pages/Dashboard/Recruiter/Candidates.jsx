import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import { useEffect, useState } from "react";
import API from "../../../api/api";

function Candidates() {

  const [applications, setApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSummary, setSelectedSummary] = useState(null);


  useEffect(() => {

    loadCandidates();

  }, []);



  const loadCandidates = async () => {

    try {

      const response =
        await API.get("/applications");


      setApplications(response.data);


    } catch(error) {

      console.log(error);

    }

  };



  const updateStatus = async(id, status)=>{


    try{

      await API.put(
        `/applications/${id}`,
        {
          status: status
        }
      );


      alert(`Candidate ${status}`);


      loadCandidates();


    }
    catch(error){

      console.log(error);

    }

  };




  const scheduleInterview = async(candidate)=>{


    try{


      await API.post(
        "/interviews/create",
        {

          candidateName:
          candidate.candidateName,

          jobTitle:
          candidate.jobTitle,

          date:"25-Jun-2026",

          type:"AI Video",

          status:"Scheduled"

        }
      );


      alert("Interview Scheduled");


    }
    catch(error){

      console.log(error);

    }

  };




  const filteredApplications =
  applications.filter((app)=>


    (app.candidateName || "")
    .toLowerCase()
    .includes(searchTerm.toLowerCase())


    ||

    (app.jobTitle || "")
    .toLowerCase()
    .includes(searchTerm.toLowerCase())


  );



  return (

    <DashboardLayout>


      <h1>
        Candidate Applications
      </h1>



      <div className="activity-card">


        <input

          type="text"

          placeholder="Search candidate or job..."

          value={searchTerm}

          onChange={
            (e)=>setSearchTerm(e.target.value)
          }

        />


      </div>





      <div className="activity-card">


      <table>


      <thead>

      <tr>

      <th>Candidate</th>
      <th>Job</th>
      <th>Location</th>
      <th>Status</th>
      <th>Actions</th>

      </tr>

      </thead>



      <tbody>


      {

      filteredApplications.length > 0 ?


      filteredApplications.map((app)=>(


      <tr key={app._id}>


      <td>
        {app.candidateName}
      </td>



      <td>
        {app.jobTitle}
      </td>



      <td>
        {app.location}
      </td>



      <td>
        {app.status}
      </td>



      <td>


      <button

      onClick={()=>updateStatus(
        app._id,
        "Shortlisted"
      )}

      >
      Shortlist
      </button>



      <button

      onClick={()=>updateStatus(
        app._id,
        "Rejected"
      )}

      >
      Reject
      </button>



      <button

      onClick={()=>scheduleInterview(app)}

      >
      Schedule
      </button>


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





    </DashboardLayout>

  );

}


export default Candidates;