// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import Navbar from "./Navbar";

// const EditRecipe = () => {
//   const { recipe_id } = useParams();
//   const navigate = useNavigate();
  
//   const [formData, setFormData] = useState({
//     title: "",
//     ingredients: "",
//     steps: "",
//     cookingTime: "",
//     difficulty: "Easy",
//     image: null,
//   });

//   const [imagePreview, setImagePreview] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (!recipe_id) {
//       setError("Invalid recipe ID");
//       setLoading(false);
//       return;
//     }

//     axios.get(`http://localhost:8000/api/recipes/edit/${recipe_id}/`)
//       .then((response) => {
//         const recipe = response.data;
//         setFormData({
//           title: recipe?.title || "",
//           ingredients: recipe?.ingredients?.join(", ") || "",
//           steps: recipe?.steps?.join("\n") || "",
//           cookingTime: recipe?.cooking_time || "",
//           difficulty: recipe?.difficulty || "Easy",
//           image: null,
//         });
//         setImagePreview(recipe?.image || null);
//         setLoading(false);
//       })
//       .catch((error) => {
//         setError(error?.response?.data?.message || "Recipe not found");
//         setLoading(false);
//       });
//   }, [recipe_id]);

//   const handleChange = (e) => {
//     if (e.target.name === "image") {
//       const file = e.target.files[0];
//       setFormData({ ...formData, image: file });
//       if (file) {
//         setImagePreview(URL.createObjectURL(file));
//       }
//     } else {
//       setFormData({ ...formData, [e.target.name]: e.target.value });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const data = new FormData();
//     data.append("title", formData.title);
//     data.append("ingredients", JSON.stringify(formData.ingredients.split(",").map((item) => item.trim())));
//     data.append("steps", JSON.stringify(formData.steps.split("\n").map((item) => item.trim())));
//     data.append("cooking_time", formData.cookingTime);
//     data.append("difficulty", formData.difficulty);
//     if (formData.image) {
//       data.append("image", formData.image);
//     }

//     try {
//       await axios.put(`http://localhost:8000/api/recipes/edit/${recipe_id}/`, data, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       alert("Recipe updated successfully!");
//       navigate("/profile");
//     } catch (error) {
//       alert("Failed to update the recipe.");
//     }
//   };

//   if (loading) return <p className="text-center">Loading...</p>;
//   if (error) return <p className="text-danger text-center">{error}</p>;

//   return (
//     <>
//       <Navbar />
//       <div className="container mt-5 pt-5">
//         <div className="card shadow p-4">
//           <h2 className="text-center text-primary fw-bold">✏️ Edit Recipe</h2>
//           <form onSubmit={handleSubmit}>
//             <div className="mb-3">
//               <label className="form-label fw-bold">📌 Recipe Title</label>
//               <input type="text" name="title" className="form-control" value={formData.title} onChange={handleChange} required />
//             </div>

//             <div className="mb-3">
//               <label className="form-label fw-bold">🛒 Ingredients</label>
//               <textarea name="ingredients" className="form-control" value={formData.ingredients} onChange={handleChange} rows="3" required></textarea>
//             </div>

//             <div className="mb-3">
//               <label className="form-label fw-bold">📜 Cooking Steps</label>
//               <textarea name="steps" className="form-control" value={formData.steps} onChange={handleChange} rows="4" required></textarea>
//             </div>

//             <div className="mb-3">
//               <label className="form-label fw-bold">⏳ Cooking Time (minutes)</label>
//               <input type="number" name="cookingTime" className="form-control" value={formData.cookingTime} onChange={handleChange} required />
//             </div>

//             <div className="mb-3">
//               <label className="form-label fw-bold">🔥 Difficulty</label>
//               <select name="difficulty" className="form-select" value={formData.difficulty} onChange={handleChange} required>
//                 <option value="Easy">Easy</option>
//                 <option value="Medium">Medium</option>
//                 <option value="Hard">Hard</option>
//               </select>
//             </div>

//             <div className="mb-3">
//               <label className="form-label fw-bold">📸 Recipe Image</label>
//               <input type="file" name="image" className="form-control" accept="image/*" onChange={handleChange} />
//               {imagePreview && (
//                 <div className="mt-3">
//                   <p className="fw-bold">Current Image:</p>
//                   <img src={imagePreview} alt="Recipe" className="img-fluid rounded" style={{ maxWidth: "200px", maxHeight: "200px" }} />
//                 </div>
//               )}
//             </div>

