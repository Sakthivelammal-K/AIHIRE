import "../../styles/benefits.css";

function BenefitsSection() {

  const benefits = [
    {
      number: "70%",
      title: "Faster Hiring",
      description:
        "Reduce hiring time with AI-powered screening and evaluation."
    },
    {
      number: "90%",
      title: "Resume Automation",
      description:
        "Automatically analyze resumes and shortlist top candidates."
    },
    {
      number: "3X",
      title: "Better Matching",
      description:
        "AI identifies candidates that best fit job requirements."
    },
    {
      number: "50%",
      title: "Cost Reduction",
      description:
        "Reduce manual recruitment effort and operational costs."
    }
  ];

  return (
    <section className="benefits">

      <div className="benefits-header">

        <span>Why AIHIRE</span>

        <h2>
          Built for Modern Recruitment Teams
        </h2>

        <p>
          Accelerate hiring, improve candidate quality
          and make better decisions with AI.
        </p>

      </div>

      <div className="benefits-grid">

        {benefits.map((item, index) => (

          <div className="benefit-card" key={index}>

            <h3>{item.number}</h3>

            <h4>{item.title}</h4>

            <p>{item.description}</p>

          </div>

        ))}

      </div>

    </section>
  );
}

export default BenefitsSection;