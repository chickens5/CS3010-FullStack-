import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ setIsAuthenticated, setIsGuest }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

            try {
                const response = await axios.post("http://127.0.0.1:5000/api/login", {
                    username,
                    password,
                });

                const data = response.data;

                console.log("Login Successful:", data);
                localStorage.setItem("userId", data.user_id);
                localStorage.setItem("token", data.access_token);
                localStorage.setItem("username", data.username);
                navigate("/account");

                setIsAuthenticated(true);
                setIsGuest(false);
            } catch (error) {
                console.error("❌Login error:", error);
                if (error.response) {
                    setMessage(error.response.data.error);
                } else {
                    setMessage("⚠️ Could not connect to the server.");
                }
            }
        };

    return (
        <div className="page-container">
            <section className="title-container">
                <h1 className="outline">Login</h1>
            </section>
            <section className="app-container">
                <section className="content-container">
                    <h2 className="outline">Welcome Back!</h2>
                </section>
                <section className="login-container">
                    {message && <p className="message">{message}</p>}
                    <form onSubmit={handleLogin}>
                        <label>Username:</label>
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />

                        <label>Password:</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

                        <button type="submit" className="button">Login</button>
                    </form>

                </section>
            </section>
        </div>
    );
};
export default Login;