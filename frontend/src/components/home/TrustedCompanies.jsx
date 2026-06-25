import "../../styles/trustedcompanies.css";

import google from "../../assets/logos/google.svg";
import microsoft from "../../assets/logos/microsoft.svg";
import amazon from "../../assets/logos/amazon.svg";
import infosys from "../../assets/logos/infosys.svg";
import tcs from "../../assets/logos/tcs.svg";
import zoho from "../../assets/logos/zoho.svg";
import flipkart from "../../assets/logos/flipkart.svg";
import swiggy from "../../assets/logos/swiggy.svg";
import zomato from "../../assets/logos/zomato.svg";

function TrustedCompanies() {

  const logos = [
    google,
    microsoft,
    amazon,
    infosys,
    tcs,
    zoho,
    flipkart,
    swiggy,
    zomato,
  ];

  const scrollingLogos = [
    ...logos,
    ...logos
  ];

  return (
    <section className="trusted-section">

      <span className="section-badge">
        Trusted Worldwide
      </span>

      <h2>
        Trusted by modern hiring teams
      </h2>

      <p>
        Thousands of recruiters use AIHIRE to automate hiring,
        reduce screening time and discover top talent faster.
      </p>

      <div className="logo-slider">

        <div className="logo-track">

          {scrollingLogos.map((logo, index) => (
            <div
              key={index}
              className="logo-card"
            >
              <img
                src={logo}
                alt="company logo"
              />
            </div>
          ))}

        </div>

      </div>

      <div className="trust-grid">

        <div>
          <h3>50K+</h3>
          <span>Candidates Screened</span>
        </div>

        <div>
          <h3>1200+</h3>
          <span>Recruiters</span>
        </div>

        <div>
          <h3>92%</h3>
          <span>Match Accuracy</span>
        </div>

        <div>
          <h3>70%</h3>
          <span>Faster Hiring</span>
        </div>

      </div>

    </section>
  );
}

export default TrustedCompanies;