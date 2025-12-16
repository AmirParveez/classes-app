import { Navigate } from "react-router-dom";

export default function RequireAuth({ children }) {
  const loggedIn = localStorage.getItem("isLoggedIn");

  return loggedIn === "true" ? children : <Navigate to="/login" replace />;
}
