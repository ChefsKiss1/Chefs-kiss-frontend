import { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import { useApi } from "../api/ApiContext";
import useQuery from "../api/useQuery";
import RecipeCard from "./RecipeCard";

const HomePage = () => {
  const [userFavorites, setUserFavorites] = useState([]);
  const { token } = useAuth();
  const { request } = useApi();

  const {
    data: recipes = [],
    loading,
    error,
  } = useQuery("/favorites/top-favorited", "topRecipes");

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

  const handleFavoriteChange = (recipeId, isNowFavorited) => {
    if (isNowFavorited) {
      setUserFavorites((prev) => [...prev, recipeId]);
    } else {
      setUserFavorites((prev) => prev.filter((id) => id !== recipeId));
    }
  };

  // Calculate max favorites for top favorite display
  const maxFavorites =
    recipes.length > 0 ? Math.max(...recipes.map((r) => r.favoritecount)) : 0;

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

              {recipes.map((recipe, index) => {
                const isTopFavorited = recipe.favoritecount === maxFavorites;

                return (
                  <div key={recipe.id || index} className="recipe-card-wrapper">
                    <div className="recipe-rank">#{index + 1}</div>
                    {isTopFavorited && (
                      <div className="top-favorite-tag">🏆 Most Favorited!</div>
                    )}

                    <RecipeCard
                      recipe={recipe}
                      onFavoriteChange={handleFavoriteChange}
                      isFavorited={userFavorites.includes(recipe.id)}
                    />
                  </div>
                );
              })}
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
