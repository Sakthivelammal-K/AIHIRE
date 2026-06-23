import "../../styles/featuresSection.css";
import {
  IconFileText,
  IconRobot,
  IconMicrophone,
  IconSchool,
} from "@tabler/icons-react";

const features = [
  {
    icon: <IconFileText size={20} />,
    title: "AI Resume Intelligence",
    description: "Automatically analyze resumes, extract skills, and rank candidates based on job fit — in seconds.",
    tag: "Resume screening",
    iconBg: "#E6F1FB",
    iconColor: "#185FA5",
    tagBg: "#E6F1FB",
    tagColor: "#0C447C",
  },
  {
    icon: <IconRobot size={20} />,
    title: "AI Hiring Copilot",
    description: "Find and recommend the best candidates using AI-powered matching tailored to your job requirements.",
    tag: "Smart matching",
    iconBg: "#EEEDFE",
    iconColor: "#534AB7",
    tagBg: "#EEEDFE",
    tagColor: "#3C3489",
  },
  {
    icon: <IconMicrophone size={20} />,
    title: "AI Interview Agent",
    description: "Conduct intelligent interviews and auto-generate structured evaluation reports for every candidate.",
    tag: "Automated interviews",
    iconBg: "#E1F5EE",
    iconColor: "#0F6E56",
    tagBg: "#E1F5EE",
    tagColor: "#085041",
  },
  {
    icon: <IconSchool size={20} />,
    title: "AI Career Coach",
    description: "Help candidates improve their skills and prepare for future opportunities with personalized guidance.",
    tag: "Career growth",
    iconBg: "#FAEEDA",
    iconColor: "#854F0B",
    tagBg: "#FAEEDA",
    tagColor: "#633806",
  },
];

function FeaturesSection() {
  return (
    <section className="features-section">
      <div className="features-header">
        <h2>Powerful AI features</h2>
        <p>Everything you need to hire smarter and faster.</p>
      </div>

      <div className="features-grid">
        {features.map((feature, index) => (
          <div key={index} className="feature-card">
            <div
              className="feature-icon"
              style={{ background: feature.iconBg, color: feature.iconColor }}
            >
              {feature.icon}
            </div>
            <div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
            <span
              className="feature-tag"
              style={{ background: feature.tagBg, color: feature.tagColor }}
            >
              {feature.tag}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default FeaturesSection;