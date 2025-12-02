// Simple server URL helper
// Export default serverUrl string and named apiBaseUrl for compatibility.
const serverUrl =
  (typeof process !== "undefined" &&
    process.env &&
    (process.env.VITE_API_URL || process.env.REACT_APP_API_URL)) ||
  "https://rynott-ecommerce-server.onrender.com";

export const apiBaseUrl = `${serverUrl}/api`;

export { serverUrl };
export default serverUrl;
