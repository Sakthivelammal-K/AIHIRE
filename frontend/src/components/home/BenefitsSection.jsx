import "../../styles/benefits.css";

function BenefitsSection() {
  const benefits = [
    {
      value: "70%",
      title: "Faster Time To Hire",
      description:
        "Reduce manual screening and accelerate hiring decisions.",
    },
    {
      value: "95%",
      title: "Candidate Matching Accuracy",
      description:
        "AI identifies the strongest candidates automatically.",
    },
    {
      value: "3x",
      title: "Recruiter Productivity",
      description:
        "Handle more candidates with less manual effort.",
    },
    {
      value: "50%",
      title: "Lower Hiring Costs",
      description:
        "Reduce operational expenses through automation.",
    },
  ];

  return (
    <section className="benefits">
      <div className="benefits-left">

        <span className="section-tag">
          WHY AIHIRE
        </span>

        <h2>
          Hiring Teams Move Faster
          With AI Assistance
        </h2>

        <p>
          Everything recruiters need to source,
          evaluate and hire top talent at scale.
        </p>

      </div>

      <div className="benefits-grid">
        {benefits.map((item, index) => (
          <div className="benefit-card" key={index}>

            <h3>{item.value}</h3>

            <h4>{item.title}</h4>

            <p>{item.description}</p>

          </div>
        ))}
      </div>
    </section>
  );
}

export default BenefitsSection;