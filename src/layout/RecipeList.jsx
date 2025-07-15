import useQuery from "../api/useQuery";
import { NavLink } from "react-router";

export default function RecipeList() {
  const { data: recipes, loading, error } = useQuery("/recipes", "recipes");

  if (loading) return <p>Loading recipes...</p>;
  if (error) return <p>Error loading recipes: {error}</p>;

  return (
    <div>
      <h2>All Recipes</h2>
      <ul>
        {recipes?.map((recipe) => (
          <NavLink to={"/recipes/" + recipe.id} key={recipe.id}>
            {recipe.title}
          </NavLink>
        ))}
      </ul>
    </div>
  );
}
