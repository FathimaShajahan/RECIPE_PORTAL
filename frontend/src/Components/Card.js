import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Card = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Unauthorized: Please log in.");

        const response = await axios.get("http://localhost:8000/api/recipes/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("API Response:", response.data); // Debugging output

        const data = response.data.recipes;
        if (!Array.isArray(data)) throw new Error("Unexpected API response format");

        setRecipes(data);
        setError("");
      } catch (error) {
        console.error("Fetch Error:", error);
        setError(error.response?.data?.detail || error.message || "Failed to fetch recipes.");
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  if (loading) return <p className="text-center">Loading recipes...</p>;
  if (error) return <p className="text-danger text-center">{error}</p>;

  return (
    <div className="row">
      {recipes.length > 0 ? (
        recipes.map((recipe) => (
          <div key={recipe.id} className="col-lg-4 col-md-6 mb-4">
            <div className="card shadow border-0 rounded-lg overflow-hidden">
              
              <img
  src={recipe.image_url || "default-image.jpg"}
  className="card-img-top"
  alt={recipe.title}
  style={{
    width: "100%", // Make the image responsive to the card width
    height: "200px", // Set a fixed height
    objectFit: "cover", // Ensures the image maintains aspect ratio and fills the area
    borderTopLeftRadius: "10px",
    borderTopRightRadius: "10px"
  }}
  onError={(e) => (e.target.src = "default-image.jpg")}
/>


              <div className="card-body">
                <h5 className="card-title text-primary fw-bold">{recipe.title}</h5>

                {/* Display Username */}
                <p className="text-muted">
                  <strong>Added by:</strong> {recipe.user ? recipe.user.name : "Unknown"}
                </p>

                <p className="card-text text-muted">{recipe.description}</p>
              </div>

              <div className="card-footer bg-white text-center">
                <Link to={`/recipe/${recipe.id}`} className="btn btn-outline-primary btn-sm w-75">
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-muted text-center">No recipes found.</p>
      )}
    </div>
  );
};

export default Card;


