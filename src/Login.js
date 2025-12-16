import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setMsg("Please enter username and password");
      return;
    }

    setLoading(true);
    setMsg("");

    try {
      // Call the GET endpoint with query parameters
      const res = await axios.get("http://localhost:5161/api/UserLogin/login", {
        params: { username, password }
      });

      if (res.data.status === "success") {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userID", res.data.userID);
        localStorage.setItem("userName", res.data.userName);
        navigate("/"); // Redirect to dashboard
      } else {
        setMsg("Invalid username or password");
      }
    } catch (error) {
      console.error(error);
      setMsg(error.response?.data?.message || "Server not responding");
    }

    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleLogin(e);
  };

  return (
    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
      fontFamily: "Segoe UI",
      padding: "15px"
    }}>
      <div style={{
        width: "100%",
        maxWidth: "380px",
        background: "#fff",
        padding: "35px",
        borderRadius: "18px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
        animation: "fadeIn 0.7s"
      }}>
        <h2 style={{
          textAlign: "center",
          marginBottom: "25px",
          fontWeight: "600",
          color: "#4f46e5"
        }}>School Portal</h2>

        <form onSubmit={handleLogin}>
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyPress={handleKeyPress}
          />

          <input
            type="password"
            className="form-control mb-3"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
          />

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
            style={{ padding: "10px", fontSize: "16px", borderRadius: "8px" }}
          >
            {loading ? "Checking..." : "Login"}
          </button>
        </form>

        {msg && (
          <p className="text-danger mt-3 text-center" style={{ fontWeight: 500 }}>
            {msg}
          </p>
        )}
      </div>

      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
          }
        `}
      </style>
    </div>
  );
}