//             <div className="d-flex justify-content-between">
//               <button type="submit" className="btn btn-primary fw-bold px-4">✅ Update Recipe</button>
//               <button type="button" className="btn btn-secondary fw-bold px-4" onClick={() => navigate("/profile")}>❌ Cancel</button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </>
//   );
// };

// export default EditRecipe;

// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
// import Navbar from "./Navbar";

// const EditRecipe = () => {
//   const { recipe_id } = useParams();
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     title: "",
//     ingredients: "",
//     steps: "",
//     cookingTime: "",
//     difficulty: "Easy",
//     image: null,
//   });

//   const [imagePreview, setImagePreview] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (!recipe_id) {
//       setError("Invalid recipe ID");
//       setLoading(false);
//       return;
//     }

//     const token = localStorage.getItem("access_token");

//     axios
//       .get(`http://localhost:8000/api/recipes/get/${recipe_id}/`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       })
//       .then((response) => {
//         const recipe = response.data;
//         setFormData({
//           title: recipe?.title || "",
//           ingredients: recipe?.ingredients?.join(", ") || "",
//           steps: recipe?.steps?.join("\n") || "",
//           cookingTime: recipe?.cooking_time || "",
//           difficulty: recipe?.difficulty || "Easy",
//           image: null,
//         });
//         setImagePreview(recipe?.image || null);
//         setLoading(false);
//       })
//       .catch((error) => {
//           console.error("Error fetching recipe:", error);
//           if (error.response && error.response.status === 401) {
//             setError("Unauthorized: Please log in again.");
//           } else {
//             setError(error?.response?.data?.message || "Recipe not found");
//           }
//           setLoading(false);
//         });
//       }, [recipe_id]);

//   //     .catch((error) => {
//   //       setError(error?.response?.data?.message || "Recipe not found");
//   //       setLoading(false);
//   //     });
//   // }, [recipe_id]);

//   const handleChange = (e) => {
//     if (e.target.name === "image") {
//       const file = e.target.files[0];
//       setFormData({ ...formData, image: file });
//       if (file) {
//         setImagePreview(URL.createObjectURL(file));
//       }
//     } else {
//       setFormData({ ...formData, [e.target.name]: e.target.value });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const token = localStorage.getItem("access_token");

//     const data = new FormData();
//     data.append("title", formData.title);
//     data.append("ingredients", formData.ingredients);
//     data.append("steps", formData.steps);
//     data.append("cooking_time", formData.cookingTime);
//     data.append("difficulty", formData.difficulty);
//     if (formData.image) {
//       data.append("image", formData.image);
//     }

//     try {
//       await axios.put(`http://localhost:8000/api/recipes/update/${recipe_id}/`, data, {
//         headers: {
//           "Content-Type": "multipart/form-data",
//            Authorization: `Bearer ${token}`,
//         },
//       });
//       alert("Recipe updated successfully!");
//       navigate("/profile");
//     } catch (error) {
//       alert("Failed to update the recipe.");
//     }
//   };

//   if (loading) return <p className="text-center">Loading...</p>;
//   if (error) return <p className="text-danger text-center">{error}</p>;

//   return (
//     <>
//       <Navbar />
//       <div className="container mt-5 pt-5">
//         <div className="card shadow p-4">
//           <h2 className="text-center text-primary fw-bold">✏️ Edit Recipe</h2>
//           <form onSubmit={handleSubmit}>
//             <div className="mb-3">
//               <label className="form-label fw-bold">📌 Recipe Title</label>
//               <input type="text" name="title" className="form-control" value={formData.title} onChange={handleChange} required />
//             </div>
//             <div className="mb-3">
//               <label className="form-label fw-bold">🛒 Ingredients</label>
//               <textarea name="ingredients" className="form-control" value={formData.ingredients} onChange={handleChange} rows="3" required></textarea>
//             </div>
//             <div className="mb-3">
//               <label className="form-label fw-bold">📜 Cooking Steps</label>
//               <textarea name="steps" className="form-control" value={formData.steps} onChange={handleChange} rows="4" required></textarea>
//             </div>
//             <div className="mb-3">
//               <label className="form-label fw-bold">⏳ Cooking Time (minutes)</label>
//               <input type="number" name="cookingTime" className="form-control" value={formData.cookingTime} onChange={handleChange} required />
//             </div>
//             <div className="mb-3">
//               <label className="form-label fw-bold">🔥 Difficulty</label>
//               <select name="difficulty" className="form-select" value={formData.difficulty} onChange={handleChange} required>
//                 <option value="Easy">Easy</option>
//                 <option value="Medium">Medium</option>
//                 <option value="Hard">Hard</option>
//               </select>
//             </div>
//             <div className="mb-3">
//               <label className="form-label fw-bold">📸 Recipe Image</label>
//               <input type="file" name="image" className="form-control" accept="image/*" onChange={handleChange} />
//               {imagePreview && (
//                 <div className="mt-3">
//                   <p className="fw-bold">Current Image:</p>
//                   <img src={imagePreview} alt="Recipe" className="img-fluid rounded" style={{ maxWidth: "200px", maxHeight: "200px" }} />
//                 </div>
//               )}
//             </div>
//             <div className="d-flex justify-content-between">
//               <button type="submit" className="btn btn-primary fw-bold px-4">✅ Update Recipe</button>
//               <button type="button" className="btn btn-secondary fw-bold px-4" onClick={() => navigate("/profile")}>❌ Cancel</button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </>
//   );
// };

