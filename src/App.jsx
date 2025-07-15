import { Route, Routes } from "react-router";
import Layout from "./layout/Layout";
import Login from "./auth/Login";
import Register from "./auth/Register";
import AddRecipe from "./layout/AddRecipe";
import RecipeList from "./layout/RecipeList";
import RecipeDetails from "./layout/RecipeDetails";
import { useState } from "react";

export default function App() {
  const { recipe, setRecipe } = useState();
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<p>Home page</p>} />
        <Route path="/addrecipe" element={<AddRecipe />} />
        <Route path="/recipes" element={<RecipeList />} />
        <Route
          path="/recipes/:id"
          element={<RecipeDetails setRecipe={setRecipe} />}
        />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Route>
    </Routes>
  );
}
