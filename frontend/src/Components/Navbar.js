import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; 
// Install with: npm install jwt-decode

const Navbar = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("access"));

  // Logout function (wrapped in useCallback to avoid dependency issues in useEffect)
  const handleLogout = useCallback(async () => {
    const refreshToken = localStorage.getItem("refresh");
    if (!refreshToken) {
      console.error("No refresh token found.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/api/user/logout/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access")}`,
        },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      // Clear tokens and update state
      localStorage.removeItem("token");
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      setIsAuthenticated(false);
      navigate("/login");

      if (!response.ok) {
        const data = await response.json();
        console.error("Logout failed:", data.error);
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  }, [navigate]); // useCallback to avoid unnecessary re-renders

  // Authentication check in useEffect
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem("access");
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        const decodedToken = jwtDecode(token);
        const isExpired = decodedToken.exp * 1000 < Date.now(); // Convert to milliseconds
        if (isExpired) {
          handleLogout(); // Auto logout if token is expired
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        handleLogout(); // If decoding fails, force logout
      }
    };

    checkAuthStatus(); // Run on mount

    const interval = setInterval(checkAuthStatus, 60 * 1000); // Check every minute
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [handleLogout]); // Include handleLogout in dependencies

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top shadow">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">COOKING WORLD</Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            {isAuthenticated ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/recipes">Recipes</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/profile">Profile</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/add-recipe">Add Recipe</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/change-password">Change Password</Link>
                </li>
                <button className="btn btn-danger ms-3" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Register</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;


// import React, { useEffect, useState, useCallback } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { jwtDecode } from "jwt-decode";
// import { useDispatch, useSelector } from "react-redux";
// import { logout } from "../slice/authSlice"; // Import Redux logout action

// const Navbar = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const token = useSelector((state) => state.auth.token);
//   const refreshToken = useSelector((state) => state.auth.refreshToken);
//   const isAuthenticated = !!token;

//   const handleLogout = useCallback(async () => {
//     if (!refreshToken) {
//       console.error("No refresh token found.");
//       return;
//     }

//     try {
//       const response = await fetch("http://localhost:8000/api/user/logout/", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ refresh: refreshToken }),
//       });

//       dispatch(logout()); // Dispatch logout action to update Redux state
//       navigate("/login");

//       if (!response.ok) {
//         const data = await response.json();
//         console.error("Logout failed:", data.error);
//       }
//     } catch (error) {
//       console.error("Logout error:", error);
//     }
//   }, [dispatch, navigate, token, refreshToken]);

//   useEffect(() => {
//     const checkAuthStatus = () => {
//       if (!token) {
//         return;
//       }

//       try {
//         const decodedToken = jwtDecode(token);
//         if (decodedToken.exp * 1000 < Date.now()) {
//           handleLogout();
//         }
//       } catch (error) {
//         console.error("Error decoding token:", error);
//         handleLogout();
//       }
//     };

//     checkAuthStatus();
//     const interval = setInterval(checkAuthStatus, 60 * 1000);
//     return () => clearInterval(interval);
//   }, [handleLogout, token]);

//   return (
//     <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top shadow">
//       <div className="container">
//         <Link className="navbar-brand fw-bold" to="/">COOKING WORLD</Link>
//         <button
//           className="navbar-toggler"
//           type="button"
//           data-bs-toggle="collapse"
//           data-bs-target="#navbarNav"
//           aria-controls="navbarNav"
//           aria-expanded="false"
//           aria-label="Toggle navigation"
//         >
//           <span className="navbar-toggler-icon"></span>
//         </button>
//         <div className="collapse navbar-collapse" id="navbarNav">
//           <ul className="navbar-nav ms-auto">
//             <li className="nav-item">
//               <Link className="nav-link" to="/">Home</Link>
//             </li>
//             {isAuthenticated ? (
//               <>
//                 <li className="nav-item">
//                   <Link className="nav-link" to="/recipes">Recipes</Link>
//                 </li>
//                 <li className="nav-item">
//                   <Link className="nav-link" to="/profile">Profile</Link>
//                 </li>
//                 <li className="nav-item">
//                   <Link className="nav-link" to="/add-recipe">Add Recipe</Link>
//                 </li>
//                 <li className="nav-item">
//                   <Link className="nav-link" to="/change-password">Change Password</Link>
//                 </li>
//                 <button className="btn btn-danger ms-3" onClick={handleLogout}>
//                   Logout
//                 </button>
//               </>
//             ) : (
//               <>
//                 <li className="nav-item">
//                   <Link className="nav-link" to="/register">Register</Link>
//                 </li>
//                 <li className="nav-item">
//                   <Link className="nav-link" to="/login">Login</Link>
//                 </li>
//               </>
//             )}
//           </ul>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
