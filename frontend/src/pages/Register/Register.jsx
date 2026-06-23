import "../../styles/register.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import API from "../../api/api";


function Register() {

  const navigate = useNavigate();


  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [role,setRole] = useState("candidate");


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


    }
    catch(error){

      console.log(error);

      alert("Registration failed");

    }

  };



  return (

    <div className="register-container">

      <div className="register-card">


        <h1>AIHIRE</h1>

        <h2>Create Account</h2>


        <form onSubmit={handleRegister}>


          <div className="form-group">

            <label>Full Name</label>

            <input
              type="text"
              placeholder="Enter full name"
              value={name}
              onChange={(e)=>setName(e.target.value)}
              required
            />

          </div>



          <div className="form-group">

            <label>Email</label>

            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
              required
            />

          </div>




          <div className="form-group">

            <label>Password</label>

            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              required
            />

          </div>



          <div className="form-group">

            <label>Role</label>


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



          <button
            type="submit"
            className="register-btn"
          >
            Create Account

          </button>


        </form>


      </div>

    </div>

  );

}


export default Register;