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

const companies = [
  google,
  microsoft,
  amazon,
  infosys,
  tcs,
  zoho,
  swiggy,
  flipkart,
  zomato,
];

const logoStyle = {
  height: "32px",
  width: "auto",
  maxWidth: "110px",
  maxHeight: "32px",
  objectFit: "contain",
  display: "block",
  filter: "grayscale(1)",
  opacity: "0.6",
};

function TrustedCompanies() {
  const doubled = [...companies, ...companies];
  return (
    <section className="trusted">
      <h1>Trusted by leading companies for hiring</h1>
      <div className="slider-outer">
        <div className="logo-track">
          {doubled.map((logo, index) => (
            <div className="logo-item" key={index}>
              <img src={logo} alt="company" style={logoStyle} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TrustedCompanies;