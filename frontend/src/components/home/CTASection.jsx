import { Link } from "react-router-dom";
import "../../styles/cta.css";

function CTASection() {
  return (
    <section className="cta-section">

      <div className="cta-content">

        <span className="cta-badge">
          AI Recruitment Platform
        </span>

        <h2>
          Ready To Build A Better Hiring Process?
        </h2>

        <p>
          Join companies using AIHIRE to automate recruiting,
          improve candidate quality, reduce hiring time and
          make smarter hiring decisions with AI.
        </p>

        <div className="cta-buttons">

          <Link to="/register">
            <button className="cta-primary">
              Start Free Trial
            </button>
          </Link>

          <Link to="/contact">
            <button className="cta-secondary">
              Schedule Demo
            </button>
          </Link>

        </div>

      </div>

    </section>
  );
}

export default CTASection;