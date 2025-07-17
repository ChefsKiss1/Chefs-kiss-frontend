import { useMemo, useState, useEffect } from "react";
import useQuery from "../api/useQuery";
import RecipeCard from "./RecipeCard";

<<<<<<< HEAD
export default function HomePage() {
  const [userFavorites, setUserFavorites] = useState([]);
  const [displayRecipes, setDisplayRecipes] = useState([]);
  const { token } = useAuth();
  const { request } = useApi();
=======
const HomePage = () => {
  const [optimisticFavorites, setOptimisticFavorites] = useState(new Set());
  const [refetchKey, setRefetchKey] = useState(0);
>>>>>>> 318325453aea56d3b707e09370e4566bc38faa6a

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
      const favoritedIds = new Set(favoritedRecipes.map((r) => r.id));
      const uniqueRandom = randomRecipes.filter((r) => !favoritedIds.has(r.id));
      recipes = [
        ...favoritedRecipes,
        ...uniqueRandom.slice(0, 9 - favoritedRecipes.length),
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
