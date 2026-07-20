import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../api/api";

import {
  FaChartLine, FaUsers, FaUserCheck, FaClock, FaBriefcase, FaCalendarAlt,
  FaSpinner, FaTrophy, FaArrowUp, FaArrowDown, FaDownload, FaInfoCircle,
  FaArrowRight, FaCheckCircle, FaUserTie, FaStar, FaFilter, FaCode,
  FaFileAlt, FaUser, FaVideo, FaThumbsUp, FaTimesCircle, FaRobot, FaEnvelope
} from "react-icons/fa";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area, Cell, PieChart, Pie
} from "recharts";

// 🟢 Helper: Status Icon Matcher
const getActivityIcon = (type) => {
  const map = {
    'Hired': <FaCheckCircle />, 'Selected': <FaCheckCircle />,
    'Shortlisted': <FaUserCheck />,
    'Interview': <FaVideo />, 'Scheduled': <FaVideo />,
    'Applied': <FaFileAlt />,
    'Offer': <FaTrophy />,
    'Rejected': <FaTimesCircle />
  };
  return map[type] || <FaEnvelope />;
};

const getActivityColor = (type) => {
  const map = {
    'Hired': '#10b981', 'Selected': '#10b981',
    'Shortlisted': '#3b82f6',
    'Interview': '#8b5cf6', 'Scheduled': '#8b5cf6',
    'Applied': '#f59e0b',
    'Offer': '#eab308',
    'Rejected': '#ef4444'
  };
  return map[type] || '#6b7280';
};

// 🟢 Custom Gradient for Trend Chart
const trendGradient = (
  <defs>
    <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stopColor="#f97316" stopOpacity={0.15}/>
      <stop offset="100%" stopColor="#f97316" stopOpacity={0}/>
    </linearGradient>
  </defs>
);

// 🟢 COLORS
const FUNNEL_COLORS = ['#f97316', '#f59e0b', '#eab308', '#8b5cf6', '#3b82f6', '#10b981'];

