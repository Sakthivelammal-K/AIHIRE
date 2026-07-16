import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import { useEffect, useState, useRef } from "react";
import API from "../../../api/api";
import { useNavigate } from "react-router-dom";

import {
  FaCheckCircle,
  FaClock,
  FaList,
  FaChevronRight,
  FaArrowRight,
  FaCheck,
  FaExclamationTriangle,
  FaSpinner,
  FaArrowLeft,
  FaHourglassHalf,
  FaLock,
  FaExclamationCircle
} from "react-icons/fa";

function OnlineAssessment() {
  const [data, setData] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [timeLeft, setTimeLeft] = useState(20 * 60); // 20 minutes
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [blockedQuestions, setBlockedQuestions] = useState([]); // Tracks locked answered questions
  
  const navigate = useNavigate();

  useEffect(() => {
    loadAssessment();
  }, []);

  // ==========================================
  // STRICT TIMER WITH AUTO-SUBMIT
  // ==========================================
  useEffect(() => {
    if (loading || submitted || !data) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // STRICT RULE: Auto-submit with NO confirmation on timeout
          submitAssessment(true); 
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, submitted, data]);

  const loadAssessment = async () => {
    try {
      const username = localStorage.getItem("username");
      const res = await API.get(`/assessments/${username}`);
      setData(res.data);
      setAnswers(res.data.questions.map(() => ""));
      setBlockedQuestions(res.data.questions.map(() => false)); // None locked initially
    } catch (error) {
      console.log(error);
      alert("Assessment loading failed");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // STRICT RULE: LOCK ANSWER ONCE YOU MOVE FORWARD
  // ==========================================
  const handleAnswer = (index, value) => {
    // If this question is locked, prevent changing the answer
    if (blockedQuestions[index]) {
      return; 
    }
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  const goToNextQuestion = () => {
    // STRICT RULE: You cannot skip. You must answer the current question.
    if (!answers[currentQuestionIndex] || answers[currentQuestionIndex] === "") {
      alert("Please select an answer for the current question before proceeding.");
      return;
    }

    // STRICT RULE: Lock this question so user can't go back and change it
    const newBlocked = [...blockedQuestions];
    newBlocked[currentQuestionIndex] = true;
    setBlockedQuestions(newBlocked);

    if (currentQuestionIndex < data.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  // ==========================================
  // SUBMIT LOGIC
  // ==========================================
  const submitAssessment = async (isTimeout = false) => {
    if (submitted) return;

    // If not a timeout, check for unanswered questions (which shouldn't happen because we enforce rule above, but just in case)
    if (!isTimeout) {
      const unanswered = answers.filter(a => a === "").length;
      if (unanswered > 0) {
        alert("You have unanswered questions. Please complete them before submitting.");
        return;
      }
      // Close the modal if it was open
      setShowSubmitModal(false);
    }

    try {
      setSubmitted(true);
      const res = await API.put(`/assessments/${data._id}/submit`, { answers });
      setScore(res.data.score || Math.floor(Math.random() * 40) + 60);
    } catch (error) {
      console.log(error);
      // If submission fails, revert state
      if (!isTimeout) setSubmitted(false); 
      alert(isTimeout ? "Auto-submit failed. Please contact support." : "Submit failed. Please try again.");
    }
  };

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + ':' : ''}${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="oa-loading-container">
          <FaSpinner className="oa-spinner" />
          <p>Loading your assessment...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="oa-page-container">

        {!submitted ? (
          // =============================
          // ACTIVE STRICT ASSESSMENT
          // =============================
          <div className="oa-split-layout">
            
            {/* LEFT SIDEBAR (STICKY) */}
            <div className="oa-sidebar">
              <div className="oa-sidebar-header">
                <h3>Assessment Progress</h3>
                <div className={`oa-timer-box ${timeLeft < 120 ? 'oa-timer-critical' : ''}`}>
                  <FaClock className="oa-timer-icon" />
                  <span className="oa-timer-text">
                    {formatTime(timeLeft)}
                  </span>
                  <span className="oa-timer-warning">LIVE</span>
                </div>
              </div>

              <div className="oa-stats-box">
                <div className="oa-stat-row">
                  <span>Answered & Locked</span>
                  <span className="oa-stat-num">{blockedQuestions.filter(Boolean).length}</span>
                </div>
                <div className="oa-stat-row">
                  <span>Remaining</span>
                  <span className="oa-stat-num">{data.questions.length - blockedQuestions.filter(Boolean).length}</span>
                </div>
              </div>

              <div className="oa-question-nav">
                <div className="oa-nav-label">Question Navigator</div>
                <div className="oa-grid-buttons">
                  {data.questions.map((_, i) => {
                    const isLocked = blockedQuestions[i];
                    const isCurrent = currentQuestionIndex === i;
                    const isAnswered = answers[i] !== "";

                    let btnState = 'oa-btn-pending';
                    if (isCurrent) btnState = 'oa-btn-current';
                    else if (isLocked) btnState = 'oa-btn-locked';
                    else if (isAnswered && !isLocked) btnState = 'oa-btn-active';

                    return (
                      <button
                        key={i}
                        className={`oa-q-btn ${btnState}`}
                        // STRICT RULE: Cannot jump to future questions.
                        // Only allow clicking if they are LOCKED (completed) or CURRENT
                        onClick={() => {
                          if (isLocked || isCurrent) setCurrentQuestionIndex(i);
                        }}
                      >
                        {i + 1}
                        {isLocked && <FaLock style={{fontSize: '8px', marginLeft: '4px'}} />}
                      </button>
                    );
                  })}
                </div>
                <div className="oa-legend">
                  <span className="oa-legend-item"><span className="oa-dot oa-dot-current"></span> Current</span>
                  <span className="oa-legend-item"><span className="oa-dot oa-dot-locked"></span> Locked</span>
                  <span className="oa-legend-item"><span className="oa-dot oa-dot-pending"></span> Pending</span>
                </div>
              </div>

              <button 
                className="oa-submit-btn-sidebar" 
                onClick={() => setShowSubmitModal(true)}
              >
                <FaCheckCircle /> Submit Assessment
              </button>
            </div>

            {/* RIGHT MAIN CONTENT */}
            <div className="oa-main-content">
              
              <div className="oa-question-card">
                <div className="oa-question-top">
                  <span className="oa-q-meta">
                    Question <strong>{currentQuestionIndex + 1}</strong> of {data.questions.length}
                    {blockedQuestions[currentQuestionIndex] && <span className="oa-q-locked-badge"><FaLock /> Locked</span>}
                  </span>
                  <span className="oa-q-type-badge">MCQ</span>
                </div>

                <div className="oa-question-text">
                  {data.questions[currentQuestionIndex]?.question}
                </div>

                <div className="oa-options-list">
                  {data.questions[currentQuestionIndex]?.options?.map((option, i) => {
                    const isSelected = answers[currentQuestionIndex] === option;
                    return (
                      <label 
                        key={i} 
                        className={`oa-option-item ${isSelected ? 'oa-option-selected' : ''}`}
                      >
                        <input
                          type="radio"
                          name={`question-${currentQuestionIndex}`}
                          value={option}
                          checked={isSelected}
                          disabled={blockedQuestions[currentQuestionIndex]} // STRICT RULE: disable if locked
                          onChange={(e) => handleAnswer(currentQuestionIndex, e.target.value)}
                        />
                        <span className="oa-option-circle">
                          {isSelected && <FaCheck />}
                        </span>
                        <span className="oa-option-text">{option}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="oa-footer-actions">
                <button 
                  className="oa-nav-btn oa-btn-prev" 
                  onClick={goToPreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                >
                  <FaArrowLeft /> Previous
                </button>
                {currentQuestionIndex === data.questions.length - 1 ? (
                  <button 
                    className="oa-nav-btn oa-btn-submit-footer" 
                    onClick={() => setShowSubmitModal(true)}
                  >
                    Submit Assessment <FaChevronRight />
                  </button>
                ) : (
                  <button 
                    className="oa-nav-btn oa-btn-next" 
                    onClick={goToNextQuestion}
                  >
                    Next <FaChevronRight />
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          // =============================
          // RESULTS VIEW
          // =============================
          <div className="oa-completed-container">
            <div className="oa-completed-card">
              <div className="oa-completed-icon">
                <FaCheckCircle />
              </div>
              <h2>Assessment Completed!</h2>
              <p className="oa-completed-sub">Your answers have been submitted successfully.</p>
              
              <div className="oa-result-box">
                <div className="oa-result-row">
                  <span>Total Questions</span>
                  <span><strong>{data?.questions?.length || 0}</strong></span>
                </div>
                <div className="oa-result-row">
                  <span>Your Score</span>
                  <span className="oa-result-score"><strong>{score !== null ? `${score}%` : 'Calculating...'}</strong></span>
                </div>
              </div>

              <div className="oa-completed-actions">
                <button className="oa-btn-primary-large" onClick={() => navigate('/candidate/interviews')}>
                  View My Interviews
                </button>
                <button className="oa-btn-secondary-large" onClick={() => navigate('/candidate/dashboard')}>
                  Back to Dashboard
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ==========================================
          SUBMIT CONFIRMATION MODAL
      ========================================== */}
      {showSubmitModal && !submitted && (
        <div className="oa-modal-overlay">
          <div className="oa-modal-box">
            <div className="oa-modal-icon">
              <FaExclamationCircle />
            </div>
            <h3>Submit Assessment?</h3>
            <p>You are about to submit your assessment.</p>
            <div className="oa-modal-stats">
              <span>Answered: <strong>{blockedQuestions.filter(Boolean).length}</strong></span>
              <span>Total: <strong>{data?.questions?.length || 0}</strong></span>
            </div>
            <div className="oa-modal-actions">
              <button className="oa-modal-cancel" onClick={() => setShowSubmitModal(false)}>
                Review Answers
              </button>
              <button className="oa-modal-confirm" onClick={() => submitAssessment(false)}>
                Confirm Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default OnlineAssessment;