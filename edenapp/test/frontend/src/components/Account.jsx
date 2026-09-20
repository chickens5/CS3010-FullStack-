import { useState, useEffect } from "react";
import api from "../utils/api";


const Account = () => {
    const [account, setAccount] = useState(null);
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [bio, setBio] = useState("");
    
    const [profilePicture, setProfilePicture] = useState("");
    const [profileFile, setProfileFile] = useState(null);

    const [message, setMessage] = useState("");
    const [isEditing, setIsEditing] = useState(false);


    useEffect(() => {
        const fetchAccount = async () => {
            const userId = localStorage.getItem("userId");
            const token = localStorage.getItem("token");
            if (!userId || !token) {
                console.log("User not found in local storage. Are you logged in?");
                return;
            }

            try {
                const response = await api.get(`/account/${userId}`);
                const data = response.data;
                setAccount(data);
                setEmail(data.email || "");
                setFirstName(data.firstname || "");
                setLastName(data.lastname || "");
                setBio(data.bio || "");
                setProfilePicture(data.profile_picture || "");
                console.log("Account fetched successfully.");
            } catch (error) {
                console.error("Fetch error:", error);
                setMessage("Could not fetch account.");
            }
        };

        fetchAccount();
    }, []);

    // Rejects non-image files client-side before they're ever sent to the server.
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setMessage("Please select an image file.");
            e.target.value = "";
            return;
        }

        setProfileFile(file);
        setProfilePicture(URL.createObjectURL(file));
        setMessage("");
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const userId = localStorage.getItem("userId");
        try {
            const formData = new FormData();
            formData.append("email", email);
            formData.append("firstname", firstName);
            formData.append("lastname", lastName);
            formData.append("bio", bio);
            if (profileFile) {
                formData.append("profile_picture", profileFile);
            }

            const response = await api.put(`/account/${userId}`, formData);
            const data = response.data;

            setAccount(data);
            setEmail(data.email || "");
            setFirstName(data.firstname || "");
            setLastName(data.lastname || "");
            setBio(data.bio || "")
            setProfilePicture(data.profile_picture || "");
            setProfileFile(null);
            setIsEditing(false);
            setMessage("Account updated successfully!");
        } catch (error) {
            console.error("Update error:", error);
            setMessage(error.response?.data?.error || "Could not update account.");
        }
    };


    return (
        <div className="page-container">

            <section className="title-container">
                <h1>Account</h1>
            </section>

            <section className="app-container">
                <div className="account-details">
                <h2> User: {account?.username ?? "Could not fetch"}</h2>
                <p>
                    Name: {[account?.firstname, account?.lastname].filter(Boolean).join(" ") || "Not set"}
                    </p>
                <p>
                    Email: {account?.email  ?? "Not set"}
                    </p>

                    <img
                            src={profilePicture ?? "/default-profile.png"}
                            alt="Profile"
                            className="profile-pic"
                        />

                         <h4>Biography</h4>
                <p>{account?.bio ?? "Hit Edit to add a bio"}</p>
                </div>

                {message && <p>{message}</p>}
                {account ? (
                    <div className="account-details">
                        {!isEditing ? (
                            <button  onClick={() => setIsEditing(true)}>
                                Edit Profile
                            </button>
                        ) : (
                            <form onSubmit={handleUpdate}>
                                <label>First Name:</label>
                                <input
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                />

                                <label>Last Name:</label>
                                <input
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                />

                                <h4>About</h4>
                                <input 
                                type ="text"
                                value ={bio}
                                onChange={(e) => setBio(e.target.value)}
                                />
                                <label>Email:</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />

                                <label>Upload a profile Picture:</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />

                                <div className="form-actions">
                                    <button type="submit" id="submit">Update Account</button>
                                    <button type="button" id="submit" onClick={() => setIsEditing(false)}>
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                ) : (
                    <p>Loading account info...</p>
                )}
            </section>
        </div>
    );
};

export default Account;