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


<h1>Edit Job</h1>


<div className="activity-card">

<form onSubmit={handleUpdate}>


<input

name="title"

value={job.title || ""}

onChange={handleChange}

/>



<input

name="department"

value={job.department || ""}

onChange={handleChange}

/>



<input

name="location"

value={job.location || ""}

onChange={handleChange}

/>



<textarea

name="description"

value={job.description || ""}

onChange={handleChange}

/>



<select

name="status"

value={job.status || "Open"}

onChange={handleChange}

>

<option>
Open
</option>

<option>
Closed
</option>

</select>



<br/>

<button>
Update Job
</button>


</form>

</div>


</DashboardLayout>

);

}


export default EditJob;