import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { SocketProvider } from "./context/SocketContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Loading Component for Suspense
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-900 transition-colors duration-500">
    <div className="relative w-20 h-20">
      <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"></div>
      <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest animate-pulse">JS</span>
      </div>
    </div>
  </div>
);

// Lazy Load Pages for Production Performance
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ProfileWizard = lazy(() => import("./pages/ProfileWizard"));
const FreelancerDashboard = lazy(() => import("./pages/FreelancerDashboard"));
const EmployerDashboard = lazy(() => import("./pages/EmployerDashboard"));
const JobListing = lazy(() => import("./pages/JobListing"));
const JobDetail = lazy(() => import("./pages/JobDetail"));
const PostJob = lazy(() => import("./pages/PostJob"));
const ResumeGenerator = lazy(() => import("./pages/ResumeGenerator"));
const AIChatbot = lazy(() => import("./pages/AIChatbot"));
const Messaging = lazy(() => import("./pages/Messaging"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const Payments = lazy(() => import("./pages/Payments"));
const SavedJobs = lazy(() => import("./pages/SavedJobs"));
const MyApplications = lazy(() => import("./pages/MyApplications"));
const OtpVerify = lazy(() => import("./pages/OtpVerify"));
const PaymentSuccess = lazy(() => import("./pages/PaymentSuccess"));
const PaymentFailure = lazy(() => import("./pages/PaymentFailure"));
const FreelancerProfile = lazy(() => import("./pages/FreelancerProfile"));
const EditProfile = lazy(() => import("./pages/EditProfile"));
const Mentorship = lazy(() => import("./pages/Mentorship"));
const Settings = lazy(() => import("./pages/Settings"));
const ChangePassword = lazy(() => import("./pages/ChangePassword"));
const About = lazy(() => import("./pages/About"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogDetail = lazy(() => import("./pages/BlogDetail"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Services = lazy(() => import("./pages/Services"));
const Terms = lazy(() => import("./pages/Terms"));
const Privacy = lazy(() => import("./pages/Privacy"));

// Component Imports
import ErrorBoundary from "./components/ErrorBoundary";
import AIChatbotWidget from "./components/AIChatbotWidget";
import DashboardLayout from "./components/DashboardLayout";

const ProtectedRoute = ({ children, role }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return <PageLoader />;

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
      <ThemeProvider>
        <AuthProvider>
        <SocketProvider>
          <Router>
            <Suspense fallback={<PageLoader />}>
              <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-200 transition-colors duration-300">
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
                  <Route path="/blog/:id" element={<BlogDetail />} />

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
            </Suspense>
          </Router>
        </SocketProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;