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
  const [interviewId, setInterviewId] = useState("");

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

  recordedChunks.current = [];

  mediaRecorderRef.current = new MediaRecorder(stream);

  mediaRecorderRef.current.ondataavailable = (event) => {

    if (event.data.size > 0) {

      recordedChunks.current.push(event.data);

    }

  };

  mediaRecorderRef.current.start();

};

const uploadVideo = async () => {

  if(recordedChunks.current.length === 0){
    return;
  }

  try{

    const blob = new Blob(
      recordedChunks.current,
      {
        type:"video/webm"
      }
    );

    const formData = new FormData();

    formData.append(
      "video",
      blob,
      "interview.webm"
    );

    await API.post(

      `/video-interviews/${interviewId}/upload`,

      formData,

      {
        headers:{
          "Content-Type":"multipart/form-data"
        }
      }

    );

    console.log("Video uploaded");

  }

  catch(error){

    console.log(error);

    alert("Video upload failed");

  }

};

  const startInterview = async () => {

  try {

    const response = await API.post("/video-interviews/start", {

      candidateName: localStorage.getItem("username"),

      jobId: localStorage.getItem("jobId"),

      jobTitle: localStorage.getItem("jobTitle")

    });

    setInterviewId(response.data._id);
    
    localStorage.setItem(
    "videoInterviewId",
    response.data._id
);

    const element = document.documentElement;

try{

  if(element.requestFullscreen){

    await element.requestFullscreen();

  }

  else if(element.webkitRequestFullscreen){

    element.webkitRequestFullscreen();

  }

  else if(element.msRequestFullscreen){

    element.msRequestFullscreen();

  }

}
catch(error){

  console.log("Fullscreen failed:", error);

}

setStarted(true);

setSecurity(true);

setPage("interview");

    setTimeout(() => {
      startRecording();
    }, 1500);

  }

  catch(error){

    console.log(error);

    alert("Unable to start interview.");

  }

};

const saveCurrentAnswer = async () => {

  const existing = answers.find(
    item => item.questionNo === currentQuestion + 1
  );

  if(existing){
    return true;
  }

  if(answer.trim()===""){
    alert("Please answer the question.");
    return false;
  }


  try{

    await API.put(
      `/video-interviews/${interviewId}/answer`,
      {
        questionNo: currentQuestion + 1,
        question: questions[currentQuestion],
        answer
      }
    );


    setAnswers(prev=>[
      ...prev,
      {
        questionNo:currentQuestion+1,
        answer
      }
    ]);


    return true;

  }
  catch(error){

    console.log(error);

    alert("Unable to save answer.");

    return false;
  }

};

  const nextQuestion = async () => {

  const saved = await saveCurrentAnswer();

  if(!saved) return;

  setAnswer("");

  if(currentQuestion < questions.length-1){

    setCurrentQuestion(prev=>prev+1);

  }

  else{

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

  try {


    if(answer.trim() !== ""){

      await saveCurrentAnswer();

    }



    if(
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ){

      await new Promise((resolve)=>{

        mediaRecorderRef.current.onstop = resolve;

        mediaRecorderRef.current.stop();

      });

    }



    await uploadVideo();




    // temporary video evaluation scores
    // later AI evaluation will replace this

let verdict="Pending";

const technical =
answers.length >= 3 ? 80 : 60;


const communication =
answers.length >= 3 ? 75 : 60;


const confidence =
violations === 0 ? 85 : 65;



const overall =
Math.round(
(
technical +
communication +
confidence
) / 3
);



if(overall >= 75){

  verdict="Hire";

}

else if(overall < 50){

  verdict="Reject";

}





    await API.put(

      `/video-interviews/${interviewId}/finish`,

      {

        violations,


        technical,

        communication,

        confidence,

        overall,

        verdict

      }

    );





    localStorage.removeItem(
      "videoInterviewId"
    );



    // stop security first
setSecurity(false);


// remove fullscreen listener trigger
if(document.fullscreenElement){

await document.exitFullscreen();

}


    await API.post(
 `/video-interviews/${interviewId}/evaluate`
);


    alert(
      "Interview Submitted Successfully"
    );



    window.location.href="/candidate/interviews";



  }


  catch(error){

    console.log(error);

    alert(
      "Submission Failed"
    );

  }

};

useEffect(()=>{

  if(!started || !security) return;


  const handleFullscreenChange = ()=>{


    // only detect exit while interview is active
    if(!document.fullscreenElement && security){


      setViolations(prev=>prev+1);


      alert(
        "Please stay in fullscreen during the interview."
      );


      document.documentElement
      .requestFullscreen()
      .catch(()=>{});


    }


  };


  document.addEventListener(
    "fullscreenchange",
    handleFullscreenChange
  );


  return ()=>{


    document.removeEventListener(
      "fullscreenchange",
      handleFullscreenChange
    );


  };


},[started,security]);


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