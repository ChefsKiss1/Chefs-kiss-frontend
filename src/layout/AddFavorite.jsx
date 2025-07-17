import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import useMutation from "../api/useMutation";

const AddFavorite = ({
  recipeId,
  isFavorited,
  onFavoriteChange,
  className = "",
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { token } = useAuth();

  const { mutate: addToFavorites } = useMutation("POST", "/favorites", [
    "topRecipes",
    "userFavorites",
    "randomRecipes",
  ]);

  const { mutate: removeFromFavorites } = useMutation(
    "DELETE",
    `/favorites/${recipeId}`,
    ["topRecipes", "userFavorites", "randomRecipes"]
  );

  const getUserIdFromToken = () => {
    if (!token) return null;

    try {
      const parts = token.split(".");
      if (parts.length !== 3) {
        console.error("Invalid token format");
        return null;
      }

      const payload = JSON.parse(atob(parts[1]));
      return payload.id;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  const handleError = (err) => {
    const errorMessage = err.message || err.error || "An error occurred";
    alert(`Error: ${errorMessage}`);
    console.error("Full error:", err);
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
      }
    } catch (err) {
      handleError(err);
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

      const success = await removeFromFavorites({
        user_id: userId,
      });

      if (success) {
        onFavoriteChange(recipeId, false);
      }
    } catch (err) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClick = (e) => {
    e.stopPropagation();

    if (!token) {
      navigate("/login");
      return;
    }

    if (isFavorited) {
      handleRemoveFromFavorites();
    } else {
      handleAddToFavorites();
    }
  };

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
