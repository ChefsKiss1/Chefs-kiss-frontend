import { useNavigate } from "react-router-dom";
import AddFavorite from "./AddFavorite";


const RecipeCard = ({ recipe, onFavoriteChange, isFavorited = false }) => {
  const navigate = useNavigate();

  const handleUsernameClick = (username) => {
    navigate(`/profile/${username}`);
  };

  const handleRecipeClick = () => {
    navigate(`/recipe/${recipe.id}`);
  };

  return (
    <div
      className="recipe-card"
      onClick={handleRecipeClick}
      style={{ cursor: "pointer" }}
    >
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
