import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useApi } from "../api/ApiContext";
import useMutation from "../api/useMutation";

const AddFavorite = ({
  recipeId,
  isFavorited,
  onFavoriteChange,
  className = "",
  children,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { token } = useAuth();
  const { request, invalidateTags } = useApi();

  const { mutate: addToFavorites } = useMutation("POST", "/favorites", [
    "topRecipes",
    "userFavorites",
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

  const handleAddToFavorites = async () => {
    try {
      setIsLoading(true);

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
        onFavoriteChange(recipeId, true);
        alert("Recipe added to favorites!");
      }
    } catch (err) {
      const errorMessage = err.message || err.error || "An error occurred";
      alert(`Error: ${errorMessage}`);
      console.error("Full error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFromFavorites = async () => {
    try {
      setIsLoading(true);

      const userId = getUserIdFromToken();
      if (!userId) {
        navigate("/login");
        return;
      }

      const result = await request(`/favorites/${recipeId}`, {
        method: "DELETE",
        body: JSON.stringify({ user_id: userId }),
      });

      if (result) {
        onFavoriteChange(recipeId, false);
        invalidateTags(["topRecipes", "userFavorites"]);
        alert("Recipe removed from favorites!");
      }
    } catch (err) {
      const errorMessage = err.message || err.error || "An error occurred";
      alert(`Error: ${errorMessage}`);
      console.error("Full error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClick = (e) => {
    e.stopPropagation();
    if (isFavorited) {
      handleRemoveFromFavorites();
    } else {
      handleAddToFavorites();
    }
  };

  if (children) {
    return (
      <div onClick={handleClick} className={className}>
        {children}
      </div>
    );
  }

  return (
    <button onClick={handleClick} disabled={isLoading} className={className}>
      {isLoading
        ? isFavorited
          ? "Removing..."
          : "Adding..."
        : !token
        ? "Login to Favorite"
        : isFavorited
        ? "💔 Remove from Favorites"
        : "❤️ Add to Favorites"}
    </button>
  );
};

export default AddFavorite;
