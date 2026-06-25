import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import "../../styles/contact.css";


import {
FaEnvelope,
FaPhoneAlt,
FaMapMarkerAlt,
FaLinkedin,
FaInstagram,
FaFacebook
} from "react-icons/fa";


function Contact(){


return(

<>

<Navbar/>


<div className="contact-page">


<section className="contact-hero">


<span className="contact-tag">
CONTACT AIHIRE
</span>


<h1>
Let's Talk About Smarter Hiring
</h1>


<p>

Have questions, need a demo or want to transform
your recruitment workflow?

Our team is ready.

</p>


</section>





<section className="contact-main">



<div className="contact-card">


<h2>
Get In Touch
</h2>


<p className="contact-desc">

Talk with our recruitment specialists
and discover how AIHIRE can improve
your hiring process.

</p>



<div className="info-box">

<div className="info-icon">
<FaEnvelope/>
</div>

<div>
<h4>Email</h4>
<p>support@aihire.com</p>
</div>

</div>




<div className="info-box">

<div className="info-icon">
<FaPhoneAlt/>
</div>

<div>
<h4>Phone</h4>
<p>+91 9876543210</p>
</div>

</div>




<div className="info-box">

<div className="info-icon">
<FaMapMarkerAlt/>
</div>

<div>
<h4>Office</h4>
<p>Tamil Nadu, India</p>
</div>

</div>



<div className="social-links">


<a href="#">
<FaLinkedin/>
</a>


<a href="#">
<FaInstagram/>
</a>


<a href="#">
<FaFacebook/>
</a>


</div>


</div>






<div className="form-card">


<h2>
Send Message
</h2>



<form className="contact-form">


<input placeholder="Full Name"/>

<input placeholder="Work Email"/>

<input placeholder="Company Name"/>


<textarea
rows="5"
placeholder="Tell us how we can help"
/>


<button>
Send Message
</button>


</form>



</div>



</section>





<section className="contact-stats">


<div className="stat-box">
<h2>10K+</h2>
<p>Candidates Managed</p>
</div>


<div className="stat-box">
<h2>85%</h2>
<p>Faster Screening</p>
</div>


<div className="stat-box">
<h2>24/7</h2>
<p>Support</p>
</div>


</section>






<section className="faq-section">


<h2>
Frequently Asked Questions
</h2>


<div className="faq-container">


<div className="faq-card">

<h3>
How fast can we start?
</h3>

<p>
You can setup your hiring workspace within minutes.
</p>

</div>




<div className="faq-card">

<h3>
Does AIHIRE support AI interviews?
</h3>

<p>
Yes, AI powered interviews and evaluation reports.
</p>

</div>




<div className="faq-card">

<h3>
Can recruiters customize workflows?
</h3>

<p>
Yes. Hiring stages can be fully customized.
</p>

</div>




<div className="faq-card">

<h3>
Is support available?
</h3>

<p>
Our team helps companies throughout their journey.
</p>

</div>



</div>


</section>



</div>


<Footer/>


</>

)

}


export default Contact;