// export default EditRecipe;


import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";

const EditRecipe = () => {
  const { recipe_id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    ingredients: "",
    steps: "",
    cookingTime: "",
    difficulty: "Easy",
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Retrieved Token:", token);
        if (!token) {
          setError("Unauthorized: Please log in.");
          navigate('/login')
          return;
        }


        // const fetchRecipe = async () => {
        //   const token = localStorage.getItem("token"); // Get JWT token
    
        //   if (!token) {
        //     setError("Unauthorized: Please log in.");
        //     setLoading(false);
        //     return;
        //   }

        const response = await axios.get(`http://localhost:8000/api/recipes/get/${recipe_id}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const recipe = response.data;
        setFormData({
          title: recipe.title || "",
          ingredients: recipe.ingredients.join(", ") || "",
          steps: recipe.steps.join("\n") || "",
          cookingTime: recipe.cooking_time || "",
          difficulty: recipe.difficulty || "Easy",
          image: null,
        });
        setImagePreview(recipe.image || null);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching recipe:", error);
        if (error.response && error.response.status === 401) {
          setError("Unauthorized: Please log in again.");
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          setError("Recipe not found.");
        }
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [recipe_id, navigate]);

  const handleChange = (e) => {
    if (e.target.name === "image") {
      const file = e.target.files[0];
      setFormData({ ...formData, image: file });
      if (file) {
        setImagePreview(URL.createObjectURL(file));
      }
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Unauthorized: Please log in.");
      navigate("/login");
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("ingredients", formData.ingredients);
    data.append("steps", formData.steps);
    data.append("cooking_time", formData.cookingTime);
    data.append("difficulty", formData.difficulty);
    if (formData.image) {
      data.append("image", formData.image);
    }

    try {
      await axios.put(
        `http://localhost:8000/api/recipes/update/${recipe_id}/`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Recipe updated successfully!");
      navigate("/profile");
    } catch (error) {
      console.error("Update Error:", error);
      alert("Failed to update the recipe.");
    }
  };

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-danger text-center">{error}</p>;

  return (
    <>
      <Navbar />
      <div className="container mt-5 pt-5">
        <div className="card shadow p-4">
          <h2 className="text-center text-primary fw-bold">✏️ Edit Recipe</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-bold">📌 Recipe Title</label>
              <input
                type="text"
                name="title"
                className="form-control"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold">🛒 Ingredients</label>
              <textarea
                name="ingredients"
                className="form-control"
                value={formData.ingredients}
                onChange={handleChange}
                rows="3"
                required
              ></textarea>
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold">📜 Cooking Steps</label>
              <textarea
                name="steps"
                className="form-control"
                value={formData.steps}
                onChange={handleChange}
                rows="4"
                required
              ></textarea>
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold">⏳ Cooking Time (minutes)</label>
             <input type="number" name="cookingTime" className="form-control" value={formData.cookingTime} onChange={handleChange} required />
             </div>
            <div className="mb-3">
               <label className="form-label fw-bold">🔥 Difficulty</label>
               <select name="difficulty" className="form-select" value={formData.difficulty} onChange={handleChange} required>
                 <option value="Easy">Easy</option>
                 <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold">📸 Recipe Image</label>
              <input
                type="file"
                name="image"
                className="form-control"
                accept="image/*"
                onChange={handleChange}
              />
              {imagePreview && (
                <div className="mt-3">
                  <img
                    src={imagePreview}
                    alt="Recipe"
                    className="img-fluid rounded"
                    style={{ maxWidth: "200px", maxHeight: "200px" }}
                  />
                </div>
              )}
            </div>
            <button type="submit" className="btn btn-primary fw-bold px-4">
              ✅ Update Recipe
            </button>
            <button type="button" className="btn btn-secondary fw-bold px-4" onClick={() => navigate("/profile")}>❌ Cancel</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditRecipe;
