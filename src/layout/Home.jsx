import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useApi } from "../api/ApiContext";
import useQuery from "../api/useQuery";
import useMutation from "../api/useMutation";
import RecipeCard from "./RecipeCard";

const HomePage = () => {
  const [favoritingRecipe, setFavoritingRecipe] = useState(null);
  const [userFavorites, setUserFavorites] = useState([]);
  const navigate = useNavigate();
  const { token } = useAuth();
  const { request, invalidateTags } = useApi();

  const {
    data: recipes = [],
    loading,
    error,
  } = useQuery("/favorites/top-favorited", "topRecipes");

  const { mutate: addToFavorites } = useMutation("POST", "/favorites", [
    "topRecipes",
    "userFavorites",
  ]);

  useEffect(() => {
    const fetchUserFavorites = async () => {
      if (token) {
        try {
          const favorites = await request("/favorites/user", {
            method: "GET",
          });
          if (favorites && Array.isArray(favorites)) {
            const favoriteIds = favorites.map((fav) => fav.recipe_id || fav.id);
            setUserFavorites(favoriteIds);
          }
        } catch (error) {
          console.error("Error fetching user favorites:", error);
        }
      }
    };

    fetchUserFavorites();
  }, [token, request]);

  const getUserIdFromToken = () => {
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.user_id || payload.id;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  const handleAddToFavorites = async (recipeId) => {
    try {
      setFavoritingRecipe(recipeId);

      const userId = getUserIdFromToken();
      if (!userId) {
        navigate("/login");
        return;
      }

      const success = await addToFavorites({
        recipe_id: recipeId,
        user_id: userId,
      });

      if (success) {
        setUserFavorites((prev) => [...prev, recipeId]);
        alert("Recipe added to favorites!");
      }
    } catch (err) {
      const errorMessage = err.message || err.error || "An error occurred";
      alert(`Error: ${errorMessage}`);
      console.error("Full error:", err);
    } finally {
      setFavoritingRecipe(null);
    }
  };

  const handleRemoveFromFavorites = async (recipeId) => {
    try {
      setFavoritingRecipe(recipeId);

      const userId = getUserIdFromToken();
      if (!userId) {
        navigate("/login");
        return;
      }
      
      const result = await request(`/favorites/${recipeId}`, {
        method: "DELETE",
        body: JSON.stringify({ user_id: userId }),
      });

      if (result) {
        setUserFavorites((prev) => prev.filter((id) => id !== recipeId));
        invalidateTags(["topRecipes", "userFavorites"]);
        alert("Recipe removed from favorites!");
      }
    } catch (err) {
      const errorMessage = err.message || err.error || "An error occurred";
      alert(`Error: ${errorMessage}`);
      console.error("Full error:", err);
    } finally {
      setFavoritingRecipe(null);
    }
  };

  return (
    <div>
      <div className="home-content">
        <h1>Welcome to Chef's Kiss</h1>

        <section className="featured-recipes">
          <h2>Top 9 Most Favorited Recipes</h2>

          {loading && <p>Loading...</p>}
          {error && <p>Error: {error}</p>}

          {recipes.length > 0 && !loading && (
            <div className="recipes-grid">
              {recipes.map((recipe, index) => (
                <RecipeCard
                  key={recipe.id || index}
                  recipe={recipe}
                  rank={index + 1}
                  recipes={recipes}
                  onAddToFavorites={handleAddToFavorites}
                  onRemoveFromFavorites={handleRemoveFromFavorites}
                  favoritingRecipe={favoritingRecipe}
                  token={token}
                  showRank={true}
                  showTopFavoriteTag={true}
                  isFavorited={userFavorites.includes(recipe.id)}
                />
              ))}
            </div>
          )}

          {recipes.length === 0 && !loading && !error && (
            <p>No recipes found.</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default HomePage;
