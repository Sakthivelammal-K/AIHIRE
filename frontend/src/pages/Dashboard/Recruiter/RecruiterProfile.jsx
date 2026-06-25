import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import {useEffect,useState} from "react";
import API from "../../../api/api";

import {
FaUserTie,
FaBuilding,
FaEnvelope,
FaMapMarkerAlt,
FaEdit,
FaUsers,
FaBriefcase,
FaPhone,
FaGlobe,
FaLinkedin,
FaIndustry
} from "react-icons/fa";


function RecruiterProfile(){


const [user,setUser]=useState({});

const [editing,setEditing]=useState(false);

const [activeTab,setActiveTab]=useState("profile");

const [formData,setFormData]=useState({});



useEffect(()=>{

loadProfile();

},[]);



useEffect(()=>{

setFormData({

name:user.name || "",
company:user.company || "",
industry:user.industry || "",
location:user.location || "",
phone:user.phone || "",
linkedin:user.linkedin || "",
website:user.website || "",
about:user.about || ""

});


},[user]);





const loadProfile=async()=>{


try{


const email =
localStorage.getItem("email");


const res =
await API.get(
`/users/profile?email=${email}`
);


setUser(res.data);



}

catch(err){

console.log(err);

}

};





const handleChange=(e)=>{


setFormData({

...formData,

[e.target.name]:e.target.value

});


};





const saveProfile=async()=>{


try{


await API.put(
"/users/profile",
{
email:user.email,
...formData
}
);


alert("Profile Updated");


setEditing(false);


loadProfile();


}

catch(err){

console.log(err);

alert("Update Failed");

}


};





return (

<DashboardLayout>


<div className="candidate-banner">


<div>


<h1>
{user.name || "Recruiter"}
</h1>


<p>

Talent Acquisition Manager •
{" "}
{user.company || "Company"}

</p>



<div className="profile-progress">


<p>
Profile Completion 80%
</p>


<div className="progress-bg">

<div
className="progress-fill"
style={{
width:"80%"
}}
/>

</div>


</div>



</div>




<div className="banner-icon">


<FaUserTie/>


<br/>


<button
className="profile-edit-btn"
onClick={()=>setEditing(true)}
>

<FaEdit/>

Edit Profile

</button>


</div>



</div>






<div className="candidate-stats">



<div className="candidate-stat">

<div className="stat-icon blue">

<FaUsers/>

</div>


<div>

<h3>
Candidates
</h3>

<h2>
120
</h2>

</div>

</div>





<div className="candidate-stat">

<div className="stat-icon green">

<FaBriefcase/>

</div>


<div>

<h3>
Active Jobs
</h3>

<h2>
15
</h2>

</div>

</div>






<div className="candidate-stat">

<div className="stat-icon purple">

<FaBuilding/>

</div>


<div>

<h3>
Company
</h3>

<h2>

{user.company || "AIHIRE"}

</h2>

</div>

</div>





<div className="candidate-stat">

<div className="stat-icon orange">

<FaIndustry/>

</div>


<div>

<h3>
Industry
</h3>

<h2>

{user.industry || "IT"}

</h2>

</div>

</div>




</div>







<div className="candidate-panel">


<h2>
Recruiter Information
</h2>


<table className="recruiter-table">


<tbody>


<tr>

<td>
<FaEnvelope/> Email
</td>

<td>
{user.email}
</td>


</tr>




<tr>

<td>
<FaMapMarkerAlt/> Location
</td>


<td>
{user.location || "Not Added"}
</td>


</tr>




<tr>

<td>
<FaPhone/> Phone
</td>


<td>
{user.phone || "Not Added"}
</td>


</tr>



<tr>

<td>
<FaLinkedin/> LinkedIn
</td>


<td>
{user.linkedin || "Not Added"}
</td>


</tr>




<tr>

<td>
<FaGlobe/> Website
</td>


<td>
{user.website || "Not Added"}
</td>


</tr>


</tbody>


</table>


</div>









<div className="candidate-panel">


<h2>
Company Profile
</h2>


<p
style={{
color:"#94A3B8",
lineHeight:"1.8"
}}
>


{user.about ||

"Recruiter profile helps manage hiring, candidates and job postings."}


</p>


</div>









{
editing &&

<div className="profile-settings-overlay">


<div className="recruiter-profile-modal">



{/* SIDEBAR */}

<div className="recruiter-sidebar">


<h3>
Recruiter
</h3>
<h2>My Profile</h2>

<div
className={
activeTab==="profile"
?"side-active"
:""
}
onClick={()=>setActiveTab("profile")}
>
<FaUserTie/>
Profile
</div>



<div
className={
activeTab==="account"
?"side-active"
:""
}
onClick={()=>setActiveTab("account")}
>
<FaEnvelope/>
Account
</div>




<div
className={
activeTab==="company"
?"side-active"
:""
}
onClick={()=>setActiveTab("company")}
>
<FaBuilding/>
Company Details
</div>





<div
className={
activeTab==="billing"
?"side-active"
:""
}
onClick={()=>setActiveTab("billing")}
>
<FaBriefcase/>
Billing Plans
</div>




<div className="billing-footer">

<p>
Current Plan
</p>


<h3>
{
user.plan || "FREE"
}
</h3>


</div>



</div>





{/* CONTENT */}


<div className="profile-content">



<button
className="profile-close-btn"
onClick={()=>setEditing(false)}
>
✕
</button>




{
activeTab==="profile" &&

<>


<h1>
Profile
</h1>

<p>
Manage your recruiter information
</p>


<div className="profile-form">


<div className="form-group">

<label>
Name
</label>

<input
name="name"
value={formData.name}
onChange={handleChange}
/>

</div>




<div className="form-group">

<label>
Company
</label>

<input
name="company"
value={formData.company}
onChange={handleChange}
/>

</div>




<div className="form-group full-width">

<label>
Email
</label>

<input
disabled
value={user.email || ""}
/>

</div>




<div className="form-group full-width">

<label>
Phone
</label>

<input
name="phone"
value={formData.phone}
onChange={handleChange}
/>

</div>





<div className="form-group full-width">

<label>
LinkedIn
</label>

<input
name="linkedin"
value={formData.linkedin}
onChange={handleChange}
/>

</div>



</div>


</>

}







{
activeTab==="account" &&

<>

<h1>
Account Settings
</h1>


<div className="profile-form">


<div className="form-group full-width">

<label>
Email Address
</label>


<input
disabled
value={user.email}
/>

</div>



<div className="form-group full-width">

<label>
Password
</label>


<input
type="password"
placeholder="Change password"
/>

</div>



</div>

</>

}









{
activeTab==="company" &&


<>


<h1>
Company Details
</h1>


<div className="profile-form">



<div className="form-group">

<label>
Industry
</label>

<input
name="industry"
value={formData.industry}
onChange={handleChange}
/>

</div>




<div className="form-group">

<label>
Website
</label>

<input
name="website"
value={formData.website}
onChange={handleChange}
/>

</div>



<div className="form-group full-width">

<label>
About Company
</label>


<textarea

rows="6"

name="about"

value={formData.about}

onChange={handleChange}

/>


</div>



</div>


</>

}









{
activeTab==="billing" &&


<>


<h1>
Billing Plans
</h1>


<div className="billing-card">


<h2>
{
user.plan || "Free Plan"
}
</h2>


<h1>
₹0 / month
</h1>


<p>
For small recruiters getting started
</p>



<ul>

<li>
✓ Create Jobs
</li>

<li>
✓ View Candidates
</li>

<li>
✓ Basic AI Interview
</li>

</ul>


<button>
Upgrade Plan
</button>


</div>





<div className="billing-card premium">


<h2>
Pro Plan
</h2>


<h1>
₹999 / month
</h1>


<ul>

<li>
✓ Unlimited Jobs
</li>

<li>
✓ AI Screening
</li>

<li>
✓ Advanced Analytics
</li>

<li>
✓ Priority Support
</li>


</ul>



</div>



</>

}






<div className="profile-modal-actions">


<button
className="profile-cancel-btn"
onClick={()=>setEditing(false)}
>
Cancel
</button>



<button
className="profile-save-btn"
onClick={saveProfile}
>
Save Changes
</button>


</div>



</div>


</div>

</div>

}





</DashboardLayout>

);


}


export default RecruiterProfile;