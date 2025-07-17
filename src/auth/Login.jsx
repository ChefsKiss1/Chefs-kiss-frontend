import { useState } from "react";
import { Link, useNavigate } from "react-router";
import "./LoginPage.css";
import { useAuth } from "./AuthContext";

/** A form that allows users to log into an existing account. */
export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState(null);

  const onLogin = async (formData) => {
    const username = formData.get("username");
    const password = formData.get("password");
    try {
      await login({ username, password });
      navigate("/");
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-header">
        <h1 className="login-title">Chef's Kiss</h1>
      </div>
      <div className="login-form-wrapper">
        <h2 className="login-subtitle">Log in to your account</h2>
        <form className="login-form" action={onLogin}>
          <label className="login-label">
            Username
            <input
              type="text"
              name="username"
              className="login-input"
              required
            />
          </label>
          <label className="login-label">
            Password
            <input
              type="password"
              name="password"
              className="login-input"
              required
            />
          </label>
          <button className="login-btn">Login</button>
          {error && <output className="login-error">{error}</output>}
        </form>
        <Link className="login-register-link" to="/register">
          Need an account? Register here.
        </Link>
      </div>
    </div>
  );
}
