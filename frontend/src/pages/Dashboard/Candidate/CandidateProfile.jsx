import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import API from "../../../api/api";
import { useEffect, useState } from "react";


function CandidateProfile() {

const [user,setUser] = useState({});


useEffect(()=>{
    loadProfile();
},[]);



const loadProfile = async()=>{

try{

const email = localStorage.getItem("email");


const response = await API.get(
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

<h1>My Profile</h1>


<div className="activity-card">


<table>

<tbody>

<tr>
<td>Name</td>
<td>{user.name || "User"}</td>
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
<td>Skills</td>
<td>
{user.skills || "Not added"}
</td>
</tr>


<tr>
<td>Experience</td>
<td>
{user.experience || "0"}
</td>
</tr>


</tbody>

</table>


</div>


</DashboardLayout>

);

}


export default CandidateProfile;