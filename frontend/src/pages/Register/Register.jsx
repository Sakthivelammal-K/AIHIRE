import "../../styles/register.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import API from "../../api/api";

import {
  FaUserPlus,
  FaRocket,
  FaShieldAlt,
  FaBrain,
  FaEye,
  FaEyeSlash
} from "react-icons/fa";


function Register(){

  const navigate = useNavigate();


  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [showPassword,setShowPassword] = useState(false);
  const [role,setRole]=useState("candidate");


  const handleRegister = async(e)=>{

    e.preventDefault();

    try{

      const response = await API.post("/auth/register",{

        name,
        email,
        password,
        role

      });


      alert(response.data.message);

      navigate("/login");


    }catch(error){

      console.log(error);

      alert("Registration failed");

    }

  };


  return (

    <div className="register-page">


      <div className="register-wrapper">


        {/* LEFT BRAND SECTION */}

        <div className="register-info">


          <h1>
            AIHIRE
          </h1>


          <h2>
            Build Your Future
            With Smart Hiring
          </h2>


          <p>
            Join AIHIRE and experience
            AI powered recruitment,
            interviews and candidate management.
          </p>



          <div className="info-box">

            <FaBrain/>

            <div>
              <h4>
                AI Powered
              </h4>

              <p>
                Smart resume screening
              </p>
            </div>

          </div>



          <div className="info-box">

            <FaRocket/>

            <div>
              <h4>
                Faster Hiring
              </h4>

              <p>
                Reduce hiring time
              </p>
            </div>

          </div>



          <div className="info-box">

            <FaShieldAlt/>

            <div>
              <h4>
                Secure Platform
              </h4>

              <p>
                Enterprise ready system
              </p>
            </div>

          </div>


        </div>





        {/* REGISTER CARD */}


        <div className="register-card">


          <div className="register-title">


            <FaUserPlus/>

            <h2>
              Create Account
            </h2>


            <p>
              Start your AIHIRE journey
            </p>


          </div>





          <form onSubmit={handleRegister}>


            <div className="input-group">

              <label>
                Full Name
              </label>


              <input

                type="text"

                placeholder="Enter your name"

                value={name}

                onChange={(e)=>setName(e.target.value)}

                required

              />

            </div>





            <div className="input-group">


              <label>
                Email
              </label>


              <input

                type="email"

                placeholder="Enter email"

                value={email}

                onChange={(e)=>setEmail(e.target.value)}

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





            <div className="input-group">


              <label>
                Account Type
              </label>


              <select

                value={role}

                onChange={(e)=>setRole(e.target.value)}

              >


                <option value="candidate">
                  Candidate
                </option>


                <option value="recruiter">
                  Recruiter
                </option>


              </select>


            </div>





            <button className="register-btn">

              Create Account

            </button>





          </form>


          <div className="login-link">

            Already have account?

            <span
              onClick={()=>navigate("/login")}
            >
              Login
            </span>


          </div>



        </div>



      </div>



    </div>

  );

}


export default Register;