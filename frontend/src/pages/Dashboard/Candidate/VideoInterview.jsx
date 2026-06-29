import { useState, useEffect, useRef } from "react";
import Webcam from "react-webcam";
import API from "../../../api/api";

import {
  FaVideo,
  FaClock,
  FaStopCircle,
  FaShieldAlt,
  FaMicrophone,
  FaCheckCircle,
  FaKeyboard
} from "react-icons/fa";

function VideoInterview() {

  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunks = useRef([]);

  const [page, setPage] = useState("check");

  const [cameraReady, setCameraReady] = useState(false);
  const [micReady, setMicReady] = useState(false);

  const [started, setStarted] = useState(false);
  const [security, setSecurity] = useState(false);

  const [violations, setViolations] = useState(0);

  const [timeLeft, setTimeLeft] = useState(20 * 60);

  const [currentQuestion, setCurrentQuestion] = useState(0);

  const [answer, setAnswer] = useState("");

  const [answers, setAnswers] = useState([]);

  const username = localStorage.getItem("username");

  const questions = [

    "Tell me about yourself.",

    "Explain your previous project and your contribution.",

    "What is React Virtual DOM?",

    "How do you handle API errors in React?"

  ];

    useEffect(() => {

    if (!security) return;

    const detectTab = () => {

      if (document.hidden) {

        setViolations(prev => prev + 1);

        alert("Do not switch tabs during the interview.");

      }

    };

    document.addEventListener(
      "visibilitychange",
      detectTab
    );

    return () => {

      document.removeEventListener(
        "visibilitychange",
        detectTab
      );

    };

  }, [security]);

    useEffect(() => {

    if (!started) return;

    const timer = setInterval(() => {

      setTimeLeft(prev => {

        if (prev <= 1) {

          finishInterview();

          return 0;

        }

        return prev - 1;

      });

    }, 1000);

    return () => clearInterval(timer);

  }, [started]);

    const enableCamera = async () => {

    try {

      const stream = await navigator.mediaDevices.getUserMedia({

        video: true

      });

      stream.getTracks().forEach(track => track.stop());

      setCameraReady(true);

    }

    catch {

      alert("Camera permission denied");

    }

  };

    const enableMicrophone = async () => {

    try {

      const stream = await navigator.mediaDevices.getUserMedia({

        audio: true

      });

      stream.getTracks().forEach(track => track.stop());

      setMicReady(true);

    }

    catch {

      alert("Microphone permission denied");

    }

  };

    const startRecording = () => {

    if (!webcamRef.current) return;

    const stream = webcamRef.current.stream;

    if (!stream) return;

    mediaRecorderRef.current = new MediaRecorder(stream);

    mediaRecorderRef.current.ondataavailable = (event) => {

      if (event.data.size > 0) {

        recordedChunks.current.push(event.data);

      }

    };

    mediaRecorderRef.current.start();

  };

    const startInterview = async () => {

    try {

      await document.documentElement.requestFullscreen();

      setStarted(true);

      setSecurity(true);

      setPage("interview");

      setTimeout(() => {

        startRecording();

      }, 1500);

    }

    catch {

      alert("Fullscreen permission required.");

    }

  };

    const saveCurrentAnswer = () => {

    const updated = [...answers];

    updated[currentQuestion] = {

      question: questions[currentQuestion],

      answer

    };

    setAnswers(updated);

  };

    const nextQuestion = () => {

    saveCurrentAnswer();

    if (currentQuestion < questions.length - 1) {

      setCurrentQuestion(currentQuestion + 1);

      setAnswer("");

    }

    else {

      finishInterview();

    }

  };

    const minutes = String(
    Math.floor(timeLeft / 60)
  ).padStart(2, "0");

  const seconds = String(
    timeLeft % 60
  ).padStart(2, "0");

  const finishInterview = async () => {

  saveCurrentAnswer();

  try{

    // Stop Recording

    if(
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ){

      mediaRecorderRef.current.stop();

    }

    // Exit Security

    setSecurity(false);

    if(document.fullscreenElement){

      await document.exitFullscreen();

    }

    // Save Interview Answers

    const interviewData={

      candidateName:username,

      answers,

      violations,

      interviewType:"Video",

      submittedAt:new Date()

    };

    console.log(interviewData);

    /*
    await API.post(
      "/video-interview/submit",
      interviewData
    );
    */

    alert("Interview Submitted Successfully");

    window.location.href="/interviews";

  }

  catch(error){

    console.log(error);

    alert("Submission Failed");

  }

};

return(

<div className="company-interview">

{
page==="check" &&

<div className="assessment-card">

<FaShieldAlt size={65}/>

<h1>AI Video Interview</h1>

<p>
Complete the system check before starting.
</p>

<div className="permission-container">

<button
className={
cameraReady
?
"permission-card enabled"
:
"permission-card"
}
onClick={enableCamera}
>

{
cameraReady
?
<FaCheckCircle/>
:
<FaVideo/>
}

<h3>Camera</h3>

<p>

{
cameraReady
?
"Enabled"
:
"Click to Allow"
}

</p>

</button>



<button
className={
micReady
?
"permission-card enabled"
:
"permission-card"
}
onClick={enableMicrophone}
>

{
micReady
?
<FaCheckCircle/>
:
<FaMicrophone/>
}

<h3>Microphone</h3>

<p>

{
micReady
?
"Enabled"
:
"Click to Allow"
}

</p>

</button>

</div>

<div className="rules-box">

<p>✔ Camera must remain ON</p>

<p>✔ Microphone must remain ON</p>

<p>✔ AI Proctoring Enabled</p>

<p>✔ Do not switch tabs</p>

<p>✔ Fullscreen will start automatically</p>

</div>

<button

className="start-btn"

disabled={
!(cameraReady && micReady)
}

onClick={startInterview}

>

Start Interview

</button>

</div>

}

{
page==="interview" &&

<div className="interview-wrapper">

<div className="interview-header">

<h2>

<FaVideo/>

AI Video Interview

</h2>

<div className="timer">

<FaClock/>

{minutes}:{seconds}

</div>

</div>

<div className="interview-content">

<div className="question-card">

<h4>

Question

{currentQuestion+1}

of

{questions.length}

</h4>

<h1>

{questions[currentQuestion]}

</h1>

<div className="answer-box">

<div className="answer-title">

<FaKeyboard/>

Your Answer

</div>

<textarea

placeholder="Type your answer here..."

value={answer}

onChange={(e)=>

setAnswer(e.target.value)

}

/>

</div>

<div className="question-actions">

<button

className="next-btn"

onClick={nextQuestion}

>

{

currentQuestion===questions.length-1

?

"Submit Interview"

:

"Next Question"

}

</button>

<button

className="finish-btn"

onClick={finishInterview}

>

<FaStopCircle/>

Finish

</button>

</div>

<div className="progress">

{

questions.map((_,index)=>(

<div

key={index}

className={

index===currentQuestion

?

"progress-dot active"

:

"progress-dot"

}

/>

))

}

</div>

</div>

<div className="webcam-card">

<Webcam

ref={webcamRef}

audio

mirrored

videoConstraints={{

facingMode:"user"

}}

className="candidate-camera"

/>

<div className="camera-footer">

Candidate Camera

</div>

<div className="security-status">

<FaShieldAlt/>

AI Proctoring Active

<br/>

Violations :

{violations}

</div>

</div>

</div>

</div>

}

</div>

);

}

export default VideoInterview;