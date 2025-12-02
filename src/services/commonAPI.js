import { apiBaseUrl } from "./serverURL";
import axios from "axios";

// Helper function to get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem("token");
};

// Helper function to set auth token
const setAuthToken = (token) => {
  localStorage.setItem("token", token);
};

// Helper function to remove auth token
const removeAuthToken = () => {
  localStorage.removeItem("token");
};

// Helper function to get current user from localStorage
const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
};

// Helper function to set current user
const setCurrentUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

// Helper function to remove current user
const removeCurrentUser = () => {
  localStorage.removeItem("user");
};

// Helper function to check if user is authenticated
const isAuthenticated = () => {
  const token = getAuthToken();
  const user = getCurrentUser();
  return !!(token && user);
};

// Helper function to check if user is admin
const isAdmin = () => {
  const user = getCurrentUser();
  return user && user.role === "admin";
};

// Generic API wrapper using axios

// Resolve endpoint: accept full URL or endpoint path starting with '/'
const resolveUrl = (endpoint) => {
  if (!endpoint) return apiBaseUrl;
  if (endpoint.startsWith("http://") || endpoint.startsWith("https://")) {
    return endpoint;
  }
  // Ensure leading slash
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${apiBaseUrl}${path}`;
};

const apiCall = async (endpoint, options = {}) => {
  const token = getAuthToken();

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) headers.Authorization = `Bearer ${token}`;

  const method = (options.method || "GET").toUpperCase();

  const config = {
    method,
    url: resolveUrl(endpoint),
    headers,
    timeout: 30000,
  };

  if (options.body && method !== "GET") {
    config.data = options.body;
  }

  try {
    const res = await axios(config);
    return res.data;
  } catch (error) {
    console.error("API Error:", error);
    const status = error.response?.status || 500;
    // Handle unauthorized centrally
    if (status === 401) {
      try {
        logout();
      } catch (e) {
        // ignore
      }
    }
    return {
      success: false,
      message: error.response?.data?.message || error.message,
      status,
      data: null,
    };
  }
};

// File upload wrapper
const uploadFile = async (endpoint, file, additionalData = {}) => {
  const token = getAuthToken();

  const formData = new FormData();
  formData.append("file", file);

  // Add additional data if provided
  Object.keys(additionalData).forEach((key) => {
    formData.append(key, additionalData[key]);
  });

  const headers = {};
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${apiBaseUrl}${endpoint}`, {
      method: "POST",
      headers,
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        logout();
        window.location.href = "/login";
        return {
          success: false,
          message: "Session expired. Please log in again.",
        };
      }
      // Return error response in consistent format
      return {
        success: false,
        message: data.message || `HTTP error! status: ${response.status}`,
        data: null,
      };
    }

    return data;
  } catch (error) {
    console.error("File upload failed:", error);
    // Return error in consistent format instead of throwing
    return {
      success: false,
      message: error.message || "Upload failed. Please try again.",
      data: null,
    };
  }
};

// Avatar upload wrapper
const uploadAvatar = async (file) => {
  return uploadFile(config.endpoints.upload.avatar, file);
};

// Authentication functions
const login = async (email, password) => {
  const response = await apiCall(config.endpoints.auth.login, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  if (response.success && response.data.token) {
    setAuthToken(response.data.token);
    setCurrentUser(response.data.user);
  }

  return response;
};

const register = async (userData) => {
  const response = await apiCall(config.endpoints.auth.register, {
    method: "POST",
    body: JSON.stringify(userData),
  });

  if (response.success && response.data.token) {
    setAuthToken(response.data.token);
    setCurrentUser(response.data.user);
  }

  return response;
};

const logout = async () => {
  try {
    await apiCall(config.endpoints.auth.logout, {
      method: "POST",
    });
  } catch (error) {
    console.error("Logout API call failed:", error);
  } finally {
    removeAuthToken();
    removeCurrentUser();
  }
};

const getCurrentUserProfile = async () => {
  return apiCall(config.endpoints.auth.me);
};

const updateProfile = async (userData) => {
  return apiCall(config.endpoints.auth.updateDetails, {
    method: "PUT",
    body: JSON.stringify(userData),
  });
};

const updatePassword = async (passwordData) => {
  return apiCall(config.endpoints.auth.updatePassword, {
    method: "PUT",
    body: JSON.stringify(passwordData),
  });
};

// Utility functions
const formatPrice = (price, currency = "USD") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(price);
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatDateTime = (date) => {
  return new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Image URL helper
const getImageUrl = (imageUrl) => {
  if (!imageUrl) return "/images/default-product.png";

  if (imageUrl.startsWith("http")) {
    return imageUrl;
  }

  return `${config.serverUrl}${imageUrl}`;
};

// Validation helpers
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  return password.length >= 6;
};

const validateRequired = (value) => {
  return value && value.toString().trim().length > 0;
};

// Local storage helpers
const setItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Failed to save to localStorage:", error);
  }
};

const getItem = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error("Failed to read from localStorage:", error);
    return null;
  }
};

const removeItem = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error("Failed to remove from localStorage:", error);
  }
};

// Export all functions and utilities
export {
  // Auth functions
  login,
  register,
  logout,
  getCurrentUserProfile,
  updateProfile,
  updatePassword,

  // Utility functions
  getAuthToken,
  setAuthToken,
  removeAuthToken,
  getCurrentUser,
  setCurrentUser,
  removeCurrentUser,
  isAuthenticated,
  isAdmin,
  apiCall,
  uploadFile,
  uploadAvatar,

  // Formatting functions
  formatPrice,
  formatDate,
  formatDateTime,
  getImageUrl,

  // Validation functions
  validateEmail,
  validatePassword,
  validateRequired,

  // Local storage helpers
  setItem,
  getItem,
  removeItem,
};

export default {
  login,
  register,
  logout,
  getCurrentUserProfile,
  updateProfile,
  updatePassword,
  getAuthToken,
  setAuthToken,
  removeAuthToken,
  getCurrentUser,
  setCurrentUser,
  removeCurrentUser,
  isAuthenticated,
  isAdmin,
  apiCall,
  uploadFile,
  uploadAvatar,
  formatPrice,
  formatDate,
  formatDateTime,
  getImageUrl,
  validateEmail,
  validatePassword,
  validateRequired,
  setItem,
  getItem,
  removeItem,
};
