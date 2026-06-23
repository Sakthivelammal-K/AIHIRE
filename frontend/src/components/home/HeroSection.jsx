import { Link } from "react-router-dom";
import heroIllustration from "../../assets/hero-illustration.jpg";
import "../../styles/hero.css";

function HeroSection() {
  return (
    <section className="hero">

      <div className="hero-content">

        {/* Left Side */}

        <div className="hero-left">

          <span className="badge">
            🚀 AI Powered Hiring Platform
          </span>

          <h1>
            Find Top Talent &
            <span className="highlight"> Get Hired Faster</span>
          </h1>

          <p>
            AIHIRE helps recruiters identify the best candidates
            through AI Resume Screening, Smart Match Scores,
            AI Interviews, and Hiring Predictions.
          </p>

          <div className="hero-buttons">

            <Link to="/register">
              <button className="primary-btn">
                Get Started
              </button>
            </Link>

            <Link to="/contact">
              <button className="secondary-btn">
                Book Demo
              </button>
            </Link>

          </div>

          <div className="hero-stats">

            <div>
              <h3>10K+</h3>
              <p>Candidates</p>
            </div>

            <div>
              <h3>500+</h3>
              <p>Companies</p>
            </div>

            <div>
              <h3>95%</h3>
              <p>Match Accuracy</p>
            </div>

          </div>

        </div>

        {/* Right Side */}

        <div className="hero-right">
<div className="hero-right">
  <img
    src={heroIllustration}
    alt="AI Hiring Platform"
    className="hero-image"
  />
</div>

        </div>

      </div>

    </section>
  );
}

export default HeroSection;