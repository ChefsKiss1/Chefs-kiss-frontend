import { NavLink } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Navbar() {
  const { token, logout } = useAuth();

  return (
    <header className="navbar-header">
      <NavLink className="navbar-brand" to="/Home">
        <p style={{ margin: 0 }}>Chef's Kiss</p>
      </NavLink>
      <nav className="navbar-nav">
        <NavLink
          to="/AddRecipe"
          className={({ isActive }) =>
            "navbar-link" + (isActive ? " active" : "")
          }
        >
          Add Recipe
        </NavLink>
        <NavLink
          to="/Profile"
          className={({ isActive }) =>
            "navbar-link" + (isActive ? " active" : "")
          }
        >
          Profile
        </NavLink>
        {token ? (
          <button className="navbar-button" onClick={logout}>
            Log out
          </button>
        ) : (
          <NavLink to="/login" className="navbar-button">
            Log in
          </NavLink>
        )}
      </nav>
    </header>
  );
}
