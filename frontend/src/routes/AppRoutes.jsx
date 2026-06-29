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
import AdminDashboard from "../pages/Dashboard/Admin/AdminDashboard";
import RecruiterDashboard from "../pages/Dashboard/Recruiter/RecruiterDashboard";
import CandidateDashboard from "../pages/Dashboard/Candidate/CandidateDashboard";
import Applications from "../pages/Dashboard/Candidate/Applications";
import CandidateInterviews from "../pages/Dashboard/Candidate/CandidateInterviews";
import Resume from "../pages/Dashboard/Candidate/Resume";
import CandidateProfile from "../pages/Dashboard/Candidate/CandidateProfile";
import Jobs from "../pages/Dashboard/Recruiter/Jobs";
import Candidates from "../pages/Dashboard/Recruiter/Candidates";
import RecruiterInterviews from "../pages/Dashboard/Recruiter/RecruiterInterviews";
import Reports from "../pages/Dashboard/Recruiter/Reports";
import RecruiterProfile from "../pages/Dashboard/Recruiter/RecruiterProfile";
import Organizations from "../pages/Dashboard/Admin/Organizations";
import Users from "../pages/Dashboard/Admin/Users";
import Roles from "../pages/Dashboard/Admin/Roles";
import Analytics from "../pages/Dashboard/Admin/Analytics";
import Settings from "../pages/Dashboard/Admin/Settings";
import CreateJob from "../pages/Dashboard/Recruiter/CreateJob";
import AvailableJobs from "../pages/Dashboard/Candidate/AvailableJobs";
import EditJob from "../pages/Dashboard/Recruiter/EditJob";
import AIInterview from "../pages/Dashboard/Candidate/AIInterview";
import AIInterviewResults from "../pages/Dashboard/Recruiter/AIInterviewResults";
import ResumeScreening from "../pages/Dashboard/Recruiter/ResumeScreening";
import VideoInterview from "../pages/Dashboard/Candidate/VideoInterview";



function AppRoutes() {
  return (
    <Routes>
  <Route path="/" element={<Home />} />
  <Route path="/about" element={<About />} />
  <Route path="/features" element={<Features />} />
  <Route path="/pricing" element={<Pricing />} />
  <Route path="/contact" element={<Contact />} />
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route path="/forgot-password" element={<ForgotPassword />} />
  <Route path="/reset-password/:token" element={<ResetPassword />} />

  {/* Admin */}
  <Route
    path="/admin-dashboard"
    element={
      <ProtectedRoute>
        <AdminDashboard />
      </ProtectedRoute>
    }
  />

  <Route
    path="/organizations"
    element={
      <ProtectedRoute>
        <Organizations />
      </ProtectedRoute>
    }
  />

  <Route
    path="/users"
    element={
      <ProtectedRoute>
        <Users />
      </ProtectedRoute>
    }
  />

  <Route
    path="/roles"
    element={
      <ProtectedRoute>
        <Roles />
      </ProtectedRoute>
    }
  />

  <Route
    path="/analytics"
    element={
      <ProtectedRoute>
        <Analytics />
      </ProtectedRoute>
    }
  />

  <Route
    path="/settings"
    element={
      <ProtectedRoute>
        <Settings />
      </ProtectedRoute>
    }
  />

  {/* Recruiter */}
  <Route
    path="/recruiter-dashboard"
    element={
      <ProtectedRoute>
        <RecruiterDashboard />
      </ProtectedRoute>
    }
  />

  <Route
    path="/jobs"
    element={
      <ProtectedRoute>
        <Jobs />
      </ProtectedRoute>
    }
  />

  <Route
    path="/create-job"
    element={
      <ProtectedRoute>
        <CreateJob />
      </ProtectedRoute>
    }
  />

  <Route
    path="/edit-job/:id"
    element={
      <ProtectedRoute>
        <EditJob />
      </ProtectedRoute>
    }
  />

  <Route
    path="/candidates"
    element={
      <ProtectedRoute>
        <Candidates />
      </ProtectedRoute>
    }
  />

  <Route
    path="/recruiter-interviews"
    element={
      <ProtectedRoute>
        <RecruiterInterviews />
      </ProtectedRoute>
    }
  />

  <Route
    path="/reports"
    element={
      <ProtectedRoute>
        <Reports />
      </ProtectedRoute>
    }
  />

  <Route
    path="/recruiter-profile"
    element={
      <ProtectedRoute>
        <RecruiterProfile />
      </ProtectedRoute>
    }
  />

  {/* Candidate */}
  <Route
    path="/candidate-dashboard"
    element={
      <ProtectedRoute>
        <CandidateDashboard />
      </ProtectedRoute>
    }
  />

  <Route
    path="/available-jobs"
    element={
      <ProtectedRoute>
        <AvailableJobs />
      </ProtectedRoute>
    }
  />

  <Route
    path="/applications"
    element={
      <ProtectedRoute>
        <Applications />
      </ProtectedRoute>
    }
  />

  <Route
    path="/interviews"
    element={
      <ProtectedRoute>
        <CandidateInterviews />
      </ProtectedRoute>
    }
  />

  <Route
    path="/resume"
    element={
      <ProtectedRoute>
        <Resume />
      </ProtectedRoute>
    }
  />

  <Route
    path="/profile"
    element={
      <ProtectedRoute>
        <CandidateProfile />
      </ProtectedRoute>
    }
  />

  <Route
  path="/ai-interview"
  element={
    <ProtectedRoute>
      <AIInterview />
    </ProtectedRoute>
  }
  />

  <Route
  path="/ai-interview-results"
  element={
    <ProtectedRoute>
      <AIInterviewResults />
    </ProtectedRoute>
  }
  />

  <Route
  path="/resume-screening/:id"
  element={
  <ProtectedRoute>
    <ResumeScreening />
  </ProtectedRoute>}
/>

<Route
path="/video-interview"
element={
  <ProtectedRoute>
    <VideoInterview />
  </ProtectedRoute>
}
/>



</Routes>
  );
}

export default AppRoutes;