import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import RecipeCard from "./RecipeCard";

export default function ProfilePage() {
  const [tab, setTab] = useState("recipes");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRecipes, setUserRecipes] = useState([]);
  const [userFavoritesData, setUserFavoritesData] = useState([]);
  const [recipesLoading, setRecipesLoading] = useState(false);
  const [recipesError, setRecipesError] = useState(null);
  const [optimisticFavorites, setOptimisticFavorites] = useState(new Set());
  const [refetchKey, setRefetchKey] = useState(0);
  const navigate = useNavigate();

  // Fetch user profile data
  useEffect(() => {
    async function fetchUserData() {
      const token = sessionStorage.getItem("token");
      if (!token) {
        setLoading(false);
        setUser(null);
        return;
      }

      const BASE_URL = import.meta.env.VITE_API_URL;

      try {
        const userRes = await fetch(`${BASE_URL}/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (userRes.ok) {
          const userData = await userRes.json();
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUser(null);
      }

      setLoading(false);
    }

    fetchUserData();
  }, [refetchKey]);

  // Fetch recipes and favorites when user is loaded
  useEffect(() => {
    if (!user) return;

    async function fetchUserRecipesAndFavorites() {
      const token = sessionStorage.getItem("token");
      if (!token) return;

      setRecipesLoading(true);
      setRecipesError(null);

      const BASE_URL = import.meta.env.VITE_API_URL;

      try {
        // Fetch user's recipes
        const recipesRes = await fetch(`${BASE_URL}/recipes/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (recipesRes.ok) {
          const recipes = await recipesRes.json();
          setUserRecipes(recipes);
        } else {
          setRecipesError("Failed to load recipes");
        }

        // Fetch user's favorites
        const favoritesRes = await fetch(`${BASE_URL}/favorites/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (favoritesRes.ok) {
          const favorites = await favoritesRes.json();
          setUserFavoritesData(favorites);
        } else {
          setUserFavoritesData([]);
        }
      } catch (error) {
        console.error("Error fetching recipes/favorites:", error);
        setRecipesError("Failed to load data");
      }

      setRecipesLoading(false);
    }

    fetchUserRecipesAndFavorites();
  }, [user, refetchKey]);

  // Get favorited recipe IDs
  const serverFavorites = userFavoritesData.map(
    (fav) => fav.recipe_id || fav.id
  );
  const userFavoriteIds = [...serverFavorites, ...optimisticFavorites];

  // Filter recipes based on active tab
  const filtered = tab === "favorites" ? userFavoritesData : userRecipes;

  // Handle favorite changes
  const handleFavoriteChange = (recipeId, isNowFavorited) => {
    setOptimisticFavorites((prev) => {
      const newSet = new Set(prev);
      if (isNowFavorited) {
        newSet.add(recipeId);
      } else {
        newSet.delete(recipeId);
      }
      return newSet;
    });

    // Refetch data after a short delay
    setTimeout(() => {
      setRefetchKey((prev) => prev + 1);
      setOptimisticFavorites(new Set());
    }, 1000);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) return <div>Loading user...</div>;
  if (!user) return <div className="please-login">Please log in.</div>;

  if (recipesLoading) {
    return (
      <div className="profile-page">
        <div className="profile-header">
          <div className="profile-user-row">
            <img
              className="profile-avatar"
              src={
                user.avatar || "https://randomuser.me/api/portraits/men/32.jpg"
              }
              alt="avatar"
            />
            <div>
              <div style={{ fontSize: "1.3rem", fontWeight: "bold" }}>
                {user.username || user.name}
              </div>
            </div>
          </div>
          <div className="profile-actions">
            <button>Settings</button>
            <button>Edit Profile</button>
            <button>Delete Recipe</button>
          </div>
        </div>
        <div>Loading recipes...</div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-user-row">
          <img
            className="profile-avatar"
            src={
              user.avatar || "https://randomuser.me/api/portraits/men/32.jpg"
            }
            alt="avatar"
          />
          <div>
            <div style={{ fontSize: "1.3rem", fontWeight: "bold" }}>
              {user.username || user.name}
            </div>
          </div>
        </div>
        <div className="profile-actions">
          <button>Settings</button>
          <button>Edit Profile</button>
          <button onClick={handleLogout}>Log out</button>
        </div>
      </div>
      <div className="profile-main">
        <div className="profile-tabs">
          <button
            className={`profile-tab${tab === "recipes" ? " active" : ""}`}
            onClick={() => setTab("recipes")}
          >
            Recipes ({userRecipes.length})
          </button>
          <button
            className={`profile-tab${tab === "favorites" ? " active" : ""}`}
            onClick={() => setTab("favorites")}
          >
            Favorites ({userFavoritesData.length})
          </button>
        </div>

        {recipesError && <div>Error loading recipes: {recipesError}</div>}

        {filtered.length === 0 && !recipesError && (
          <div style={{ textAlign: "center", padding: "2rem" }}>
            <p>
              {tab === "recipes"
                ? "You haven't created any recipes yet."
                : "You don't have any favorite recipes yet."}
            </p>
          </div>
        )}

        <div className="profile-grid">
          {filtered.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              isFavorited={userFavoriteIds.includes(recipe.id)}
              onFavoriteChange={handleFavoriteChange}
            >
              {tab === "recipes" && (
                <button
                  style={{
                    marginTop: "8px",
                    padding: "4px 8px",
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/recipe/${recipe.id}/edit`);
                  }}
                >
                  Edit
                </button>
              )}
            </RecipeCard>
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

/* --- COMMENT OUT THE BELOW useEffect IF PRESENT! ---

  useEffect(() => {
    async function fetchProfileData() {
      // ... original backend code ...
    }
    fetchProfileData();
  }, []);
*/
