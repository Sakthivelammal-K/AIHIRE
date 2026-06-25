import Navbar from "../../components/common/Navbar";
import Footer from "../../components/common/Footer";
import "../../styles/pricing.css";

import { useNavigate } from "react-router-dom";

import {
  FaCheckCircle,
  FaArrowRight,
  FaMinus
} from "react-icons/fa";


function Pricing(){

const navigate = useNavigate();


const plans=[
{
name:"Starter",
price:"₹0",
desc:"For small teams exploring AI hiring",
features:[
"5 Active Jobs",
"Resume Screening",
"Candidate Tracking",
"Basic Dashboard"
]
},

{
name:"Professional",
price:"₹4999",
desc:"For growing recruitment teams",
popular:true,
features:[
"Unlimited Jobs",
"AI Resume Ranking",
"AI Interviews",
"Hiring Analytics",
"Team Collaboration"
]
},

{
name:"Enterprise",
price:"Custom",
desc:"For large organizations",
features:[
"Everything in Pro",
"Dedicated Support",
"Custom Integrations",
"Enterprise Security"
]
}

];


return(
<>

<Navbar/>


<div className="pricing-page">


<section className="pricing-hero">

<span className="pricing-tag">
PLANS & PRICING
</span>


<h1>
Scale Your Hiring With AI
</h1>


<p>
Choose a plan that fits your recruitment workflow.
Start small and upgrade as your team grows.
</p>


</section>



<section className="pricing-cards">


{
plans.map((plan,index)=>(

<div
className={`pricing-card ${plan.popular?"featured":""}`}
key={index}
>


{
plan.popular &&
<div className="popular">
MOST POPULAR
</div>
}


<h3>{plan.name}</h3>

<h2>
{plan.price}
</h2>

<span>
per month
</span>


<p className="plan-desc">
{plan.desc}
</p>


<ul>

{
plan.features.map((item,i)=>(

<li key={i}>
<FaCheckCircle/>
{item}
</li>

))
}

</ul>


<button
onClick={()=>navigate("/register")}
>
Get Started
</button>


</div>

))
}


</section>





<section className="compare-section">


<h2>
Compare Plans
</h2>


<div className="compare-card">


<div className="compare-row head">

<div>Feature</div>
<div>Starter</div>
<div>Professional</div>
<div>Enterprise</div>

</div>



<div className="compare-row">

<div>Job Posting</div>
<div>5</div>
<div>Unlimited</div>
<div>Unlimited</div>

</div>



<div className="compare-row">

<div>AI Resume Screening</div>
<div><FaCheckCircle/></div>
<div><FaCheckCircle/></div>
<div><FaCheckCircle/></div>

</div>



<div className="compare-row">

<div>AI Interviews</div>

<div>
<FaMinus/>
</div>

<div>
<FaCheckCircle/>
</div>

<div>
<FaCheckCircle/>
</div>

</div>



<div className="compare-row">

<div>Analytics Dashboard</div>

<div>
<FaMinus/>
</div>

<div>
<FaCheckCircle/>
</div>

<div>
<FaCheckCircle/>
</div>

</div>



<div className="compare-row">

<div>Custom Integrations</div>

<div>
<FaMinus/>
</div>

<div>
<FaMinus/>
</div>

<div>
<FaCheckCircle/>
</div>

</div>



</div>


</section>





<section className="faq-section">


<h2>
Frequently Asked Questions
</h2>



<div className="faq-grid">


<div className="faq-card">

<h3>
Can I start free?
</h3>

<p>
Yes. Start with our free plan and upgrade anytime.
</p>

</div>



<div className="faq-card">

<h3>
Can I change plans later?
</h3>

<p>
Yes. Upgrade or downgrade depending on your hiring needs.
</p>

</div>



<div className="faq-card">

<h3>
Does AIHIRE provide AI interviews?
</h3>

<p>
Professional and Enterprise plans include AI powered interviews.
</p>

</div>



<div className="faq-card">

<h3>
Do enterprises get support?
</h3>

<p>
Enterprise customers receive dedicated assistance.
</p>

</div>


</div>


</section>





<section className="pricing-cta">


<h2>
Ready To Hire Smarter?
</h2>


<p>
Build faster hiring workflows with AIHIRE.
</p>


<button
onClick={()=>navigate("/register")}
>

Start Free Today

<FaArrowRight/>

</button>


</section>



</div>


<Footer/>

</>
)

}


export default Pricing;