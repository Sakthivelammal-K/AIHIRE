import "../../styles/login.css";

import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import API from "../../api/api";

import {
  FaArrowRight,
  FaShieldAlt,
  FaRobot,
  FaUsers,
  FaEye,
  FaEyeSlash
} from "react-icons/fa";


function Login(){

const navigate = useNavigate();


const [email,setEmail]=useState("");
const [password,setPassword]=useState("");
const [showPassword,setShowPassword] =
useState(false);


const handleLogin = async(e)=>{

e.preventDefault();


try{


const response = await API.post(
"/auth/login",
{
email,
password
}
);



localStorage.setItem(
"username",
response.data.username
);


localStorage.setItem(
"email",
response.data.email
);


localStorage.setItem(
"role",
response.data.role
);


localStorage.setItem(
"token",
response.data.token
);



alert("Login Successful");



if (response.data.role === "admin") {

  navigate("/admin/dashboard");

}

else if (response.data.role === "recruiter") {

  navigate("/recruiter/dashboard");

}

else if (response.data.role === "candidate") {

  navigate("/candidate/dashboard");

}



}
catch(error){

console.log(error);

alert(
"Invalid Email or Password"
);

}


};



return (

<div className="login-page">


<div className="login-glow"></div>



<div className="login-wrapper">



{/* LEFT SIDE */}


<div className="login-brand">


<h1>
AIHIRE
</h1>


<h2>
Smart Hiring Starts Here
</h2>


<p>

AI powered recruitment platform
that helps companies discover,
interview and hire the best talent.

</p>



<div className="brand-feature">

<FaRobot/>

AI Resume Screening

</div>



<div className="brand-feature">

<FaUsers/>

Candidate Management

</div>



<div className="brand-feature">

<FaShieldAlt/>

Secure Hiring Workflow

</div>



</div>






{/* LOGIN CARD */}



<div className="login-card">


<h2>
Welcome Back
</h2>


<p>
Login to continue your workspace
</p>




<form onSubmit={handleLogin}>


<div className="input-group">

<label>
Email
</label>


<input

type="email"

placeholder="Enter your email"

value={email}

onChange={
(e)=>setEmail(e.target.value)
}

required

/>

</div>





<div className="input-group">

<label>
Password
</label>

<div className="password-wrapper">

  <input
    type={showPassword ? "text" : "password"}
    placeholder="Enter password"
    value={password}
    onChange={(e)=>setPassword(e.target.value)}
    required
  />

  <button
    type="button"
    className="password-toggle"
    onClick={() => setShowPassword(!showPassword)}
  >
    {showPassword ? <FaEyeSlash /> : <FaEye />}
  </button>

</div>

</div>





<div className="login-links">


<Link to="/forgot-password">

Forgot Password?

</Link>


</div>






<button
className="login-btn"
type="submit"
>

Login

<FaArrowRight/>

</button>





<p className="signup">

Don't have an account?


<Link to="/register">

Create Account

</Link>


</p>



</form>



</div>


</div>



</div>

);

}


export default Login;