import React, { useState,useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";


const AddRecipe = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    ingredients: "",
    steps: "",
    cookingTime: "",
    difficulty: "Easy",
    image: null,
  });

  
  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); // Redirect to login if not authenticated
    }
  }, [navigate]);
    
  const handleChange = (e) => {
    if (e.target.name === "image") {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const token = localStorage.getItem("token"); // Retrieve token from local storage
  
    if (!token) {
      alert("⚠️ Unauthorized! Please log in first.");
      navigate("/login"); // Redirect to login page if token is missing
      return;
    }
  
    const data = new FormData();
    data.append("title", formData.title);
    data.append("ingredients", formData.ingredients);
    data.append("steps", formData.steps);
    data.append("cooking_time", formData.cookingTime);
    data.append("difficulty", formData.difficulty);
    data.append("image", formData.image);
  
    try {
      await axios.post("http://localhost:8000/api/recipes/add/", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`, // Add authorization header
        },
      });
      alert("🎉 Recipe added successfully!");
      navigate("/recipes");
    } catch (error) {
      console.error("Error adding recipe:", error);
      alert(`⚠️ Failed to add recipe. ${error.response?.data?.detail || "Unauthorized request"}`);
    }
  };
  

  return (
    <>
      <Navbar />
      <div className="container mt-5 pt-5">
        <div className="row justify-content-center">
          <div className="col-lg-12">
            <div className="card shadow-lg border-1 rounded-4">
              {/* Card Header with Background Image */}
              <div
                className="card-header text-white text-center py-4"
                style={{
                  backgroundImage: "linear-gradient(135deg,rgb(8, 28, 50) 10%,rgb(35, 27, 30) 100%)",
                //   borderTopLeftRadius: "20px",
                //   borderTopRightRadius: "20px",
                }}
              >
                <h2 className="fw-bold">🍽️ Add a Delicious Recipe</h2>
                <p className="mb-0">Share your favorite dish with the world!</p>
              </div>

              {/* Card Body with Form */}
              <div className="card-body p-4">
                <form onSubmit={handleSubmit}>
                  {/* Recipe Title */}
                  <div className="mb-3">
                    <label className="form-label fw-bold">📌 Recipe Title</label>
                    <input
                      type="text"
                      name="title"
                      className="form-control rounded-3 shadow-sm"
                      placeholder="Enter recipe title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Ingredients */}
                  <div className="mb-3">
                    <label className="form-label fw-bold">🛒 Ingredients</label>
                    <textarea
                      name="ingredients"
                      className="form-control rounded-3 shadow-sm"
                      placeholder="List ingredients (comma separated)"
                      value={formData.ingredients}
                      onChange={handleChange}
                      rows="3"
                      required
                    ></textarea>
                  </div>

                  {/* Cooking Steps */}
                  <div className="mb-3">
                    <label className="form-label fw-bold">📜 Cooking Steps</label>
                    <textarea
                      name="steps"
                      className="form-control rounded-3 shadow-sm"
                      placeholder="Describe step-by-step instructions"
                      value={formData.steps}
                      onChange={handleChange}
                      rows="4"
                      required
                    ></textarea>
                  </div>

                  {/* Cooking Time */}
                  <div className="mb-3">
                    <label className="form-label fw-bold">⏳ Cooking Time (minutes)</label>
                    <input
                      type="number"
                      name="cookingTime"
                      className="form-control rounded-3 shadow-sm"
                      placeholder="Enter cooking time"
                      value={formData.cookingTime}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Difficulty Level */}
                  <div className="mb-3">
                    <label className="form-label fw-bold">🔥 Difficulty</label>
                    <select
                      name="difficulty"
                      className="form-select rounded-3 shadow-sm"
                      value={formData.difficulty}
                      onChange={handleChange}
                      required
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>

                  {/* Image Upload */}
                  <div className="mb-3">
                    <label className="form-label fw-bold">📸 Recipe Image</label>
                    <input
                      type="file"
                      name="image"
                      className="form-control rounded-3 shadow-sm"
                      accept="image/*"
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="btn btn-lg btn-dark w-100 fw-bold rounded-3 shadow"
                  >
                    ✅ Submit Recipe
                  </button>
                </form>
              </div>
            </div>

            {/* Back to Recipes Button */}
            <div className="text-center mt-3">
              <button
                onClick={() => navigate("/recipes")}
                className="btn btn-dark rounded-3 shadow-lg px-4 py-2 mb-5"
              >
                🔙 Back to Recipes
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddRecipe;
