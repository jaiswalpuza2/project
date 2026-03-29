import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
import AIChatbot from "./pages/AIChatbot";
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
import Settings from "./pages/Settings";
import ChangePassword from "./pages/ChangePassword";
import About from "./pages/About";
import Blog from "./pages/Blog";
import FAQ from "./pages/FAQ";
import Services from "./pages/Services";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import ErrorBoundary from "./components/ErrorBoundary";
import AIChatbotWidget from "./components/AIChatbotWidget";
import DashboardLayout from "./components/DashboardLayout";

const ProtectedRoute = ({ children, role }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
    </div>
  );

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (role && user?.role !== role) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

const DashboardRedirect = () => {
  const { user } = useAuth();

  if (!user?.isVerified) {
    return <Navigate to="/verify-otp" />;
  }

  if (user?.role === "admin") {
    return <Navigate to="/admin" />;
  }

  if (!user?.isProfileComplete) {
    return <Navigate to="/profile-wizard" />;
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
            <div className="min-h-screen bg-slate-900 text-slate-200">
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
                    <DashboardLayout>
                      <FreelancerDashboard />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/employer-dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <EmployerDashboard />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/jobs"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <JobListing />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/jobs/:id"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <JobDetail />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/post-job"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <PostJob />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/edit-job/:id"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <PostJob />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/resume-generator"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <ResumeGenerator />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/ai-chatbot"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <AIChatbot />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/messages"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Messaging />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/mentorship"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Mentorship />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute role="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/payments"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Payments />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-applications"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <MyApplications />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/saved-jobs"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <SavedJobs />
                    </DashboardLayout>
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
                    <DashboardLayout>
                      <EditProfile />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <Settings />
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
                <Route
                  path="/change-password"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <ChangePassword />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                <Route path="/about" element={<About />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/employer-faq" element={<FAQ />} />
                <Route path="/services" element={<Services />} />
                <Route path="/tools" element={<Services />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
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