import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";

import Home from "../pages/Home/Home";
import About from "../pages/About/About";
import Features from "../pages/Features/Features";
import Pricing from "../pages/Pricing/Pricing";
import Contact from "../pages/Contact/Contact";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import ForgotPassword from "../pages/auth/ForgotPassword/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";

// Admin
import AdminDashboard from "../pages/Dashboard/Admin/AdminDashboard";
import Organizations from "../pages/Dashboard/Admin/Organizations";
import Users from "../pages/Dashboard/Admin/Users";
import Roles from "../pages/Dashboard/Admin/Roles";
import Analytics from "../pages/Dashboard/Admin/Analytics";
import Settings from "../pages/Dashboard/Admin/Settings";

// Recruiter
import RecruiterDashboard from "../pages/Dashboard/Recruiter/RecruiterDashboard";
import Jobs from "../pages/Dashboard/Recruiter/Jobs";
import CreateJob from "../pages/Dashboard/Recruiter/CreateJob";
import EditJob from "../pages/Dashboard/Recruiter/EditJob";
import Candidates from "../pages/Dashboard/Recruiter/Candidates";
import CandidateDetail from "../pages/Dashboard/Recruiter/CandidateDetail";
import RecruiterInterviews from "../pages/Dashboard/Recruiter/RecruiterInterviews";
import Reports from "../pages/Dashboard/Recruiter/Reports";
import RecruiterProfile from "../pages/Dashboard/Recruiter/RecruiterProfile";
import AIInterviewResults from "../pages/Dashboard/Recruiter/AIInterviewResults";
import ResumeScreening from "../pages/Dashboard/Recruiter/ResumeScreening";
import RankedCandidates from "../pages/Dashboard/Recruiter/RankedCandidates";
import Messages from "../pages/Dashboard/Recruiter/Messages";
import Notifications from "../pages/Dashboard/Recruiter/Notifications";
import Templates from "../pages/Dashboard/Recruiter/Templates";
import RecruiterSettings from "../pages/Dashboard/Recruiter/RecruiterSettings";
import Activity from "../pages/Dashboard/Recruiter/Activity";
import AIPrompts from "../pages/Dashboard/Recruiter/AIPrompts";

// Candidate
import CandidateDashboard from "../pages/Dashboard/Candidate/CandidateDashboard";
import AvailableJobs from "../pages/Dashboard/Candidate/AvailableJobs";
import Applications from "../pages/Dashboard/Candidate/Applications";
import CandidateInterviews from "../pages/Dashboard/Candidate/CandidateInterviews";
import Resume from "../pages/Dashboard/Candidate/Resume";
import CandidateProfile from "../pages/Dashboard/Candidate/CandidateProfile";
import AIInterview from "../pages/Dashboard/Candidate/AIInterview";
import VideoInterview from "../pages/Dashboard/Candidate/VideoInterview";
import OnlineAssessment from "../pages/Dashboard/Candidate/OnlineAssessment";
import CandidateActivities from "../pages/Dashboard/Candidate/CandidateActivities";
import SavedJobs from "../pages/Dashboard/Candidate/SavedJobs";
import CandidateMessages from "../pages/Dashboard/Candidate/CandidateMessages";
import CandidateNotifications from "../pages/Dashboard/Candidate/CandidateNotifications";

