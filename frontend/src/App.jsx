import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProfileWizard from "./pages/ProfileWizard";
import FreelancerDashboard from "./pages/FreelancerDashboard";
import EmployerDashboard from "./pages/EmployerDashboard";
import JobListing from "./pages/JobListing";
import JobDetail from "./pages/JobDetail";
import PostJob from "./pages/PostJob";
import ResumeGenerator from "./pages/ResumeGenerator";
import Messaging from "./pages/Messaging";
import AdminDashboard from "./pages/AdminDashboard";
import Payments from "./pages/Payments";
import SavedJobs from "./pages/SavedJobs";
import MyApplications from "./pages/MyApplications";
import OtpVerify from "./pages/OtpVerify";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailure from "./pages/PaymentFailure";
import FreelancerProfile from "./pages/FreelancerProfile";
import EditProfile from "./pages/EditProfile";
import Mentorship from "./pages/Mentorship";
import ErrorBoundary from "./components/ErrorBoundary";
import AIChatbotWidget from "./components/AIChatbotWidget";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return isAuthenticated ? children : <Navigate to="/login" />;
};

const DashboardRedirect = () => {
  const { user } = useAuth();
  
  if (!user?.isVerified) {
    return <Navigate to="/verify-otp" />;
  }

  if (!user?.isProfileComplete) {
    return <Navigate to="/profile-wizard" />;
  }

  if (user?.role === "admin") {
    return <Navigate to="/admin" />;
  }

  if (user?.role === "employer") {
    return <Navigate to="/employer-dashboard" />;
  }

  return <Navigate to="/freelancer-dashboard" />;
};

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <SocketProvider>
          <Router>
            <div className="min-h-screen bg-gray-50 text-gray-900">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardRedirect />
                    </ProtectedRoute>
                  }
                />

              <Route
                path="/profile-wizard"
                element={
                  <ProtectedRoute>
                    <ProfileWizard />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/freelancer-dashboard"
                element={
                  <ProtectedRoute>
                    <FreelancerDashboard />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/employer-dashboard"
                element={
                  <ProtectedRoute>
                    <EmployerDashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/jobs"
                element={
                  <ProtectedRoute>
                    <JobListing />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/jobs/:id"
                element={
                  <ProtectedRoute>
                    <JobDetail />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/post-job"
                element={
                  <ProtectedRoute>
                    <PostJob />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/resume-generator"
                element={
                  <ProtectedRoute>
                    <ResumeGenerator />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/messages"
                element={
                  <ProtectedRoute>
                    <Messaging />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/mentorship"
                element={
                  <ProtectedRoute>
                    <Mentorship />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/payments"
                element={
                  <ProtectedRoute>
                    <Payments />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-applications"
                element={
                  <ProtectedRoute>
                    <MyApplications />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/saved-jobs"
                element={
                  <ProtectedRoute>
                    <SavedJobs />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/verify-otp"
                element={
                  <ProtectedRoute>
                    <OtpVerify />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/payment-success"
                element={
                  <ProtectedRoute>
                    <PaymentSuccess />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/payment-failure"
                element={
                  <ProtectedRoute>
                    <PaymentFailure />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile/:id"
                element={
                  <ProtectedRoute>
                    <FreelancerProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/edit-profile"
                element={
                  <ProtectedRoute>
                    <EditProfile />
                  </ProtectedRoute>
                }
              />
            </Routes>
            <AIChatbotWidget />
            <ToastContainer position="top-right" autoClose={3000} />
          </div>
        </Router>
      </SocketProvider>
    </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;