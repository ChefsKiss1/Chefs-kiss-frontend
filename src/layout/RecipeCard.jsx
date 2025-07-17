import { useNavigate } from "react-router-dom";
import AddFavorite from "./AddFavorite";
import "./RecipeCard.css";

const RecipeCard = ({
  recipe,
  onFavoriteChange,
  isFavorited = false,
  children,
}) => {
  const navigate = useNavigate();

  const handleUsernameClick = (username) => {
    navigate(`/profile/${username}`);
  };

  const handleRecipeClick = () => {
    navigate(`/recipes/${recipe.id}`);
  };

  return (
    <div
      className="recipe-card"
      onClick={handleRecipeClick}
      style={{ cursor: "pointer" }}
    >
      {children}

      <h3>{recipe.name}</h3>

      {recipe.img_url && (
        <img
          src={recipe.img_url}
          alt={recipe.name}
          className="recipe-image"
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
      )}

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

      {recipe.favoritecount !== undefined && (
        <p className="favorite-count">❤️ {recipe.favoritecount} favorites</p>
      )}

      {onFavoriteChange && (
        <AddFavorite
          recipeId={recipe.id}
          isFavorited={isFavorited}
          onFavoriteChange={onFavoriteChange}
        />
      )}
    </div>
  );
};

export default RecipeCard;
