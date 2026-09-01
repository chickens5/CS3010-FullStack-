import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const GardenEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [newPlant, setNewPlant] = useState({
        plant_name: "",
        growth_stage: "",
        last_watered: "",
        plant_role: "",
        category: "",
        quantity: 1,
    });


    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");


    useEffect(() => {
        fetchGarden();
        fetchPlants();
    }, [id]);

    const fetchGarden = async () => {
        try {
            const res = await fetch(`http://127.0.0.1:5000/api/gardens/${usserId}`);
            const data = await res.json();
            setGarden(data);
            setGardenName(data.garden_name);
            setGardenType(data.garden_type);
        } catch (err) {
            setError("Failed to load garden");
        }
    };

    const fetchPlants = async () => {
        try {
            const res = await fetch(`http://127.0.0.1:5000/api/gardens/${GardenId}/plants`);
            const data = await res.json();
            setPlants(data);
        } catch (err) {
            setError("Failed to load plants");
        }
    };

    const handlePlantInput = (e) => {
        const { name, value } = e.target;
        setNewPlant(prev => ({ ...prev, [name]: value }));
    };



    return (
        <div className="page-container">
            <section className="title-container">
                <h1 className="outline">Edit Garden: </h1>
            </section>

            {error && <p className="error-message">{error}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}

            <div className="add-plant-form">
                <h3>Add a New Plant</h3>
                <input name="plant_name" placeholder="Name" value={newPlant.plant_name} onChange={handlePlantInput} />
                <input name="growth_stage" placeholder="Stage" value={newPlant.growth_stage} onChange={handlePlantInput} />
                <input name="last_watered" type="date" value={newPlant.last_watered} onChange={handlePlantInput} />
                <input name="plant_role" placeholder="Role" value={newPlant.plant_role} onChange={handlePlantInput} />
                <input name="category" placeholder="Category" value={newPlant.category} onChange={handlePlantInput} />
                <input name="quantity" type="number" value={newPlant.quantity} onChange={handlePlantInput} />
                <button className = 'btn'>Add Plant</button>
            </div>

        </div>
    );
};

export default GardenEditor;
