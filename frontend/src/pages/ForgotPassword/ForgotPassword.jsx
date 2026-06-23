import { useState } from "react";
import "../../styles/forgotPassword.css";
import API from "../../api/api";

function ForgotPassword() {

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);


  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!email) {
      setMessage("Please enter your email");
      return;
    }


    try {

      setLoading(true);

      const response = await API.post("/auth/forgot-password", {
        email: email
      });


      setMessage(response.data.message);

    } catch (error) {

      setMessage(
        error.response?.data?.message ||
        "Something went wrong"
      );

    } finally {
      setLoading(false);
    }

  };


  return (
    <div className="forgot-container">

      <div className="forgot-card">

        <h1>AIHIRE</h1>

        <h2>Forgot Password?</h2>

        <p>
          Enter your registered email address.
        </p>


        <form onSubmit={handleResetPassword}>


          <div className="form-group">

            <label>Email Address</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
            />

          </div>


          <button 
            className="reset-btn"
            disabled={loading}
          >

            {loading 
              ? "Sending..."
              : "Send Reset Link"
            }

          </button>


        </form>


        {message && (
          <p className="message">
            {message}
          </p>
        )}


      </div>

    </div>
  );
}

export default ForgotPassword;