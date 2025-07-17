import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../auth/AuthContext";
import { useApi } from "../api/ApiContext";
import useQuery from "../api/useQuery";
import RecipeCard from "./RecipeCard";

export default function HomePage() {
  const [userFavorites, setUserFavorites] = useState([]);
  const [displayRecipes, setDisplayRecipes] = useState([]);
  const { token } = useAuth();
  const { request } = useApi();

  // Get top favorited recipes
  const {
    data: favoritedRecipes = [],
    loading: favoritesLoading,
    error: favoritesError,
  } = useQuery("/favorites/top-favorited", "topRecipes");

  const needsRandomRecipes = favoritedRecipes.length < 9;

  // Get random recipes only if needed
  const {
    data: randomRecipes = [],
    loading: randomLoading,
    error: randomError,
  } = useQuery(needsRandomRecipes ? "/recipes/random" : "", "randomRecipes");

  // Get user favorite recipe IDs
  const fetchUserFavorites = useCallback(async () => {
    if (token) {
      try {
        const favorites = await request("/favorites/user", {
          method: "GET",
        });

        const favoriteIds = favorites.map((fav) => fav.recipe_id || fav.id);
        setUserFavorites(favoriteIds);
      } catch (error) {
        console.error("Error fetching user favorites:", error);
      }
    }
  }, [token, request]);

  useEffect(() => {
    fetchUserFavorites();
  }, [fetchUserFavorites]);

  useEffect(() => {
    let recipes = [];

    if (favoritedRecipes.length >= 9) {
      recipes = favoritedRecipes.slice(0, 9);
    } else if (randomRecipes.length > 0) {
      const favoritedIds = new Set(favoritedRecipes.map((r) => r.id));
      const uniqueRandom = randomRecipes.filter((r) => !favoritedIds.has(r.id));
      recipes = [
        ...favoritedRecipes,
        ...uniqueRandom.slice(0, 9 - favoritedRecipes.length),
      ];
    } else {
      recipes = favoritedRecipes;
    }

    setDisplayRecipes(recipes);
  }, [favoritedRecipes, randomRecipes]);

  const handleFavoriteChange = (recipeId, isNowFavorited) => {
    setUserFavorites((prev) =>
      isNowFavorited
        ? [...prev, recipeId]
        : prev.filter((id) => id !== recipeId)
    );
  };

  const loading = favoritesLoading || (needsRandomRecipes && randomLoading);
  const error = favoritesError || randomError;

  return (
    <div className="home-content">
      <h1>Welcome to Chef&apos;s Kiss</h1>

      <section className="featured-recipes">
        <h2>Featured Recipes</h2>

        {loading && <p>Loading...</p>}
        {error && (
          <p>
            Error:{" "}
            {typeof error === "string" ? error : "Failed to load recipes"}
          </p>
        )}

        {!loading && displayRecipes.length > 0 && (
          <div className="recipes-grid">
            {displayRecipes.map((recipe) => {
              const isFavorited = userFavorites.includes(recipe.id);
              const isTop = favoritedRecipes.some(
                (fav) => fav.id === recipe.id
              );

              return (
                <div key={recipe.id} className="recipe-card-wrapper">
                  <RecipeCard
                    recipe={recipe}
                    isFavorited={isFavorited}
                    onFavoriteChange={handleFavoriteChange}
                  />
                  {!isTop && <span className="recipe-badge">Random Pick</span>}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
