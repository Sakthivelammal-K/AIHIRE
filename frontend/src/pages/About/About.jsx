import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import "../../styles/about.css";

import {
  FaRobot,
  FaUsers,
  FaChartLine,
  FaBullseye,
  FaLightbulb,
  FaShieldAlt,
  FaDatabase,
  FaSearch,
  FaClock,
  FaCheckCircle
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";


function About(){

const navigate = useNavigate();


return(
<>

<Navbar/>


{/* HERO */}

<section className="about-hero">

<div className="about-glow"></div>


<div className="about-container">


<span className="about-tag">
ABOUT AIHIRE
</span>


<h1>
Building The Future Of
<span> Intelligent Hiring</span>
</h1>


<p>

AIHIRE is a next generation AI recruitment
platform helping companies discover,
evaluate and hire exceptional talent faster.

</p>


<button
onClick={()=>navigate("/register")}
>
Start Hiring
</button>


</div>

</section>




{/* STORY */}


<section className="about-story">


<div className="story-card">


<h2>
The Problem We Solve
</h2>


<p>

Recruitment teams spend countless hours
reviewing resumes, scheduling interviews,
tracking candidates and making hiring decisions.

AIHIRE removes repetitive work by combining
artificial intelligence, automation and analytics
into one powerful hiring workspace.

</p>


</div>


</section>






{/* PLATFORM */}

<section className="platform-section">


<div>

<h2>
One Platform For Complete Hiring
</h2>


<p>

From the first application to final selection,
AIHIRE helps recruiters manage every stage
of the recruitment journey.

</p>


<ul>

<li>
<FaCheckCircle/> AI Resume Screening
</li>

<li>
<FaCheckCircle/> Automated Candidate Ranking
</li>

<li>
<FaCheckCircle/> AI Powered Interviews
</li>

<li>
<FaCheckCircle/> Hiring Analytics Dashboard
</li>

</ul>


</div>



<div className="platform-card">


<h3>
Candidate Pipeline
</h3>


<div>
Applied Candidates
<span>1200+</span>
</div>


<div>
AI Shortlisted
<span>350</span>
</div>


<div>
Interview Ready
<span>85</span>
</div>


</div>


</section>







{/* VALUES */}


<section className="values-section">


<h2>
What Makes AIHIRE Different
</h2>


<div className="values-grid">



<div className="value-card">

<FaRobot/>

<h3>
AI Powered
</h3>

<p>
Smart algorithms analyze candidates
and identify the best matches.
</p>

</div>




<div className="value-card">

<FaUsers/>

<h3>
Human Focused
</h3>

<p>
Technology helps recruiters make better decisions.
</p>

</div>




<div className="value-card">

<FaChartLine/>

<h3>
Analytics Driven
</h3>

<p>
Understand hiring performance with insights.
</p>

</div>




<div className="value-card">

<FaShieldAlt/>

<h3>
Secure Platform
</h3>

<p>
Recruitment data stays protected.
</p>

</div>




<div className="value-card">

<FaClock/>

<h3>
Save Time
</h3>

<p>
Reduce manual recruitment tasks.
</p>

</div>




<div className="value-card">

<FaSearch/>

<h3>
Better Matching
</h3>

<p>
Find candidates who fit your needs.
</p>

</div>



</div>

</section>







{/* MISSION */}


<section className="mission-section">


<div>


<h2>
Our Mission
</h2>


<p>

Our mission is to transform hiring into a faster,
smarter and more transparent process.

We believe AI should support recruiters,
not replace them.

</p>


</div>



<div className="mission-dashboard">


<h3>
AIHIRE Performance
</h3>


<div className="metric">
85% Faster Screening
</div>


<div className="metric">
4x Better Productivity
</div>


<div className="metric">
60% Less Manual Work
</div>


</div>


</section>







{/* STATS */}


<section className="about-stats">


<div>
<h2>10K+</h2>
<p>Candidates Processed</p>
</div>


<div>
<h2>500+</h2>
<p>Companies</p>
</div>


<div>
<h2>95%</h2>
<p>Hiring Accuracy</p>
</div>


<div>
<h2>24/7</h2>
<p>AI Assistance</p>
</div>


</section>







{/* VISION */}


<section className="vision-section">


<h2>
The Future Of Recruitment
</h2>


<p>

AIHIRE is continuously evolving to make
recruitment more intelligent, inclusive and efficient.

We are building tools that allow companies
to focus on people while AI handles the process.

</p>


</section>






{/* CTA */}


<section className="about-cta">


<h2>
Ready To Transform Hiring?
</h2>


<p>
Join companies using AIHIRE to build stronger teams.
</p>


<button
onClick={()=>navigate("/contact")}
>
Contact Us
</button>


</section>



<Footer/>


</>

)

}


export default About;