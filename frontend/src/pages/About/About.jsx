import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import "../../styles/about.css";

function About() {
  return (
    <>
      <Navbar />

      {/* HERO */}
      <section className="about-hero">
        <div className="about-container">
          <span className="hero-tag">ABOUT AIHIRE</span>
          <h1 className="gradient-text">Building The Future Of Hiring</h1>
          <p>
            We believe hiring should be faster, fairer, and powered by intelligence.
            AIHIRE helps organizations discover exceptional talent through modern
            recruitment technology.
          </p>
        </div>
      </section>

      {/* WHO WE ARE */}
      <section className="about-section glass-card">
        <div className="about-content">
          <h2>Who We Are</h2>
          <p>
            AIHIRE is an AI-powered recruitment platform designed to simplify and
            modernize the hiring process.
          </p>
          <p>
            Our platform combines intelligent screening, candidate matching,
            interview automation and hiring analytics to help organizations
            recruit the right people faster.
          </p>
        </div>
      </section>

      {/* MISSION */}
      <section className="mission-section glass-card">
        <div className="about-container">
          <h2 className="gradient-text">Our Mission</h2>
          <p>
            To eliminate inefficiencies in hiring and create a world where
            recruiters spend less time sorting resumes and more time connecting
            with great talent.
          </p>
        </div>
      </section>

      {/* VALUES */}
      <section className="values-section">
        <div className="about-container">
          <h2>Our Values</h2>
          <div className="values-grid">
            <div className="value-card glass-card">
              <h3>People First</h3>
              <p>Technology should empower people, not replace them.</p>
            </div>
            <div className="value-card glass-card">
              <h3>Transparency</h3>
              <p>Every hiring decision should be explainable and fair.</p>
            </div>
            <div className="value-card glass-card">
              <h3>Innovation</h3>
              <p>We constantly explore better ways to connect talent and opportunity.</p>
            </div>
          </div>
        </div>
      </section>

      {/* PHILOSOPHY */}
      <section className="philosophy-section glass-card">
        <div className="about-container">
          <h2 className="gradient-text">Our View On Modern Hiring</h2>
          <p>
            Hiring should not depend on manual resume reviews, endless
            spreadsheets, or repetitive workflows.
          </p>
          <p>
            AI can assist recruiters in making faster and better decisions while
            preserving the human side of hiring.
          </p>
        </div>
      </section>

      {/* TEAM */}
      <section className="team-section">
        <div className="about-container">
          <h2>Leadership Team</h2>
          <div className="team-grid">
            <div className="team-card glass-card">
              <div className="avatar">S</div>
              <h3>Sam</h3>
              <span>Founder & CEO</span>
            </div>
            <div className="team-card glass-card">
              <div className="avatar">A</div>
              <h3>AI Lead</h3>
              <span>Artificial Intelligence</span>
            </div>
            <div className="team-card glass-card">
              <div className="avatar">P</div>
              <h3>Product Lead</h3>
              <span>Platform Engineering</span>
            </div>
          </div>
        </div>
      </section>

      {/* JOIN */}
      <section className="join-section glass-card">
        <div className="about-container">
          <h2 className="gradient-text">Join Our Journey</h2>
          <p>
            We're building technology that helps organizations hire better and
            helps candidates find meaningful careers.
          </p>
          <button className="join-btn">Explore AIHIRE</button>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default About;