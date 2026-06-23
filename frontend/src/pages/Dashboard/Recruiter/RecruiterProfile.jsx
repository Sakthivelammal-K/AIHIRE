import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import API from "../../../api/api";
import {useEffect,useState} from "react";


function RecruiterProfile(){


const [user,setUser]=useState({});



useEffect(()=>{

loadProfile();

},[]);



const loadProfile=async()=>{


try{


const email =
localStorage.getItem("email");


const response =
await API.get(
`/users/profile?email=${email}`
);


setUser(response.data);


}

catch(error){

console.log(error);

}

};



return (

<DashboardLayout>


<h1>Recruiter Profile</h1>


<div className="activity-card">


<table>

<tbody>


<tr>

<td>Name</td>

<td>
{user.name || "User"}
</td>

</tr>



<tr>

<td>Email</td>

<td>{user.email}</td>

</tr>



<tr>

<td>Role</td>

<td>{user.role}</td>

</tr>



<tr>

<td>Designation</td>

<td>Recruiter</td>

</tr>


</tbody>

</table>


</div>


<div className="activity-card">


<h2>Company Information</h2>


<table>

<tbody>


<tr>
<td>Company</td>
<td>AIHIRE Technologies</td>
</tr>


<tr>
<td>Industry</td>
<td>Software & AI</td>
</tr>


<tr>
<td>Location</td>
<td>Chennai</td>
</tr>


</tbody>


</table>


</div>


</DashboardLayout>

);

}


export default RecruiterProfile;