import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Logout = ({ setIsAuthenticated, setIsGuest }) => {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const storedUsername = localStorage.getItem("username");
        setUsername(storedUsername || "Guest");

        const confirmLogout = window.confirm(`Are you sure you want to log out, ${storedUsername || "Guest"}?`);

        if (confirmLogout) {
            fetch("http://127.0.0.1:5000/api/logout", { method: "POST" })
                .then((res) => res.json())
                .then(() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("userId");
                    localStorage.removeItem("username");
                    setIsAuthenticated(false);
                    setIsGuest(true); //
                    setMessage("Successfully logged out! Come back soon!");

                    setTimeout(() => {
                        navigate("/");
                    }, 1500); // Short delay to show the message
                })
                .catch((error) => {
                    console.error("Logout Error:", error);
                    setMessage("⚠️ Error logging out.");
                });
        } else {
            navigate("/account");
        }
    }, [navigate, setIsAuthenticated, setIsGuest]);

    return (
        <div className="page-container">
            <section className="app-container">
                <h1 className="outline">Logout</h1>
                {message && <p className="success">{message}</p>}
            </section>
        </div>
    );
};

export default Logout;
