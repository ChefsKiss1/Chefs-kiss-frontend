import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "./AuthContext";
import "./Register.css";

/** A form that allows users to register for a new account */
export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState(null);

  const onRegister = async (formData) => {
    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");
    try {
      await register({ username, email, password });
      navigate("/");
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="register-page-container">
      <div className="register-header">
        <h1 className="register-title">CHEF'S KISS</h1>
      </div>

      <div className="register-form-wrapper">
        <h2 className="register-subtitle">Create Your Account</h2>

        <form action={onRegister} className="register-form">
          <label className="register-label">
            Username
            <input
              type="text"
              name="username"
              className="register-input"
              placeholder="Enter your username"
              required
            />
          </label>

          <label className="register-label">
            Email
            <input
              type="email"
              name="email"
              className="register-input"
              placeholder="Enter your email"
              required
            />
          </label>

          <label className="register-label">
            Password
            <input
              type="password"
              name="password"
              className="register-input"
              placeholder="Enter your password"
              required
            />
          </label>

          <button type="submit" className="register-btn">
            Create Account
          </button>

          {error && <div className="register-error">{error}</div>}
        </form>

        <Link to="/login" className="register-login-link">
          Already have an account? Sign in here
        </Link>
      </div>
    </div>
  );
}
