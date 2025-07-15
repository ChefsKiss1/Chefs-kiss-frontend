import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useApi } from "../api/ApiContext";

const RecipeEdit = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const { request } = useApi();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState(null);
  const [title, setTitle] = useState("");
  const [instructions, setInstructions] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      const data = await request(`/recipes/${id}`, { method: "GET" });
      setRecipe(data);
      setTitle(data.name);
      setInstructions(data.instructions);
      setLoading(false);
    };
    fetchRecipe();
  }, [id, request]);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    await request(`/recipes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: title, instructions }),
    });
    navigate(`/recipe/${id}`);
  };

  if (loading) return <p>Loading...</p>;
  if (!recipe) return <p>Recipe not found.</p>;

  return (
    <form onSubmit={handleEditSubmit}>
      <h2>Edit Recipe</h2>
      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Title"
        required
      />
      <textarea
        value={instructions}
        onChange={e => setInstructions(e.target.value)}
        placeholder="Instructions"
        required
      />
      <button type="submit">Save</button>
      <button type="button" onClick={() => navigate(-1)}>Cancel</button>
    </form>
  );
};

export default RecipeEdit;
