// import { useState } from "react";

// const dummyUser = {
//   name: "Your Name",
//   avatar: "https://ui-avatars.com/api/?name=Y+N&background=222&color=fff", // Placeholder
// };

// const dummyRecipes = [
//   { id: 1, title: "Pinned Post", pinned: true },
//   { id: 2, title: "Favorite Recipe", favorite: true },
//   { id: 3, title: "Other Post" },
//   { id: 4, title: "Favorite Recipe 2", favorite: true },
//   { id: 5, title: "Other Post" },
// ];

// export default function ProfilePage() {
//   const [tab, setTab] = useState("favorites"); // or "add-recipe"

//   const filtered =
//     tab === "favorites"
//       ? dummyRecipes.filter((r) => r.favorite || r.pinned)
//       : dummyRecipes;

//   return (
//     <div className="profile-page">
//       <div className="profile-header">
//         <div className="profile-user-row">
//           <img className="profile-avatar" src={dummyUser.avatar} alt="avatar" />
//           <div>
//             <div style={{ fontSize: "1.3rem", fontWeight: "bold" }}>
//               {dummyUser.name}
//             </div>
//           </div>
//         </div>
//         <div className="profile-actions">
//           <button>Settings</button>
//           <button>Edit Profile</button>
//           <button>Log out</button>
//         </div>
//       </div>
//       <div className="profile-main">
//         <div className="profile-tabs">
//           <button
//             className={`profile-tab${tab === "add-recipe" ? " active" : ""}`}
//             onClick={() => setTab("add-recipe")}
//           >
//             Recipes
//           </button>
//           <button
//             className={`profile-tab${tab === "favorites" ? " active" : ""}`}
//             onClick={() => setTab("favorites")}
//           >
//             Favorites
//           </button>
//         </div>
//         <div className="profile-grid">
//           {filtered.map((post) => (
//             <div
//               key={post.id}
//               className={`profile-card${post.pinned ? " pinned" : ""}`}
//             >
//               {post.pinned && <span className="favorite-label">Pinned</span>}
//               {post.favorite && !post.pinned && (
//                 <span className="favorite-label">Favorite</span>
//               )}
//               <div>{post.title}</div>
//             </div>
//           ))}
//         </div>
//         <div className="profile-contact">
//           <a
//             href="/contact"
//             style={{
//               color: "#E50914",
//               textDecoration: "underline",
//               fontWeight: "bold",
//             }}
//           >
//             Contact Us / About Us
//           </a>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState, useEffect } from "react";

export default function ProfilePage() {
  const [tab, setTab] = useState("recipes"); // default to recipes
  const [user, setUser] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfileData() {
      // 1. Get token from localStorage
      const token = sessionStorage.getItem("token");
      console.log(token);
      if (!token) {
        setLoading(false);
        setUser(null);
        setRecipes([]);
        return;
      }

      const BASE_URL = import.meta.env.VITE_API_URL;

      // 2. Fetch user info
      // const userRes = await fetch("/api/me", {
      //   headers: { Authorization: `Bearer ${token}` },
      // });
      // if (!userRes.ok) {
      //   setUser(null);
      //   setRecipes([]);
      //   setLoading(false);
      //   return;
      // }
      // const userData = await userRes.json();
      // setUser(userData);

      // 3. Fetch user’s recipes (replace /api/my-recipes with your endpoint)
      const recipesRes = await fetch(`${BASE_URL}/recipes/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const recipesData = recipesRes.ok ? await recipesRes.json() : [];
      setRecipes(recipesData);
      //console.log(recipesData);
      setLoading(false);
    }
    fetchProfileData();
  }, []);

  // Filter logic for tabs
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
