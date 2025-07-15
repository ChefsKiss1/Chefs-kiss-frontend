import { Route, Routes } from "react-router";
import Layout from "./layout/Layout";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Profile from "./layout/Profile";
import HomePage from "./layout/Home.jsx";
import AddRecipe from "./layout/AddRecipe";
import RecipeList from "./layout/RecipeList";
import Contact from "./layout/Contact";
import AboutUs from "./layout/AboutUs";
import Recipe from "./layout/Recipe";
import RecipeEdit from "./pages/RecipeEdit";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="recipe" element={<Recipe />} />
        <Route path="addrecipe" element={<AddRecipe />} />
        <Route path="recipes" element={<RecipeList />} />
        <Route path="register" element={<Register />} />
        <Route path="login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="contact" element={<Contact />} />
        <Route path="about" element={<AboutUs />} />
        <Route path="/recipe/:id/edit" element={<RecipeEdit />} />
      </Route>
    </Routes>
  );
}
