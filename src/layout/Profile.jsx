import { useState } from "react";

const dummyUser = {
  name: "Your Name",
  avatar: "https://ui-avatars.com/api/?name=Y+N&background=222&color=fff", // Placeholder
};

const dummyRecipes = [
  { id: 1, title: "Pinned Post", pinned: true },
  { id: 2, title: "Favorite Recipe", favorite: true },
  { id: 3, title: "Other Post" },
  { id: 4, title: "Favorite Recipe 2", favorite: true },
  { id: 5, title: "Other Post" },
];

export default function ProfilePage() {
  const [tab, setTab] = useState("favorites"); // or "add-recipe"

  const filtered =
    tab === "favorites"
      ? dummyRecipes.filter((r) => r.favorite || r.pinned)
      : dummyRecipes;

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-user-row">
          <img className="profile-avatar" src={dummyUser.avatar} alt="avatar" />
          <div>
            <div style={{ fontSize: "1.3rem", fontWeight: "bold" }}>
              {dummyUser.name}
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
            className={`profile-tab${tab === "add-recipe" ? " active" : ""}`}
            onClick={() => setTab("add-recipe")}
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
