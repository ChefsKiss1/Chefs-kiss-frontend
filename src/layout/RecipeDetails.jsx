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
        setRecipe(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!recipe) return <p>No recipe found</p>;

  return (
    <>
      <p>{recipe.title}</p>
      <p>Hi World</p>
    </>
  );
}
