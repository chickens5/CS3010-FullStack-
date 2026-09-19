import axios from "axios";
import { useState, useEffect } from "react";


const Account = () => {
    const [account, setAccount] = useState(null);
    const [email, setEmail] = useState("");
    const [profilePicture, setProfilePicture] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const fetchAccount = async () => {
            const userId = localStorage.getItem("userId");
            const token = localStorage.getItem("token");
            if (!userId || !token) {
                console.log("User not found in local storage. Are you logged in?");
                return;
            }

            try {
                const response = await axios.get(`/api/account/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = response.data;
                setAccount(data);
                setEmail(data.email || "");
                setProfilePicture(data.profile_picture || "");
                console.log("Account fetched successfully.");
            } catch (error) {
                console.error("Fetch error:", error);
                setMessage("Could not fetch account.");
            }
        };

        fetchAccount();
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");
        try {
            const response = await axios.put(`/api/account/${userId}`, {
                email,
                profile_picture: profilePicture,
            }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setMessage(response.data.message);

            alert("Account updated successfully!");
        } catch (error) {
            console.error("Update error:", error);
            setMessage("Could not update account.");
        }
    };


    return (
        <div className="page-container">
            <section className="app-container">
                <h1 className="outline">Your Account</h1>
                
                {message && <p className="error">{message}</p>}
                {account ? (
                    <div className="account-details">
                        <img
                            src={profilePicture || "/default-profile.png"}
                            alt="Profile"
                            className="profile-pic"
                        />
                        <form onSubmit={handleUpdate}>
                            <label>Username:</label>
                            <input type="text" value={account.username} disabled />

                            <label>Email:</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />

                            <label>Profile Picture URL:</label>
                            <input
                                type="text"
                                value={profilePicture}
                                onChange={(e) => setProfilePicture(e.target.value)}
                            />

                            <button type="submit" className="button">Update Account</button>
                        </form>
                    </div>
                ) : (
                    <p>Loading account info...</p>
                )}
            </section>
        </div>
    );
};

export default Account;


//test version: import { useState } from "react";
// import { Navigate } from "react-router-dom";
//
// const Account = ({ isAuthenticated }) => {
//     const [account] = useState({
//         username: "DemoUser",
//         email: "demo@example.com",
//     });
//     const [email, setEmail] = useState("demo@example.com");
//     const [profilePicture, setProfilePicture] = useState("/default-profile.png");
//
//     // Redirect if not authenticated
//     if (!isAuthenticated) {
//         return <Navigate to="/login" />;
//     }
//
//     const handleUpdate = (e) => {
//         e.preventDefault();
//         // Simply show success message since we're not doing any actual updates
//         alert("Account updated successfully!");
//     };
//
//     return (
//         <div className="page-container">
//             <section className="title-container">
//                 <h1 className="outline">Your Account</h1>
//             </section>
//
//             <section className="app-container">
//                 <div className="account-details">
//                     <img
//                         src={profilePicture || "/default-profile.png"}
//                         alt="Profile"
//                         className="profile-pic"
//                     />
//                     <form onSubmit={handleUpdate}>
//                         <label>Username:</label>
//                         <input
//                             type="text"
//                             value={account.username}
//                             disabled
//                         />
//
//                         <label>Email:</label>
//                         <input
//                             type="email"
//                             value={email}
//                             onChange={(e) => setEmail(e.target.value)}
//                         />
//
//                         <label>Profile Picture URL:</label>
//                         <input
//                             type="text"
//                             value={profilePicture}
//                             onChange={(e) => setProfilePicture(e.target.value)}
//                         />
//
//                         <button type="submit" className="button">
//                             Update Account
//                         </button>
//                     </form>
//                 </div>
//             </section>
//         </div>
//     );
// };
//
// export default Account;
