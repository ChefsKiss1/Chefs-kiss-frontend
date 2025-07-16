import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const [tab, setTab] = useState("recipes");
  const [user, setUser] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfileData() {
      const token = sessionStorage.getItem("token");
      if (!token) {
        setLoading(false);
        setUser(null);
        setRecipes([]);
        return;
      }
      const BASE_URL = import.meta.env.VITE_API_URL;

      // Fetch user profile
      const userRes = await fetch(`${BASE_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const userData = userRes.ok ? await userRes.json() : null;

      // If not logged in or token invalid
      if (!userData) {
        setUser(null);
        setRecipes([]);
        setLoading(false);
        return;
      }
      setUser(userData);

      // Fetch recipes for user
      const recipesRes = await fetch(`${BASE_URL}/recipes/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const recipesData = recipesRes.ok ? await recipesRes.json() : [];
      setRecipes(recipesData);

      setLoading(false);
    }
    fetchProfileData();
  }, []);

  const filtered =
    tab === "favorites"
      ? recipes.filter((r) => r.favorite || r.pinned)
      : recipes;

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please log in.</div>;

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-user-row">
          <img className="profile-avatar" src={user.avatar} alt="avatar" />
          <div>
            <div style={{ fontSize: "1.3rem", fontWeight: "bold" }}>
              {user.name}
            </div>
          </div>
        </div>
        <div className="profile-actions">
          <button>Settings</button>
          <button>Edit Profile</button>
          <button>Log out</button>
        </div>
      </div>
      <div className="profile-main">
        <div className="profile-tabs">
          <button
            className={`profile-tab${tab === "recipes" ? " active" : ""}`}
            onClick={() => setTab("recipes")}
          >
            Recipes
          </button>
          <button
            className={`profile-tab${tab === "favorites" ? " active" : ""}`}
            onClick={() => setTab("favorites")}
          >
            Favorites
          </button>
        </div>
        <div className="profile-grid">
          {filtered.map((post) => (
            <div
              key={post.id}
              className={`profile-card${post.pinned ? " pinned" : ""}`}
            >
              {post.pinned && <span className="favorite-label">Pinned</span>}
              {post.favorite && !post.pinned && (
                <span className="favorite-label">Favorite</span>
              )}
              <div>{post.title}</div>
              <button
                style={{ marginTop: "8px" }}
                onClick={() => navigate(`/recipe/${post.id}/edit`)}
              >
                Edit
              </button>
            </div>
          ))}
        </div>
        <div className="profile-contact">
          <a
            href="/contact"
            style={{
              color: "#E50914",
              textDecoration: "underline",
              fontWeight: "bold",
            }}
          >
            Contact Us / About Us
          </a>
        </div>
      </div>
    </div>
  );
}
