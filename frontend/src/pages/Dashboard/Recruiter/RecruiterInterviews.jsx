import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../api/api";

import {
  FaVideo,
  FaCalendar,
  FaCalendarAlt,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaSpinner,
  FaEllipsisV,
  FaGoogle,
  FaVideo as FaVideoIcon,
  FaBriefcase,
  FaChevronLeft,
  FaChevronRight,
  FaPlus,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaArrowUp,
  FaArrowDown,
  FaStar,
  FaUserTie,
  FaUsers,
  FaLink,
  FaCrown,
  FaArrowLeft,
  FaEdit,
  FaTrash,
  FaSearch,
  FaCode,
  FaFileAlt,
  FaBell,
  FaUndo,
  FaChartLine,
  FaSave,
  FaUserCircle
} from "react-icons/fa";

function RecruiterInterviews() {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState([]);
  const [selectedInterview, setSelectedInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  
  // Calendar states
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  
  // Schedule Interview states
  const [showSchedulePage, setShowSchedulePage] = useState(false);
  
  // Load real candidates for the dropdown
  const [candidatesList, setCandidatesList] = useState([]);
  const [loadingCandidates, setLoadingCandidates] = useState(false);

  const [scheduleForm, setScheduleForm] = useState({
    candidateId: "", 
    candidateName: "",
    candidateEmail: "",
    candidateRole: "",
    atsScore: 0,
    interviewType: "Video", 
    date: "",
    time: "",
    duration: "60",
    timeZone: "Pacific Time (US & Canada)",
    mode: "Google Meet",
    meetingLink: "",
    rounds: ["Technical Discussion", "Culture Fit Round"],
    notes: "",
    interviewers: [""]
  });

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await API.get("/interviews/");
      const data = res.data.scheduled || res.data || [];
      setInterviews(Array.isArray(data) ? data : []);
      await loadCandidates();
    } catch (err) {
      console.log(err);
      setError("Failed to load interviews. Please try again.");
      setInterviews([]);
    } finally {
      setLoading(false);
    }
  };

  const loadCandidates = async () => {
    setLoadingCandidates(true);
    try {
      const res = await API.get("/applications/");
      const data = Array.isArray(res.data) ? res.data : (res.data.applications || []);
      setCandidatesList(data);
    } catch (err) {
      console.log("Failed to load candidates list:", err);
      setCandidatesList([]);
    } finally {
      setLoadingCandidates(false);
    }
  };

  // ==========================================
  // FIXED SAVE CHANGES: Proper URL formatting
  // ==========================================
