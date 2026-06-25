import "../../styles/howItWorks.css";

const steps = [
  {
    number: "01",
    title: "Create Hiring Pipeline",
    description:
      "Build jobs, define requirements, and configure automated hiring workflows in minutes.",
  },
  {
    number: "02",
    title: "AI Candidate Screening",
    description:
      "AI evaluates resumes, skills, experience, and job fit instantly with intelligent ranking.",
  },
  {
    number: "03",
    title: "AI Interviews & Assessments",
    description:
      "Conduct automated video interviews and technical assessments with detailed scoring.",
  },
  {
    number: "04",
    title: "Collaborative Hiring",
    description:
      "Recruiters and hiring managers review candidates together with AI-powered insights.",
  },
];

function HowItWorks() {
  return (
    <section className="how-section">
      <div className="section-header">
        <span>Workflow</span>

        <h2>
          From Application to Offer,
          <br />
          Powered by AI
        </h2>

        <p>
          Streamline every stage of recruitment with automation,
          analytics and intelligent decision making.
        </p>
      </div>

      <div className="timeline">
        {steps.map((step) => (
          <div className="timeline-card" key={step.number}>
            <div className="timeline-number">
              {step.number}
            </div>

            <h3>{step.title}</h3>

            <p>{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default HowItWorks;