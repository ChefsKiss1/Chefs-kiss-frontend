import { useState } from "react";
import useMutation from "../api/useMutation";
import "./AddRecipe.css";

export default function AddRecipe() {
  const [title, setTitle] = useState("");
  const [prepTime, setPrepTime] = useState(0);
  const [ingredientList, setIngredientList] = useState("");
  const [instructionList, setInstructionList] = useState("");

  const { mutate, loading, error } = useMutation("POST", "/recipes", [
    "recipes",
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await mutate({
      title,
      prepTime,
      ingredientList,
      instructionList,
    });

    if (success) {
      setTitle("");
      setPrepTime("");
      setIngredientList("");
      setInstructionList("");
      alert("Recipe added!");
    }
  };

  return (
    <div className="add-recipe-container">
      <form onSubmit={handleSubmit} className="add-recipe-form">
        <h2 className="add-recipe-header">Add New Recipe</h2>

        <input
          className="add-recipe-input"
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          className="add-recipe-input"
          type="number"
          placeholder="Prep Time"
          value={prepTime}
          onChange={(e) => setPrepTime(e.target.value)}
        />

        <input
          className="add-recipe-input"
          type="text"
          placeholder="Ingredients (comma-separated)"
          value={ingredientList}
          onChange={(e) => setIngredientList(e.target.value)}
        />

        <textarea
          className="add-recipe-textarea"
          placeholder="Instructions"
          value={instructionList}
          onChange={(e) => setInstructionList(e.target.value)}
        />

        <button type="submit" disabled={loading} className="add-recipe-button">
          {loading ? "Saving..." : "Add Recipe"}
        </button>

        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
}
