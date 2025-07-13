import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import useQuery from "../api/useQuery";
import useMutation from "../api/useMutation";
import RecipeCard from "./RecipeCard";

const HomePage = () => {
  const [favoritingRecipe, setFavoritingRecipe] = useState(null);
  const navigate = useNavigate();
  const { token } = useAuth();

  const {
    data: recipes = [],
    loading,
    error,
  } = useQuery("/recipes/favorites/top-favorited?limit=9", "topRecipes");

  const { mutate: addToFavorites } = useMutation("POST", "/recipes/favorites", [
    "topRecipes",
  ]);

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
        alert("Recipe added to favorites!");
      }
    } catch (err) {
      alert(`Error: ${err.message}`);
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
                  favoritingRecipe={favoritingRecipe}
                  token={token}
                  showRank={true}
                  showTopFavoriteTag={true}
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
