import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../utils/api";
const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token"));
  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get("/auth/me");
        setUser(res.data.data);
      } catch (err) {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
      }
      setLoading(false);
    };
    loadUser();
  }, [token]);
  const login = async (email, password) => {
    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      return { success: true };
    } catch (err) {
      console.error("Login Context Error:", err.response?.data || err.message);
      return {
        success: false,
        message: err.response?.data?.message || "Login failed",
      };
    }
  };
  const register = async (userData) => {
    try {
      const res = await api.post("/auth/register", userData);
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      return { success: true };
    } catch (err) {
      console.error("Register Context Error:", err.response?.data || err.message);
      return {
        success: false,
        message: err.response?.data?.message || "Registration failed",
      };
    }
  };
  const forgotPasswordOTP = async (email) => {
    try {
      const res = await api.post("/auth/forgot-password-otp", {
        email,
      });
      return { success: true, message: res.data.data };
    } catch (err) {
      console.error("Forgot Password OTP Error:", err.response?.data || err.message);
      return {
        success: false,
        message: err.response?.data?.message || "Failed to send OTP",
      };
    }
  };
  const loginWithOTP = async (email, otp) => {
    try {
      const res = await api.post("/auth/login-otp", {
        email,
        otp,
      });
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      return { success: true };
    } catch (err) {
      console.error("OTP Login Error:", err.response?.data || err.message);
      return {
        success: false,
        message: err.response?.data?.message || "Authentication failed",
      };
    }
  };
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };
  const reloadUser = async () => {
    if (!token) return;
    try {
      const res = await api.get("/auth/me");
      setUser(res.data.data);
    } catch (err) {
      console.error("Reload user failed", err);
    }
  };
  const value = {
    user,
    token,
    loading,
    login,
    register,
    forgotPasswordOTP,
    loginWithOTP,
    logout,
    reloadUser,
    isAuthenticated: !!user,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
