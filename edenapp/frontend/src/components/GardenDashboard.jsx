import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Plants from "./Plants.jsx";

const GardenDashboard = () => {
    const [gardens, setGardens] = useState([]);
    const [plants, setPlants] = useState([]);
    const [selectedGarden, setSelectedGarden] = useState(null);
    const [gardenName, setGardenName] = useState("");
    const [gardenType, setGardenType] = useState("");
    const [imageId, setImageId] = useState("");
    const [imageFile, setImageFile] = useState(null); // Image file for upload

    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");

    const userId = localStorage.getItem("userId");



    useEffect(() => {
        if (!userId) {
            setError("❌ User ID not found. Please log in.");
            setLoading(false);
            return;
        }

        const fetchGardens = async () => {
            try {
                const res = await fetch(`http://127.0.0.1:5000/api/gardens/${userId}`);
                if (!res.ok) throw new Error("Failed to fetch gardens");

                const data = await res.json();
                setGardens(Array.isArray(data) ? data : []);
                setError(null);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchGardens();
    }, [userId]);

    const fetchPlants = async () => {
        try {
            const res = await fetch(`http://127.0.0.1:5000/api/gardens/${gardenId}/plants`);
            const data = await res.json();
            setPlants(data);
        } catch (err) {
            setError("Failed to load plants");
        }
    };

    const createGarden = async () => {
        if (!gardenName.trim()) {
            setError("⚠️ Garden name is required!");
            return;
        }

        const formData = new FormData();
        formData.append("garden_name", gardenName);
        formData.append("garden_type", gardenType);
        if (imageFile) {
            formData.append("imageFile", imageFile); //  Ensure image is being sent
            console.log("Uploading image:", imageFile.name); // Debugging log
        }

        try {
            const response = await fetch(`http://127.0.0.1:5000/api/gardens/${userId}/create`, {
                method: "POST",
                body: formData, // Send as FormData
            });

            if (!response.ok) throw new Error("⚠️ Failed to create garden");

            const newGarden = await response.json();
            console.log("Garden created:", newGarden);

        } catch (err) {
            setError(err.message);
        }
    };


    const handleImageUpload = (e) => {
        const file = e.target.files[0];

        if (file) {
            setImageFile(file); //  Store the file object
            setImagePreview(URL.createObjectURL(file)); // Generate a preview
            console.log(" Image selected:", file.name); // Debugging log
        }
    };


    const updateGarden = async (gardenId) => {
        if (!gardenId || isNaN(gardenId)) {
            console.error(" Invalid Garden ID:", gardenId);
            return;
        }

        const formData = new FormData();
        formData.append("garden_name", gardenName || "");
        formData.append("garden_type", gardenType || "soil");
        if (imageFile) formData.append("imageFile", imageFile);

        try {
            const response = await fetch(`http://127.0.0.1:5000/api/gardens/${gardenId}/edit`, {
                method: "PUT",
                body: formData,
            });

            if (!response.ok) throw new Error("⚠️ Failed to update garden");

            const updatedGarden = await response.json();
            console.log("✅ Garden updated:", updatedGarden);

            setGardens(gardens.map(g => g.id === gardenId ? updatedGarden : g));
            setSuccessMessage("Garden updated successfully!");
        } catch (err) {
            console.error(" Error updating garden:", err);
        }
    };


    const deleteGarden = async (gardenId) => {
        if (!gardenId || isNaN(gardenId)) {
            console.error("Invalid Garden ID:", gardenId);
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:5000/api/gardens/${gardenId}`, {
                method: "DELETE",
            });

            if (!response.ok) throw new Error("⚠️ Failed to delete garden");

            console.log("✅ Garden deleted:", gardenId);

            setGardens(gardens.filter(g => g.id !== gardenId));
        } catch (err) {
            console.error(" Error deleting garden:", err);
        }
    };

    if (loading) return <p className="loading-message"> Loading your gardens...</p>;
    if (error) return <p className="error-message">{error}</p>;

    return (
        <div className="page-container">
            <section className="title-container">
                <h1 className="outline">Manage Your Gardens</h1>
            </section>
            <h2>Create a Garden below to get started!</h2>
            <form onSubmit={createGarden}>
                <h5>Garden Name:</h5>
            <input
                type="text"
                value={gardenName}
                onChange={(e) => setGardenName(e.target.value)}
            />
                <h5>Garden Type:</h5>
            <input
                type="text"
                value={gardenType}
                onChange={(e) => setGardenType(e.target.value)}
            />
                <button type="submit" className="btn">Create Garden</button>

            {successMessage && <p className="success-message">{successMessage}</p>}
            </form>
            <div className="gardens-grid">
                {gardens.length === 0 ? (
                    <p className="no-gardens-message">No gardens found. Start by creating one!</p>
                ) : (
                    gardens.map((garden) => (
                        <div
                            key={garden.id}
                            className="garden-card"
                            style={{
                                backgroundImage: garden.image_id
                                    ? `url(http://127.0.0.1:5000/uploads/${garden.image_id})`
                                    : 'url(/default-garden.png)',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                        >
                            <div className="garden-card-overlay">
                                <h3 className={'garden-title'}>{garden.garden_name}</h3>
                                <p>Type: {garden.garden_type}</p>

                                <Link to={`/gardens`} className="button edit-btn" onClick={() => handleEditGarden(garden)}>Edit</Link>
                                <button className="button delete-btn" onClick={() => deleteGarden(garden.id)}>Delete</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
            <div className="plants-container">
                <h2>🌿 Plants in this Garden</h2>
                {plants.length === 0 ? (
                    <p>No plants yet.</p>
                ) : (
                    <div className="plants-grid">
                        {plants.map((plant) => (
                            <div key={plant.id} className="plant-card">
                                <h3>{plant.plant_name}</h3>
                                <p>Growth Stage: {plant.growth_stage}</p>
                                <p>Last Watered: {plant.last_watered || "N/A"}</p>
                                <p>Frequency: {plant.frequency || "N/A"}</p>
                                <p>Category: {plant.category || "N/A"}</p>
                                {/* Add update/delete buttons here */}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default GardenDashboard;
