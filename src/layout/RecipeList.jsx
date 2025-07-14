import useQuery from "../api/useQuery";

export default function RecipeList() {
  const { data: recipes, loading, error } = useQuery("/recipes", "recipes");

  if (loading) return <p>Loading recipes...</p>;
  if (error) return <p>Error loading recipes: {error}</p>;

  return (
    <div>
      <h2>All Recipes</h2>
      <ul>
        {recipes?.map((recipe) => (
          <li key={recipe.id}>{recipe.title}</li>
        ))}
      </ul>
    </div>
  );
}
