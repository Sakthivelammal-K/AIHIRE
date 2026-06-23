import "../../styles/howItWorks.css";

function HowItWorks() {
  return (
    <section className="how-section">
      <h2>How AIHIRE Works</h2>

      <div className="steps-container">

        <div className="step-card">
          <div className="step-number">1</div>
          <h3>Create Job</h3>
          <p>Create a job manually or let AI generate it.</p>
        </div>

        <div className="step-card">
          <div className="step-number">2</div>
          <h3>AI Screening</h3>
          <p>AI analyzes resumes and ranks candidates.</p>
        </div>

        <div className="step-card">
          <div className="step-number">3</div>
          <h3>AI Interview</h3>
          <p>Conduct AI powered interviews and assessments.</p>
        </div>

        <div className="step-card">
          <div className="step-number">4</div>
          <h3>Hire Talent</h3>
          <p>Select the best candidate with AI insights.</p>
        </div>

      </div>
    </section>
  );
}

export default HowItWorks;