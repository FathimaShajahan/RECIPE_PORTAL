import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";

const RecipeDisplay = () => {
  const { recipe_id } = useParams(); // Get recipe ID from URL
  const [recipe, setRecipe] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  console.log("Recipe ID from URL:", recipe_id); // Debugging: Check if recipe_id is correctly received

  useEffect(() => {
    const fetchRecipe = async () => {
      const token = localStorage.getItem("token"); // Get JWT token

      if (!token) {
        setError("Unauthorized: Please log in.");
        navigate('/login')
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:8000/api/recipes/${recipe_id.trim()}/`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setRecipe(response.data);
      } catch (err) {
        console.error("Error fetching recipe:", err);
        if (err.response && err.response.status === 401) {
          setError("Unauthorized: Please log in again.");
          localStorage.removeItem("token"); // Clear invalid token
          navigate("/login"); // Redirect to login page
        } else {
          setError("Recipe not found.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [recipe_id, navigate]);

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-danger text-center">{error}</p>;

  return (
    <>
      <Navbar />
      <div className="container mt-5 pt-5">
        <div className="row justify-content-center">
          <div className="col-lg-12">
            <div className="card shadow-lg rounded-4">
              {/* Recipe Image */}
              <img
                src={recipe.image || "default-image.jpg"}
                className="card-img-top"
                alt={recipe.title}
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                  borderTopLeftRadius: "10px",
                  borderTopRightRadius: "10px",
                }}
                onError={(e) => (e.target.src = "default-image.jpg")}
              />

              {/* Recipe Details */}
              <div className="card-body">
                <h2 className="card-title text-center text-primary fw-bold">
                  {recipe.title}
                </h2>

                {/* Added by (Username) */}
                <p className="text-muted text-center">
                  <strong>👤 Added by:</strong> {recipe.user ? recipe.user.name : "Unknown"}
                </p>

                {/* Cooking Time & Difficulty */}
                <div className="d-flex justify-content-between my-3">
                  <span className="badge bg-info p-2">
                    ⏳ Cooking Time: {recipe.cooking_time} mins
                  </span>
                  <span
                    className={`badge p-2 ${
                      recipe.difficulty === "Easy"
                        ? "bg-success"
                        : recipe.difficulty === "Medium"
                        ? "bg-warning"
                        : "bg-danger"
                    }`}
                  >
                    🔥 Difficulty: {recipe.difficulty}
                  </span>
                </div>

                {/* Ingredients */}
                <h5 className="fw-bold text-dark">🛒 Ingredients:</h5>
                <ul className="list-group mb-3">
                  {recipe.ingredients && recipe.ingredients.length > 0 ? (
                    recipe.ingredients.map((item, index) => (
                      <li key={index} className="list-group-item">
                        ✅ {item}
                      </li>
                    ))
                  ) : (
                    <li className="list-group-item">No ingredients listed.</li>
                  )}
                </ul>

                {/* Steps */}
                <h5 className="fw-bold text-dark">👨‍🍳 Cooking Steps:</h5>
                <ol className="list-group list-group-numbered">
                  {recipe.steps && recipe.steps.length > 0 ? (
                    recipe.steps.map((step, index) => (
                      <li key={index} className="list-group-item">
                        {step}
                      </li>
                    ))
                  ) : (
                    <li className="list-group-item">No steps available.</li>
                  )}
                </ol>

                {/* Additional Notes */}
                {recipe.notes && (
                  <>
                    <h5 className="fw-bold text-dark mt-3">📝 Additional Notes:</h5>
                    <p className="text-muted">{recipe.notes}</p>
                  </>
                )}

                {/* Buttons */}
                <div className="d-flex justify-content-between mt-4">
                  <Link to="/recipes" className="btn btn-outline-secondary">
                    🔙 Back to Recipes
                  </Link>
                  {/* <button className="btn btn-primary">📥 Save Recipe</button> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RecipeDisplay;