function AppRoutes() {
  return (
    <Routes>

      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/features" element={<Features />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      {/* ========================= ADMIN ========================= */}

      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/organizations"
        element={
          <ProtectedRoute>
            <Organizations />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/users"
        element={
          <ProtectedRoute>
            <Users />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/roles"
        element={
          <ProtectedRoute>
            <Roles />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/analytics"
        element={
          <ProtectedRoute>
            <Analytics />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />

      {/* ========================= RECRUITER ========================= */}

      <Route
        path="/recruiter/dashboard"
        element={
          <ProtectedRoute>
            <RecruiterDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/recruiter/jobs"
        element={
          <ProtectedRoute>
            <Jobs />
          </ProtectedRoute>
        }
      />

      <Route
        path="/recruiter/jobs/create"
        element={
          <ProtectedRoute>
            <CreateJob />
          </ProtectedRoute>
        }
      />

      <Route
        path="/recruiter/jobs/edit/:id"
        element={
          <ProtectedRoute>
            <EditJob />
          </ProtectedRoute>
        }
      />

      <Route
        path="/recruiter/candidates"
        element={
          <ProtectedRoute>
            <Candidates />
          </ProtectedRoute>
        }
      />

      <Route
        path="/recruiter/candidates/:id"
        element={
          <ProtectedRoute>
            <CandidateDetail />
          </ProtectedRoute>
        }
      />

      <Route
        path="/recruiter/interviews"
        element={
          <ProtectedRoute>
            <RecruiterInterviews />
          </ProtectedRoute>
        }
      />

      <Route
        path="/recruiter/reports"
        element={
          <ProtectedRoute>
            <Reports />
          </ProtectedRoute>
        }
      />

      <Route
        path="/recruiter/profile"
        element={
          <ProtectedRoute>
            <RecruiterProfile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/recruiter/interview-results"
        element={
          <ProtectedRoute>
            <AIInterviewResults />
          </ProtectedRoute>
        }
      />

      <Route
        path="/recruiter/resume-screening/:jobId/:email"
        element={
          <ProtectedRoute>
            <ResumeScreening />
          </ProtectedRoute>
        }
      />

      <Route
        path="/recruiter/ranked-candidates/:jobId"
        element={
          <ProtectedRoute>
            <RankedCandidates />
          </ProtectedRoute>
        }
      />

      <Route
        path="/recruiter/messages"
        element={
          <ProtectedRoute>
            <Messages />
          </ProtectedRoute>
        }
      />

      <Route
        path="/recruiter/notifications"
        element={
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        }
      />

      <Route
        path="/recruiter/templates"
        element={
          <ProtectedRoute>
            <Templates />
          </ProtectedRoute>
        }
      />

      <Route
        path="/recruiter/settings"
        element={
          <ProtectedRoute>
            <RecruiterSettings />
          </ProtectedRoute>
        }
      />

        <Route
        path="/recruiter/activity"
        element={
          <ProtectedRoute>
            <Activity />
          </ProtectedRoute>
        }
      />

      <Route
      path="/recruiter/ai-prompts"
      element={
        <ProtectedRoute>
          <AIPrompts />
        </ProtectedRoute>
      }
      />

      {/* ========================= CANDIDATE ========================= */}

      <Route
        path="/candidate/dashboard"
        element={
          <ProtectedRoute>
            <CandidateDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/candidate/jobs"
        element={
          <ProtectedRoute>
            <AvailableJobs />
          </ProtectedRoute>
        }
      />

      <Route
        path="/candidate/applications"
        element={
          <ProtectedRoute>
            <Applications />
          </ProtectedRoute>
        }
      />

      <Route
        path="/candidate/interviews"
        element={
          <ProtectedRoute>
            <CandidateInterviews />
          </ProtectedRoute>
        }
      />

      <Route
        path="/candidate/resume"
        element={
          <ProtectedRoute>
            <Resume />
          </ProtectedRoute>
        }
      />

      <Route
        path="/candidate/profile"
        element={
          <ProtectedRoute>
            <CandidateProfile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/candidate/ai-interview"
        element={
          <ProtectedRoute>
            <AIInterview />
          </ProtectedRoute>
        }
      />

      <Route
        path="/candidate/video-interview"
        element={
          <ProtectedRoute>
            <VideoInterview />
          </ProtectedRoute>
        }
      />

      <Route
        path="/candidate/online-assessment"
        element={
          <ProtectedRoute>
            <OnlineAssessment />
          </ProtectedRoute>
        }
      />

        <Route
        path="/candidate/activity"
        element={
          <ProtectedRoute>
            <CandidateActivities />
          </ProtectedRoute>
        }
      />

      <Route
        path="/candidate/saved-jobs"
        element={
          <ProtectedRoute>
            <SavedJobs />
          </ProtectedRoute>
        }
      />

      <Route
        path="/candidate/messages"
        element={
          <ProtectedRoute>
            <CandidateMessages />
          </ProtectedRoute>
        }
      />

      <Route
      path="/candidate/notifications"
      element={
        <ProtectedRoute>
          <CandidateNotifications />
        </ProtectedRoute>
      }
      />

    </Routes>
  );
}

export default AppRoutes;