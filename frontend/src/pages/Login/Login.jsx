import "../../styles/login.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import API from "../../api/api";


function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


const handleLogin = async (e) => {

  e.preventDefault();

  try {

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


    if(response.data.role === "admin"){

      navigate("/admin-dashboard");

    }
    else if(response.data.role === "recruiter"){

      navigate("/recruiter-dashboard");

    }
    else if(response.data.role === "candidate"){

      navigate("/candidate-dashboard");

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

    <div className="login-container">

      <div className="login-card">


        <h1>AIHIRE</h1>


        <h2>Welcome Back</h2>


        <p>
          Login to continue
        </p>



        <form 
          onSubmit={handleLogin}
          autoComplete="off"
        >



          <div className="form-group">

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





          <div className="form-group">


            <label>
              Password
            </label>


            <input

              type="password"

              placeholder="Enter password"

              value={password}

              onChange={(e)=>setPassword(e.target.value)}

              required

            />


          </div>






          <div className="login-options">


            <Link to="/forgot-password">

              Forgot Password?

            </Link>


          </div>






          <button

            type="submit"

            className="login-btn"

          >

            Login


          </button>



        </form>






        <p className="register-link">


          Don't have an account?{" "}


          <Link to="/register">

            Register

          </Link>


        </p>





      </div>


    </div>

  );

}


export default Login;