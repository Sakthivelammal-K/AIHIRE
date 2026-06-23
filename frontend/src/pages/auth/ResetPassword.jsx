import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/api";


function ResetPassword() {

  const { token } = useParams();

  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);



  const reset = async (e) => {

    e.preventDefault();


    if(!password){
      setMessage("Enter new password");
      return;
    }


    try {

      setLoading(true);


      const res = await API.post(
        "/auth/reset-password",
        {
          token,
          password
        }
      );


      setMessage(res.data.message);


      // after success go login page
      if(
        res.data.message === 
        "Password changed successfully"
      ){

        setTimeout(()=>{

          navigate("/login");

        },2000);

      }


    } catch(error){

      setMessage(
        error.response?.data?.message ||
        "Something went wrong"
      );

    } finally {

      setLoading(false);

    }

  };



  return (

    <div className="reset-container">


      <div className="reset-card">


        <h1>AIHIRE</h1>


        <h2>Reset Password</h2>


        <form onSubmit={reset}>


          <input

            type="password"

            placeholder="Enter new password"

            value={password}

            onChange={
              (e)=>setPassword(e.target.value)
            }

          />


          <button disabled={loading}>

            {
              loading 
              ? "Changing..."
              : "Change Password"
            }

          </button>


        </form>


        {
          message &&
          <p>{message}</p>
        }


      </div>


    </div>

  );

}


export default ResetPassword;