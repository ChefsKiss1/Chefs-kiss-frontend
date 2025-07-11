import { Route, Routes } from "react-router";
import Layout from "./layout/Layout";
import Login from "./auth/Login";
import Register from "./auth/Register";
import AddRecipe from "./layout/AddRecipe";
import RecipeList from "./layout/RecipeList";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/recipe" element={<AddRecipe />} />
        <Route path="/recipes" element={<RecipeList />} />
        <Route index element={<p>Home page</p>} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Route>
    </Routes>
  );
}
