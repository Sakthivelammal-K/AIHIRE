import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import { useNavigate } from "react-router-dom";

import {
  FaVideo,
  FaUserTie,
  FaUsers,
  FaChartLine,
  FaArrowRight,
  FaRobot,
  FaFileAlt,
} from "react-icons/fa";

import "../../styles/features.css";

function Features() {
  const navigate = useNavigate();

  return (
    <>
    <div className="features-page">
      <Navbar />

      <section className="features-hero">

        <div className="hero-glow"></div>

        <div className="features-container">

          <span className="hero-tag">
            AI RECRUITMENT PLATFORM
          </span>

          <h1>
            Everything You Need
            <br />
            To Hire Faster
          </h1>

          <p>
            AIHIRE combines resume screening,
            AI interviews, applicant tracking,
            hiring analytics and collaboration
            tools into one modern recruiting platform.
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
              Book Demo
            </button>

          </div>

        </div>

      </section>

      <section className="feature-grid">

        <div className="feature-card">
          <FaFileAlt className="feature-icon" />
          <h3>AI Resume Screening</h3>
          <p>
            Automatically rank applicants using
            skills, experience and job relevance.
          </p>
        </div>

        <div className="feature-card">
          <FaVideo className="feature-icon" />
          <h3>AI Interviews</h3>
          <p>
            Conduct structured interviews with
            automated scoring and reports.
          </p>
        </div>

        <div className="feature-card">
          <FaUserTie className="feature-icon" />
          <h3>Recruiter Dashboard</h3>
          <p>
            Manage jobs, candidates and interviews
            from a single workspace.
          </p>
        </div>

        <div className="feature-card">
          <FaUsers className="feature-icon" />
          <h3>Candidate Portal</h3>
          <p>
            Give candidates a seamless application
            and interview experience.
          </p>
        </div>

        <div className="feature-card">
          <FaChartLine className="feature-icon" />
          <h3>Hiring Analytics</h3>
          <p>
            Measure hiring performance with
            real-time dashboards.
          </p>
        </div>

        <div className="feature-card">
          <FaRobot className="feature-icon" />
          <h3>AI Automation</h3>
          <p>
            Reduce manual recruiting tasks
            through intelligent workflows.
          </p>
        </div>

      </section>

      <section className="platform-section">

        <div className="platform-left">

          <span>SMART HIRING</span>

          <h2>
            Replace Spreadsheets
            With Intelligent Hiring
          </h2>

          <p>
            Move your hiring workflow into one
            collaborative platform built for
            modern recruitment teams.
          </p>

          <ul>
            <li>✓ Resume Parsing</li>
            <li>✓ Candidate Ranking</li>
            <li>✓ AI Interviews</li>
            <li>✓ Hiring Analytics</li>
          </ul>

        </div>

        <div className="platform-right">

          <div className="dashboard-card">

            <div className="dashboard-header">
              Candidate Pipeline
            </div>

            <div className="candidate-item">
              Sarah Wilson
              <span>96%</span>
            </div>

            <div className="candidate-item">
              John Smith
              <span>92%</span>
            </div>

            <div className="candidate-item">
              David Lee
              <span>89%</span>
            </div>

            <div className="candidate-item">
              Emma Brown
              <span>84%</span>
            </div>

          </div>

        </div>

      </section>

      <section className="stats-section">

        <div className="stat-card">
          <h2>85%</h2>
          <p>Faster Screening</p>
        </div>

        <div className="stat-card">
          <h2>4x</h2>
          <p>Hiring Efficiency</p>
        </div>

        <div className="stat-card">
          <h2>60%</h2>
          <p>Reduced Time To Hire</p>
        </div>

        <div className="stat-card">
          <h2>95%</h2>
          <p>Candidate Satisfaction</p>
        </div>

      </section>

      <section className="features-cta">

        <h2>
          Ready To Transform Hiring?
        </h2>

        <p>
          Join organizations using AIHIRE
          to recruit top talent faster.
        </p>

        <button
          onClick={() => navigate("/register")}
        >
          Get Started
          <FaArrowRight />
        </button>

      </section>

      </div>
      
      <Footer />
      
    </>
  );
}

export default Features;