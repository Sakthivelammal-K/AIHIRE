import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import {useNavigate} from "react-router-dom";
import API from "../../../api/api";

import {
FaPlus,
FaBriefcase
} from "react-icons/fa";


function CreateJob(){


const navigate=useNavigate();



const handleSubmit=async(e)=>{

e.preventDefault();


const job={

title:e.target.title.value,

department:e.target.department.value,

location:e.target.location.value,

description:e.target.description.value,

requiredSkills:e.target.skills.value,

status:"Open",

applicants:0

};



try{


await API.post(
"/jobs/create",
job
);


alert("Job Created");


navigate("/jobs");


}

catch(error){

console.log(error);

alert("Failed");

}


};



return (

<DashboardLayout>



<div className="candidate-banner">


<div>

<h1>
Create Job
</h1>

<p>
Add a new hiring position
</p>


</div>


<div className="banner-icon">

<FaBriefcase/>

</div>


</div>





<div className="candidate-panel hover-card">


<form onSubmit={handleSubmit}>


<div className="form-group">

<label>
Job Title
</label>

<input
name="title"
required
/>

</div>




<div className="form-group">

<label>
Department
</label>

<input
name="department"
required
/>

</div>





<div className="form-group">

<label>
Location
</label>

<input
name="location"
required
/>

</div>





<div className="form-group">

<label>
Required Skills
</label>


<input

name="skills"

placeholder="React, Python, AI"

required

/>

</div>





<div className="form-group">

<label>
Description
</label>


<textarea

name="description"

rows="5"

/>


</div>




<button type="submit">

<FaPlus/>

 Create Job

</button>



</form>


</div>



</DashboardLayout>

);


}


export default CreateJob;