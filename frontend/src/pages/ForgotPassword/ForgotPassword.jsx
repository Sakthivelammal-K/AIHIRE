import "../../styles/forgotPassword.css";

function ForgotPassword() {
  return (
    <div className="forgot-container">

      <div className="forgot-card">

        <h1>AIHIRE</h1>

        <h2>Forgot Password?</h2>

        <p>
          Enter your registered email address.
        </p>

        <form>

          <div className="form-group">
            <label>Email Address</label>

            <input
              type="email"
              placeholder="Enter your email"
            />
          </div>

          <button className="reset-btn">
            Send Reset Link
          </button>

        </form>

      </div>

    </div>
  );
}

export default ForgotPassword;