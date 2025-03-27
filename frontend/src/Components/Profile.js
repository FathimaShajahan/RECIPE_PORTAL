import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";

const Profile = () => {
  const [username, setUsername] = useState("Loading...");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        // if (!token) throw new Error("Unauthorized: Please log in.");
        if (!token) {
          navigate("/login"); // Redirect to login if not authenticated
        }

        // Fetch user profile
        const profileResponse = await axios.get("http://localhost:8000/api/profile/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsername(profileResponse.data.name || "Guest");

        // Fetch only the logged-in user's recipes
        const recipesResponse = await axios.get("http://localhost:8000/api/recipes/user-recipes/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setRecipes(recipesResponse.data.recipes);
      } catch (err) {
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleDelete = async (recipeId) => {
    if (window.confirm("Are you sure you want to delete this recipe?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:8000/api/recipes/delete/${recipeId}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setRecipes(recipes.filter((recipe) => recipe.id !== recipeId));
      } catch {
        alert("Failed to delete recipe.");
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-5 pt-5 pb-5">
        <div className="card shadow px-5 py-5 text-center">
          {/* <h2 className="text-primary fw-bold">👨‍🍳 {username}</h2> */}
          <h2 className="text-primary fw-bold">👨‍🍳 {username[0]?.toUpperCase() + username.slice(1)}</h2>

          <Link to="/add-recipe" className="btn btn-dark mt-3">➕ Add Recipe</Link>
        </div>
        <h3 className="mt-4 text-center text-secondary">Your Recipes</h3>
        {loading && <p className="text-center text-muted">Loading recipes...</p>}
        {error && <p className="text-center text-danger">{error}</p>}
        <div className="row mt-3">
          {recipes.length === 0 && !loading && !error && (
            <p className="text-center text-muted">No recipes added yet!</p>
          )}
          <div className="container">
  <div className="row">
    {recipes.map((recipe) => (
      <div key={recipe.id} className="col-lg-4 col-lg-6 mb-4">
        <div className="card shadow-lg border-0 rounded-lg">
          <img
            src={recipe.image_url || "default-image.jpg"}
            className="card-img-top"
            alt={recipe.title}
            style={{ height: "200px", objectFit: "cover" }}
            onError={(e) => (e.target.src = "default-image.jpg")}
          />
          <div className="card-body">
            <h5 className="card-title text-primary fw-bold">{recipe.title}</h5>
            <p className="card-text text-danger">Views : {recipe.views}</p>
            <p className="card-text text-muted">{recipe.description}</p>
            
            <div className="d-flex justify-content-between">
              <Link to={`/edit-recipe/${recipe.id}`} className="btn btn-warning btn-sm">
                ✏️ Edit
              </Link>
              <button onClick={() => handleDelete(recipe.id)} className="btn btn-danger btn-sm">
                ❌ Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>

        </div>
      </div>
    </>
  );
};

export default Profile;

