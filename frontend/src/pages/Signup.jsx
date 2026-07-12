import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { Link, useNavigate } from "react-router-dom";
import { Truck, User, Mail, Lock, Shield } from "lucide-react";

export default function Signup() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Fleet Manager");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || !role) {
      setError("Please fill in all fields");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await register(name, email, password, role);
      // Auth context auto logs in on successful registration, so we navigate to home
      navigate("/fleet");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      background: "radial-gradient(circle at center, #1e293b 0%, #0f111a 100%)",
      padding: "20px"
    }}>
      <div style={{
        background: "rgba(26, 29, 45, 0.65)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        borderRadius: "16px",
        padding: "40px",
        width: "100%",
        maxWidth: "440px",
        boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
        display: "flex",
        flexDirection: "column",
        gap: "24px"
      }}>
        <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
          <div style={{
            width: "56px",
            height: "56px",
            background: "rgba(59, 130, 246, 0.15)",
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "8px"
          }}>
            <Truck color="var(--accent-color)" size={32} />
          </div>
          <h2 style={{ fontSize: "24px", fontWeight: "600", color: "#fff" }}>Create an Account</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: "14px" }}>Register as a TransitOps user</p>
        </div>

        {error && (
          <div style={{
            background: "rgba(239, 68, 68, 0.1)",
            border: "1px solid rgba(239, 68, 68, 0.2)",
            color: "var(--danger-color)",
            padding: "12px 16px",
            borderRadius: "8px",
            fontSize: "14px"
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div className="form-group">
            <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <User size={14} /> Full Name
            </label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Mail size={14} /> Email Address
            </label>
            <input
              type="email"
              className="form-control"
              placeholder="e.g. john@transitops.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Lock size={14} /> Password
            </label>
            <input
              type="password"
              className="form-control"
              placeholder="Min. 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Shield size={14} /> Account Role
            </label>
            <select
              className="form-control"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              {["Fleet Manager", "Dispatcher", "Driver", "Safety Officer", "Financial Analyst"].map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "8px" }} disabled={loading}>
            {loading ? "Registering..." : "Sign Up"}
          </button>
        </form>

        <div style={{ textAlign: "center", fontSize: "14px", color: "var(--text-secondary)" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "var(--accent-color)", textDecoration: "none", fontWeight: "600" }}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