function Reports() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    stats: { totalApplications: 0, shortlisted: 0, interviewsConducted: 0, hired: 0, avgTimeToHire: 0, offerAcceptanceRate: 0 },
    funnel: { applications: 0, screening: 0, shortlisted: 0, interviewed: 0, offered: 0, hired: 0 },
    topJobs: [],
    trend: [],
    recentActivity: [],
    insights: []
  });

  const [days, setDays] = useState(30);

  useEffect(() => { loadData(); }, [days]);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/analytics/dashboard?days=${days}`);
      if (res.data) setData(res.data);
    } catch (err) { console.log("Error loading reports:", err); }
    finally { setLoading(false); }
  };

  const formatNumber = (num) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num;
  };

  const funnelChartData = [
    { name: 'Applications', value: data.funnel.applications, color: '#f97316' },
    { name: 'Screening', value: data.funnel.screening, color: '#f59e0b' },
    { name: 'Shortlisted', value: data.funnel.shortlisted, color: '#eab308' },
    { name: 'Interviewed', value: data.funnel.interviewed, color: '#8b5cf6' },
    { name: 'Offered', value: data.funnel.offered, color: '#3b82f6' },
    { name: 'Hired', value: data.funnel.hired, color: '#10b981' }
  ];

  if (loading) return (
    <DashboardLayout>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <FaSpinner className="spin" style={{ fontSize: '40px', color: '#f97316' }} />
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="reports-page">
        
        {/* 1. HEADER */}
        <div className="reports-header">
          <div className="reports-header-left">
            <h1>Reports & Analytics</h1>
            <p>Track hiring performance and make smarter recruitment decisions.</p>
          </div>
          <div>
            <button style={{ padding:'8px 16px', background:'#f97316', color:'white', border:'none', borderRadius:'6px', fontWeight:'600', fontSize:'14px', display:'flex', alignItems:'center', gap:'6px', cursor:'pointer' }}>
              <FaDownload /> Export Report
            </button>
          </div>
        </div>

        {/* 2. FILTERS BAR */}
        <div className="reports-filter-bar">
          <div className="reports-filter-group">
            <span className="reports-filter-label">Date Range</span>
            <select className="reports-filter-select" value={days} onChange={(e) => setDays(Number(e.target.value))}>
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
            </select>
          </div>
          <div className="reports-filter-group">
            <span className="reports-filter-label">Job</span>
            <select className="reports-filter-select"><option>All Jobs</option></select>
          </div>
          <div className="reports-filter-group">
            <span className="reports-filter-label">Department</span>
            <select className="reports-filter-select"><option>All Departments</option></select>
          </div>
          <button className="reports-apply-btn"><FaFilter /> Apply Filters</button>
        </div>

        {/* 3. STATS ROW */}
        <div className="reports-stats-row">
          {[
            { label: 'Total Applications', value: data.stats.totalApplications, icon: <FaUsers />, bg: '#fff7ed', color: '#f97316', trend: '18.6% last 30 days' },
            { label: 'Candidates Shortlisted', value: data.stats.shortlisted, icon: <FaUserCheck />, bg: '#ecfdf5', color: '#10b981', trend: '12.4% last 30 days' },
            { label: 'Interviews Conducted', value: data.stats.interviewsConducted, icon: <FaVideo />, bg: '#f5f3ff', color: '#8b5cf6', trend: '14.7% last 30 days' },
            { label: 'Candidates Hired', value: data.stats.hired, icon: <FaTrophy />, bg: '#fef2f2', color: '#ef4444', trend: '19.2% last 30 days' },
            { label: 'Avg. Time to Hire', value: `${data.stats.avgTimeToHire} Days`, icon: <FaClock />, bg: '#eff6ff', color: '#3b82f6', trend: '8.3% last 30 days' },
            { label: 'Offer Acceptance Rate', value: `${data.stats.offerAcceptanceRate || 0}%`, icon: <FaThumbsUp />, bg: '#fefce8', color: '#eab308', trend: '7.6% last 30 days' }
          ].map((stat, i) => (
            <div key={i} className="reports-stat-card">
              <div className="reports-stat-icon-box" style={{ background: stat.bg, color: stat.color }}>{stat.icon}</div>
              <div className="reports-stat-number">{formatNumber(stat.value)}</div>
              <div className="reports-stat-label">{stat.label}</div>
              <div className="reports-stat-trend"><FaArrowUp /> {stat.trend}</div>
            </div>
          ))}
        </div>

        {/* 4. MAIN GRID */}
        <div className="reports-main-grid">

          {/* --- COLUMN 1: Funnel & Top Jobs --- */}
          <div className="reports-col">
            
            {/* Recruitment Funnel */}
            <div className="reports-card">
              <h3 className="reports-card-title">Recruitment Funnel</h3>
              <div className="reports-funnel-chart">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart layout="vertical" data={funnelChartData} margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                    <XAxis type="number" axisLine={false} tickLine={false} />
                    <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} width={120} />
                    <Tooltip />
                    <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={20}>
                      {funnelChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Performing Jobs */}
            <div className="reports-card">
              <div className="reports-card-header">
                <h3 className="reports-card-title">Top Performing Jobs</h3>
                <button className="reports-card-link" onClick={() => navigate('/recruiter/jobs')}>View All <FaArrowRight /></button>
              </div>
              {data.topJobs.length > 0 ? (
                <table className="reports-jobs-table">
                  <thead>
                    <tr><th>Job Title</th><th style={{textAlign:'center'}}>Apps</th><th style={{textAlign:'center'}}>Int.</th><th style={{textAlign:'center'}}>Hired</th><th style={{textAlign:'right'}}>Rate</th></tr>
                  </thead>
                  <tbody>
                    {data.topJobs.map((job, i) => (
                      <tr key={i}>
                        <td><strong>{job.title}</strong></td>
                        <td style={{textAlign:'center'}}>{job.applications}</td>
                        <td style={{textAlign:'center'}}>{job.interviews}</td>
                        <td style={{textAlign:'center'}}>{job.hired}</td>
                        <td style={{textAlign:'right', color:'#10b981', fontWeight:600}}>{job.rate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>No job data available yet.</div>
              )}
            </div>

          </div>

          {/* --- COLUMN 2: Trend Chart & Activity --- */}
          <div className="reports-col">

            {/* Application Trend */}
            <div className="reports-card">
              <div className="reports-card-header">
                <h3 className="reports-card-title">Application Trend</h3>
                <select style={{ border:'1px solid #e5e7eb', borderRadius:'4px', fontSize:'12px', padding:'4px 8px', outline:'none' }}>
                  <option>Daily</option>
                  <option>Weekly</option>
                </select>
              </div>
              <div style={{ height: '200px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.trend}>
                    {trendGradient}
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize:11}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize:11}} />
                    <Tooltip />
                    <Area type="monotone" dataKey="applications" stroke="#f97316" strokeWidth={2} fill="url(#trendGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Hiring Activity */}
            <div className="reports-card">
              <div className="reports-card-header">
                <h3 className="reports-card-title">Recent Hiring Activity</h3>
                <button className="reports-card-link" onClick={() => navigate('/recruiter/activity')}>View All <FaArrowRight /></button>
              </div>
              {data.recentActivity.length > 0 ? (
                data.recentActivity.map((act, i) => (
                  <div key={i} className="reports-activity-item">
                    <div className="reports-activity-icon" style={{ 
                      background: getActivityColor(act.type) + '15', 
                      color: getActivityColor(act.type)
                    }}>
                      {getActivityIcon(act.type)}
                    </div>
                    <div>
                      <div className="reports-activity-title">{act.details}</div>
                      <div className="reports-activity-sub">{act.candidate} • {act.job} • {act.time}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>No recent activity.</div>
              )}
            </div>

          </div>

          {/* --- COLUMN 3: Insights & Reports --- */}
          <div className="reports-col">

            {/* Hiring Insights */}
            <div className="reports-card">
              <div className="reports-card-header">
                <h3 className="reports-card-title">AI Hiring Insights</h3>
                <button className="reports-card-link">View All <FaArrowRight /></button>
              </div>
              {data.insights.length > 0 ? (
                data.insights.map((insight, i) => (
                  <div key={i} className="reports-activity-item">
                    <div className="reports-activity-icon" style={{ background: '#ecfdf5', color: '#10b981' }}>
                      {insight.icon === 'ArrowUp' ? <FaArrowUp /> : <FaTrophy />}
                    </div>
                    <div>
                      <div className="reports-activity-title">{insight.title}</div>
                      <div className="reports-activity-sub">{insight.desc}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}>No insights available yet.</div>
              )}
            </div>

            {/* Export Reports */}
           {/*<div className="reports-card">
              <div className="reports-card-header">
                <h3 className="reports-card-title">Export Reports</h3>
              </div>
              <div className="reports-activity-item">
                <div className="reports-activity-icon" style={{ background: '#fee2e2', color: '#ef4444' }}><FaFileAlt /></div>
                <div><div className="reports-activity-title">Download PDF</div><div className="reports-activity-sub">High-quality PDF report</div></div>
              </div>
              <div className="reports-activity-item">
                <div className="reports-activity-icon" style={{ background: '#ecfdf5', color: '#10b981' }}><FaFileAlt /></div>
                <div><div className="reports-activity-title">Download Excel</div><div className="reports-activity-sub">CSV data file for analysis</div></div>
              </div>
            </div>*/}

          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}

export default Reports;