import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import { useNavigate } from "react-router-dom";

import {
  FaFileAlt,
  FaVideo,
  FaUserTie,
  FaUsers,
  FaChartLine,
  FaArrowRight
} from "react-icons/fa";

import "../../styles/features.css";

function Features() {

  const navigate = useNavigate();

  return (
    <>
      <Navbar />

      <section className="features-hero">

        <div className="features-container">

          <span className="hero-tag">
            PRODUCT FEATURES
          </span>

          <h1>
            One Platform.
            <br />
            Complete Hiring Workflow.
          </h1>

          <p>
            From resume screening to AI interviews
            and hiring analytics, AIHIRE gives your
            recruiting team everything needed to
            hire faster and smarter.
          </p>

          <div className="hero-buttons">

            <button
              className="primary-btn"
              onClick={() => navigate("/register")}
            >
              Start Hiring
            </button>

            <button
              className="secondary-btn"
              onClick={() => navigate("/contact")}
            >
              Request Demo
            </button>

          </div>

        </div>

      </section>

      <section className="feature-nav">

        <a href="#screening">AI Screening</a>
        <a href="#interview">AI Interview</a>
        <a href="#recruiter">Recruiter</a>
        <a href="#candidate">Candidate</a>
        <a href="#analytics">Analytics</a>

      </section>
      <section id="screening" className="product-section">

  <div className="product-left">

    <span>AI SCREENING</span>

    <h2>
      Automatically Find The Best Candidates
    </h2>

    <p>
      AIHIRE analyzes resumes, extracts skills,
      calculates match scores and ranks candidates
      instantly.
    </p>

    <ul>
      <li>✓ Resume Parsing</li>
      <li>✓ Skill Extraction</li>
      <li>✓ Match Score</li>
      <li>✓ Candidate Ranking</li>
    </ul>

  </div>

  <div className="product-right">

    <div className="dashboard-mockup">

      <div className="mock-header">
        Candidate Analysis
      </div>

      <div className="candidate-row">
        John Anderson
        <span>92%</span>
      </div>

      <div className="candidate-row">
        Sarah Miller
        <span>88%</span>
      </div>

      <div className="candidate-row">
        David Wilson
        <span>84%</span>
      </div>

    </div>

  </div>

</section>
<section
  id="interview"
  className="product-section reverse"
>

  <div className="product-right">

    <div className="dashboard-mockup">

      <FaVideo className="mock-icon" />

      <h3>
        AI Interview Report
      </h3>

      <p>Communication 89%</p>
      <p>Technical Skills 94%</p>
      <p>Confidence 91%</p>

    </div>

  </div>

  <div className="product-left">

    <span>AI INTERVIEWS</span>

    <h2>
      Conduct Structured AI Interviews
    </h2>

    <p>
      Automatically evaluate candidates,
      generate reports and reduce recruiter workload.
    </p>

    <ul>
      <li>✓ AI Question Generation</li>
      <li>✓ Automated Evaluation</li>
      <li>✓ Interview Reports</li>
      <li>✓ Candidate Scoring</li>
    </ul>

  </div>

</section>

<section id="recruiter" className="product-section">

  <div className="product-left">

    <span>RECRUITER WORKSPACE</span>

    <h2>
      Manage Hiring From One Dashboard
    </h2>

    <p>
      Create jobs, review candidates,
      schedule interviews and track hiring progress.
    </p>

    <ul>
      <li>✓ Job Management</li>
      <li>✓ Candidate Tracking</li>
      <li>✓ Interview Scheduling</li>
      <li>✓ Hiring Decisions</li>
    </ul>

  </div>

  <div className="product-right">

    <div className="dashboard-mockup">

      <FaUserTie className="mock-icon" />

      <h3>Recruiter Dashboard</h3>

      <p>15 Active Jobs</p>
      <p>248 Applications</p>
      <p>32 Interviews</p>

    </div>

  </div>

</section>

<section
  id="candidate"
  className="product-section reverse"
>

  <div className="product-right">

    <div className="dashboard-mockup">

      <FaUsers className="mock-icon" />

      <h3>Candidate Portal</h3>

      <p>Track Applications</p>
      <p>Upload Resume</p>
      <p>Interview Updates</p>

    </div>

  </div>

  <div className="product-left">

    <span>CANDIDATE EXPERIENCE</span>

    <h2>
      A Better Journey For Every Candidate
    </h2>

    <p>
      Help candidates apply faster,
      track applications and stay informed.
    </p>

  </div>

</section>

<section id="analytics" className="product-section">

  <div className="product-left">

    <span>ANALYTICS</span>

    <h2>
      Make Data Driven Hiring Decisions
    </h2>

    <p>
      Understand hiring performance through
      real-time recruitment analytics.
    </p>

  </div>

  <div className="product-right">

    <div className="dashboard-mockup">

      <FaChartLine className="mock-icon" />

      <h3>Analytics Dashboard</h3>

      <p>Hiring Speed ↑ 47%</p>
      <p>Applications ↑ 34%</p>
      <p>Interviews ↑ 21%</p>

    </div>

  </div>

</section>

<section className="final-cta">

  <h2>
    Ready To Transform Hiring?
  </h2>

  <p>
    Join organizations using AIHIRE
    to recruit smarter.
  </p>

  <button
    className="primary-btn"
    onClick={() => navigate("/register")}
  >
    Get Started
    <FaArrowRight />
  </button>

</section>

<Footer />
</>
);
}

export default Features;