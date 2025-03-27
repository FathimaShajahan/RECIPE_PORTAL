import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "./Navbar";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); // Redirect to login if not authenticated
    }
  }, [navigate]);

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setError("❌ Passwords do not match!");
      setSuccess("");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/user/change-password/", // Adjust your API endpoint
        {
          current_password: currentPassword,
          new_password: newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        setSuccess("✅ Password updated successfully!");
        setError("");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setError(response.data.message || "❌ Failed to update password!");
        setSuccess("");
      }
    } catch (err) {
      console.error("Error updating password:", err);
      setError("❌ Error updating password. Please try again.");
      setSuccess("");
    }
  };

  return (
    <>
      <Navbar />
      <div className="container d-flex justify-content-center align-items-center vh-100">
        <div className="card shadow-lg p-4 rounded-4" style={{ width: "400px" }}>
          {/* Card Header */}
          <div
            className="card-header text-center text-white fw-bold py-3"
            style={{
              backgroundImage: "linear-gradient(135deg,rgb(22, 3, 43) 10%,rgb(4, 27, 66) 100%)",
              borderTopLeftRadius: "15px",
              borderTopRightRadius: "15px",
            }}
          >
            🔒 Change Password
          </div>

          {/* Card Body */}
          <div className="card-body">
            {/* Current Password */}
            <label className="form-label fw-bold">Current Password</label>
            <div className="input-group mb-3">
              <span className="input-group-text bg-light">
                <i className="bi bi-lock"></i>
              </span>
              <input
                type="password"
                className="form-control rounded-3"
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>

            {/* New Password */}
            <label className="form-label fw-bold">New Password</label>
            <div className="input-group mb-3">
              <span className="input-group-text bg-light">
                <i className="bi bi-shield-lock"></i>
              </span>
              <input
                type="password"
                className="form-control rounded-3"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>

            {/* Confirm New Password */}
            <label className="form-label fw-bold">Confirm New Password</label>
            <div className="input-group mb-3">
              <span className="input-group-text bg-light">
                <i className="bi bi-check-circle"></i>
              </span>
              <input
                type="password"
                className="form-control rounded-3"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {/* Error Message */}
            {error && <p className="text-danger fw-bold">{error}</p>}

            {/* Success Message */}
            {success && <p className="text-success fw-bold">{success}</p>}

            {/* Submit Button */}
            <button
              onClick={handleChangePassword}
              className="btn btn-dark w-100 fw-bold rounded-3 shadow-sm"
            >
              🔄 Update Password
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChangePassword;

