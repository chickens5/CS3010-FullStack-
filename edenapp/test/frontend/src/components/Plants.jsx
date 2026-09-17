import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

const Plants = () => {
    const {id: gardenId} = useParams();
    const [plants, setPlants] = useState([]);
    const [plantName, setPlantName] = useState("");
    const [growthStage, setGrowthStage] = useState("");
    const [lastWatered, setLastWatered] = useState("");
    const [frequency, setFrequency] = useState("");
    const [category, setCategory] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");
    const [editPlantId, setEditPlantId] = useState(null);
    const [editingPlantId, setEditingPlantId] = useState(null);
    const [editForm, setEditForm] = useState({
        plant_name: "",
        growth_stage: "",
        last_watered: "",
        frequency: "",
        category: ""
    });
    const updatePlant = async () => {
        if (!editingPlantId) return;

        try {
            const res = await fetch(`http://127.0.0.1:5000/api/gardens/${gardenId}/plants/${editingPlantId}`, {
                method: "PUT",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(editForm),
            });

            if (!res.ok) throw new Error("⚠️ Failed to update plant");

            const updatedPlant = await res.json();

            setPlants(plants.map(p => p.id === editingPlantId ? updatedPlant : p));
            setEditingPlantId(null);
            setSuccessMessage("✅ Plant updated!");
        } catch (err) {
            setError(err.message);
        }
    };

    const editPlant = (plant) => {
        setEditingPlantId(plant.id);
        setEditForm({
            plant_name: plant.plant_name || "",
            growth_stage: plant.growth_stage || "",
            last_watered: plant.last_watered || "",
            frequency: plant.frequency || "",
            category: plant.category || ""
        });
    };

    const fetchPlants = async () => {
        try {
            const res = await fetch(`/api/gardens/${gardenId}/plants`);
            if (!res.ok) throw new Error("⚠️ Failed to fetch plants");
            const data = await res.json();
            setPlants(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const [garden, setGarden] = useState(null); // ✅ Store garden info

    useEffect(() => {
        if (!gardenId) {
            setError("❌ Garden ID not found.");
            setLoading(false);
            return;
        }

        const updatePlant = async () => {
            if (!editingPlantId) return;

            try {
                const res = await fetch(`http://127.0.0.1:5000/api/gardens/${gardenId}/plants/${editingPlantId}`, {
                    method: "PUT",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(editForm),
                });

                if (!res.ok) throw new Error("⚠️ Failed to update plant");

                const updatedPlant = await res.json();

                setPlants(plants.map(p => p.id === editingPlantId ? updatedPlant : p));
                setEditingPlantId(null);
                setSuccessMessage("✅ Plant updated!");
            } catch (err) {
                setError(err.message);
            }
        };


        const fetchGardenDetails = async () => {
            try {
                const res = await fetch(`http://127.0.0.1:5000/api/garden/${gardenId}`);
                if (!res.ok) throw new Error("⚠️ Failed to fetch garden details");
                const data = await res.json();
                setGarden(data); // ✅ Store garden data
            } catch (err) {
                setError(err.message);
            }
        };

        if (gardenId) {
            fetchGardenDetails();
            fetchPlants();
            editPlant();
            updatePlant();
        } else {
            setError("❌ Garden ID not found.");
            setLoading(false);
        }
    }, [gardenId]);


    const addPlant = async () => {
        if (!plantName || !growthStage) {
            setError("⚠️ Please enter plant name and growth stage.");
            return;
        }

        try {
            const res = await fetch(`http://127.0.0.1:5000/api/gardens/${gardenId}/plants`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    plant_name: plantName,
                    growth_stage: growthStage,
                    last_watered: lastWatered || null,
                    frequency: frequency || null,
                    category: category || null
                }),
            });

            if (!res.ok) throw new Error("⚠️ Failed to add plant");

            const newPlant = await res.json();
            setPlants([...plants, newPlant]); // ✅ Update state
            setSuccessMessage("✅ Plant added successfully!");
            setError(null); // ✅ Clear errors

            // ✅ Reset Form Fields
            setPlantName("");
            setGrowthStage("");
            setLastWatered("");
            setFrequency("");
            setCategory("");
        } catch (err) {
            setError(err.message);
        }
    };

    const deletePlant = async (plantId) => {
        try {
            const res = await fetch(`http://127.0.0.1:5000/api/gardens/${gardenId}/plants/${plantId}`, {method: "DELETE"});

            if (!res.ok) throw new Error("⚠️ Failed to delete plant");

            setPlants(plants.filter(plant => plant.id !== plantId)); // ✅ Remove from UI
            setSuccessMessage("✅ Plant deleted successfully!");
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <p className="loading-message">🌱 Loading plants...</p>;
    if (error) return <p className="error-message">{error}</p>;

    return (
        <div className="page-container">
            <section className="garden-header">
                {garden ? (
                    <>
                        <h1 className="outline">{garden.garden_name}</h1>
                        <div className="garden-header-img">
                            <img
                                src={garden.image_id ? `http://127.0.0.1:5000/uploads/${garden.image_id}` : "/default-garden.png"}
                                alt={garden.garden_name}
                                className="header-image"
                            />
                        </div>
                    </>
                ) : (
                    <h1 className="outline">Garden Plants</h1> // Default if garden isn't loaded
                )}
            </section>


            {/* ✅ Display Messages */}
            {successMessage && <p className="success-message">{successMessage}</p>}
            {error && <p className="error-message">{error}</p>}

            <section className="plant-form">
                <input type="text" placeholder="Plant Name" value={plantName}
                       onChange={(e) => setPlantName(e.target.value)}/>
                <input type="text" placeholder="Growth Stage" value={growthStage}
                       onChange={(e) => setGrowthStage(e.target.value)}/>
                <input type="date" placeholder="Last Watered" value={lastWatered}
                       onChange={(e) => setLastWatered(e.target.value)}/>
                <input type="text" placeholder="Watering Frequency" value={frequency}
                       onChange={(e) => setFrequency(e.target.value)}/>
                <input type="text" placeholder="Category" value={category}
                       onChange={(e) => setCategory(e.target.value)}/>
                <button className="button" onClick={editingPlantId ? updatePlant : addPlant}>
                    {editingPlantId ? "💾 Update Plant" : "🌱 Add Plant"}
                </button>

            </section>

            <section className="plants-container">
                {plants.length === 0 ? (
                    <p>No plants found in this garden.</p>
                ) : (
                    <div className="plants-grid">
                        {plants.map((plant) => (
                            <div key={plant.id} className="plant-card">
                                {editPlantId === plant.id ? (
                                    <>
                                        <input
                                            type="text"
                                            value={editFields.plant_name}
                                            onChange={(e) => setEditFields({...editFields, plant_name: e.target.value})}
                                            placeholder="Plant Name"
                                        />
                                        <input
                                            type="text"
                                            value={editFields.growth_stage}
                                            onChange={(e) => setEditFields({
                                                ...editFields,
                                                growth_stage: e.target.value
                                            })}
                                            placeholder="Growth Stage"
                                        />
                                        <input
                                            type="date"
                                            value={editFields.last_watered}
                                            onChange={(e) => setEditFields({
                                                ...editFields,
                                                last_watered: e.target.value
                                            })}
                                        />
                                        <input
                                            type="text"
                                            value={editFields.frequency}
                                            onChange={(e) => setEditFields({...editFields, frequency: e.target.value})}
                                            placeholder="Watering Frequency"
                                        />
                                        <input
                                            type="text"
                                            value={editFields.category}
                                            onChange={(e) => setEditFields({...editFields, category: e.target.value})}
                                            placeholder="Category"
                                        />
                                        <button onClick={updatePlant} className="button save-btn">✅ Update</button>
                                        <button onClick={() => setEditPlantId(null)} className="button cancel-btn">❌
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <h3>{plant.plant_name}</h3>
                                        <p><strong>Growth Stage:</strong> {plant.growth_stage}</p>
                                        <p><strong>Last Watered:</strong> {plant.last_watered || "N/A"}</p>
                                        <p><strong>Watering Frequency:</strong> {plant.frequency || "N/A"}</p>
                                        <p><strong>Category:</strong> {plant.category || "N/A"}</p>
                                        <button className="button edit-btn" onClick={() => handleEditClick(plant)}>✏️
                                            Edit
                                        </button>
                                        <button className="button delete-btn" onClick={() => deletePlant(plant.id)}>❌
                                            Remove
                                        </button>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};
export default Plants;



//import { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import { Link } from "react-router-dom";
//
//
// const Plants = () => {
//     const { id: gardenId } = useParams(); // ✅ Get garden ID from URL
//     const [plants, setPlants] = useState([]);
//     const [plantName, setPlantName] = useState("");
//     const [growthStage, setGrowthStage] = useState("");
//     const [lastWatered, setLastWatered] = useState("");
//     const [frequency, setFrequency] = useState("");
//     const [category, setCategory] = useState("");
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [successMessage, setSuccessMessage] = useState("");
//     const [editPlantId, setEditPlantId] = useState(null);
//     const [editingPlantId, setEditingPlantId] = useState(null);
//     const [editForm, setEditForm] = useState({
//         plant_name: "",
//         growth_stage: "",
//         last_watered: "",
//         frequency: "",
//         category: ""
//     });
//
//     const updatePlant = async () => {
//         if (!editingPlantId) return;
//
//         try {
//             const res = await fetch(`http://127.0.0.1:5000/api/gardens/${gardenId}/plants/${editingPlantId}`, {
//                 method: "PUT",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify(editForm),
//             });
//
//             if (!res.ok) throw new Error("⚠️ Failed to update plant");
//
//             const updatedPlant = await res.json();
//
//             setPlants(plants.map(p => p.id === editingPlantId ? updatedPlant : p));
//             setEditingPlantId(null);
//             setSuccessMessage("✅ Plant updated!");
//         } catch (err) {
//             setError(err.message);
//         }
//     };
//
//     const editPlant = (plant) => {
//         setEditingPlantId(plant.id);
//         setEditForm({
//             plant_name: plant.plant_name || "",
//             growth_stage: plant.growth_stage || "",
//             last_watered: plant.last_watered || "",
//             frequency: plant.frequency || "",
//             category: plant.category || ""
//         });
//     };
//
//     const fetchPlants = async () => {
//         try {
//             const res = await fetch(`/api/gardens/${gardenId}/plants`);
//             if (!res.ok) throw new Error("⚠️ Failed to fetch plants");
//             const data = await res.json();
//             setPlants(Array.isArray(data) ? data : []);
//         } catch (err) {
//             setError(err.message);
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     const [garden, setGarden] = useState(null); // ✅ Store garden info
//
//     useEffect(() => {
//         if (!gardenId) {
//             setError("❌ Garden ID not found.");
//             setLoading(false);
//             return;
//         }
//
//         const updatePlant = async () => {
//             if (!editingPlantId) return;
//
//             try {
//                 const res = await fetch(`http://127.0.0.1:5000/api/gardens/${gardenId}/plants/${editingPlantId}`, {
//                     method: "PUT",
//                     headers: { "Content-Type": "application/json" },
//                     body: JSON.stringify(editForm),
//                 });
//
//                 if (!res.ok) throw new Error("⚠️ Failed to update plant");
//
//                 const updatedPlant = await res.json();
//
//                 setPlants(plants.map(p => p.id === editingPlantId ? updatedPlant : p));
//                 setEditingPlantId(null);
//                 setSuccessMessage("✅ Plant updated!");
//             } catch (err) {
//                 setError(err.message);
//             }
//         };
//
//
//         const fetchGardenDetails = async () => {
//             try {
//                 const res = await fetch(`http://127.0.0.1:5000/api/garden/${gardenId}`);
//                 if (!res.ok) throw new Error("⚠️ Failed to fetch garden details");
//                 const data = await res.json();
//                 setGarden(data); // ✅ Store garden data
//             } catch (err) {
//                 setError(err.message);
//             }
//         };
//
//         if (gardenId) {
//             fetchGardenDetails();
//             fetchPlants();
//             editPlant();
//             updatePlant();
//         } else {
//             setError("❌ Garden ID not found.");
//             setLoading(false);
//         }
//     }, [gardenId]);
//
//
//     const addPlant = async () => {
//         if (!plantName || !growthStage) {
//             setError("⚠️ Please enter plant name and growth stage.");
//             return;
//         }
//
//         try {
//             const res = await fetch(`http://127.0.0.1:5000/api/gardens/${gardenId}/plants`, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({
//                     plant_name: plantName,
//                     growth_stage: growthStage,
//                     last_watered: lastWatered || null,
//                     frequency: frequency || null,
//                     category: category || null
//                 }),
//             });
//
//             if (!res.ok) throw new Error("⚠️ Failed to add plant");
//
//             const newPlant = await res.json();
//             setPlants([...plants, newPlant]); // ✅ Update state
//             setSuccessMessage("✅ Plant added successfully!");
//             setError(null); // ✅ Clear errors
//
//             // ✅ Reset Form Fields
//             setPlantName("");
//             setGrowthStage("");
//             setLastWatered("");
//             setFrequency("");
//             setCategory("");
//         } catch (err) {
//             setError(err.message);
//         }
//     };
//
//     const deletePlant = async (plantId) => {
//         try {
//             const res = await fetch(`http://127.0.0.1:5000/api/gardens/${gardenId}/plants/${plantId}`, { method: "DELETE" });
//
//             if (!res.ok) throw new Error("⚠️ Failed to delete plant");
//
//             setPlants(plants.filter(plant => plant.id !== plantId)); // ✅ Remove from UI
//             setSuccessMessage("✅ Plant deleted successfully!");
//         } catch (err) {
//             setError(err.message);
//         }
//     };
//
//     if (loading) return <p className="loading-message">🌱 Loading plants...</p>;
//     if (error) return <p className="error-message">{error}</p>;
//
//     return (
//         <div className="page-container">
//             <section className="garden-header">
//                 {garden ? (
//                     <>
//                         <h1 className="outline">{garden.garden_name}</h1>
//                         <div className="garden-header-img">
//                             <img
//                                 src={garden.image_id ? `http://127.0.0.1:5000/uploads/${garden.image_id}` : "/default-garden.png"}
//                                 alt={garden.garden_name}
//                                 className="header-image"
//                             />
//                         </div>
//                     </>
//                 ) : (
//                     <h1 className="outline">Garden Plants</h1> // Default if garden isn't loaded
//                 )}
//             </section>
//
//
//             {/* ✅ Display Messages */}
//             {successMessage && <p className="success-message">{successMessage}</p>}
//             {error && <p className="error-message">{error}</p>}
//
//             <section className="plant-form">
//                 <input type="text" placeholder="Plant Name" value={plantName} onChange={(e) => setPlantName(e.target.value)} />
//                 <input type="text" placeholder="Growth Stage" value={growthStage} onChange={(e) => setGrowthStage(e.target.value)} />
//                 <input type="date" placeholder="Last Watered" value={lastWatered} onChange={(e) => setLastWatered(e.target.value)} />
//                 <input type="text" placeholder="Watering Frequency" value={frequency} onChange={(e) => setFrequency(e.target.value)} />
//                 <input type="text" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
//                 <button className="button" onClick={editingPlantId ? updatePlant : addPlant}>
//                     {editingPlantId ? "💾 Update Plant" : "🌱 Add Plant"}
//                 </button>
//
//             </section>
//
//             <section className="plants-container">
//                 {plants.length === 0 ? (
//                     <p>No plants found in this garden.</p>
//                 ) : (
//                     <div className="plants-grid">
//                         {plants.map((plant) => (
//                             <div key={plant.id} className="plant-card">
//                                 {editPlantId === plant.id ? (
//                                     <>
//                                         <input
//                                             type="text"
//                                             value={editFields.plant_name}
//                                             onChange={(e) => setEditFields({ ...editFields, plant_name: e.target.value })}
//                                             placeholder="Plant Name"
//                                         />
//                                         <input
//                                             type="text"
//                                             value={editFields.growth_stage}
//                                             onChange={(e) => setEditFields({ ...editFields, growth_stage: e.target.value })}
//                                             placeholder="Growth Stage"
//                                         />
//                                         <input
//                                             type="date"
//                                             value={editFields.last_watered}
//                                             onChange={(e) => setEditFields({ ...editFields, last_watered: e.target.value })}
//                                         />
//                                         <input
//                                             type="text"
//                                             value={editFields.frequency}
//                                             onChange={(e) => setEditFields({ ...editFields, frequency: e.target.value })}
//                                             placeholder="Watering Frequency"
//                                         />
//                                         <input
//                                             type="text"
//                                             value={editFields.category}
//                                             onChange={(e) => setEditFields({ ...editFields, category: e.target.value })}
//                                             placeholder="Category"
//                                         />
//                                         <button onClick={updatePlant} className="button save-btn">✅ Update</button>
//                                         <button onClick={() => setEditPlantId(null)} className="button cancel-btn">❌ Cancel</button>
//                                     </>
//                                 ) : (
//                                     <>
//                                         <h3>{plant.plant_name}</h3>
//                                         <p><strong>Growth Stage:</strong> {plant.growth_stage}</p>
//                                         <p><strong>Last Watered:</strong> {plant.last_watered || "N/A"}</p>
//                                         <p><strong>Watering Frequency:</strong> {plant.frequency || "N/A"}</p>
//                                         <p><strong>Category:</strong> {plant.category || "N/A"}</p>
//                                         <button className="button edit-btn" onClick={() => handleEditClick(plant)}>✏️ Edit</button>
//                                         <button className="button delete-btn" onClick={() => deletePlant(plant.id)}>❌ Remove</button>
//                                     </>
//                                 )}
//                             </div>
//                         ))}
//                     </div>
//                 )}
//             </section>
//         </div>
//     );
// };
//
// export default Plants;