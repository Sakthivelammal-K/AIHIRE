import { Link } from "react-router-dom";
import "../../styles/cta.css";

function CTASection() {
  return (
    <section className="cta-section">

      <div className="cta-content">

        <span>Ready to Transform Hiring?</span>

        <h2>
          Hire Top Talent Faster with AIHIRE
        </h2>

        <p>
          Automate resume screening, conduct AI interviews,
          rank candidates and make smarter hiring decisions.
        </p>

        <div className="cta-buttons">

          <Link to="/register">
            <button className="cta-primary">
              Start Hiring
            </button>
          </Link>

          <Link to="/contact">
            <button className="cta-secondary">
              Book Demo
            </button>
          </Link>

        </div>

      </div>

    </section>
  );
}

export default CTASection;