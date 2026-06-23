import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import "../../styles/pricing.css";

import { useNavigate } from "react-router-dom";

import {
  FaCheckCircle,
  FaArrowRight
} from "react-icons/fa";

function Pricing() {

  const navigate = useNavigate();

  return (
    <>
      <Navbar />

      {/* HERO */}

      <section className="pricing-hero">

        <span className="pricing-tag">
          SIMPLE PRICING
        </span>

        <h1>
          Pricing For Every Hiring Team
        </h1>

        <p>
          Start free and scale your recruitment
          process as your organization grows.
        </p>

      </section>

      {/* PRICING CARDS */}

      <section className="pricing-cards">

        {/* FREE */}

        <div className="pricing-card">

          <h3>Free</h3>

          <h2>₹0</h2>

          <span>/month</span>

          <ul>

            <li>
              <FaCheckCircle />
              5 Active Jobs
            </li>

            <li>
              <FaCheckCircle />
              Resume Screening
            </li>

            <li>
              <FaCheckCircle />
              Candidate Tracking
            </li>

          </ul>

          <button
            onClick={() => navigate("/register")}
          >
            Start Free
          </button>

        </div>

        {/* PROFESSIONAL */}

        <div className="pricing-card featured">

          <div className="popular">
            MOST POPULAR
          </div>

          <h3>Professional</h3>

          <h2>₹4,999</h2>

          <span>/month</span>

          <ul>

            <li>
              <FaCheckCircle />
              Unlimited Jobs
            </li>

            <li>
              <FaCheckCircle />
              AI Resume Screening
            </li>

            <li>
              <FaCheckCircle />
              AI Interviews
            </li>

            <li>
              <FaCheckCircle />
              Analytics Dashboard
            </li>

          </ul>

          <button
            onClick={() => navigate("/register")}
          >
            Get Started
          </button>

        </div>

        {/* ENTERPRISE */}

        <div className="pricing-card">

          <h3>Enterprise</h3>

          <h2>Custom</h2>

          <span>Contact Us</span>

          <ul>

            <li>
              <FaCheckCircle />
              Everything in Pro
            </li>

            <li>
              <FaCheckCircle />
              Dedicated Support
            </li>

            <li>
              <FaCheckCircle />
              Custom Integrations
            </li>

            <li>
              <FaCheckCircle />
              Enterprise Security
            </li>

          </ul>

          <button
            onClick={() => navigate("/contact")}
          >
            Contact Sales
          </button>

        </div>

      </section>

      {/* EXTRA LINKS */}

      <div className="pricing-links">

        <button
          onClick={() => navigate("/features")}
        >
          View Features
        </button>

        <button
          onClick={() => navigate("/contact")}
        >
          Book Demo
        </button>

      </div>

      {/* COMPARISON TABLE */}

      <section className="comparison">

        <h2>
          Compare Plans
        </h2>

        <table>

          <thead>

            <tr>
              <th>Features</th>
              <th>Free</th>
              <th>Professional</th>
              <th>Enterprise</th>
            </tr>

          </thead>

          <tbody>

            <tr>
              <td>Job Posting</td>
              <td>5 Jobs</td>
              <td>Unlimited</td>
              <td>Unlimited</td>
            </tr>

            <tr>
              <td>Resume Screening</td>
              <td>✓</td>
              <td>✓</td>
              <td>✓</td>
            </tr>

            <tr>
              <td>AI Interviews</td>
              <td>✗</td>
              <td>✓</td>
              <td>✓</td>
            </tr>

            <tr>
              <td>Analytics Dashboard</td>
              <td>✗</td>
              <td>✓</td>
              <td>✓</td>
            </tr>

            <tr>
              <td>Priority Support</td>
              <td>✗</td>
              <td>✓</td>
              <td>✓</td>
            </tr>

            <tr>
              <td>Custom Integrations</td>
              <td>✗</td>
              <td>✗</td>
              <td>✓</td>
            </tr>

            <tr>
              <td>Enterprise Security</td>
              <td>✗</td>
              <td>✗</td>
              <td>✓</td>
            </tr>

          </tbody>

        </table>

      </section>

      {/* FAQ */}

      <section className="pricing-faq">

        <h2>
          Frequently Asked Questions
        </h2>

        <div className="faq-grid">

          <div className="faq-card">
            <h3>
              Can I start for free?
            </h3>
            <p>
              Yes. AIHIRE provides a free plan
              to explore the platform.
            </p>
          </div>

          <div className="faq-card">
            <h3>
              Can I upgrade later?
            </h3>
            <p>
              Absolutely. Upgrade anytime as
              your hiring needs grow.
            </p>
          </div>

          <div className="faq-card">
            <h3>
              Does AIHIRE support AI interviews?
            </h3>
            <p>
              Yes. Professional and Enterprise
              plans include AI interviews.
            </p>
          </div>

          <div className="faq-card">
            <h3>
              Do you offer custom pricing?
            </h3>
            <p>
              Enterprise customers receive
              custom pricing and support.
            </p>
          </div>

        </div>

      </section>

      {/* CTA */}

      <section className="pricing-cta">

        <h2>
          Ready To Hire Smarter?
        </h2>

        <p>
          Join organizations using AIHIRE
          to automate recruitment and hire
          top talent faster.
        </p>

        <button
          onClick={() => navigate("/register")}
        >
          Start Free Today
          <FaArrowRight />
        </button>

      </section>

      <Footer />
    </>
  );
}

export default Pricing;