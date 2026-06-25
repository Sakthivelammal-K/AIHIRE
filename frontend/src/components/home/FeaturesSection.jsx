import "../../styles/featuresSection.css";

const features = [
  {
    title: "AI Resume Screening",
    description:
      "Automatically analyze resumes and rank candidates based on skills, experience, and job relevance.",
  },
  {
    title: "Smart Candidate Matching",
    description:
      "AI calculates match scores and recommends the most suitable candidates instantly.",
  },
  {
    title: "AI Video Interviews",
    description:
      "Conduct intelligent interviews with automated scoring and evaluation reports.",
  },
  {
    title: "Hiring Analytics",
    description:
      "Track recruitment performance, pipeline efficiency, and hiring metrics in real time.",
  },
  {
    title: "Automated Workflows",
    description:
      "Reduce manual hiring tasks through automation and intelligent recommendations.",
  },
  {
    title: "Candidate Experience",
    description:
      "Provide a seamless application and interview process with AI-powered guidance.",
  },
];

function FeaturesSection() {
  return (
    <section className="features">

      <div className="features-top">

        <span className="section-badge">
          Product Features
        </span>

        <h2>
          Everything recruiters need
          to hire smarter
        </h2>

        <p>
          AI-powered tools designed to help
          hiring teams identify, evaluate and
          recruit top talent faster.
        </p>

      </div>

      <div className="features-grid">

        {features.map((feature, index) => (
          <div
            key={index}
            className="feature-box"
          >
            <div className="feature-number">
              0{index + 1}
            </div>

            <h3>
              {feature.title}
            </h3>

            <p>
              {feature.description}
            </p>
          </div>
        ))}

      </div>

    </section>
  );
}

export default FeaturesSection;