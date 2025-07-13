import { useNavigate } from "react-router-dom";

const RecipeCard = ({
  recipe,
  rank,
  recipes,
  onAddToFavorites,
  favoritingRecipe,
  token,
  showRank = false,
  showTopFavoriteTag = false,
}) => {
  const navigate = useNavigate();

  const handleUsernameClick = (username) => {
    navigate(`/profile/${username}`);
  };

  const handleRecipeClick = () => {
    navigate(`/recipe/${recipe.id}`);
  };

  const maxFavorites = recipes
    ? Math.max(...recipes.map((r) => r.favoritecount))
    : 0;
  const isTopFavorited =
    showTopFavoriteTag && recipe.favoritecount === maxFavorites;

  return (
    <div
      className="recipe-card"
      onClick={handleRecipeClick}
      style={{ cursor: "pointer" }}
    >
      {showRank && <span>#{rank}</span>}
      {isTopFavorited && (
        <span className="top-favorite-tag">🏆 Most Favorited!</span>
      )}
      <h3>{recipe.name}</h3>
      <p>
        Created by:
        <span
          className="username-link"
          onClick={(e) => {
            e.stopPropagation();
            handleUsernameClick(recipe.username);
          }}
        >
          {recipe.username}
        </span>
      </p>
      <p>Favorites: {recipe.favoritecount}</p>

      {onAddToFavorites && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAddToFavorites(recipe.id);
          }}
          disabled={favoritingRecipe === recipe.id}
        >
          {favoritingRecipe === recipe.id
            ? "Adding..."
            : !token
            ? "Login to Favorite"
            : "❤️ Add to Favorites"}
        </button>
      )}
    </div>
  );
};

export default RecipeCard;
