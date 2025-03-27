import { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { login } from "../slice/authSlice";
import { useNavigate } from "react-router-dom";
import './Login.css';  // Import the updated CSS file
import Navbar from "./Navbar";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const res = await axios.post("http://localhost:8000/api/user/login/", { email, password });

            // Store tokens in localStorage
            localStorage.setItem("access", res.data.access);
            localStorage.setItem("refresh", res.data.refresh);

            dispatch(login({ token: res.data.access, user: email }));
            navigate("/");
        } catch (error) {
            alert("Invalid credentials");
        }
    };

    return (
        <div className="login-container">
            <Navbar/>
            <h2>Login</h2>
            <form onSubmit={(e) => e.preventDefault()} className="login-form">
                <div className="form-group">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit" onClick={handleLogin} className="login-btn">Login</button>
            </form>
        </div>
    );
};

export default Login;


// import { useState } from "react";
// import axios from "axios";
// import { useDispatch } from "react-redux";
// import { login } from "../slice/authSlice";
// import { useNavigate } from "react-router-dom";
// import './Login.css';
// import Navbar from "./Navbar";

// const Login = () => {
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const dispatch = useDispatch();
//     const navigate = useNavigate();

//     const handleLogin = async () => {
//         try {
//             const res = await axios.post("http://localhost:8000/api/user/login/", { email, password });

//             dispatch(login({
//                 token: res.data.access,
//                 refresh: res.data.refresh,
//                 user: email
//             }));

//             navigate("/");
//         } catch (error) {
//             alert("Invalid credentials");
//         }
//     };

//     return (
//         <div className="login-container">
//             <Navbar/>
//             <h2>Login</h2>
//             <form onSubmit={(e) => e.preventDefault()} className="login-form">
//                 <div className="form-group">
//                     <input
//                         type="email"
//                         placeholder="Email"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                     />
//                 </div>
//                 <div className="form-group">
//                     <input
//                         type="password"
//                         placeholder="Password"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                     />
//                 </div>
//                 <button type="submit" onClick={handleLogin} className="login-btn">Login</button>
//             </form>
//         </div>
//     );
// };

// export default Login;
