import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import { useEffect, useState } from "react";
import API from "../../../api/api";

import {
  FaChartLine,
  FaSearch,
  FaUser,
  FaBriefcase,
  FaBrain,
  FaComments,
  FaSignal,
  FaCheckCircle,
  FaFilePdf,
  FaStar,
  FaExclamationCircle
} from "react-icons/fa";

function Reports() {

  const [results, setResults] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {

      const res = await API.get("/interviews/results");

      const data = Array.isArray(res.data)
        ? res.data
        : [];

      setResults(data);

      if (data.length) {
        setSelectedReport(data[0]);
      }

    } catch (err) {
      console.log(err);
    }
  };

  const filteredReports = results.filter(report =>
    (report.candidateName || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (

    <DashboardLayout>

      {/* Banner */}

      <div className="reports-banner">

        <div>

          <h2>AI Interview Reports</h2>

          <p>
            AI generated evaluation reports for every interview.
          </p>

        </div>

        <FaChartLine className="reports-banner-icon"/>

      </div>


      {/* Search */}

<div className="report-layout">

    {/* LEFT SIDEBAR */}

    <div className="report-sidebar">

        <div className="report-search">

            <input
                type="text"
                placeholder="Search candidate..."
                value={search}
                onChange={(e)=>setSearch(e.target.value)}
            />

        </div>

        <div className="report-list">

            {

                filteredReports.map(report=>(

                    <div
                        key={report._id}
                        className={`report-item ${
                            selectedReport?._id===report._id
                            ? "active"
                            : ""
                        }`}
                        onClick={()=>setSelectedReport(report)}
                    >

                        <div className="report-avatar">

                            {report.candidateName?.charAt(0)}

                        </div>

                        <div className="report-info">

                            <h4>{report.candidateName}</h4>

                            <p>{report.jobTitle}</p>

                        </div>

                    </div>

                ))

            }

        </div>

    </div>


    {/* RIGHT REPORT */}

    {

        selectedReport && (

            <div className="report-view">

<div className="report-header">

    <div>

        <h3>Interview Report</h3>

        <p>
            AI generated candidate evaluation report
        </p>

    </div>


</div>


<div className="report-profile">

    <div className="report-avatar-large">

        {selectedReport.candidateName?.charAt(0)}

    </div>


    <div className="profile-info">

        <h2>{selectedReport.candidateName}</h2>

        <p>
            <FaBriefcase />
            {" "}
            {selectedReport.jobTitle}
        </p>

        <p>
            <FaUser />
            {" "}
            {selectedReport.email || "Email not available"}
        </p>

    </div>


    <div className="overall-score-card">

        <span>Overall Score</span>

        <h1>
            {selectedReport.overall || selectedReport.score || 0}%
        </h1>

        <small>

            {
                (selectedReport.overall || selectedReport.score || 0) >= 85

                ? "Excellent Candidate"

                : (selectedReport.overall || selectedReport.score || 0) >= 70

                ? "Good Candidate"

                : (selectedReport.overall || selectedReport.score || 0) >= 50

                ? "Average Candidate"

                : "Needs Improvement"

            }

        </small>

    </div>

</div>


<div className="candidate-summary-grid">

    <div className="summary-card">

        <label>AI Recommendation</label>

        <h3>{selectedReport.verdict || "Pending"}</h3>

    </div>

    <div className="summary-card">

        <label>Recruiter Decision</label>

        <h3>{selectedReport.finalDecision || "Pending"}</h3>

    </div>

    <div className="summary-card">

        <label>Recruiter Rating</label>

        <h3>

            {selectedReport.recruiterRating || 0}

            /5

        </h3>

    </div>

    <div className="summary-card">

        <label>Status</label>

        <h3>

            {selectedReport.finalDecision || "Under Review"}

        </h3>

    </div>

</div>


<div className="report-metrics">

    <div className="metric-card">

        <FaBrain />

        <h4>Technical</h4>

        <h2>{selectedReport.technical}%</h2>

        <progress
            value={selectedReport.technical}
            max="100"
        />

    </div>

    <div className="metric-card">

        <FaComments />

        <h4>Communication</h4>

        <h2>{selectedReport.communication}%</h2>

        <progress
            value={selectedReport.communication}
            max="100"
        />

    </div>

    <div className="metric-card">

        <FaSignal />

        <h4>Confidence</h4>

        <h2>{selectedReport.confidence}%</h2>

        <progress
            value={selectedReport.confidence}
            max="100"
        />

    </div>

</div>


<div className="report-verdict">

    <div>

        <FaCheckCircle />

        <div>

            <h3>AI Recommendation</h3>

            <p>

                Based on the interview performance,
                the AI recommends this candidate for the

                <strong> {selectedReport.verdict} </strong>

                stage.

            </p>

        </div>

    </div>

    <span className="verdict-badge">

        {selectedReport.verdict}

    </span>

</div>

<div className="ai-summary">

    <h3>AI Summary</h3>

    <p>

        The candidate demonstrated strong technical
        knowledge, clear communication and confident
        responses throughout the interview. Overall,
        the AI recommends proceeding to the next stage
        of recruitment.

    </p>

</div>

<div className="feedback-grid">

    <div className="feedback-card">

        <h3>

            <FaStar />

            Strengths

        </h3>

        <div className="chips">

            {

                selectedReport.strengths?.map((item,index)=>(

                    <span
                        key={index}
                        className="strength-chip"
                    >

                        {item}

                    </span>

                ))

            }

        </div>

    </div>

    <div className="feedback-card">

        <h3>

            <FaExclamationCircle />

            Areas for Improvement

        </h3>

        <div className="chips">

            {

                selectedReport.improvements?.map((item,index)=>(

                    <span
                        key={index}
                        className="improvement-chip"
                    >

                        {item}

                    </span>

                ))

            }

        </div>

    </div>

</div>

<div className="interview-details">

    <h3>Interview Details</h3>

    <div className="details-grid">

        <div>

            <label>Interview Type</label>

            <h4>AI Video Interview</h4>

        </div>

        <div>

            <label>Date</label>

            <h4>

                {selectedReport.date || ""}

            </h4>

        </div>

        <div>

            <label>Questions Answered</label>

            <h4>10 / 10</h4>

        </div>

        <div>

            <label>Duration</label>

            <h4>25 Minutes</h4>

        </div>

    </div>

</div>

            </div>

        )

    }

</div>

    </DashboardLayout>

  );

}

export default Reports;