import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import {useEffect,useState} from "react";
import API from "../../../api/api";


function Users(){


const [users,setUsers]=useState([]);


useEffect(()=>{

loadUsers();

},[]);



const loadUsers=async()=>{

const response =
await API.get("/users/");

setUsers(response.data);

};



return(

<DashboardLayout>


<h1>User Management</h1>


<div className="activity-card">


<table>


<thead>

<tr>
<th>Name</th>
<th>Email</th>
<th>Role</th>
</tr>

</thead>



<tbody>


{
users.map(user=>(


<tr key={user._id}>


<td>
{user.name}
</td>


<td>
{user.email}
</td>


<td>
{user.role}
</td>


</tr>


))
}



</tbody>


</table>


</div>


</DashboardLayout>

)

}


export default Users;