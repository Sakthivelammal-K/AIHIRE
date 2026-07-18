import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import { useEffect, useState } from "react";
import API from "../../../api/api";

import {
  FaChartLine,
  FaUsers,
  FaUserCheck,
  FaClock,
  FaBriefcase,
  FaCalendarAlt,
  FaSearch,
  FaDownload,
  FaBrain,
  FaComments,
  FaSignal,
  FaSpinner,
  FaBuilding,
  FaUser,
  FaFileAlt,
  FaTrophy,
  FaMedal
} from "react-icons/fa";

// 🟢 Import Recharts components
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area
} from "recharts";

function Reports() {
  const [loading, setLoading] = useState(true);
  
  // --- Data States ---
  const [allApplications, setAllApplications] = useState([]);
  const [allJobs, setAllJobs] = useState([]);
  const [allInterviewResults, setAllInterviewResults] = useState([]);
  
  // --- UI States ---
  const [activeTab, setActiveTab] = useState("Overview");
  const [search, setSearch] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [selectedInterview, setSelectedInterview] = useState(null);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Applications (For Candidates)
      const appRes = await API.get("/applications/");
      const apps = Array.isArray(appRes.data) ? appRes.data : [];
      setAllApplications(apps);

      // 2. Fetch Jobs
      const jobRes = await API.get("/jobs/");
      const jobs = Array.isArray(jobRes.data) ? jobRes.data : [];
      setAllJobs(jobs);

      // 3. Fetch AI Interview Results
      const res = await API.get("/interviews/results");
      const interviews = Array.isArray(res.data) ? res.data : [];
      setAllInterviewResults(interviews);

      // Default selections
      if (jobs.length > 0) setSelectedJob(jobs[0]);
      if (apps.length > 0) setSelectedCandidate(apps[0]);
      if (interviews.length > 0) setSelectedInterview(interviews[0]);
      
    } catch (err) {
      console.log("Error loading reports data:", err);
    } finally {
      setLoading(false);
    }
  };

  // --- SMART FILTERING PER TAB ---
  const getFilteredJobs = () => {
    const searchLower = search.toLowerCase();
    return allJobs.filter(job => 
      (job.title || "").toLowerCase().includes(searchLower)
    );
  };
  const filteredJobs = getFilteredJobs();

  const getFilteredCandidates = () => {
    const searchLower = search.toLowerCase();
    return allApplications.filter(app => 
      (app.candidateName || "").toLowerCase().includes(searchLower) ||
      (app.jobTitle || "").toLowerCase().includes(searchLower)
    );
  };
  const filteredCandidates = getFilteredCandidates();

  const getFilteredInterviews = () => {
    const searchLower = search.toLowerCase();
    return allInterviewResults.filter(item => 
      (item.candidateName || "").toLowerCase().includes(searchLower) ||
      (item.jobTitle || "").toLowerCase().includes(searchLower)
    );
  };
  const filteredInterviews = getFilteredInterviews();

  // --- GLOBAL STATS ---
  const stats = {
    activeJobs: allJobs.filter(j => j.status === 'Active').length,
    totalCandidates: allApplications.length,
    hired: allApplications.filter(a => a.status === 'Hired' || a.status === 'Selected').length,
    upcomingInterviews: allApplications.filter(a => a.status === 'Interview' || a.status === 'Scheduled').length
  };

  // --- CHART DATA GENERATORS ---

  // 1. Funnel Data (Pipeline)
  const funnelData = [
    { name: 'Applied', value: allApplications.length, fill: '#f97316' },
    { name: 'Interviewing', value: allApplications.filter(a => a.status === 'Interview').length, fill: '#8b5cf6' },
    { name: 'Shortlisted', value: allApplications.filter(a => a.status === 'Shortlisted').length, fill: '#3b82f6' },
    { name: 'Hired', value: stats.hired, fill: '#10b981' }
  ];

  // 2. Trend Data (Last 7 days - Simulated since we don't have a daily analytics API yet)
  const getLast7Days = () => {
    const dates = [];
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      // Filter applications for that day
      const dayApps = allApplications.filter(app => {
        if (!app.createdAt) return false;
        const appDate = new Date(app.createdAt);
        return appDate.toDateString() === d.toDateString();
      });
      dates.push({
        date: d.toLocaleDateString('en-US', { weekday: 'short' }),
        applications: dayApps.length
      });
    }
    return dates;
  };
  const trendData = getLast7Days();

  // --- HELPERS ---
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getDecisionClass = (decision) => {
    if (!decision) return 'pending';
    return decision.toLowerCase();
  };

  // ==========================================
  // RENDER HELPERS
  // ==========================================

  const renderOverview = () => (
    <div className="reports-detail-view">
      <div className="report-detail-header">
        <div>
          <h3>Recruiter Overview</h3>
          <div className="report-detail-meta">
            <span><FaCalendarAlt /> {new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* 🟢 Visual Charts Grid */}
      <div className="reports-chart-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
        
        {/* 1. Pipeline Funnel (Horizontal Bar Chart) */}
        <div className="reports-chart-box">
          <h4><FaUsers /> Pipeline Funnel</h4>
          <div style={{ height: '220px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={funnelData}
                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="value" radius={[0, 8, 8, 0]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Weekly Trend (Area Chart) */}
        <div className="reports-chart-box">
          <h4><FaChartLine /> Weekly Trend</h4>
          <div style={{ height: '220px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorApps" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="applications" stroke="#f97316" fillOpacity={1} fill="url(#colorApps)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );

  // 2. RENDER JOBS TAB
  const renderJobsTab = () => (
    <div className="reports-main-layout">
      <div className="reports-list-sidebar">
        <div className="reports-list-search">
          <div className="search-wrapper">
            <FaSearch className="search-icon" />
            <input type="text" placeholder="Search jobs..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="reports-list-items">
          {filteredJobs.length > 0 ? (
            filteredJobs.map(job => (
              <div key={job._id} className={`report-list-item ${selectedJob?._id === job._id ? "active" : ""}`} onClick={() => setSelectedJob(job)}>
                <div className="report-list-avatar"><FaBriefcase /></div>
                <div className="report-list-info">
                  <h4>{job.title}</h4>
                  <p>{job.department} • {job.applicationsCount || 0} Applicants</p>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state-small">No jobs found.</div>
          )}
        </div>
      </div>

      <div className="reports-detail-view">
        {selectedJob ? (
          <div className="reports-chart-box" style={{ padding: '30px' }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '22px' }}>{selectedJob.title}</h3>
            <p style={{ color: '#6b7280', marginBottom: '20px' }}>{selectedJob.department} • {selectedJob.location}</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
              <div className="data-summary-item"><span>Status</span><span>{selectedJob.status}</span></div>
              <div className="data-summary-item"><span>Applications</span><span>{selectedJob.applicationsCount || 0}</span></div>
              <div className="data-summary-item"><span>Employment Type</span><span>{selectedJob.employmentType}</span></div>
              <div className="data-summary-item"><span>Work Mode</span><span>{selectedJob.workMode}</span></div>
            </div>
          </div>
        ) : (
          <div className="empty-state"><FaBuilding className="empty-state-icon" /><span>Select a job to view details</span></div>
        )}
      </div>
    </div>
  );

  // 3. RENDER CANDIDATES TAB
  const renderCandidatesTab = () => (
    <div className="reports-main-layout">
      <div className="reports-list-sidebar">
        <div className="reports-list-search">
          <div className="search-wrapper">
            <FaSearch className="search-icon" />
            <input type="text" placeholder="Search candidates..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="reports-list-items">
          {filteredCandidates.length > 0 ? (
            filteredCandidates.map(cand => (
              <div key={cand._id} className={`report-list-item ${selectedCandidate?._id === cand._id ? "active" : ""}`} onClick={() => setSelectedCandidate(cand)}>
                <div className="report-list-avatar">{(cand.candidateName || "U").charAt(0)}</div>
                <div className="report-list-info">
                  <h4>{cand.candidateName}</h4>
                  <p>{cand.jobTitle} • {cand.status}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state-small">No candidates found.</div>
          )}
        </div>
      </div>

      <div className="reports-detail-view">
        {selectedCandidate ? (
          <div className="reports-chart-box" style={{ padding: '30px' }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '22px' }}>{selectedCandidate.candidateName}</h3>
            <p style={{ color: '#6b7280', marginBottom: '20px' }}>{selectedCandidate.jobTitle}</p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
              <div className="data-summary-item"><span>Email</span><span>{selectedCandidate.email}</span></div>
              <div className="data-summary-item"><span>Status</span><span>{selectedCandidate.status}</span></div>
              <div className="data-summary-item"><span>Applied On</span><span>{formatDate(selectedCandidate.createdAt)}</span></div>
              <div className="data-summary-item"><span>ATS Score</span><span>N/A</span></div>
            </div>
          </div>
        ) : (
          <div className="empty-state"><FaUser className="empty-state-icon" /><span>Select a candidate to view details</span></div>
        )}
      </div>
    </div>
  );

  // 4. RENDER INTERVIEWS TAB
  const renderInterviewsTab = () => (
    <div className="reports-main-layout">
      <div className="reports-list-sidebar">
        <div className="reports-list-search">
          <div className="search-wrapper">
            <FaSearch className="search-icon" />
            <input type="text" placeholder="Search interview reports..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="reports-list-items">
          {filteredInterviews.length > 0 ? (
            filteredInterviews.map(item => (
              <div key={item._id} className={`report-list-item ${selectedInterview?._id === item._id ? "active" : ""}`} onClick={() => setSelectedInterview(item)}>
                <div className="report-list-avatar">{(item.candidateName || "U").charAt(0)}</div>
                <div className="report-list-info">
                  <h4>{item.candidateName}</h4>
                  <p>{item.jobTitle} • Score {item.overall || item.score || 0}%</p>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state-small">No interview results found.</div>
          )}
        </div>
      </div>

      <div className="reports-detail-view">
        {selectedInterview ? (
          <>
            <div className="report-detail-header">
              <div>
                <h3>{selectedInterview.candidateName}</h3>
                <div className="report-detail-meta">
                  <span><FaBriefcase /> {selectedInterview.jobTitle}</span>
                  <span>•</span>
                  <span><FaCalendarAlt /> {formatDate(selectedInterview.date || selectedInterview.createdAt)}</span>
                </div>
              </div>
              <button className="report-detail-print"><FaDownload /> Download Report</button>
            </div>

            <div className="reports-chart-grid">
              <div className="reports-chart-box">
                <h4>AI Performance Metrics</h4>
                <div className="metric-bar-group">
                  {[
                    { label: 'Technical', icon: <FaBrain />, value: selectedInterview.technical || 0 },
                    { label: 'Communication', icon: <FaComments />, value: selectedInterview.communication || 0 },
                    { label: 'Confidence', icon: <FaSignal />, value: selectedInterview.confidence || 0 }
                  ].map((metric, idx) => (
                    <div className="metric-bar-item" key={idx}>
                      <div className="metric-bar-header">
                        <span>{metric.icon} {metric.label}</span>
                        <span>{metric.value}%</span>
                      </div>
                      <div className="metric-bar-track">
                        <div className="metric-bar-fill" style={{ width: `${metric.value}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="reports-chart-box">
                <h4>Decision Summary</h4>
                <div className="data-summary-list">
                  <div className="data-summary-item"><span>Overall Score</span><span>{selectedInterview.overall || selectedInterview.score || 0}%</span></div>
                  <div className="data-summary-item"><span>AI Verdict</span><span>{selectedInterview.verdict || "Pending"}</span></div>
                  <div className="data-summary-item"><span>Recruiter Decision</span><span className={`decision-badge ${getDecisionClass(selectedInterview.finalDecision)}`}>{selectedInterview.finalDecision || "Pending"}</span></div>
                  <div className="data-summary-item"><span>Recruiter Rating</span><span>{selectedInterview.recruiterRating || 0} / 5</span></div>
                </div>
              </div>
            </div>

            <div className="reports-bottom-grid">
              <div className="reports-chart-box">
                <h4>Qualitative Feedback</h4>
                <div className="feedback-section">
                  <h5 className="strength-title">Strengths</h5>
                  <div className="chip-container">
                    {selectedInterview.strengths?.length > 0 ? selectedInterview.strengths.map((s, i) => <span key={i} className="chip strength">{s}</span>) : <span className="empty-text">No strengths listed</span>}
                  </div>
                </div>
                <div className="feedback-section">
                  <h5 className="weakness-title">Improvement Areas</h5>
                  <div className="chip-container">
                    {selectedInterview.improvements?.length > 0 ? selectedInterview.improvements.map((s, i) => <span key={i} className="chip weakness">{s}</span>) : <span className="empty-text">No improvement areas listed</span>}
                  </div>
                </div>
              </div>

              <div className="reports-chart-box">
                <h4>AI Summary</h4>
                <div className="ai-summary-box">
                  <p>{selectedInterview.aiSummary || `The AI evaluated the candidate based on the interview responses. Technical score was ${selectedInterview.technical || 0}% and communication was ${selectedInterview.communication || 0}%.`}</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="empty-state"><FaFileAlt className="empty-state-icon" /><span>Select an interview report to view details</span></div>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <DashboardLayout>
        <div className="reports-page">
          <div className="empty-state"><FaSpinner className="spin" /><p>Loading reports...</p></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="reports-page">
        
        {/* TABS */}
        <div className="reports-tabs">
          {['Overview', 'Jobs', 'Candidates', 'Interviews'].map(tab => (
            <span 
              key={tab}
              className={activeTab === tab ? "active" : ""} 
              onClick={() => { setActiveTab(tab); setSearch(""); }}
            >
              {tab}
            </span>
          ))}
        </div>

        {/* STATS ROW */}
        <div className="reports-stats-row">
          <div className="stat-card">
            <div className="stat-icon-wrapper orange"><FaBriefcase /></div>
            <div className="stat-info"><div className="stat-number">{stats.activeJobs}</div><div className="stat-title">Active Jobs</div></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon-wrapper green"><FaUsers /></div>
            <div className="stat-info"><div className="stat-number">{stats.totalCandidates}</div><div className="stat-title">Total Candidates</div></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon-wrapper purple"><FaUserCheck /></div>
            <div className="stat-info"><div className="stat-number">{stats.hired}</div><div className="stat-title">Hired</div></div>
          </div>
          <div className="stat-card">
            <div className="stat-icon-wrapper blue"><FaClock /></div>
            <div className="stat-info"><div className="stat-number">{stats.upcomingInterviews}</div><div className="stat-title">Upcoming Interviews</div></div>
          </div>
        </div>

        {/* DYNAMIC TAB CONTENT */}
        {activeTab === "Overview" && renderOverview()}
        {activeTab === "Jobs" && renderJobsTab()}
        {activeTab === "Candidates" && renderCandidatesTab()}
        {activeTab === "Interviews" && renderInterviewsTab()}

      </div>
    </DashboardLayout>
  );
}

export default Reports;