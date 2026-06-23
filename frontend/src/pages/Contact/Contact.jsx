import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import "../../styles/contact.css";

import {
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaInstagram,
  FaLinkedin,
  FaFacebook,
  FaTwitter
} from "react-icons/fa";

function Contact() {
  return (
    <>
      <Navbar />

      <section className="contact-hero">

        <span className="contact-tag">
          CONTACT AIHIRE
        </span>

        <h1>
          Let's Build Better Hiring Together
        </h1>

        <p>
          Have questions about AIHIRE?
          Our team is here to help you automate
          recruitment and hire top talent faster.
        </p>

      </section>

      <section className="contact-main">

        <div className="contact-info">

          <h2>Get In Touch</h2>

          <p className="contact-desc">
            Reach out to our team for demos,
            support, partnerships or general inquiries.
          </p>

          <div className="info-item">

            <FaEnvelope className="info-icon" />

            <div>
              <h4>Email</h4>
              <p>support@aihire.com</p>
            </div>

          </div>

          <div className="info-item">

            <FaPhoneAlt className="info-icon" />

            <div>
              <h4>Phone</h4>
              <p>+91 9876543210</p>
            </div>

          </div>

          <div className="info-item">

            <FaMapMarkerAlt className="info-icon" />

            <div>
              <h4>Location</h4>
              <p>Tuticorin, Tamil Nadu, India</p>
            </div>

          </div>

          <div className="social-links">

            <a
              href="https://www.linkedin.com/company/devopstrio"
              target="_blank"
              rel="noreferrer"
            >
              <FaLinkedin />
            </a>

            <a
              href="https://www.instagram.com/devopstrio"
              target="_blank"
              rel="noreferrer"
            >
              <FaInstagram />
            </a>

            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noreferrer"
            >
              <FaFacebook />
            </a>

            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
            >
              <FaTwitter />
            </a>

          </div>

        </div>

        <div className="contact-form">

          <h2>Send Us A Message</h2>

          <form>

            <input
              type="text"
              placeholder="Full Name"
            />

            <input
              type="email"
              placeholder="Work Email"
            />

            <input
              type="text"
              placeholder="Company Name"
            />

            <input
              type="text"
              placeholder="Subject"
            />

            <textarea
              rows="6"
              placeholder="Tell us how we can help..."
            />

            <button type="submit">
              Send Message
            </button>

          </form>

        </div>

      </section>

      <section className="faq-section">

        <h2>Frequently Asked Questions</h2>

        <div className="faq-container">

          <div className="faq-card">
            <h3>How quickly can we start?</h3>
            <p>
              Most companies can begin using AIHIRE
              within a few days.
            </p>
          </div>

          <div className="faq-card">
            <h3>Do you support AI interviews?</h3>
            <p>
              Yes. AIHIRE provides AI-powered
              candidate interviews and scoring.
            </p>
          </div>

          <div className="faq-card">
            <h3>Can workflows be customized?</h3>
            <p>
              Recruiters can customize hiring
              stages and interview processes.
            </p>
          </div>

          <div className="faq-card">
            <h3>Do candidates need accounts?</h3>
            <p>
              Candidates can apply and manage
              interviews through the platform.
            </p>
          </div>

        </div>

      </section>

      <Footer />
    </>
  );
}

export default Contact;