import { useMemo, useState, useEffect } from "react";
import useQuery from "../api/useQuery";
import RecipeCard from "./RecipeCard";

const HomePage = () => {
  const [optimisticFavorites, setOptimisticFavorites] = useState(new Set());
  const [refetchKey, setRefetchKey] = useState(0);

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
  } = useQuery(
    needsRandomRecipes ? "/recipes/random" : "/recipes/empty",
    "randomRecipes"
  );

  const {
    data: userFavoritesData = [],
    loading: userFavoritesLoading,
    error: userFavoritesError,
  } = useQuery("/favorites/user", "userFavorites");

  const serverFavorites = userFavoritesData.map(
    (fav) => fav.recipe_id || fav.id
  );
  const userFavorites = [...serverFavorites, ...optimisticFavorites];

  const displayRecipes = useMemo(() => {
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

    return recipes;
  }, [favoritedRecipes, randomRecipes]);

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

    setTimeout(() => {
      setRefetchKey((prev) => prev + 1);
      setOptimisticFavorites(new Set());
    }, 1000);
  };

  useEffect(() => {
    if (refetchKey > 0) {
      window.location.reload();
    }
  }, [refetchKey]);

  const loading =
    favoritesLoading ||
    (needsRandomRecipes && randomLoading) ||
    userFavoritesLoading;
  const error = favoritesError || randomError || userFavoritesError;

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
