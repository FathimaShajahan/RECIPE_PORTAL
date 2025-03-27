import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Register from "./Components/Register"; // ✅ Import Register component
import Login from "./Components/Login"

import Landing from "./Components/Landing";
import ChangePassword from "./Components/ChangePassword";
import EditRecipe from "./Components/EditRecipe";
import AddRecipe from "./Components/AddRecipe";
import Profile from "./Components/Profile";
import RecipeList from "./Components/RecipeList";
import RecipeDisplay from "./Components/RecipeDisplay";
function App() {
  return (
          <Router>
    
            <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/recipes" element={<RecipeList/>} />
                <Route path="/login" element={<Login />} />
                <Route path="/Register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
                {/* <Route path="/recipe-display/:id" element={<RecipeDisplay />} /> */}
                <Route path="/recipe/:recipe_id" element={<RecipeDisplay />} />
                <Route path="/add-recipe" element={<AddRecipe />} />
                <Route path="/edit-recipe/:recipe_id" element={<EditRecipe />} />
                {/* <Route path="/recipes/edit/:recipe_id" element={<EditRecipe />} /> */}
                <Route path="/change-password" element={<ChangePassword />} />
          </Routes>
          </Router>
  
  
  );
}

export default App;
