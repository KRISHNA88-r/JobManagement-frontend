import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./AuthContext.jsx";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Home from "./pages/Home.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Jobs from "./pages/Jobs.jsx";
import JobDetails from "./pages/JobDetails.jsx";
import MyApplications from "./pages/MyApplications.jsx";
import Profile from "./pages/Profile.jsx";
import RecruiterJobs from "./pages/RecruiterJobs.jsx";
import JobForm from "./pages/JobForm.jsx";
import JobApplicants from "./pages/JobApplicants.jsx";
import ChangePassword from "./pages/ChangePassword.jsx";
import DeleteAccount from "./pages/DeleteAccount.jsx";
import Notifications from "./pages/Notifications.jsx";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <main className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobDetails />} />

            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
            
            <Route path="/my-applications" element={<ProtectedRoute role="JOB_SEEKER"><MyApplications /></ProtectedRoute>} />

            <Route path="/recruiter/jobs" element={<ProtectedRoute role="RECRUITER"><RecruiterJobs /></ProtectedRoute>} />
            <Route path="/recruiter/jobs/new" element={<ProtectedRoute role="RECRUITER"><JobForm /></ProtectedRoute>} />
            <Route path="/recruiter/jobs/:id/edit" element={<ProtectedRoute role="RECRUITER"><JobForm /></ProtectedRoute>} />
            <Route path="/recruiter/jobs/:id/applicants" element={<ProtectedRoute role="RECRUITER"><JobApplicants /></ProtectedRoute>} />
            <Route path="/profile/password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
            <Route path="/profile/delete" element={<ProtectedRoute><DeleteAccount /></ProtectedRoute>} />
            <Route path="*" element={<p>Page not found.</p>} />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}