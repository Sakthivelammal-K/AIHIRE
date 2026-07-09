import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import { useEffect, useState } from "react";
import API from "../../../api/api";

import {
  FaChartLine,
  FaUsers,
  FaCheckCircle,
  FaUserCheck,
  FaClock,
  FaStar,
  FaSearch,
  FaDownload,
  FaArrowUp,
  FaArrowDown,
  FaBriefcase,
  FaCalendarAlt,
  FaBrain,
  FaComments,
  FaSignal,
  FaSpinner,
  FaBuilding
} from "react-icons/fa";

function Reports() {
  const [results, setResults] = useState([]);
  const [selectedView, setSelectedView] = useState(null); // Renamed to handle both Candidates and Jobs
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Tab State
  const [activeTab, setActiveTab] = useState("Overview");

  // Fetch Interview Results from API
  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setLoading(true);
    try {
      const res = await API.get("/interviews/results");
      const data = Array.isArray(res.data) ? res.data : [];
      setResults(data);
      
      // Handle initial selection
      if (data.length) {
        setSelectedView(data[0]);
      }
    } catch (err) {
      console.log("Error loading reports:", err);
    } finally {
      setLoading(false);
    }
  };

  // --- SMART FILTERING LOGIC ---
  const getFilteredItems = () => {
    const searchLower = search.toLowerCase();
    const searchMatch = (item) => {
      const name = (item.candidateName || "").toLowerCase();
      const title = (item.jobTitle || "").toLowerCase();
      return name.includes(searchLower) || title.includes(searchLower);
    };

    let tabFiltered = results;

    if (activeTab === "Jobs") {
      // Jobs Tab: Show Unique Job Titles
      const seenJobs = new Set();
      tabFiltered = results.filter(report => {
        if (!report.jobTitle) return false;
        const key = report.jobTitle.toLowerCase().trim();
        if (seenJobs.has(key)) return false;
        seenJobs.add(key);
        return true;
      });
    } 
    else if (activeTab === "Candidates") {
      // Candidates Tab: Show Unique Candidate Names
      const seenCandidates = new Set();
      tabFiltered = results.filter(report => {
        if (!report.candidateName) return false;
        const key = report.candidateName.toLowerCase().trim();
        if (seenCandidates.has(key)) return false;
        seenCandidates.add(key);
        return true;
      });
    } 
    else {
      // Overview & Interviews: Show all individual instances
      tabFiltered = results;
    }

    return tabFiltered.filter(searchMatch);
  };

  const filteredItems = getFilteredItems();

  // --- CALCULATE REAL STATS FROM DATA ---
  const stats = {
    totalApplications: results.length,
    hired: results.filter(r => r.finalDecision?.toLowerCase() === 'hired').length,
    interviews: results.length,
    offers: results.filter(r => r.finalDecision?.toLowerCase() === 'offer' || r.finalDecision?.toLowerCase() === 'offered').length,
    avgTimeToHire: results.length > 0 
      ? Math.round(results.reduce((acc, curr) => acc + (curr.overall || curr.score || 0), 0) / results.length) 
      : 0
  };

  // Helpers for formatting
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getDecisionClass = (decision) => {
    if (!decision) return 'pending';
    return decision.toLowerCase();
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="reports-page">
          <div className="empty-state">
            <FaSpinner className="spin" style={{ color: '#e67e22', marginBottom: '10px', fontSize: '30px' }} />
            <span>Loading reports...</span>
          </div>
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
              onClick={() => {
                setActiveTab(tab);
                // Clear selection when switching tabs to avoid data mismatch
                setSelectedView(null); 
                // Auto-select the first item in the new filtered list
                const newList = getFilteredItems();
                if (newList.length > 0) setSelectedView(newList[0]);
              }}
            >
              {tab}
            </span>
          ))}
        </div>

        {/* STATS ROW */}
        <div className="reports-stats-row">
          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-title">Total Applications</span>
              <div className="stat-icon"><FaUsers /></div>
            </div>
            <div className="stat-number">{stats.totalApplications}</div>
            <div className="stat-trend"><FaArrowUp /> From database</div>
          </div>
          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-title">Hired</span>
              <div className="stat-icon"><FaCheckCircle /></div>
            </div>
            <div className="stat-number">{stats.hired}</div>
            <div className="stat-trend"><FaArrowUp /> From database</div>
          </div>
          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-title">Interviews</span>
              <div className="stat-icon"><FaUserCheck /></div>
            </div>
            <div className="stat-number">{stats.interviews}</div>
            <div className="stat-trend"><FaArrowUp /> From database</div>
          </div>
          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-title">Offers</span>
              <div className="stat-icon"><FaStar /></div>
            </div>
            <div className="stat-number">{stats.offers}</div>
            <div className="stat-trend"><FaArrowUp /> From database</div>
          </div>
          <div className="stat-card">
            <div className="stat-header">
              <span className="stat-title">Avg. Score</span>
              <div className="stat-icon"><FaClock /></div>
            </div>
            <div className="stat-number">{stats.avgTimeToHire}%</div>
            <div className="stat-trend down"><FaArrowDown /> Average score</div>
          </div>
        </div>

        {/* MAIN LAYOUT */}
        <div className="reports-main-layout">
          
          {/* LEFT SIDEBAR LIST */}
          <div className="reports-list-sidebar">
            <div className="reports-list-search">
              <input 
                type="text" 
                placeholder={`Search ${activeTab === 'Overview' || activeTab === 'Interviews' ? 'candidates...' : activeTab === 'Jobs' ? 'jobs...' : 'candidates...'}`} 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
              />
            </div>
            <div className="reports-list-items">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <div
                    key={item._id}
                    className={`report-list-item ${selectedView?._id === item._id ? "active" : ""}`}
                    onClick={() => setSelectedView(item)}
                  >
                    <div className="report-list-avatar">
                      {/* If Jobs tab, use first letter of Job Title. If not, use Candidate initial */}
                      {activeTab === "Jobs" 
                        ? (item.jobTitle?.charAt(0) || "J") 
                        : (item.candidateName?.charAt(0) || "?")}
                    </div>
                    <div className="report-list-info">
                      <h4>
                        {activeTab === "Jobs" ? (item.jobTitle || "Unnamed Job") : (item.candidateName || "Unknown")}
                      </h4>
                      <p>
                        {activeTab === "Jobs" 
                          ? `${item.candidateName || "No candidate"} • Score ${item.overall || item.score || 0}%` 
                          : `${item.jobTitle || 'N/A'} • Score ${item.overall || item.score || 0}%`}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ padding: '20px', textAlign: 'center', color: '#718096' }}>
                  No {activeTab.toLowerCase()} found matching your search.
                </div>
              )}
            </div>
          </div>

          {/* RIGHT DETAIL VIEW */}
          <div className="reports-detail-view">
            {selectedView ? (
              <>
                {/* Header */}
                <div className="report-detail-header">
                  <div>
                    <h3>
                      {activeTab === "Jobs" ? selectedView.jobTitle : selectedView.candidateName}
                    </h3>
                    <div style={{ display: 'flex', gap: '10px', fontSize: '13px', color: '#718096', marginTop: '4px' }}>
                      {activeTab === "Jobs" ? (
                        <>
                          <span><FaUsers style={{marginRight: '4px'}}/>{selectedView.candidateName || 'No candidates yet'}</span>
                        </>
                      ) : (
                        <>
                          <span><FaBriefcase style={{marginRight: '4px'}}/>{selectedView.jobTitle}</span>
                          <span>•</span>
                          <span><FaCalendarAlt style={{marginRight: '4px'}}/>{formatDate(selectedView.date || selectedView.createdAt)}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <span className="report-detail-print"><FaDownload /> Download Report</span>
                </div>

                {/* Metrics & Summary - Only show these details if it's a Candidate/Interview report */}
                {activeTab !== "Jobs" && (
                  <>
                  <div className="reports-chart-grid">
                    <div className="reports-chart-box">
                      <h4>AI Performance Metrics</h4>
                      <div className="metric-bar-group">
                        <div className="metric-bar-item">
                          <div className="metric-bar-header">
                            <span><FaBrain /> Technical</span>
                            <span>{selectedView.technical || 0}%</span>
                          </div>
                          <div className="metric-bar-track">
                            <div className="metric-bar-fill" style={{ width: `${selectedView.technical || 0}%` }}></div>
                          </div>
                        </div>
                        <div className="metric-bar-item">
                          <div className="metric-bar-header">
                            <span><FaComments /> Communication</span>
                            <span>{selectedView.communication || 0}%</span>
                          </div>
                          <div className="metric-bar-track">
                            <div className="metric-bar-fill" style={{ width: `${selectedView.communication || 0}%` }}></div>
                          </div>
                        </div>
                        <div className="metric-bar-item">
                          <div className="metric-bar-header">
                            <span><FaSignal /> Confidence</span>
                            <span>{selectedView.confidence || 0}%</span>
                          </div>
                          <div className="metric-bar-track">
                            <div className="metric-bar-fill" style={{ width: `${selectedView.confidence || 0}%` }}></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="reports-chart-box">
                      <h4>Decision Summary</h4>
                      <div className="data-summary-list">
                        <div className="data-summary-item">
                          <span>Overall Score</span>
                          <span style={{ fontWeight: 700, color: '#e67e22' }}>{selectedView.overall || selectedView.score || 0}%</span>
                        </div>
                        <div className="data-summary-item">
                          <span>AI Verdict</span>
                          <span style={{ fontWeight: 600, color: '#10b981' }}>{selectedView.verdict || "Pending Review"}</span>
                        </div>
                        <div className="data-summary-item">
                          <span>Recruiter Decision</span>
                          <span>
                            <span className={`decision-badge ${getDecisionClass(selectedView.finalDecision)}`}>
                              {selectedView.finalDecision || "Pending"}
                            </span>
                          </span>
                        </div>
                        <div className="data-summary-item">
                          <span>Recruiter Rating</span>
                          <span style={{ fontWeight: 600 }}>{selectedView.recruiterRating || 0} / 5</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="reports-bottom-grid">
                    <div className="reports-chart-box">
                      <h4>Qualitative Feedback</h4>
                      <div style={{ marginBottom: '20px' }}>
                        <h5 style={{ margin: '0 0 8px 0', color: '#10b981', fontSize: '14px' }}>Strengths</h5>
                        <div className="chip-container">
                          {selectedView.strengths?.length > 0 ? (
                            selectedView.strengths.map((s, i) => (
                              <span key={i} className="chip strength">{s}</span>
                            ))
                          ) : (
                            <span style={{ fontSize: '13px', color: '#718096' }}>No strengths listed</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <h5 style={{ margin: '0 0 8px 0', color: '#ef4444', fontSize: '14px' }}>Improvement Areas</h5>
                        <div className="chip-container">
                          {selectedView.improvements?.length > 0 ? (
                            selectedView.improvements.map((s, i) => (
                              <span key={i} className="chip weakness">{s}</span>
                            ))
                          ) : (
                            <span style={{ fontSize: '13px', color: '#718096' }}>No improvement areas listed</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="reports-chart-box">
                      <h4>AI Summary</h4>
                      <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px', minHeight: '120px' }}>
                        <p style={{ margin: 0, lineHeight: '1.6', color: '#4a5568', fontSize: '14px' }}>
                          {selectedView.aiSummary || 
                            `The AI evaluated the candidate based on the interview responses for the ${selectedView.jobTitle || 'position'}. 
                            The technical score was ${selectedView.technical || 0}%, and communication was ${selectedView.communication || 0}%. 
                            ${selectedView.verdict === 'Hire' ? 'AI recommends advancing the candidate to the next stage.' : 'AI recommends a manual review by the recruitment team.'}`
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                  </>
                )}

                {/* Fallback UI if Jobs tab is selected */}
                {activeTab === "Jobs" && (
                  <div className="reports-chart-box" style={{ textAlign: 'center', padding: '40px' }}>
                    <FaBuilding style={{ fontSize: '40px', color: '#e2e8f0', marginBottom: '15px' }} />
                    <h4 style={{ color: '#1a202c' }}>Job Overview</h4>
                    <p style={{ color: '#718096' }}>
                      Click on a specific candidate under this job title in the sidebar to view their detailed interview report.
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="empty-state">
                <FaChartLine />
                <span>Select an item from the sidebar to view its report</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Reports;