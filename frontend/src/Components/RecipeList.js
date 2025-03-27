import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

const RecipeList = () => {
  const [recipes, setRecipes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecipes = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Unauthorized: Please log in.");
        setLoading(false);
        navigate("/login"); // Redirect to login page
        return;
      }

      try {
        const response = await axios.get("http://localhost:8000/api/recipes/", {
          headers: { Authorization: `Bearer ${token}` }, // ✅ JWT Auth Header
        });

        if (!Array.isArray(response.data.recipes)) {
          throw new Error("Unexpected API response format");
        }
        setRecipes(response.data.recipes);
      } catch (error) {
        console.error("Fetch Error:", error);
        
        if (error.response?.status === 401) {
          localStorage.removeItem("token"); // Clear invalid token
          setError("Session expired. Please log in again.");
          navigate("/login"); // Redirect to login
        } else {
          setError(error.response?.data?.detail || "Failed to fetch recipes.");
        }

        setRecipes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [navigate]);

const handleViewClick = async (recipeId) => {
    const token = localStorage.getItem("token");
    if (!token) {
        setError("Unauthorized: Please log in.");
        navigate("/login");
        return;
    }

    try {
        const res = await axios.put(
            `http://localhost:8000/api/recipes/${recipeId}/increase-view/`,
            {},
            {
                headers: { Authorization: `Bearer ${token}` },
            }
        );

        if (res?.data?.updated_views !== undefined) {
            setRecipes((prevRecipes) =>
                prevRecipes.map((recipe) =>
                    recipe.id === recipeId ? { ...recipe, views: res.data.updated_views } : recipe
                )
            );
        }
    } catch (error) {
        console.error("Failed to increase view count:", error);

        if (error.response?.status === 401) {
            localStorage.removeItem("token"); // Remove expired token
            setError("Session expired. Please log in again.");
            navigate("/login");
        } else {
            setError(error.response?.data?.detail || "Failed to update view count.");
        }
    }
};


  const filteredRecipes = recipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <p className="text-center">Loading recipes...</p>;
  if (error) return <p className="text-danger text-center">{error}</p>;

  return (
    <>
      <Navbar />
      <div className="container mt-5 pt-5">
        <h2 className="text-center mb-4">Delicious Recipes</h2>

        {/* Search Bar */}
        <div className="d-flex justify-content-center mb-4">
          <input
            type="text"
            className="form-control w-50 shadow-sm rounded-pill p-2"
            placeholder="Search recipes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Recipe Cards */}
        <div className="row g-4">
          {filteredRecipes.length > 0 ? (
            filteredRecipes.map((recipe) => (
              <div key={recipe.id} className={filteredRecipes.length === 1 ? "col-12" : "col-lg-4 col-md-6"}>
                <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
                  <img
                    src={recipe?.image_url || "default-image.jpg"}
                    className="card-img-top img-fluid"
                    alt={recipe?.title || "Recipe"}
                    style={{
                      width: "100%",
                      height: filteredRecipes.length === 1 ? "400px" : "250px",
                      objectFit: "cover",
                      borderTopLeftRadius: "12px",
                      borderTopRightRadius: "12px",
                    }}
                    onError={(e) => (e.target.src = "default-image.jpg")}
                  />

                  <div className="card-body text-center">
                    <h5 className="card-title text-primary fw-bold">
                      {recipe?.title || "No Title"}
                    </h5>
                    <p className="text-muted small">
                      <strong>Added by:</strong> {recipe?.user?.name || "Unknown"}
                    </p>
                    <p className="text-muted small">
                      <strong>Views:</strong> {recipe?.views || 0}
                    </p>
                  </div>

                  <div className="card-footer bg-white text-center pb-3">
                    <Link
                      to={`/recipe/${recipe?.id}`}
                      className="btn btn-outline-primary btn-sm rounded-pill px-4"
                      onClick={(e) => {
                        e.preventDefault();
                        handleViewClick(recipe?.id);
                        setTimeout(() => (window.location.href = `/recipe/${recipe?.id}`), 500);
                      }}
                    >
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
      </div>
    </>
  );
};

export default RecipeList;


