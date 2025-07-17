import { useState } from "react";
import useMutation from "../api/useMutation";
import "./AddRecipe.css";

export default function AddRecipe() {
  const [formData, setFormData] = useState({
    title: "",
    prepTime: "",
    ingredientList: "",
    instructionList: "",
  });

  const { mutate, loading, error } = useMutation("POST", "/recipes", [
    "recipes",
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { title, prepTime, ingredientList, instructionList } = formData;

    if (!title || !prepTime || !ingredientList || !instructionList) {
      alert("Please fill in all fields.");
      return;
    }

    const success = await mutate({
      title,
      prepTime: Number(prepTime),
      ingredientList: ingredientList.split(",").map((item) => item.trim()),
      instructionList,
    });

    if (success) {
      setFormData({
        title: "",
        prepTime: "",
        ingredientList: "",
        instructionList: "",
      });
      alert("Recipe added!");
    }
  };

  return (
    <div className="add-recipe-container">
      <form onSubmit={handleSubmit} className="add-recipe-form">
        <h2 className="add-recipe-header">Add New Recipe</h2>

        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          placeholder="e.g., Sushi Rolls"
          value={formData.title}
          onChange={handleChange}
        />

        <label htmlFor="prepTime">Image URL</label>
        <input
          id="prepTime"
          name="prepTime"
          className="add-recipe-input"
          type="string"
          min="1"
          placeholder="unsplash, pexels, etc."
          value={formData.prepTime}
          onChange={handleChange}
        />

        <label htmlFor="prepTime">Prep Time (minutes)</label>
        <input
          id="prepTime"
          name="prepTime"
          className="add-recipe-input"
          type="number"
          min="1"
          placeholder="e.g., 30"
          value={formData.prepTime}
          onChange={handleChange}
        />

        <label htmlFor="ingredientList">Ingredients</label>
        <input
          id="ingredientList"
          name="ingredientList"
          className="add-recipe-input"
          type="text"
          placeholder="e.g., rice, vinegar, seaweed"
          value={formData.ingredientList}
          onChange={handleChange}
        />

        <label htmlFor="instructionList">Instructions</label>
        <textarea
          id="instructionList"
          name="instructionList"
          className="add-recipe-textarea"
          placeholder="e.g., Rinse rice thoroughly, boil with vinegar..."
          value={formData.instructionList}
          onChange={handleChange}
        />

        <button type="submit" disabled={loading} className="add-recipe-button">
          {loading ? "Saving..." : "Add Recipe"}
        </button>

        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
}
