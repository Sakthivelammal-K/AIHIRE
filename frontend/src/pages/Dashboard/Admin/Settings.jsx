import DashboardLayout from "../../../components/dashboard/DashboardLayout";

import {useEffect,useState} from "react";

import API from "../../../api/api";


import {
FaUsers,
FaBriefcase,
FaFileAlt,
FaServer,
FaRobot,
FaCheckCircle,
FaCog
} from "react-icons/fa";





function Settings(){



const [users,setUsers]=useState([]);

const [jobs,setJobs]=useState([]);

const [applications,setApplications]=useState([]);







useEffect(()=>{


loadData();


},[]);







const loadData = async()=>{


try{


const [

usersRes,

jobsRes,

appRes


]=await Promise.all([


API.get("/users/"),

API.get("/jobs/"),

API.get("/applications/")


]);





setUsers(usersRes.data);

setJobs(jobsRes.data);

setApplications(appRes.data);





}
catch(error){


console.log(error);


}


};









return(



<DashboardLayout>





<div className="admin-dashboard">







{/* HEADER */}



<div className="dashboard-header">



<div>



<h1>

Platform Settings

</h1>



<p>

Manage AIHIRE system configuration

</p>



</div>




<FaCog className="dashboard-icon"/>



</div>











{/* STAT CARDS */}





<div className="cards">







<div className="admin-card">


<FaUsers className="dashboard-icon"/>



<h3>

Users

</h3>



<h2>

{users.length}

</h2>



</div>









<div className="admin-card">


<FaBriefcase className="dashboard-icon"/>



<h3>

Jobs

</h3>



<h2>

{jobs.length}

</h2>



</div>









<div className="admin-card">


<FaFileAlt className="dashboard-icon"/>



<h3>

Applications

</h3>



<h2>

{applications.length}

</h2>



</div>









</div>














{/* PLATFORM INFO */}




<div className="activity-card">





<h2>

Platform Information

</h2>







<table className="recruiter-table">





<tbody>





<tr>

<td>

Platform Name

</td>


<td>

AIHIRE

</td>


</tr>







<tr>


<td>

Version

</td>


<td>

1.0.0

</td>


</tr>








<tr>


<td>

Environment

</td>


<td>

Development

</td>


</tr>





<tr>


<td>

Database

</td>


<td>

MongoDB

</td>


</tr>





</tbody>







</table>







</div>
















{/* SYSTEM STATUS */}





<div className="activity-card">





<h2>

System Status

</h2>







<div className="overview-item">



<FaCheckCircle/>


<span>

Application Status

</span>


<b>

Running

</b>



</div>









<div className="overview-item">



<FaServer/>


<span>

Database Status

</span>


<b>

Connected

</b>



</div>









<div className="overview-item">



<FaRobot/>


<span>

AI Modules

</span>


<b>

Enabled

</b>



</div>








</div>












</div>





</DashboardLayout>



);



}



export default Settings;