import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../../styles/forgotPassword.css";

import {
  FaLock,
  FaArrowLeft
} from "react-icons/fa";


function ForgotPassword(){

  const [email,setEmail] = useState("");
  const navigate = useNavigate();


  const handleSubmit=(e)=>{

    e.preventDefault();


    // temporary reset link redirect
    navigate(
      `/reset-password?email=${email}`
    );

  };


  return(

    <div className="forgot-page">


      <div className="forgot-glow"></div>


      <div className="forgot-card">


        <center>

          <div className="forgot-icon">

            <FaLock/>

          </div>

        </center>


        <h1>
          Forgot Password?
        </h1>


        <p>
          Enter your email address and we'll send
          you a secure link to reset your password.
        </p>



        <form onSubmit={handleSubmit}>


          <label>
            Email Address
          </label>


          <input

            type="email"

            placeholder="Enter your email"

            value={email}

            onChange={(e)=>setEmail(e.target.value)}

            required

          />



          <button type="submit">

            Send Reset Link

          </button>


        </form>



        <Link

          to="/login"

          className="back-login"

        >

          <FaArrowLeft/>

          Back to Login


        </Link>


      </div>


    </div>

  )

}


export default ForgotPassword;