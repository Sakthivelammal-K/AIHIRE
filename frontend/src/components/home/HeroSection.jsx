import { Link } from "react-router-dom";
import "../../styles/hero.css";

function HeroSection() {
  return (
    <section className="hero">

      <div className="hero-grid">

        <div className="hero-left">

          <div className="hero-badge">
            AI Recruitment Platform
          </div>

          <h1>
            Hire Better Talent
            <br />
            <span>Faster With AI</span>
          </h1>

          <p>
            Source candidates, screen resumes, conduct AI interviews,
            and make hiring decisions with confidence from one unified platform.
          </p>

          <div className="hero-actions">

            <Link
              to="/register"
              className="hero-primary"
            >
              Start Free Trial
            </Link>

            <Link
              to="/contact"
              className="hero-secondary"
            >
              Book Demo
            </Link>

          </div>

          <div className="hero-metrics">

            <div>
              <h3>50K+</h3>
              <span>Candidates</span>
            </div>

            <div>
              <h3>1200+</h3>
              <span>Recruiters</span>
            </div>

            <div>
              <h3>92%</h3>
              <span>Accuracy</span>
            </div>

          </div>

        </div>

<div className="hero-right">

  <div className="dashboard-preview">

    <div className="dashboard-top">

      <div className="metric-card">
        <span>Applications</span>
        <h3>1,284</h3>
      </div>

      <div className="metric-card">
        <span>AI Match Score</span>
        <h3>94%</h3>
      </div>

    </div>

    <div className="candidate-list">

      <div className="candidate-card">

        <div className="candidate-avatar"></div>

        <div>
          <h4>Sarah Johnson</h4>
          <p>Senior Frontend Engineer</p>
        </div>

        <span className="score">98%</span>

      </div>

      <div className="candidate-card">

        <div className="candidate-avatar"></div>

        <div>
          <h4>David Lee</h4>
          <p>Product Designer</p>
        </div>

        <span className="score">91%</span>

      </div>

      <div className="candidate-card">

        <div className="candidate-avatar"></div>

        <div>
          <h4>Michael Chen</h4>
          <p>Backend Developer</p>
        </div>

        <span className="score">95%</span>

      </div>

    </div>

  </div>

</div>

      </div>

    </section>
  );
}

export default HeroSection;