// Minimal server URL helper — only exports server URL and API base URL
// Reads Vite's import.meta.env when available, otherwise falls back to process.env.
let _env = {};
try {
  if (typeof import.meta !== "undefined" && import.meta.env) {
    _env = import.meta.env;
  }
} catch (e) {
  // ignore in environments without import.meta
}

if (
  !Object.keys(_env).length &&
  typeof process !== "undefined" &&
  process.env
) {
  _env = process.env;
}

const NODE_ENV = _env.MODE || _env.NODE_ENV || "development";
const OVERRIDE_API = _env.VITE_API_URL || _env.REACT_APP_API_URL || "";

export const serverUrl =
  NODE_ENV === "production"
    ? OVERRIDE_API || "https://rynott-ecommerce-server.onrender.com"
    : OVERRIDE_API || "http://localhost:5000";

export const apiBaseUrl = `${serverUrl}/api`;

export default { serverUrl, apiBaseUrl };
