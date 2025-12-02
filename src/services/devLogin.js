// Development helper to automatically log in admin user
import { apiBaseUrl } from "./serverURL";

export const autoLoginAdmin = async () => {
  const adminCredentials = {
    email: "admin@rynott.com",
    password: "admin123",
  };

  try {
    const response = await fetch(`${apiBaseUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(adminCredentials),
    });

    const data = await response.json();

    if (response.ok) {
      // Store token and user data
      localStorage.setItem("token", data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data.user));

      console.log("✅ Admin auto-login successful");
      return {
        success: true,
        user: data.data.user,
        token: data.data.token,
      };
    } else {
      console.error("❌ Admin auto-login failed:", data.message);
      return {
        success: false,
        error: data.message,
      };
    }
  } catch (error) {
    console.error("❌ Admin auto-login error:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

// Check if we should auto-login (development mode only)
export const shouldAutoLogin = () => {
  return (
    import.meta.env.DEV === true &&
    !localStorage.getItem("token") &&
    window.location.pathname.startsWith("/admin")
  );
};
