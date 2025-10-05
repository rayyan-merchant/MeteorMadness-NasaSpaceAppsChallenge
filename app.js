// ===== APP.JS =====
// Main application controller

const NASA_API_KEY = CONFIG.NASA_API_KEY;
const NASA_NEO_API = CONFIG.NASA_NEO_API;

// Global state
let asteroids = [];
let selectedAsteroid = null;
let impactParams = { ...CONFIG.DEFAULT_PARAMS };

// DOM Elements
const elements = {
    loading: document.getElementById('loading'),
    asteroidList: document.getElementById('asteroid-list'),
    refreshBtn: document.getElementById('refresh-btn'),
    calculateBtn: document.getElementById('calculate-btn'),
    resultsPlaceholder: document.getElementById('results-placeholder'),
    results: document.getElementById('results'),

    // Sliders
    diameter: document.getElementById('diameter'),
    velocity: document.getElementById('velocity'),
    angle: document.getElementById('angle'),
    density: document.getElementById('density'),

    // Value displays
    diameterValue: document.getElementById('diameter-value'),
    velocityValue: document.getElementById('velocity-value'),
    angleValue: document.getElementById('angle-value'),
    densityValue: document.getElementById('density-value'),

    // Results
    megatons: document.getElementById('megatons'),
    tntEquivalent: document.getElementById('tnt-equivalent'),
    crater: document.getElementById('crater'),
    magnitude: document.getElementById('magnitude'),
    blastRadius: document.getElementById('blast-radius'),
    tsunamiRisk: document.getElementById('tsunami-risk'),

    // Header + impact predictions card
    headerText: document.querySelector('.header-title'),
    predictionsCard: document.querySelector('.impact-predictions')
};

// Initialize app
function init() {
    setupEventListeners();
    fetchNEOData();
    enhanceHeaderUI();
    makePredictionsCardScrollable();
}

// Setup event listeners
function setupEventListeners() {
    elements.refreshBtn.addEventListener('click', fetchNEOData);
    elements.calculateBtn.addEventListener('click', calculateImpactEffects);

    // Sliders
    elements.diameter.addEventListener('input', (e) => {
        impactParams.diameter = parseFloat(e.target.value);
        elements.diameterValue.textContent = e.target.value;
    });

    elements.velocity.addEventListener('input', (e) => {
        impactParams.velocity = parseFloat(e.target.value);
        elements.velocityValue.textContent = e.target.value;
    });

    elements.angle.addEventListener('input', (e) => {
        impactParams.angle = parseFloat(e.target.value);
        elements.angleValue.textContent = e.target.value;
    });

    elements.density.addEventListener('change', (e) => {
        impactParams.density = parseFloat(e.target.value);
        elements.densityValue.textContent = e.target.value;
    });
}

// Fetch NASA NEO Data
async function fetchNEOData() {
    try {
        showLoading(true);

        const today = new Date().toISOString().split('T')[0];
        const url = `${NASA_NEO_API}?start_date=${today}&end_date=${today}&api_key=${NASA_API_KEY}`;

        const response = await fetch(url);
        const data = await response.json();

        const neoList = Object.values(data.near_earth_objects).flat();
        asteroids = neoList.slice(0, 10).map(neo => ({
            id: neo.id,
            name: neo.name,
            diameter: neo.estimated_diameter.meters.estimated_diameter_max,
            velocity: parseFloat(neo.close_approach_data[0]?.relative_velocity.kilometers_per_second || 20),
            missDistance: parseFloat(neo.close_approach_data[0]?.miss_distance.kilometers || 0),
            isPotentiallyHazardous: neo.is_potentially_hazardous_asteroid
        }));

        displayAsteroids();
        showLoading(false);

    } catch (error) {
        console.error('Error fetching NEO data:', error);
        elements.asteroidList.innerHTML = `
            <div style="color: #ef4444; text-align: center; padding: 20px;">
                Failed to fetch NASA data. Please try again.
            </div>
        `;
        showLoading(false);
    }
}

// Display asteroid list
function displayAsteroids() {
    elements.asteroidList.innerHTML = asteroids.map(asteroid => `
        <div class="asteroid-item ${selectedAsteroid?.id === asteroid.id ? 'selected' : ''}" 
             data-id="${asteroid.id}">
            <div class="asteroid-name">${asteroid.name}</div>
            <div class="asteroid-details">
                <div>Diameter: ${asteroid.diameter.toFixed(0)}m</div>
                <div>Velocity: ${asteroid.velocity.toFixed(1)} km/s</div>
                ${asteroid.isPotentiallyHazardous ? 
                    '<div class="hazardous">⚠️ Potentially Hazardous</div>' : ''}
            </div>
        </div>
    `).join('');

    document.querySelectorAll('.asteroid-item').forEach(item => {
        item.addEventListener('click', () => {
            const asteroidId = item.dataset.id;
            const asteroid = asteroids.find(a => a.id === asteroidId);
            loadAsteroidData(asteroid);
        });
    });
}

