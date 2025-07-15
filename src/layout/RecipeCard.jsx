import { useNavigate } from "react-router-dom";

const RecipeCard = ({
  recipe,
  rank,
  recipes,
  onAddToFavorites,
  onRemoveFromFavorites,
  favoritingRecipe,
  token,
  showRank = false,
  showTopFavoriteTag = false,
  isFavorited = false,
  currentUserId,
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

      {recipe.ownerId === currentUserId && (
        <button
          onClick={e => {
            e.stopPropagation();
            navigate(`/recipe/${recipe.id}/edit`);
          }}
        >
          Edit
        </button>
      )}

      {(onAddToFavorites || onRemoveFromFavorites) && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (isFavorited && onRemoveFromFavorites) {
              onRemoveFromFavorites(recipe.id);
            } else if (onAddToFavorites) {
              onAddToFavorites(recipe.id);
            }
          }}
          disabled={favoritingRecipe === recipe.id}
        >
          {favoritingRecipe === recipe.id
            ? isFavorited
              ? "Removing..."
              : "Adding..."
            : !token
            ? "Login to Favorite"
            : isFavorited
            ? "💔 Remove from Favorites"
            : "❤️ Add to Favorites"}
        </button>
      )}
    </div>
  );
};

export default RecipeCard;
