import { useMemo, useState, useEffect, useCallback } from 'react';
import rawPlants from '/plant_data_with_pollinators.json';
import { normalizePlants } from '../utils/normalizePlants';
import { filterPlants } from '../utils/filterPlants';
import FilterPanel from './FilterPanel';
import PlantCard from './eden-tool/PlantCard';
import '../styles/nativerec.css';
import PlantModal from './eden-tool/PlantModal';


const ALL_PLANTS = normalizePlants(rawPlants)

const DEFAULT_FILTERS = {
  search: '',
  plantTypes: [],
  sunExposure: [],
  soilTypes: [],
  bloomSeasons: [],
  pollinators: [],
  habitats: [],
};

function NativeRec() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
      // Instantly jumps to the top
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });

    
    }, []); // Empty array ensures this runs only once when the component mounts

  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const filtered = useMemo(
    () => filterPlants(ALL_PLANTS, filters),
    [filters]
  );
  return (
     <div className ='page-container'>
            <span className="header-brand">Eden Plant Tool</span>
            <span className="header-zone">Zone 7a &mdash; St. Louis, MO</span>
          

      <div className="eden-body">
        <div className={`sidebar-overlay${sidebarOpen ? ' visible' : ''}`}
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />

        <div className={`sidebar-wrap${sidebarOpen ? ' open' : ''}`}>
          <FilterPanel
            filters={filters}
            onChange={handleFilterChange}
            resultCount={filtered.length}
            totalCount={ALL_PLANTS.length}
          />
        </div>

        <main className="plant-grid-area">
          {filtered.length === 0 ? (
            <div className="no-results">
              <p>No plants match the current filters.</p>
              <button
                className="clear-btn"
                onClick={() => setFilters(DEFAULT_FILTERS)}
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="plant-grid">
              {filtered.map(plant => (
                <PlantCard
                  key={plant.botanical_name}
                  plant={plant}
                  onClick={() => setSelectedPlant(plant)}
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {selectedPlant && (
        <PlantModal
          plant={selectedPlant}
          onClose={() => setSelectedPlant(null)}
        />
      )}
    </div>
  );
}

export default NativeRec;