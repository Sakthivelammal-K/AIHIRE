import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import { useState, useEffect } from "react";
import API from "../../../api/api";


function AIInterview() {

  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);

  const [answer1, setAnswer1] = useState("");
  const [answer2, setAnswer2] = useState("");
  const [answer3, setAnswer3] = useState("");

  // Get candidate interview details
const [interviews,setInterviews] = useState([]);


useEffect(()=>{

loadInterviews();

},[]);


const loadInterviews = async()=>{

try{

const response =
await API.get("/interviews/");

setInterviews(response.data);

}
catch(error){

console.log(error);

}

};

  const currentUser =
    localStorage.getItem("username");

  const myInterview =
    interviews.find(
      (item) =>
        item.candidateName === currentUser
    );

  const jobTitle =
    myInterview?.jobTitle || "Frontend Developer";

  // AI Generated Questions
  const interviewQuestions = {

    "Frontend Developer": [
      "Explain React Hooks.",
      "What is Virtual DOM?",
      "Difference between useState and useEffect?"
    ],

    "Backend Developer": [
      "Explain REST APIs.",
      "What is JWT Authentication?",
      "Difference between SQL and NoSQL?"
    ],

    "Full Stack Developer": [
      "Explain MERN Stack.",
      "How do frontend and backend communicate?",
      "What is API Integration?"
    ]

  };

  const questions =
    interviewQuestions[jobTitle] ||
    interviewQuestions["Frontend Developer"];

const handleSubmit = async (e) => {

    e.preventDefault();

    const totalLength =
      answer1.length +
      answer2.length +
      answer3.length;


    let communication = 50;
    let technical = 50;
    let confidence = 50;


    if (totalLength > 300) {
      communication = 85;
      technical = 90;
      confidence = 88;
    }
    else if (totalLength > 150) {
      communication = 75;
      technical = 80;
      confidence = 78;
    }
    else {
      communication = 60;
      technical = 65;
      confidence = 62;
    }


    const overall = Math.round(
      (
        communication +
        technical +
        confidence
      ) / 3
    );


    const verdict =
      overall >= 80
        ? "Hire"
        : overall >= 65
        ? "Consider"
        : "Reject";


    let strengths = [];
    let improvements = [];


    if (communication >= 80){
        strengths.push("Good communication skills");
    }else{
        improvements.push("Improve communication clarity");
    }


    if (technical >= 80){
        strengths.push("Strong technical knowledge");
    }else{
        improvements.push("Strengthen technical concepts");
    }


    if (confidence >= 80){
        strengths.push("Confident responses");
    }else{
        improvements.push("Show more confidence");
    }


    const interviewResult = {

      candidateName: currentUser,

      jobTitle,

      communication,

      technical,

      confidence,

      overall,

      verdict,

      strengths,

      improvements,

    };


    try {

      await API.post(
        "/interviews/result",
        interviewResult
      );


      setResult(interviewResult);

      setSubmitted(true);


      alert(
        "Interview Submitted Successfully"
      );


    } catch(error){

      console.log(error);

      alert(
        "Interview submission failed"
      );

    }

};

  return (
    <DashboardLayout>

      <h1>AI Interview</h1>

      <div className="activity-card">
        <h3>Role: {jobTitle}</h3>
      </div>

      {!submitted ? (

        <div className="activity-card">

          <form onSubmit={handleSubmit}>

            <div className="form-group">
              <label>{questions[0]}</label>

              <textarea
                rows="4"
                value={answer1}
                onChange={(e) =>
                  setAnswer1(e.target.value)
                }
                required
              />
            </div>

            <div className="form-group">
              <label>{questions[1]}</label>

              <textarea
                rows="4"
                value={answer2}
                onChange={(e) =>
                  setAnswer2(e.target.value)
                }
                required
              />
            </div>

            <div className="form-group">
              <label>{questions[2]}</label>

              <textarea
                rows="4"
                value={answer3}
                onChange={(e) =>
                  setAnswer3(e.target.value)
                }
                required
              />
            </div>

            <button type="submit">
              Submit Interview
            </button>

          </form>

        </div>

      ) : (

        <div className="activity-card">

          <h2>AI Interview Evaluation</h2>

          <p>
            <strong>Communication:</strong>{" "}
            {result.communication}%
          </p>

          <p>
            <strong>Technical:</strong>{" "}
            {result.technical}%
          </p>

          <p>
            <strong>Confidence:</strong>{" "}
            {result.confidence}%
          </p>

          <p>
            <strong>Overall Score:</strong>{" "}
            {result.overall}%
          </p>

          <h3>
            ⭐ Verdict: {result.verdict}
          </h3>

          <hr style={{ margin: "20px 0" }} />
          <h3>AI Feedback</h3>
          <h4>Strengths</h4>

          <ul>
            {result.strengths.map((item, index) => (
                <li key={index}>✅ {item}</li>
            ))}
          </ul>

          <h4>Areas for Improvement</h4>

          <ul>
            {result.improvements.map((item, index) => (
                <li key={index}>⚠️ {item}</li>
            ))}
          </ul>

        </div>

      )}

    </DashboardLayout>
  );
}

export default AIInterview;