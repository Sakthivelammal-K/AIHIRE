import DashboardLayout from "../../../components/dashboard/DashboardLayout";

import {
FaUserShield,
FaUserTie,
FaUserGraduate,
FaKey,
FaUsersCog
} from "react-icons/fa";



function Roles(){



return(


<DashboardLayout>



<div className="admin-dashboard">





{/* HEADER */}



<div className="dashboard-header">


<div>


<h1>
Roles & Permissions
</h1>


<p>
Manage AIHIRE platform access control
</p>


</div>



<FaUsersCog className="dashboard-icon"/>


</div>










{/* ROLE CARDS */}



<div className="cards">






<div className="admin-card">


<FaUserShield className="dashboard-icon"/>


<h3>
Admin
</h3>


<h2>
Full
</h2>


</div>







<div className="admin-card">


<FaUserTie className="dashboard-icon"/>


<h3>
Recruiter
</h3>


<h2>
Manage
</h2>


</div>








<div className="admin-card">


<FaUserGraduate className="dashboard-icon"/>


<h3>
Candidate
</h3>


<h2>
Apply
</h2>


</div>





</div>









{/* TABLE */}




<div className="activity-card">



<h2>
Role Management
</h2>






<table className="recruiter-table">





<thead>


<tr>


<th>
Role
</th>


<th>
Responsibilities
</th>


<th>
Access Level
</th>


</tr>


</thead>







<tbody>






<tr>


<td>


<FaUserShield/>


{" "}

Admin


</td>




<td>


Manage Users, Analytics,
Settings and Organizations


</td>





<td>


<span className="green-badge">

<FaKey/>

{" "}

Full Access

</span>


</td>





</tr>









<tr>


<td>


<FaUserTie/>


{" "}

Recruiter


</td>





<td>


Create Jobs, Manage Candidates,
Schedule Interviews


</td>





<td>


<span className="blue-badge">


Recruitment Access


</span>


</td>






</tr>











<tr>


<td>


<FaUserGraduate/>


{" "}

Candidate


</td>





<td>


Apply Jobs, Upload Resume,
Attend Interviews


</td>





<td>


<span className="blue-badge">


Candidate Access


</span>


</td>







</tr>







</tbody>





</table>







</div>













{/* OVERVIEW */}



<div className="activity-card">



<h2>
Role Overview
</h2>





<div className="overview-item">


<FaUserShield/>


<span>

Admin controls entire AIHIRE platform

</span>


</div>






<div className="overview-item">


<FaUserTie/>


<span>

Recruiters manage hiring activities

</span>


</div>







<div className="overview-item">


<FaUserGraduate/>


<span>

Candidates apply and attend interviews

</span>


</div>







</div>









</div>



</DashboardLayout>



);


}



export default Roles;