import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../auth/AuthContext";
import { useApi } from "../api/ApiContext";
import useQuery from "../api/useQuery";
import RecipeCard from "./RecipeCard";

const HomePage = () => {
  const [userFavorites, setUserFavorites] = useState([]);
  const [displayRecipes, setDisplayRecipes] = useState([]);
  const { token } = useAuth();
  const { request } = useApi();

  const {
    data: favoritedRecipes = [],
    loading: favoritesLoading,
    error: favoritesError,
  } = useQuery("/favorites/top-favorited", "topRecipes");

  const needsRandomRecipes = favoritedRecipes.length < 9;
  const {
    data: randomRecipes = [],
    loading: randomLoading,
    error: randomError,
  } = useQuery(needsRandomRecipes ? "/recipes/random" : null, "randomRecipes");

  const fetchUserFavorites = useCallback(async () => {
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
  }, [token, request]);

  useEffect(() => {
    fetchUserFavorites();
  }, [fetchUserFavorites]);

  useEffect(() => {
    let recipes = [];

    if (favoritedRecipes.length >= 9) {
      recipes = favoritedRecipes.slice(0, 9);
    } else if (randomRecipes.length > 0) {
      const favoritedIds = new Set(favoritedRecipes.map((recipe) => recipe.id));
      const uniqueRandomRecipes = randomRecipes.filter(
        (recipe) => !favoritedIds.has(recipe.id)
      );

      recipes = [
        ...favoritedRecipes,
        ...uniqueRandomRecipes.slice(0, 9 - favoritedRecipes.length),
      ];
    } else {
      recipes = favoritedRecipes;
    }

    setDisplayRecipes(recipes);
  }, [favoritedRecipes, randomRecipes]);

  const handleFavoriteChange = (recipeId, isNowFavorited) => {
    if (isNowFavorited) {
      setUserFavorites((prev) => [...prev, recipeId]);
    } else {
      setUserFavorites((prev) => prev.filter((id) => id !== recipeId));
    }
  };

  const loading = favoritesLoading || (needsRandomRecipes && randomLoading);
  const error = favoritesError || randomError;

  return (
    <div>
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

          {displayRecipes.length > 0 && !loading && (
            <div className="recipes-grid">
              {displayRecipes.map((recipe) => {
                const isFavoritedRecipe = favoritedRecipes.some(
                  (fav) => fav.id === recipe.id
                );

                return (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    isFavorited={userFavorites.includes(recipe.id)}
                    onFavoriteChange={handleFavoriteChange}
                  >
                    {!isFavoritedRecipe && (
                      <div className="recipe-badge">Random Pick</div>
                    )}
                  </RecipeCard>
                );
              })}
            </div>
          )}
          {displayRecipes.length === 0 && !loading && <p>No recipes found.</p>}
        </section>
      </div>
    </div>
  );
};

export default HomePage;
