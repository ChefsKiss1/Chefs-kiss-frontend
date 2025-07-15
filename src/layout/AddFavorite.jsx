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
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { token } = useAuth();
  const { request } = useApi();

  const { mutate: addToFavorites } = useMutation("POST", "/favorites", []);

  const getUserIdFromToken = () => {
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
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
        window.location.reload();
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

      const result = await request(`/favorites/${recipeId}`, {
        method: "DELETE",
        body: JSON.stringify({ user_id: userId }),
      });

      if (result) {
        onFavoriteChange(recipeId, false);
        window.location.reload();
      }
    } catch (err) {
      handleError(err);
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
