

import { useEffect, useState, useRef } from "react";
import '../styles/nativerec.css'

export default function NativePlantRecommender() {
    const [allPlants, setAllPlants] = useState([]);
    const [genusImages, setGenusImages] = useState({});
    const [showAll, setShowAll] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState({
        soilType: [],
        sunlight: [],
        habitat: [],
        plantType: [],
        plantStatus: []
    });
    const [recommendations, setRecommendations] = useState([]);
    const [selectedPlant, setSelectedPlant] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const plantsPerPage = 10;
    const plantDetailRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);
    const pageContainerRef = useRef(null);

    const filterOptions = {
        plantStatus: ['S1', 'S2', 'S3', 'S4', 'S5'],
        soilType: ['moist', 'dry'],
        sunlight: ['full_sun', 'part_shade', 'full_shade'],
        plantType: ['Tree','Shrub','Forb','Fern', 'Grass'],
        habitat: [
            'rain_garden_wet',
            'rain_garden_dry',
            'bioswale',
            'wildlife_keystone',
            'ground_cover'
        ]
    };

    const habitatDisplayNames = {
        'rain_garden_wet': 'Rain Garden (Wet soil)',
        'rain_garden_dry': 'Rain Garden (Dry soil)',
        'bioswale': 'Bioswale',
        'wildlife_keystone': 'Wildlife Keystone',
        'ground_cover': 'Ground Cover'
    };

    const handleScroll = () => {
        if (pageContainerRef.current) {
            const { scrollHeight, scrollTop, clientHeight } = pageContainerRef.current;
            setIsScrolledToBottom(scrollHeight - scrollTop === clientHeight);
        }
    };

    const scrollToBottom = () => {
        if (pageContainerRef.current) {
            pageContainerRef.current.scrollTo({ top: pageContainerRef.current.scrollHeight, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        fetch("/plant_data.json")
            .then((res) => res.json())
            .then((data) => setAllPlants(data))
            .catch(() => setRecommendations([{ common_name: "⚠️ Error loading plant data." }]));
    }, []);

    useEffect(() => {
        fetch(`/genusImages.json`)
            .then((res) => res.json())
            .then((data) => setGenusImages(data))
            .catch(() => console.error("⚠️ Error loading genus images data."));
    }, []);

    useEffect(() => {
        setLoading(true);
        const filteredPlants = filterPlants(allPlants);
        setTimeout(() => setLoading(false), 800);
        setRecommendations(filteredPlants);
        setSelectedPlant(null);
        setCurrentPage(1);
    }, [selectedFilters, allPlants]);

    const filterPlants = (plants) => {
        return plants.filter(plant => {

            if (selectedFilters.plantType.length > 0 && !selectedFilters.plantType.includes(plant.plant_type)) {
               return false;
            }
            if (selectedFilters.soilType.length > 0 && !selectedFilters.soilType.includes(plant.soil_type)) {
                return false;
            }
            if (selectedFilters.sunlight.length > 0) {
                const hasSunlight = selectedFilters.sunlight.some(light => plant[light]);
                if (!hasSunlight) return false;
            }
            if (selectedFilters.habitat.length > 0) {
                const hasHabitat = selectedFilters.habitat.some(habitat => plant[habitat]);
                if (!hasHabitat) return false;
            }
            return true;
        });
    };

    const showPlantDetails = (plant) => {
        setLoading(true);
        setSelectedPlant(plant);
        setTimeout(() => {
            plantDetailRef.current?.scrollIntoView({ behavior: "smooth" });
            setLoading(false);
        }, 200);
    };

    const handleViewAll = () => setShowAll(true);
    const handlePaginatedView = () => setShowAll(false);

    const handleFilterChange = (filterType, value) => {
        setSelectedFilters(prev => ({
            ...prev,
            [filterType]: prev[filterType].includes(value)
                ? prev[filterType].filter(item => item !== value)
                : [...prev[filterType], value]
        }));
    };

    const indexOfLastPlant = currentPage * plantsPerPage;
    const indexOfFirstPlant = indexOfLastPlant - plantsPerPage;
    const currentPlants = showAll ? recommendations : recommendations.slice(indexOfFirstPlant, indexOfLastPlant);
    const totalPages = Math.ceil(recommendations.length / plantsPerPage);
    const clearHabitatFilter = () => {
        setSelectedFilters((prevFilters) => ({
            ...prevFilters,
            habitat: []
        }));
    };

    function getGenusFromName(botanicalName) {
        return botanicalName?.split(" ")[0];
    }



    function getGenusKey(genus, genusImages) {
        if (!genus || !genusImages || typeof genusImages !== 'object') return null;

        // Convert to lowercase for comparison, then return the actual matching key
        const match = Object.keys(genusImages).find(
            key => key.toLowerCase() === genus.toLowerCase()
        );

        return match || null;
    }



    function getImageFromJson(plant, genusImages) {
        if (plant?.image) return `${GITHUB_JSON_BASE}${plant.image}`;
        const genus = getGenusFromName(plant.botanical_name);
        const genusKey = getGenusKey(genus, genusImages);
        const genusImage = genusImages[genusKey]?.image;
        return genusImage ? `${GITHUB_JSON_BASE}${genusImage}` : `${GITHUB_JSON_BASE}/plantImgs/default.jpg`;
    }

    function getSourceUrl(plant, genusImages) {
        if (plant?.url) return plant.url;
        const genus = getGenusFromName(plant.botanical_name);
        const genusKey = getGenusKey(genus, genusImages);
        return genusImages[genusKey]?.url || "#";
    }

    function getDescription(plant, genusImages) {
        if (plant?.description && plant.description.length > 10) return plant.description;
        const genus = getGenusFromName(plant.botanical_name);
        const genusKey = getGenusKey(genus, genusImages);
        return genusImages[genusKey]?.description || "No description available.";
    }




    const getPlantHabitats = (plant) => {
        return Object.entries(plant)
            .filter(([key, value]) => filterOptions.habitat.includes(key) && value)
            .map(([key]) => habitatDisplayNames[key]);
    };

    return (
        <div className="native-page-container" ref={pageContainerRef} onScroll={handleScroll}>
            <div className="umsl-app-container">
                <iframe className ='page-container' src = "https://chickens5.github.io/umsl-plant-app/" alt = 'text'>
                </iframe>
            </div>
        </div>
    );
}