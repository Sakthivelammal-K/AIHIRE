import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../../../api/api";

import {
  FaLock,
  FaArrowLeft
} from "react-icons/fa";

import "../../../styles/forgotPassword.css";

function ForgotPassword() {

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      const res = await API.post(
        "/auth/forgot-password",
        {
          email
        }
      );

      setMessage(res.data.message);

      // Temporary (until email is configured)
console.log("Reset Link:", res.data.reset_link);

// Automatically open the reset page
window.location.href = res.data.reset_link;

    }
    catch (err) {

      setMessage(
        err.response?.data?.detail ||
        "Something went wrong."
      );

    }
    finally {

      setLoading(false);

    }

  };

  return (

    <div className="forgot-page">

      <div className="forgot-glow"></div>

      <div className="forgot-card">

        <center>
          <div className="forgot-icon">
            <FaLock />
          </div>
        </center>

        <center>
          <h1>Forgot Password?</h1>
        </center>

        <p>
          Enter your email address and we'll send you a secure reset link.
        </p>

        <form onSubmit={handleSubmit}>

          <label>Email Address</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

        </form>

        {message && (
          <p
            style={{
              marginTop: "15px",
              textAlign: "center",
              color: "#F97316"
            }}
          >
            {message}
          </p>
        )}

        <Link
          to="/login"
          className="back-login"
        >
          <FaArrowLeft />
          Back to Login
        </Link>

      </div>

    </div>

  );

}

export default ForgotPassword;