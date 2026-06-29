import {useEffect,useState} from "react";
import {useNavigate,useParams} from "react-router-dom";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import API from "../../../api/api";


function EditJob(){


const {id}=useParams();

const navigate=useNavigate();


const [job,setJob]=useState({});



useEffect(()=>{

loadJob();

},[]);



const loadJob=async()=>{


try{

const response =
await API.get("/jobs/");


const found =
response.data.find(
(item)=>item._id === id
);


setJob(found || {});


}

catch(error){

console.log(error);

}

};



const handleChange=(e)=>{

setJob({

...job,

[e.target.name]:e.target.value

});

};



const handleUpdate=async(e)=>{


e.preventDefault();


try{


await API.put(
`/jobs/${id}`,
updatedjob
);


alert("Job Updated successfully");


navigate("/jobs");


}

catch(error){

console.log(error);

alert("Update failed");

}


};




return (

<DashboardLayout>

<div className="edit-job-container">

<div className="edit-job-card">

<h1>Edit Job</h1>

<form className="edit-job-form" onSubmit={handleUpdate}>

<div className="edit-form-group">
<label>Job Title</label>
<input
name="title"
value={job.title || ""}
onChange={handleChange}
/>
</div>

<div className="edit-form-group">
<label>Department</label>
<input
name="department"
value={job.department || ""}
onChange={handleChange}
/>
</div>

<div className="edit-form-group">
<label>Location</label>
<input
name="location"
value={job.location || ""}
onChange={handleChange}
/>
</div>

<div className="edit-form-group edit-full">
<label>Description</label>
<textarea
rows="6"
name="description"
value={job.description || ""}
onChange={handleChange}
/>
</div>

<div className="edit-form-group">
<label>Status</label>

<select
name="status"
value={job.status || "Open"}
onChange={handleChange}
>

<option>Open</option>
<option>Closed</option>

</select>

</div>

<div className="edit-actions">

<button
type="button"
className="edit-cancel-btn"
onClick={()=>navigate("/jobs")}
>

Cancel

</button>

<button
type="submit"
className="edit-save-btn"
>

Update Job

</button>

</div>

</form>

</div>

</div>

</DashboardLayout>

);

}


export default EditJob;