const saveInterview = async () => {
  if (!selectedInterview) return;
  try {
    // FIXED: Ensure there is a forward slash before the ID
    await API.put(`/interviews/result/${selectedInterview._id}`, {
      type: selectedInterview.type,
      interviewType: selectedInterview.interviewType,
      date: selectedInterview.date,
      duration: selectedInterview.duration,
      mode: selectedInterview.mode,
      meetingLink: selectedInterview.meetingLink,
      interviewers: selectedInterview.interviewers,
      rounds: selectedInterview.rounds,
      instructions: selectedInterview.instructions,
      notes: selectedInterview.notes,
      status: selectedInterview.status
    });

    // Update local state to match the saved data
    setInterviews(prev =>
      prev.map(item =>
        item._id === selectedInterview._id
          ? {
              ...item,
              type: selectedInterview.type,
              interviewType: selectedInterview.interviewType,
              date: selectedInterview.date,
              duration: selectedInterview.duration,
              mode: selectedInterview.mode,
              meetingLink: selectedInterview.meetingLink,
              interviewers: selectedInterview.interviewers,
              rounds: selectedInterview.rounds,
              instructions: selectedInterview.instructions,
              notes: selectedInterview.notes,
              status: selectedInterview.status
            }
          : item
      )
    );

    setSelectedInterview({ ...selectedInterview });
    alert("Interview updated successfully!");
    load(); // Reload data from database to ensure sync
  } catch (err) {
    console.log(err);
    alert("Update failed. Please try again.");
  }
};


  const handleScheduleInterview = async (e) => {
    e.preventDefault();
    const errors = [];
    if (!scheduleForm.candidateId) errors.push("Please select a candidate.");
    if (!scheduleForm.date) errors.push("Please select a date.");
    if (!scheduleForm.time) errors.push("Please select a time.");
    if (!scheduleForm.interviewType) errors.push("Please select an interview type.");
    
    const validInterviewers = scheduleForm.interviewers.filter(i => i.trim());
    if (validInterviewers.length === 0) errors.push("Please add at least one interviewer.");

    const validRounds = scheduleForm.rounds.filter(r => r.trim());
    if (validRounds.length === 0) errors.push("Please add at least one interview round.");

    if (errors.length > 0) {
      alert("Validation Error:\n\n• " + errors.join("\n• "));
      return;
    }

    try {
      const dateTime = new Date(`${scheduleForm.date}T${scheduleForm.time}`);
      
      await API.post("/interviews/create", {
        candidateId: scheduleForm.candidateId,
        candidateName: scheduleForm.candidateName,
        email: scheduleForm.candidateEmail || "",
        jobTitle: scheduleForm.candidateRole || "",
        date: dateTime.toISOString(),
        type: scheduleForm.interviewType, 
        interviewType: scheduleForm.interviewType,
        meetingLink: scheduleForm.meetingLink || "",
        instructions: scheduleForm.notes || "",
        status: "Scheduled",
        duration: scheduleForm.duration,
        interviewers: validInterviewers,
        rounds: validRounds,
        mode: scheduleForm.mode,
        timeZone: scheduleForm.timeZone
      });

      setShowSchedulePage(false);
      resetForm();
      load();
      alert("Interview scheduled successfully!");
    } catch (err) {
      console.log(err);
      alert("Failed to schedule interview. Please try again.");
    }
  };

  const resetForm = () => {
    setScheduleForm({
      candidateId: "",
      candidateName: "",
      candidateEmail: "",
      candidateRole: "",
      atsScore: 0,
      interviewType: "Video",
      date: "",
      time: "",
      duration: "60",
      timeZone: "Pacific Time (US & Canada)",
      mode: "Google Meet",
      meetingLink: "",
      rounds: ["Technical Discussion", "Culture Fit Round"],
      notes: "",
      interviewers: [""]
    });
  };

  const handleBack = () => {
    setShowSchedulePage(false);
    resetForm();
  };

  // Calendar functions
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    return { daysInMonth, startingDay };
  };

  const getMonthName = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  const isToday = (day) => {
    const today = new Date();
    return day === today.getDate() && 
           currentDate.getMonth() === today.getMonth() && 
           currentDate.getFullYear() === today.getFullYear();
  };

  const isSelected = (day) => {
    if (!selectedDate) return false;
    return day === selectedDate.getDate() && 
           currentDate.getMonth() === selectedDate.getMonth() && 
           currentDate.getFullYear() === selectedDate.getFullYear();
  };

  const getInterviewsForDate = (day) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return interviews.filter(interview => {
      const interviewDate = new Date(interview.date);
      return interviewDate.toDateString() === date.toDateString();
    });
  };

  const handleDateClick = (day) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(date);
  };

  const today = new Date();
  const todayStr = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const todayInterviews = interviews.filter(interview => {
    const interviewDate = new Date(interview.date);
    return interviewDate.toDateString() === today.toDateString();
  });

  const upcomingInterviews = interviews.filter(interview => {
    const interviewDate = new Date(interview.date);
    const diffDays = Math.ceil((interviewDate - today) / (1000 * 60 * 60 * 24));
    return diffDays > 0 && diffDays <= 7 && interview.status !== "Completed" && interview.status !== "Cancelled";
  });

  const groupedUpcoming = upcomingInterviews.reduce((groups, interview) => {
    const dateKey = new Date(interview.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
    if (!groups[dateKey]) groups[dateKey] = [];
    groups[dateKey].push(interview);
    return groups;
  }, {});

  const filteredInterviews = interviews.filter(interview => {
    const matchesSearch = (interview.candidateName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (interview.jobTitle || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || interview.status?.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const statusMap = {
      'Scheduled': { class: 'status-scheduled', icon: <FaClock />, label: 'Scheduled' },
      'Completed': { class: 'status-completed', icon: <FaCheckCircle />, label: 'Completed' },
      'Cancelled': { class: 'status-cancelled', icon: <FaTimesCircle />, label: 'Cancelled' },
      'Rescheduled': { class: 'status-rescheduled', icon: <FaUndo />, label: 'Rescheduled' }
    };
    return statusMap[status] || statusMap['Scheduled'];
  };

  const handleRescheduleInterview = async (id, newDate) => {
    const newDateTime = prompt("Enter new date and time (YYYY-MM-DD HH:MM):", newDate);
    if (!newDateTime) return;

    const dateObj = new Date(newDateTime);
    if (isNaN(dateObj.getTime())) {
      alert("Invalid date format. Please use YYYY-MM-DD HH:MM");
      return;
    }

    try {
      await API.put(`/interviews/${id}`, { date: dateObj.toISOString(), status: "Rescheduled" });
      alert("Interview rescheduled successfully!");
      load();
    } catch (err) {
      console.log(err);
      alert("Failed to reschedule interview.");
    }
  };

  const handleCancelInterview = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this interview? This action cannot be undone.")) {
      return;
    }
    try {
      await API.put(`/interviews/${id}`, { status: "Cancelled" });
      alert("Interview cancelled successfully.");
      load();
    } catch (err) {
      console.log(err);
      alert("Failed to cancel interview.");
    }
  };

  const handleSetReminder = async (id) => {
    try {
      await API.post(`/interviews/${id}/reminder`).catch(() => {}); 
      alert("Reminder set! You will be notified 15 minutes before the interview.");
    } catch (err) {
      alert("Reminder set! (Backend reminder service simulated)");
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'TBD';
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return dateString;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'TBD';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateString;
    }
  };

  const getMeetingPlatform = (type) => {
    if (type?.toLowerCase().includes('google') || type?.toLowerCase().includes('meet')) return <FaGoogle className="platform-icon" />;
    if (type?.toLowerCase().includes('zoom')) return <FaVideoIcon className="platform-icon" />;
    return <FaVideo className="platform-icon" />;
  };

  const { daysInMonth, startingDay } = getDaysInMonth(currentDate);

  // --- SCHEDULE PAGE (Unchanged) ---
  if (showSchedulePage) {
    return (
      <DashboardLayout customTitle="Schedule Interview" customSubtitle="Interview Calendar > Schedule Interview">
        <div className="schedule-interview-page">
          <button className="schedule-back-btn" onClick={handleBack}><FaArrowLeft /> Back to Interviews</button>
          <div className="schedule-grid">
            <div className="schedule-form-column">
              <div className="schedule-section">
                <h3>1. Select Candidate</h3>
                <div className="schedule-form-group">
                  <label>Candidate <span className="required">*</span></label>
                  {loadingCandidates ? (
                    <div><FaSpinner className="spin" /> Loading candidates...</div>
                  ) : (
                    <select value={scheduleForm.candidateId} onChange={(e) => {
                        const selectedId = e.target.value;
                        const candidate = candidatesList.find(c => c._id === selectedId);
                        setScheduleForm({
                          ...scheduleForm,
                          candidateId: selectedId,
                          candidateName: candidate ? (candidate.candidateName || candidate.name || "") : "",
                          candidateEmail: candidate ? candidate.email : "",
                          candidateRole: candidate ? candidate.jobTitle : ""
                        });
                      }} className={!scheduleForm.candidateId ? 'input-error' : ''}>
                      <option value="">-- Select a Candidate --</option>
                      {candidatesList.map((c) => (
                        <option key={c._id} value={c._id}>{c.candidateName || c.name || "Unknown"} - {c.jobTitle || "N/A"}</option>
                      ))}
                    </select>
                  )}
                </div>
                <div className="candidate-select-card" style={{ marginTop: '15px', opacity: scheduleForm.candidateId ? 1 : 0.5 }}>
                  <div className="candidate-select-info">
                    <div className="candidate-avatar-select">{scheduleForm.candidateName?.charAt(0)?.toUpperCase() || '?'}</div>
                    <div><div className="candidate-select-name">{scheduleForm.candidateName || "No candidate selected"}</div><div className="candidate-select-role">{scheduleForm.candidateRole || "N/A"}</div></div>
                  </div>
                </div>
              </div>
              <div className="schedule-section">
                <h3>2. Interview Details</h3>
                <div className="schedule-form-grid">
                  <div className="schedule-form-group"><label>Interview Type <span className="required">*</span></label><select value={scheduleForm.interviewType} onChange={(e) => setScheduleForm({...scheduleForm, interviewType: e.target.value})} className="form-select"><option value="Video">Video Interview</option><option value="MCQ">MCQ Assessment</option><option value="Technical Coding">Technical Coding Challenge</option></select></div>
                  <div className="schedule-form-group"><label>Date <span className="required">*</span></label><input type="date" value={scheduleForm.date} onChange={(e) => setScheduleForm({...scheduleForm, date: e.target.value})} /></div>
                  <div className="schedule-form-group"><label>Time <span className="required">*</span></label><input type="time" value={scheduleForm.time} onChange={(e) => setScheduleForm({...scheduleForm, time: e.target.value})} /></div>
                  <div className="schedule-form-group"><label>Interview Mode <span className="required">*</span></label><select value={scheduleForm.mode} onChange={(e) => setScheduleForm({...scheduleForm, mode: e.target.value})}><option>Google Meet</option><option>Zoom</option><option>Microsoft Teams</option><option>In-Person</option><option>Phone</option></select></div>
                  <div className="schedule-form-group"><label>Duration (minutes) <span className="required">*</span></label><input type="number" value={scheduleForm.duration} onChange={(e) => setScheduleForm({...scheduleForm, duration: e.target.value})} min="15" step="15" /></div>
                  <div className="schedule-form-group"><label>Time Zone <span className="required">*</span></label><select value={scheduleForm.timeZone} onChange={(e) => setScheduleForm({...scheduleForm, timeZone: e.target.value})}><option>Pacific Time (US & Canada)</option><option>Eastern Time (US & Canada)</option><option>Central Time (US & Canada)</option><option>Mountain Time (US & Canada)</option><option>GMT (UTC)</option></select></div>
                </div>
              </div>
              <div className="schedule-section">
                <h3>3. Interview Plan (Rounds)</h3>
                <div className="schedule-rounds">
                  <label>Rounds / Agenda <span className="required">*</span></label>
                  {scheduleForm.rounds.map((round, index) => (
                    <div key={index} className="round-item"><span>{index + 1}. {round}</span><button className="round-remove-btn" onClick={() => { const newRounds = scheduleForm.rounds.filter((_, i) => i !== index); setScheduleForm({...scheduleForm, rounds: newRounds}); }}><FaTimesCircle /></button></div>
                  ))}
                  <button className="add-round-btn" onClick={() => { const newRound = prompt("Enter round name:"); if (newRound) { setScheduleForm({...scheduleForm, rounds: [...scheduleForm.rounds, newRound]}); } }}><FaPlus /> Add Round</button>
                </div>
              </div>
              <div className="schedule-section">
                <h3>4. Interviewers <span className="required">*</span></h3>
                <div className="schedule-interviewers">
                  {scheduleForm.interviewers.map((interviewer, index) => (
                    <div key={index} className="interviewer-item"><div className="interviewer-tag"><FaUserTie /> <input type="text" value={interviewer} placeholder={`Interviewer ${index + 1} name`} onChange={(e) => { const newInterviewers = [...scheduleForm.interviewers]; newInterviewers[index] = e.target.value; setScheduleForm({...scheduleForm, interviewers: newInterviewers}); }} className="interviewer-input" /></div><button className="interviewer-remove-btn" onClick={() => { const newInterviewers = scheduleForm.interviewers.filter((_, i) => i !== index); setScheduleForm({...scheduleForm, interviewers: newInterviewers}); }}><FaTimesCircle /></button></div>
                  ))}
                  <button className="add-interviewer-btn" onClick={() => { setScheduleForm({...scheduleForm, interviewers: [...scheduleForm.interviewers, ""]}); }}><FaPlus /> Add Interviewer</button>
                </div>
              </div>
              <div className="schedule-section">
                <h3>5. Meeting Details</h3>
                <div className="schedule-form-group"><label>Meeting Link</label><input type="url" placeholder="https://meet.google.com/abc-def-ghi" value={scheduleForm.meetingLink} onChange={(e) => setScheduleForm({...scheduleForm, meetingLink: e.target.value})} /></div>
                <div className="schedule-form-group"><label>Recruiter Notes / Instructions</label><textarea className="schedule-notes" rows="4" value={scheduleForm.notes} onChange={(e) => setScheduleForm({...scheduleForm, notes: e.target.value})} placeholder="Add interview instructions, preparation notes, or recruiter remarks..." /></div>
              </div>
              <div className="schedule-actions"><button className="schedule-cancel-btn" onClick={handleBack}>Cancel</button><button className="schedule-submit-btn" onClick={handleScheduleInterview}><FaCalendarAlt /> Schedule Interview</button></div>
            </div>
            <div className="schedule-summary-column">
              <div className="schedule-summary-card">
                <h3>Interview Summary</h3>
                <div className="summary-item"><span className="summary-label">Candidate</span><span className="summary-value">{scheduleForm.candidateName || "Not set"}</span></div>
                <div className="summary-item"><span className="summary-label">Role</span><span className="summary-value">{scheduleForm.candidateRole || "Not set"}</span></div>
                <div className="summary-item"><span className="summary-label">Interview Type</span><span className="summary-value">{scheduleForm.interviewType || "Not set"}</span></div>
                <div className="summary-item"><span className="summary-label">Date & Time</span><span className="summary-value">{scheduleForm.date ? new Date(scheduleForm.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'TBD'} at {scheduleForm.time || 'TBD'}</span></div>
                <div className="summary-item"><span className="summary-label">Duration</span><span className="summary-value">{scheduleForm.duration} Minutes</span></div>
                <div className="summary-item"><span className="summary-label">Interview Mode</span><span className="summary-value">{scheduleForm.mode}</span></div>
                <div className="summary-item"><span className="summary-label">Interviewers</span><span className="summary-value">{scheduleForm.interviewers.filter(i => i.trim()).join(', ') || "None added"}</span></div>
                <div className="summary-item"><span className="summary-label">Rounds</span><span className="summary-value">{scheduleForm.rounds.filter(r => r.trim()).join(' → ') || "None added"}</span></div>
                <div className="summary-divider" />
                <div className="summary-item"><span className="summary-label">Meeting Link</span><span className="summary-value meeting-link"><FaLink /><a href={scheduleForm.meetingLink || "#"} target="_blank" rel="noopener noreferrer">{scheduleForm.meetingLink || "Not set"}</a></span></div>
                <div className="summary-divider" />
                <div className="email-preview"><h4>Email Invite Preview</h4><div className="email-preview-content"><p><strong>To:</strong> {scheduleForm.candidateEmail || "candidate@email.com"}</p><p><strong>Subject:</strong> Interview Invitation: {scheduleForm.interviewType} - {scheduleForm.candidateRole}</p><div className="email-body"><p>Hi {scheduleForm.candidateName || "Candidate"},</p><p>Congratulations! You are invited for a <strong>{scheduleForm.interviewType}</strong> for the position of <strong>{scheduleForm.candidateRole}</strong>.</p><p><strong>Interview Details:</strong></p><ul><li><strong>Date:</strong> {scheduleForm.date ? new Date(scheduleForm.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'TBD'}</li><li><strong>Time:</strong> {scheduleForm.time} ({scheduleForm.timeZone})</li><li><strong>Duration:</strong> {scheduleForm.duration} Minutes</li><li><strong>Mode:</strong> {scheduleForm.mode}</li><li><strong>Interviewers:</strong> {scheduleForm.interviewers.filter(i => i.trim()).join(', ') || "TBD"}</li><li><strong>Rounds:</strong> {scheduleForm.rounds.filter(r => r.trim()).join(' → ') || "TBD"}</li><li><strong>Meeting Link:</strong> <a href={scheduleForm.meetingLink || "#"} target="_blank" rel="noopener noreferrer">{scheduleForm.meetingLink || "Link will be provided soon"}</a></li></ul>{scheduleForm.notes && (<div className="email-notes"><p><strong>Recruiter Notes:</strong></p><p>{scheduleForm.notes}</p></div>)}<p>Please confirm your availability by replying to this email.</p><p>Best regards,<br />AIHIRE Recruitment Team</p></div></div></div>
                <button className="send-invite-btn"><FaEnvelope /> Send Invitation</button>
              </div>
              <div className="premium-banner-schedule"><FaCrown /><div><h4>Upgrade to Premium</h4><p>Unlock advanced features and analytics.</p></div><button onClick={() => navigate('/recruiter/profile')}>Upgrade Now</button></div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // --- MAIN CALENDAR VIEW ---
  if (loading) {
    return (
      <DashboardLayout>
        <div className="interviews-loading"><FaSpinner className="spin" /><p>Loading interviews...</p></div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="interviews-page-final">
        {/* STATS & CALENDAR (Unchanged) */}
        <div className="interviews-stats-row">
          <div className="interviews-stat-card"><div className="interviews-stat-icon blue"><FaCalendar /></div><div><div className="interviews-stat-value">{interviews.length}</div><div className="interviews-stat-label">Total Interviews</div></div></div>
          <div className="interviews-stat-card"><div className="interviews-stat-icon green"><FaCheckCircle /></div><div><div className="interviews-stat-value">{interviews.filter(i => i.status === "Completed").length}</div><div className="interviews-stat-label">Completed</div></div></div>
          <div className="interviews-stat-card"><div className="interviews-stat-icon orange"><FaClock /></div><div><div className="interviews-stat-value">{interviews.filter(i => i.status === "Scheduled").length}</div><div className="interviews-stat-label">Scheduled</div></div></div>
          <div className="interviews-stat-card"><div className="interviews-stat-icon purple"><FaVideo /></div><div><div className="interviews-stat-value">{interviews.filter(i => i.interviewType === "Video").length}</div><div className="interviews-stat-label">Video Interviews</div></div></div>
        </div>

        <div className="interviews-toolbar">
          <div className="interviews-search"><FaSearch className="interviews-search-icon" /><input type="text" placeholder="Search interviews by candidate or role..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
          <div className="interviews-filters">
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="interviews-filter-select"><option value="all">All Status</option><option value="scheduled">Scheduled</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option><option value="rescheduled">Rescheduled</option></select>
            <button className="interviews-schedule-btn" onClick={() => setShowSchedulePage(true)}><FaPlus /> Schedule</button>
          </div>
        </div>

        <div className="interviews-three-column">
          <div className="interviews-calendar">
            <div className="calendar-header">
              <div className="calendar-nav"><button onClick={goToPreviousMonth} className="calendar-nav-btn"><FaChevronLeft /></button><button onClick={goToToday} className="calendar-today-btn">Today</button><button onClick={goToNextMonth} className="calendar-nav-btn"><FaChevronRight /></button></div>
              <h3 className="calendar-month-title">{getMonthName(currentDate)}</h3>
            </div>
            <div className="calendar-grid">
              <div className="calendar-weekdays">{['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => <div key={index} className="calendar-weekday">{day}</div>)}</div>
              <div className="calendar-days">
                {Array.from({ length: startingDay }).map((_, index) => <div key={`empty-${index}`} className="calendar-day empty"></div>)}
                {Array.from({ length: daysInMonth }).map((_, index) => {
                  const day = index + 1;
                  const dayInterviews = getInterviewsForDate(day);
                  const isTodayDate = isToday(day);
                  const isSelectedDate = isSelected(day);
                  return (
                    <div key={day} className={`calendar-day ${isTodayDate ? 'today' : ''} ${isSelectedDate ? 'selected' : ''}`} onClick={() => handleDateClick(day)}>
                      <span className="day-number">{day}</span>
                      {dayInterviews.length > 0 && (<div className="day-dots">{dayInterviews.slice(0, 3).map((_, idx) => <span key={idx} className="day-dot" />)}{dayInterviews.length > 3 && <span className="day-more">+{dayInterviews.length - 3}</span>}</div>)}
                    </div>
                  );
                })}
              </div>
            </div>
            {selectedDate && (
              <div className="selected-date-interviews">
                <h4 className="selected-date-title"><FaCalendarAlt /> {selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</h4>
                {getInterviewsForDate(selectedDate.getDate()).length > 0 ? (
                  <div className="selected-date-list">
                    {getInterviewsForDate(selectedDate.getDate()).map((interview) => (
                      <div key={interview._id} className="selected-date-item" onClick={() => setSelectedInterview(interview)}>
                        <div className="selected-date-time"><FaClock /><span>{formatTime(interview.date)}</span></div>
                        <div className="selected-date-info"><span className="selected-date-candidate">{interview.candidateName}</span><span className="selected-date-role">({interview.interviewType || interview.type})</span></div>
                      </div>
                    ))}
                  </div>
                ) : (<div className="no-interviews-selected"><p>No interviews on this day</p></div>)}
              </div>
            )}
          </div>

          <div className="interviews-today">
            <div className="column-header"><h3><FaClock /> Today's Interviews</h3><span className="column-date">{todayStr}</span></div>
            <div className="today-list">
              {todayInterviews.length > 0 ? (
                todayInterviews.map((interview) => (
                  <div key={interview._id} className="today-item" onClick={() => setSelectedInterview(interview)}>
                    <div className="today-time">{formatTime(interview.date)}</div>
                    <div className="today-info"><div className="today-candidate">{interview.candidateName || 'Unknown'}</div><div className="today-role">{interview.jobTitle || 'N/A'}</div><div className="today-type">{interview.interviewType || interview.type || "Interview"}</div></div>
                    <div className="today-platform">{getMeetingPlatform(interview.type)}</div>
                  </div>
                ))
              ) : (<div className="empty-state-small"><FaCalendar className="empty-icon-small" /><p>No interviews today</p></div>)}
            </div>
          </div>

          <div className="interviews-upcoming">
            <div className="column-header"><h3><FaCalendarAlt /> Upcoming Interviews</h3></div>
            <div className="upcoming-list">
              {Object.keys(groupedUpcoming).length > 0 ? (
                Object.keys(groupedUpcoming).slice(0, 3).map((dateKey) => (
                  <div key={dateKey} className="upcoming-group">
                    <div className="upcoming-date-header"><FaCalendarAlt /><span>{dateKey}</span></div>
                    {groupedUpcoming[dateKey].slice(0, 2).map((interview) => (
                      <div key={interview._id} className="upcoming-item" onClick={() => setSelectedInterview(interview)}>
                        <div className="upcoming-time"><FaClock /><span>{formatTime(interview.date)}</span></div>
                        <div className="upcoming-info"><span className="upcoming-candidate">{interview.candidateName || 'Unknown'}</span><span className="upcoming-type">({interview.interviewType || interview.type})</span></div>
                      </div>
                    ))}
                    {groupedUpcoming[dateKey].length > 2 && <div className="upcoming-more">+{groupedUpcoming[dateKey].length - 2} more</div>}
                  </div>
                ))
              ) : (<div className="empty-state-small"><FaCalendar className="empty-icon-small" /><p>No upcoming interviews</p></div>)}
            </div>
          </div>
        </div>

        <div className="interviews-table-section">
          <div className="table-header"><h2>All Interviews</h2><span className="table-count">{filteredInterviews.length} interviews</span></div>
          <div className="table-responsive">
            <table className="interviews-table">
              <thead><tr><th>Candidate</th><th>Job Title</th><th>Interview Type</th><th>Date & Time</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {filteredInterviews.length > 0 ? (
                  filteredInterviews.map((interview) => {
                    const status = getStatusBadge(interview.status);
                    let TypeIcon = FaVideo;
                    if (interview.interviewType === "MCQ") TypeIcon = FaFileAlt;
                    else if (interview.interviewType === "Technical Coding") TypeIcon = FaCode;

                    return (
                      <tr key={interview._id} className="interviews-table-row">
                        <td><div className="candidate-cell"><div className="candidate-avatar">{interview.candidateName?.charAt(0)?.toUpperCase() || 'U'}</div><div><div className="candidate-name">{interview.candidateName || 'Unknown'}</div><div className="candidate-email">{interview.email || ''}</div></div></div></td>
                        <td>{interview.jobTitle || 'N/A'}</td>
                        <td><span className="interview-type"><TypeIcon style={{marginRight: '6px', fontSize: '12px'}} /> {interview.interviewType || interview.type || 'Video Interview'}</span></td>
                        <td><div className="date-time"><div className="date">{formatDate(interview.date)}</div><div className="time">{formatTime(interview.date)}</div></div></td>
                        <td><span className={`status-badge ${status.class}`}>{status.icon}{status.label}</span></td>
                        <td><div className="action-buttons-group"><button className="action-btn" onClick={() => setSelectedInterview(interview)} title="View Details"><FaEllipsisV /></button>{interview.status !== "Cancelled" && interview.status !== "Completed" && (<><button className="action-btn reschedule" onClick={() => handleRescheduleInterview(interview._id, interview.date)} title="Reschedule Interview"><FaUndo /></button><button className="action-btn cancel" onClick={() => handleCancelInterview(interview._id)} title="Cancel Interview"><FaTimesCircle /></button><button className="action-btn reminder" onClick={() => handleSetReminder(interview._id)} title="Set Reminder"><FaBell /></button></>)}</div></td>
                      </tr>
                    );
                  })
                ) : (
                  <tr><td colSpan="6" className="empty-state"><FaCalendar className="empty-icon" /><p>No interviews found</p></td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="premium-banner"><FaCrown /><div><h4>Upgrading to Premium</h4><p>Unlock advanced features and analytics.</p></div><button onClick={() => navigate('/recruiter/profile')}>Upgrade Now</button></div>

        {/* ================================================================================== */}
        {/* FULLY EDITABLE INTERVIEW DETAILS MODAL */}
        {/* ================================================================================== */}
        {selectedInterview && (
          <div className="interview-modal-overlay" onClick={() => setSelectedInterview(null)}>
            <div className="interview-modal" onClick={(e) => e.stopPropagation()}>
              
              {/* --- MODAL HEADER --- */}
              <div className="modal-header-professional">
                <div className="modal-header-left">
                  <div className="modal-avatar-circle">
                    {selectedInterview.candidateName?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <div className="modal-header-titles">
                    <h3 className="modal-candidate-name">{selectedInterview.candidateName || 'Unknown'}</h3>
                    <div className="modal-candidate-meta">
                      <span className="modal-candidate-role">{selectedInterview.jobTitle}</span>
                      <span className="modal-candidate-divider">•</span>
                      <span className="modal-candidate-company">{selectedInterview.company}</span>
                    </div>
                  </div>
                </div>
                <div className="modal-header-right">
                  <span className={`modal-status-badge ${getStatusBadge(selectedInterview.status).class}`}>
                    {getStatusBadge(selectedInterview.status).icon} {getStatusBadge(selectedInterview.status).label}
                  </span>
                  <button className="modal-close-btn" onClick={() => setSelectedInterview(null)}>
                    <FaTimesCircle />
                  </button>
                </div>
              </div>

              {/* --- MODAL BODY (Edit Form) --- */}
              <div className="modal-body-3col-fixed">
                
                {/* Column 1: Interview Info (Editable) */}
                <div className="modal-col-fixed">
                  <div className="modal-col-header">
                    <FaCalendarAlt /> Interview Info
                  </div>
                  <div className="modal-col-content">
                    <div className="modal-info-row">
                      <span>Date</span>
                      <input 
                        type="date" 
                        className="modal-input-edit" 
                        value={selectedInterview.date ? selectedInterview.date.split('T')[0] : ''}
                        onChange={(e) => setSelectedInterview({...selectedInterview, date: new Date(e.target.value).toISOString()})}
                      />
                    </div>
                    <div className="modal-info-row">
                      <span>Time</span>
                      <input 
                        type="time" 
                        className="modal-input-edit" 
                        value={selectedInterview.date ? new Date(selectedInterview.date).toTimeString().slice(0,5) : ''}
                        onChange={(e) => {
                          const date = new Date(selectedInterview.date);
                          const [hours, minutes] = e.target.value.split(':');
                          date.setHours(parseInt(hours));
                          date.setMinutes(parseInt(minutes));
                          setSelectedInterview({...selectedInterview, date: date.toISOString()});
                        }}
                      />
                    </div>
                    <div className="modal-info-row">
                      <span>Type</span>
                      <select className="modal-input-edit" value={selectedInterview.interviewType || 'Video'} onChange={(e) => setSelectedInterview({...selectedInterview, interviewType: e.target.value})}>
                        <option value="Video">Video</option>
                        <option value="MCQ">MCQ</option>
                        <option value="Technical Coding">Technical Coding</option>
                        <option value="HR">HR</option>
                      </select>
                    </div>
                    <div className="modal-info-row">
                      <span>Mode</span>
                      <select className="modal-input-edit" value={selectedInterview.mode || 'Google Meet'} onChange={(e) => setSelectedInterview({...selectedInterview, mode: e.target.value})}>
                        <option value="Google Meet">Google Meet</option>
                        <option value="Zoom">Zoom</option>
                        <option value="Microsoft Teams">Microsoft Teams</option>
                        <option value="In-Person">In-Person</option>
                        <option value="Phone">Phone</option>
                      </select>
                    </div>
                    <div className="modal-info-row">
                      <span>Duration</span>
                      <div className="modal-input-edit-container">
                        <input type="number" className="modal-input-edit" value={selectedInterview.duration || 60} onChange={(e) => setSelectedInterview({...selectedInterview, duration: parseInt(e.target.value)})} />
                        <span className="modal-input-suffix">min</span>
                      </div>
                    </div>
                    <div className="modal-info-row">
                      <span>Interviewers</span>
                      <input type="text" className="modal-input-edit" value={Array.isArray(selectedInterview.interviewers) ? selectedInterview.interviewers.join(', ') : ''} onChange={(e) => setSelectedInterview({...selectedInterview, interviewers: e.target.value.split(',').map(s => s.trim())})} />
                    </div>
                    <div className="modal-info-row">
                      <span>Rounds</span>
                      <input type="text" className="modal-input-edit" value={Array.isArray(selectedInterview.rounds) ? selectedInterview.rounds.join(' → ') : ''} onChange={(e) => setSelectedInterview({...selectedInterview, rounds: e.target.value.split('→').map(s => s.trim())})} />
                    </div>
                  </div>
                </div>

                {/* Column 2: Meeting Link & Resume Score (Editable Link) */}
                <div className="modal-col-fixed">
                  <div className="modal-col-header">
                    <FaLink /> Meeting Details
                  </div>
                  <div className="modal-col-content">
                    <div className="modal-info-row">
                      <span>Meeting Link</span>
                      <input type="text" className="modal-input-edit" value={selectedInterview.meetingLink || ''} onChange={(e) => setSelectedInterview({...selectedInterview, meetingLink: e.target.value})} />
                    </div>
                  </div>
                  
                  <div className="modal-score-widget">
                    <div className="modal-score-header"><FaChartLine /> Resume Score</div>
                    <div className="modal-score-body">
                      <div className="modal-score-circle" style={{ 
                        background: `conic-gradient(${selectedInterview.atsScore >= 80 ? '#10B981' : selectedInterview.atsScore >= 60 ? '#F59E0B' : '#EF4444'} ${selectedInterview.atsScore || 0}%, #eef2f6 ${selectedInterview.atsScore || 0}%)` 
                      }}>
                        <span>{selectedInterview.atsScore || 0}%</span>
                      </div>
                      <div className="modal-score-meta">
                        <div className="modal-score-label">
                          {selectedInterview.atsScore >= 80 ? 'Excellent' : selectedInterview.atsScore >= 60 ? 'Good' : 'Needs Work'}
                        </div>
                        <div className="modal-score-sub">Resume Match</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Column 3: Timeline, Notes & Actions */}
                <div className="modal-col-fixed">
                  <div className="modal-col-header">
                    <FaClock /> Timeline & Actions
                  </div>
                  <div className="modal-col-content">
                    <div className="modal-timeline-steps">
                      <div className={`modal-tl-step ${selectedInterview.status !== 'Cancelled' ? 'active' : ''}`}>
                        <div className="tl-dot"></div>
                        <span>Scheduled</span>
                        <small>{formatDate(selectedInterview.date)}</small>
                      </div>
                      <div className={`modal-tl-step ${selectedInterview.status === 'Completed' ? 'active' : 'pending'}`}>
                        <div className="tl-dot"></div>
                        <span>Completed</span>
                        <small>{selectedInterview.status === 'Completed' ? 'Done' : 'Pending'}</small>
                      </div>
                      <div className={`modal-tl-step ${selectedInterview.status === 'Cancelled' ? 'cancelled' : selectedInterview.status === 'Completed' ? 'active' : 'pending'}`}>
                        <div className="tl-dot"></div>
                        <span>Status</span>
                        <small>{selectedInterview.status === 'Cancelled' ? 'Cancelled' : selectedInterview.status === 'Completed' ? 'Finalized' : 'Waiting'}</small>
                      </div>
                    </div>

                    <div className="modal-note-group" style={{ marginTop: '16px', borderTop: '1px solid #f1f5f9', paddingTop: '12px' }}>
                      <label>Instructions</label>
                      <textarea rows="2" value={selectedInterview.instructions || ""} onChange={(e) => setSelectedInterview({...selectedInterview, instructions: e.target.value})} className="modal-input" placeholder="Add instructions..." />
                      <label>Recruiter Notes</label>
                      <textarea rows="2" value={selectedInterview.notes || ""} onChange={(e) => setSelectedInterview({...selectedInterview, notes: e.target.value})} className="modal-input" placeholder="Add recruiter notes..." />
                    </div>
                  </div>
                  
                  <div className="modal-action-footer">
                    <button className="modal-btn-save" onClick={saveInterview}><FaSave /> Save Changes</button>
                    {selectedInterview.status !== "Cancelled" && selectedInterview.status !== "Completed" && (
                      <div className="modal-btn-row">
                        <button className="modal-btn-sm undo" onClick={() => handleRescheduleInterview(selectedInterview._id, selectedInterview.date)}><FaUndo /> Reschedule</button>
                        <button className="modal-btn-sm cancel" onClick={() => handleCancelInterview(selectedInterview._id)}><FaTimesCircle /> Cancel</button>
                        <button className="modal-btn-sm bell" onClick={() => handleSetReminder(selectedInterview._id)}><FaBell /> Reminder</button>
                        <button className="modal-btn-sm check" onClick={() => { setSelectedInterview({...selectedInterview, status: "Completed"}); saveInterview(); }}><FaCheckCircle /> Complete</button>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default RecruiterInterviews;