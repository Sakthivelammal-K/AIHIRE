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
res.data.scheduled || res.data || []
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

`/interviews/result/${selectedInterview._id}`,

{

type:selectedInterview.type,

meetingLink:selectedInterview.meetingLink,

instructions:selectedInterview.instructions,

notes:selectedInterview.notes,

status:selectedInterview.status

}

);


// update UI immediately

setInterviews(prev =>

prev.map(item =>

item._id === selectedInterview._id

?

{
...item,
type:selectedInterview.type,
meetingLink:selectedInterview.meetingLink,
instructions:selectedInterview.instructions,
notes:selectedInterview.notes,
status:selectedInterview.status
}

:

item

)

);


// update selected card also

setSelectedInterview({

...selectedInterview

});



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
Manage scheduled candidate interviews
</p>


</div>


<div className="banner-icon">

<FaVideo/>

</div>


</div>



<br/>





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

onClick={()=>setSelectedInterview(item)}

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


{

item.status==="Completed"

?

<span className="green-badge">
Completed
</span>


:


item.status==="Cancelled"

?


<span className="red-badge">
Cancelled
</span>


:

<span className="orange-badge">
Scheduled
</span>


}


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


<div className="candidate-panel">


<h2>
Interview Details
</h2>



<p>

<b>
Candidate:
</b>

{" "}

{selectedInterview.candidateName}

</p>



<p>

<b>
Role:
</b>

{" "}

{selectedInterview.jobTitle}

</p>



<p>

<b>
Date:
</b>

{" "}

{selectedInterview.date}

</p>





<div className="input-group">


<label>
Interview Type
</label>


<select

value={selectedInterview.type || ""}

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


<option>
Video Interview
</option>


<option>
Online Assessment
</option>


</select>


</div>







<div className="input-group">


<label>
Status
</label>


<select

value={selectedInterview.status}

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


placeholder="Meeting link"


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



<button

className="profile-cancel-btn"

style={{
marginLeft:"15px"
}}

onClick={()=>setSelectedInterview(null)}

>

Close

</button>



</div>


)

}



</DashboardLayout>

);


}


export default RecruiterInterviews;