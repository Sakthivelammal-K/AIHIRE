import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import { useEffect, useState } from "react";
import API from "../../../api/api";

import {
FaUsers,
FaEnvelope,
FaUserTag,
FaUserShield,
FaUserTie,
FaUserGraduate
} from "react-icons/fa";



function Users(){



const [users,setUsers]=useState([]);





useEffect(()=>{

loadUsers();

},[]);







const loadUsers = async()=>{


try{


const response =
await API.get("/users/");


setUsers(response.data);


}
catch(error){

console.log(error);

}


};







const admins =
users.filter(
user=>user.role==="admin"
).length;



const recruiters =
users.filter(
user=>user.role==="recruiter"
).length;



const candidates =
users.filter(
user=>user.role==="candidate"
).length;







return(



<DashboardLayout>





<div className="admin-dashboard">







{/* HEADER */}




<div className="dashboard-header">



<div>


<h1>

User Management

</h1>



<p>

Manage AIHIRE platform users

</p>



</div>




<FaUsers className="dashboard-icon"/>



</div>













{/* CARDS */}





<div className="cards">







<div className="admin-card">


<FaUsers className="dashboard-icon"/>


<h3>

Total Users

</h3>


<h2>

{users.length}

</h2>


</div>









<div className="admin-card">


<FaUserShield className="dashboard-icon"/>


<h3>

Admins

</h3>


<h2>

{admins}

</h2>


</div>









<div className="admin-card">


<FaUserTie className="dashboard-icon"/>


<h3>

Recruiters

</h3>


<h2>

{recruiters}

</h2>


</div>









<div className="admin-card">


<FaUserGraduate className="dashboard-icon"/>


<h3>

Candidates

</h3>


<h2>

{candidates}

</h2>


</div>








</div>













{/* TABLE */}





<div className="activity-card">





<h2>

All Users

</h2>







<table className="recruiter-table">







<thead>


<tr>


<th>

Name

</th>



<th>

Email

</th>




<th>

Role

</th>



</tr>


</thead>








<tbody>





{

users.length > 0 ? (


users.map(user=>(



<tr key={user._id || user.id}>


<td>

{user.name || "Unknown"}

</td>





<td>


<FaEnvelope/>

{" "}

{user.email || "No Email"}


</td>







<td>


<span

className={
user.role==="admin"
?
"green-badge"
:
user.role==="recruiter"
?
"blue-badge"
:
"red-badge"
}

>


<FaUserTag/>

{" "}

{user.role || "User"}


</span>



</td>





</tr>



))



):(



<tr>


<td colSpan="3" style={{textAlign:"center"}}>


No Users Found


</td>


</tr>


)



}





</tbody>







</table>







</div>








</div>





</DashboardLayout>




);


}




export default Users;