import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/api";

import { FaLock, FaArrowRight } from "react-icons/fa";

import "../../styles/resetPassword.css";


function ResetPassword() {

  const { token } = useParams();

  const navigate = useNavigate();


  const [password,setPassword] = useState("");
  const [confirm,setConfirm] = useState("");

  const [message,setMessage] = useState("");

  const [loading,setLoading] = useState(false);



  const reset = async(e)=>{

    e.preventDefault();


    if(!password){

      setMessage("Please enter a new password");

      return;
    }


    if(password.length < 6){

      setMessage(
        "Password must contain minimum 6 characters"
      );

      return;
    }


    if(password !== confirm){

      setMessage(
        "Passwords do not match"
      );

      return;
    }



    try{


      setLoading(true);


      const res = await API.post(
        "/auth/reset-password",
        {
          token,
          password
        }
      );


      setMessage(
        res.data.message
      );



      if(
        res.data.message ===
        "Password changed successfully"
      ){

        setTimeout(()=>{

          navigate("/login");

        },2000);

      }


    }
    catch(error){

      setMessage(
        error.response?.data?.message ||
        "Unable to reset password"
      );

    }
    finally{

      setLoading(false);

    }

  };



  return (

    <div className="reset-page">


      <div className="reset-glow"></div>



      <div className="reset-card">


        <div className="reset-logo">

          AI<span style={{ color: "#60A5FA" }}>HIRE</span>

        </div>



        <div className="lock-icon">

          <FaLock />

        </div>



        <h1>
          Reset Password
        </h1>


        <p>
          Create a new secure password
          for your account.
        </p>



        <form onSubmit={reset}>


          <div className="reset-input">


            <FaLock />


            <input

              type="password"

              placeholder="New password"

              value={password}

              onChange={
                e=>setPassword(e.target.value)
              }

            />

          </div>



          <div className="reset-input">


            <FaLock />


            <input

              type="password"

              placeholder="Confirm password"

              value={confirm}

              onChange={
                e=>setConfirm(e.target.value)
              }

            />

          </div>




          <button disabled={loading}>


            {
              loading
              ?
              "Updating..."
              :
              <>
              Change Password
              <FaArrowRight/>
              </>
            }


          </button>



        </form>



        {
          message &&

          <div className="reset-message">

            {message}

          </div>

        }



        <span
          className="back-login"
          onClick={()=>navigate("/login")}
        >

          Back to Login

        </span>


      </div>



    </div>

  );

}


export default ResetPassword;