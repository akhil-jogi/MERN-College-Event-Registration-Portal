import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", form);
      const { token, user } = response.data;

      login(user, token);

      navigate(user.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Unable to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-container">
      <form className="form-card" onSubmit={handleSubmit}>
        <h2>Welcome Back</h2>
        <p className="muted">Login to your CampusConnect account.</p>

        {error && <p className="error-message">{error}</p>}

        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />
        </div>

        <button className="primary-button full-width" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="muted" style={{ textAlign: "center", marginTop: 20 }}>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </form>
    </main>
  );
}

export default Login;