// Load asteroid into parameters
function loadAsteroidData(asteroid) {
    selectedAsteroid = asteroid;
    impactParams.diameter = asteroid.diameter;
    impactParams.velocity = asteroid.velocity;

    elements.diameter.value = asteroid.diameter;
    elements.velocity.value = asteroid.velocity;
    elements.diameterValue.textContent = asteroid.diameter.toFixed(0);
    elements.velocityValue.textContent = asteroid.velocity.toFixed(1);

    displayAsteroids();
}

// Calculate impact effects
function calculateImpactEffects() {
    const { diameter, velocity, angle, density } = impactParams;

    let terrain = 'rural';
    if (window.earthViz) {
        const coords = earthViz.getImpactCoordinates();
        terrain = getTerrainFromCoordinates(coords.latitude, coords.longitude);
    }

    const radius = diameter / 2;
    const volume = (4/3) * Math.PI * Math.pow(radius, 3);
    const mass = volume * density;
    const velocityMs = velocity * 1000;
    const kineticEnergy = 0.5 * mass * Math.pow(velocityMs, 2);
    const tntEquivalent = kineticEnergy / CONFIG.TNT_ENERGY_JOULES;
    const megatons = tntEquivalent / 1e6;

    const terrainData = TERRAIN_EFFECTS[terrain];
    const craterDiameter = 1.8 * Math.pow(megatons, 0.29) * 1000 * terrainData.craterMultiplier;
    const magnitude = (0.67 * Math.log10(kineticEnergy) - 5.87) * terrainData.seismicMultiplier;
    const blastRadius = Math.pow(megatons, 0.33) * 2.2;

    let tsunamiRisk = 'NONE';
    let tsunamiClass = '';
    if (terrainData.tsunamiMultiplier > 0) {
        if (diameter > 300 && angle < 60) {
            tsunamiRisk = 'EXTREME';
            tsunamiClass = 'high';
        } else if (diameter > 100 && angle < 60) {
            tsunamiRisk = 'HIGH';
            tsunamiClass = 'high';
        } else if (megatons > 1) {
            tsunamiRisk = 'MODERATE';
            tsunamiClass = 'moderate';
        }
    }

    const atmospheric = calculateAtmosphericEffects(megatons, diameter);
    const population = calculatePopulationImpact(blastRadius, terrain, megatons);
    const historical = findHistoricalComparison(megatons);

    const results = {
        megatons: megatons.toFixed(2),
        tntEquivalent: tntEquivalent.toExponential(2),
        crater: craterDiameter.toFixed(0),
        magnitude: magnitude.toFixed(1),
        blastRadius: blastRadius.toFixed(1),
        tsunamiRisk,
        tsunamiClass,
        terrain: terrainData,
        atmospheric,
        population,
        historical
    };

    if (typeof deflectionCalc !== 'undefined' && deflectionCalc) {
        deflectionCalc.setAsteroidParams(impactParams, results);
    }

    displayResults(results);
    displayAdvancedEffects(results);
}

// Display results
function displayResults(results) {
    elements.resultsPlaceholder.style.display = 'none';
    elements.results.classList.remove('hidden');

    elements.megatons.textContent = results.megatons;
    elements.tntEquivalent.textContent = results.tntEquivalent + ' tons TNT';
    elements.crater.textContent = results.crater;
    elements.magnitude.textContent = results.magnitude;
    elements.blastRadius.textContent = results.blastRadius;
    elements.tsunamiRisk.textContent = results.tsunamiRisk;

    elements.tsunamiRisk.className = `result-value ${results.tsunamiClass}`;
}

// Show/hide loading
function showLoading(show) {
    elements.loading.style.display = show ? 'block' : 'none';
    elements.asteroidList.style.display = show ? 'none' : 'block';
    elements.refreshBtn.disabled = show;
}

// === NEW UI ENHANCEMENTS ===

// 🌌 Animated glowing header
function enhanceHeaderUI() {
    if (!elements.headerText) return;

    elements.headerText.style.transition = 'color 1.5s ease, text-shadow 1.5s ease';
    let glow = 0;
    setInterval(() => {
        glow = (glow + 1) % 360;
        elements.headerText.style.textShadow = `0 0 15px hsl(${glow}, 100%, 70%)`;
        elements.headerText.style.color = `hsl(${glow}, 90%, 80%)`;
    }, 150);
}

// 🌀 Make the impact predictions card scrollable
function makePredictionsCardScrollable() {
    if (!elements.predictionsCard) return;
    elements.predictionsCard.classList.add('scrollable-card');
}

// Start app
document.addEventListener('DOMContentLoaded', init);
