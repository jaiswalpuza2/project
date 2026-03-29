import React from "react";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
          <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-2xl shadow-blue-50 text-center border border-gray-100">
            <div className="inline-block p-4 bg-red-50 text-red-600 rounded-2xl mb-6">
              <AlertTriangle size={48} />
            </div>
            <h1 className="text-2xl font-black text-gray-900 mb-4">Something went wrong.</h1>
            <p className="text-gray-500 mb-8 leading-relaxed">
              An unexpected error occurred. Don't worry, our AI is already looking into it.
            </p>
            <div className="flex flex-col gap-4">
              <button 
                onClick={() => window.location.reload()}
                className="w-full bg-yellow-400 text-gray-900 py-4 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-yellow-500 transition shadow-xl shadow-yellow-100"
              >
                <RefreshCw size={20} /> Reload Page
              </button>
              <a 
                href="/"
                className="w-full bg-gray-50 text-gray-600 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-100 transition"
              >
                <Home size={20} /> Go Home
              </a>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
export default ErrorBoundary;
