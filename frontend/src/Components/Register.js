import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Register.css";  // Import the CSS file
import Navbar from "./Navbar";

const Register = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSignup = async (event) => {
        event.preventDefault();
    
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }
    
        const formData = {
            name: username,
            email: email,
            password: password,
            confirm_password: confirmPassword,  // Ensure this matches the Django serializer field
        };
    
        try {
            const response = await axios.post('http://localhost:8000/api/user/register/', formData);
            console.log('Registration successful:', response.data);
            alert("User signed up successfully!");
            navigate('/login');  // Redirect to login after success
        } catch (error) {
            if (error.response) {
                console.error('Error during registration:', error.response.data);
                setError(JSON.stringify(error.response.data));  // Show exact error message
            } else {
                console.error('Error during registration:', error.message);
                setError("An unexpected error occurred. Please try again.");
            }
        }
    };
    return (
        <div className="signup-container">
            <Navbar />
            <h2>Register</h2>
            <form onSubmit={handleSignup}>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <div className="error-message">{error}</div>}
                <button type="submit" className="signup-btn">Signup</button>
            </form>
        </div>
    );
};

export default Register;

