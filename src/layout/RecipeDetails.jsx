// import { useParams } from "react-router";
// // import useQuery from "../api/useQuery";
// // import getRecipeById from "/db/queries/recipes";
// import { useEffect, useState } from "react";

// export default function RecipeDetails({ setRecipe }) {
//   //   const { data: recipes, loading, error } = useQuery("/recipes", "recipes");
//   const [recipe, setLocalRecipe] = useState(null);
//   const { id } = useParams();
//   console.log(id);
//   useEffect(() => {
//     const fetchRecipe = async () => {
//       const res = await fetch(`/api/recipes/${id}`);
//       const data = await res.json();
//       setLocalRecipe(data);
//       if (setRecipe) setRecipe(data);
//     };
//     fetchRecipe();
//   }, [setRecipe, id]);

//   return (
//     <>
//       <p>{recipe.title}</p>
//       <p>Hi World</p>
//     </>
//   );
// }
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import "./RecipeDetails.css";

export default function RecipeDetails() {
  const API = import.meta.env.VITE_API_URL;
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await fetch(`${API}/recipes/${id}`);
        if (!res.ok) throw new Error("Failed to fetch recipe");
        const data = await res.json();
        setRecipe(data.rows[0]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!recipe) return <p>No recipe found.</p>;

  return (
    <div className="recipe-details">
      <h1>{recipe.title}</h1>
      <p className="recipe-meta">
        <strong>Prep time:</strong> {recipe.prep_time} mins
      </p>

      <h3>Ingredients</h3>
      <p>{recipe.ingredient_list}</p>

      <h3>Instructions</h3>
      <p>{recipe.instruction_list}</p>

      {recipe.photos?.length > 0 && (
        <div>
          <h3>Photos</h3>
          <div className="recipe-photos">
            {recipe.photos.map((photo, i) => (
              <img key={i} src={photo.img_url} alt={`Recipe Photo ${i + 1}`} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
