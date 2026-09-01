import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Client-side validation
        if (!username || !password || !confirmPassword) {
            setMessage("❌ All fields are required!");
            setMessageType("error");
            return;
        }

        if (password !== confirmPassword) {
            setMessage("❌ Passwords do not match!");
            setMessageType("error");
            return;
        }

        try {
            const response = await fetch("http://127.0.0.1:5000/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }), // Do not include confirmPassword
            });

            const data = await response.json();

            if (response.ok) {
                console.log("Register Successful:", data);
                localStorage.setItem("userId", data.user_id);
                localStorage.setItem("token", data.access_token);
                localStorage.setItem("username", data.username);

                setMessage("✅ Registration successful! Redirecting...");
                setMessageType("success");

                setTimeout(() => {
                    navigate("/account");
                }, 2000);
            } else {
                setMessage(data.error || "❌ Registration failed.");
                setMessageType("error");
            }
        } catch (error) {
            console.error("❌ Registration error:", error);
            setMessage("⚠️ Could not connect to the server.");
            setMessageType("error");
        }
    };

    return (
        <div className="page-container">
            <section className="title-container">
                <h1 className="outline">Register</h1>
            </section>
            <section className="app-container">
                <section className="content-container">
                    <h2 className="outline">Sign up today to connect with other Gardeners!</h2>
                </section>
                <section className="register-container">
                    <form onSubmit={handleSubmit}>
                        <label>Username:</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />

                        <label>Password:</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <label>Confirm Password:</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />

                        <button type="submit" className="button">Register</button>
                    </form>

                    {message && (
                        <div className={`message ${messageType}`}>
                            {message}
                        </div>
                    )}
                </section>
            </section>
        </div>
    );
};

export default Register;
