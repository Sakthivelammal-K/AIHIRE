import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import {useEffect,useState} from "react";
import API from "../../../api/api";

import {
FaVideo,
FaCalendar
} from "react-icons/fa";


function RecruiterInterviews(){


const [interviews,setInterviews]=useState([]);

const [selectedInterview,setSelectedInterview]=useState(null);



useEffect(()=>{

load();

},[]);



const load = async()=>{

try{

const res =
await API.get("/interviews/");


setInterviews(
res.data.scheduled || []
);


}

catch(err){

console.log(err);

setInterviews([]);

}

};




const saveInterview = async()=>{


try{


await API.put(

`/interviews/${selectedInterview._id}`,

{


type:selectedInterview.type,


meetingLink:
selectedInterview.meetingLink,


instructions:
selectedInterview.instructions,


notes:
selectedInterview.notes,


result:
selectedInterview.result,


status:
selectedInterview.status


}

);



alert("Interview updated");


load();


}

catch(err){

console.log(err);

alert("Update failed");

}


};






return (

<DashboardLayout>




<div className="candidate-banner">


<div>

<h1>
Interview Management
</h1>

<p>
Manage candidate interviews
</p>


</div>


<div className="banner-icon">

<FaVideo/>

</div>


</div>

<br />



<div className="candidate-panel">


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
Date
</th>

<th>
Type
</th>

<th>
Status
</th>


</tr>

</thead>


<tbody>


{
interviews.length ?


interviews.map(item=>(


<tr

key={item._id}

onClick={()=>
setSelectedInterview(item)
}

style={{
cursor:"pointer"
}}

>


<td>
{item.candidateName}
</td>



<td>
{item.jobTitle}
</td>



<td>

<FaCalendar/>

{" "}

{new Date(
item.date
).toLocaleDateString()}

</td>




<td>

<span className="blue-badge">

{item.type || "Not Selected"}

</span>

</td>



<td>

<span className="green-badge">

{item.status}

</span>

</td>


</tr>


))


:


<tr>

<td colSpan="5">

No Interviews

</td>

</tr>


}


</tbody>


</table>


</div>





{
selectedInterview && (


<div
className="candidate-panel"
style={{
marginTop:"30px"
}}
>


<h2>
Interview Details
</h2>






<p>

<strong>
Candidate:
</strong>

{" "}

{selectedInterview.candidateName}

</p>




<p>

<strong>
Role:
</strong>

{" "}

{selectedInterview.jobTitle}

</p>





<p>

<strong>
Date:
</strong>

{" "}

{selectedInterview.date}

</p>





<div className="input-group">


<label>

Interview Type

</label>



<select


value={
selectedInterview.type || ""
}



onChange={(e)=>

setSelectedInterview({

...selectedInterview,

type:e.target.value

})


}


>


<option value="">

Select Type

</option>


<option value="Video Interview">

Video Interview

</option>


<option value="Online Assessment">

Online Assessment

</option>


</select>


</div>







<div className="input-group">


<label>

Status

</label>


<select

value={
selectedInterview.status
}


onChange={(e)=>

setSelectedInterview({

...selectedInterview,

status:e.target.value

})


}

>


<option>
Scheduled
</option>


<option>
Completed
</option>


<option>
Cancelled
</option>


<option>
Rescheduled
</option>


</select>



</div>







<div className="input-group">


<label>

Meeting Link

</label>



<input

value={
selectedInterview.meetingLink || ""
}


placeholder="Google Meet / Zoom Link"


onChange={(e)=>

setSelectedInterview({

...selectedInterview,

meetingLink:e.target.value

})

}


/>


</div>






<div className="input-group">


<label>
Instructions
</label>


<textarea

rows="4"

value={
selectedInterview.instructions || ""
}


onChange={(e)=>

setSelectedInterview({

...selectedInterview,

instructions:e.target.value

})

}


/>


</div>






<div className="input-group">


<label>
Recruiter Notes
</label>


<textarea

rows="4"

value={
selectedInterview.notes || ""
}


onChange={(e)=>

setSelectedInterview({

...selectedInterview,

notes:e.target.value

})

}


/>


</div>






<button

className="profile-save-btn"

onClick={saveInterview}

>

Save Changes

</button>



</div>


)

}



</DashboardLayout>

);


}


export default RecruiterInterviews;