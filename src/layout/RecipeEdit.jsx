import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useApi } from "../api/ApiContext";
import "./RecipeEdit.css";
const RecipeEdit = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const { request } = useApi();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [title, setTitle] = useState("");
  const [instructions, setInstructions] = useState("");
  const [ingredientList, setIngredientList] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchRecipe = async () => {
      const data = await request(`/recipes/${id}`, { method: "GET" });
      setRecipe(data);
      setTitle(data.name);
      setInstructions(data.instructions);
      setIngredientList(
        data.ingredientList ? data.ingredientList.join(", ") : ""
      );
      setPrepTime(data.prepTime ? String(data.prepTime) : "");
      setLoading(false);
    };
    fetchRecipe();
  }, [id, request]);
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    await request(`/recipes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: title,
        instructions,
        ingredientList: ingredientList.split(",").map((item) => item.trim()),
        prepTime: Number(prepTime),
      }),
    });
    navigate(`/recipe/${id}`);
  };
  if (loading) return <p>Loading...</p>;
  if (!recipe) return <p>Recipe not found.</p>;
  return (
    <div className="recipe-edit-container">
      {" "}
      {/* <-- Add this wrapper */}
      <form className="recipe-edit-form" onSubmit={handleEditSubmit}>
        <h2 className="recipe-edit-header">Edit Recipe</h2>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          required
        />

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Image URL"
          required
        />

        <input
          type="number"
          value={prepTime}
          onChange={(e) => setPrepTime(e.target.value)}
          placeholder="Prep Time (minutes)"
          min="1"
          required
        />
        <input
          type="text"
          value={ingredientList}
          onChange={(e) => setIngredientList(e.target.value)}
          placeholder="Ingredients (comma separated)"
          required
        />
        <textarea
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder="Instructions"
          required
        />
        <button type="submit" className="cancel-btn">
          Save
        </button>
        <button
          type="button"
          className="cancel-btn"
          onClick={() => navigate(-1)}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};
export default RecipeEdit;
