# MeteorMadness-NasaSpaceAppsChallenge
# 🌍 Meteor Madness: Asteroid Impact Simulator

![Project Banner](https://img.shields.io/badge/NASA-Space%20Apps%20Challenge-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Status](https://img.shields.io/badge/status-active-success)

An interactive web-based asteroid impact simulator that combines **real NASA data** with **physics-based calculations** to model impact scenarios and evaluate planetary defense strategies.

---

## 🎯 Overview

**Meteor Madness** is an educational tool designed for the NASA Space Apps Challenge that helps users understand asteroid impact threats and planetary defense strategies. It transforms complex scientific data into an intuitive, interactive experience.

### The Challenge

A newly identified near-Earth asteroid poses a potential threat to Earth. Do we have the tools to help the public and decision-makers understand and mitigate its risks?

### Our Solution

An all-in-one simulator that:
- Fetches **real-time asteroid data** from NASA
- Models **impact physics** with scientific accuracy
- Visualizes impacts on an **interactive 3D Earth**
- Evaluates **deflection mission feasibility**
- Calculates **advanced effects** (casualties, climate impact, tsunamis)

---

## ✨ Key Features

### 🛰️ Real NASA Data Integration
- Live data from NASA's NeoWs (Near-Earth Object Web Service) API
- Displays actual asteroids making close approaches to Earth
- Real diameter, velocity, and hazard classifications
- One-click parameter loading from real asteroids

### 🌐 Interactive 3D Visualization
- Fully rotatable Earth model built with Three.js
- Click-and-drag to explore any angle
- Mouse wheel zoom (1.8 to 5.0 units)
- Impact markers with pulsing animation
- Starfield background for depth perception
- Real-time coordinate-to-3D conversion

### 🧮 Physics-Based Calculations
- **Energy**: Kinetic energy from mass and velocity (KE = ½mv²)
- **Crater**: Empirical scaling laws (diameter ∝ energy^0.29)
- **Seismic**: Richter magnitude conversion
- **Blast**: Cube-root scaling for shockwave radius
- **Tsunami**: Risk assessment based on location and size

### 🗺️ Terrain-Aware Effects
Six terrain types with unique multipliers:
- **Ocean**: 3× tsunami risk, reduced crater formation
- **Coastal**: High tsunami risk, moderate casualties
- **Urban**: Maximum casualties (5000/km²)
- **Rural**: Agricultural devastation
- **Desert**: Enhanced crater formation
- **Mountain**: Amplified seismic effects

### 🛡️ Deflection Mission Planning
Four proven/theoretical strategies:
- **Kinetic Impactor** (DART mission - proven technology)
- **Gravity Tractor** (theoretical, gradual deflection)
- **Nuclear Device** (conceptual, high-risk/high-reward)
- **Laser Ablation** (experimental, precision control)

Each with:
- Success probability calculation
- Cost estimates ($2-7 billion range)
- Technology readiness assessment
- Warning time requirements

### 📊 Advanced Impact Analysis
- Population casualties (direct, extended, tsunami zones)
- Atmospheric effects (dust clouds, temperature drops)
- Historical comparisons (Tunguska, Chicxulub, etc.)
- Energy equivalents (nuclear weapons, earthquakes)

---

## 💫 User-Friendly Design

### Intuitive Interface
- **Clean layout**: Glassmorphism design with dark space theme
- **Clear hierarchy**: Organized into logical panels
- **Visual feedback**: Hover effects, selection states, loading indicators
- **Responsive controls**: Smooth sliders with real-time updates

### Guided Workflow
```
1. Fetch NASA Data → View real asteroids
2. Select Asteroid → Auto-fills parameters
3. Adjust Location → Drag Earth or use sliders
4. Calculate Impact → See comprehensive results
5. Plan Defense → Evaluate deflection strategies
```

### Accessibility Features
- High contrast text (white on dark backgrounds)
- Large clickable areas for mobile compatibility
- Tooltips and labels on all controls
- Scrollable panels for content-heavy sections
- Error handling with user-friendly messages

### Educational Focus
- **Scientific notes** explain formulas and assumptions
- **Context provided** for all calculations (e.g., "1.5× Tsar Bomba")
- **Historical comparisons** make abstract numbers relatable
- **Visual indicators** (color-coded risk levels)

---

## 🛠️ Tech Stack

### Frontend
- **HTML5**: Semantic structure
- **CSS3**: Custom styling with CSS variables
  - Glassmorphism effects
  - Smooth animations and transitions
  - Responsive grid layouts
- **JavaScript (ES6+)**: Modern syntax
  - ES6 modules
  - Async/await for API calls
  - Class-based architecture

### 3D Graphics
- **Three.js (r128)**: WebGL rendering
  - PerspectiveCamera for realistic view
  - MeshPhongMaterial for Earth surface
  - BufferGeometry for stars
  - Real-time animation loop

### APIs
- **NASA NeoWs API**: Near-Earth Object data
  - Endpoint: `https://api.nasa.gov/neo/rest/v1/feed`
  - RESTful JSON responses
  - Rate limited (1000 requests/hour)

### External Resources
- **Google Fonts**: Poppins font family
- **CDN Libraries**: 
  - Three.js via jsDelivr/Cloudflare
  - Fallback mechanisms for reliability

---

## 📁 Project Architecture

### File Structure
```
meteor-madness/
├── index.html              # Main HTML structure
├── app.css                 # All styling (glassmorphism theme)
├── config.js               # API keys and constants
├── earth_visual.js         # 3D Earth visualization (Three.js)
├── app.js                  # Main controller + impact physics
├── deflection_calc.js      # Deflection mission planning
├── adv_effects.js          # Terrain, casualties, atmosphere
└── matt-gross-*.jpg        # Background image (space)
```

### Module Responsibilities

#### `config.js`
- NASA API key storage
- Physics constants (TNT energy conversion)
- Default parameter values

#### `earth_visual.js` (EarthVisualization class)
- Three.js scene setup
- Earth geometry (3-layer system)
- Starfield generation
- Impact marker rendering
- Mouse/wheel controls
- Coordinate conversion (lat/lon → 3D)

#### `app.js`
- NASA API integration (`fetchNEOData()`)
- Asteroid list display
- Impact parameter management
- Core physics calculations:
  - Mass from volume
  - Kinetic energy
  - Crater diameter
  - Seismic magnitude
  - Blast radius
  - Tsunami risk

#### `deflection_calc.js` (DeflectionCalculator class)
- Strategy database (4 deflection methods)
- Required velocity change (Δv) calculation
- Success probability heuristics
- Mission cost estimation
- Feasibility scoring (weighted criteria)
- Timeline visualization

#### `adv_effects.js`
- Terrain classification from coordinates
- Terrain effect multipliers
- Atmospheric effects (dust, temperature)
- Population impact calculations
- Historical event comparisons
- Energy context (nuclear weapons, quakes)

---

## ⚙️ How It Works

### 1. NASA Data Pipeline

```javascript
User clicks "Refresh NASA Data"
    ↓
fetch(`https://api.nasa.gov/neo/rest/v1/feed?start_date=${today}&api_key=...`)
    ↓
Parse JSON response
    ↓
Extract: id, name, diameter (max), velocity, hazard status
    ↓
Display first 10 asteroids in scrollable list
    ↓
User clicks asteroid → loadAsteroidData()
    ↓
Auto-fill diameter & velocity sliders
```

**Key Decision**: Use maximum diameter for worst-case scenarios.

### 2. 3D Visualization Pipeline

```javascript
Scene Setup
    ↓
Create Earth sphere (radius: 1.0)
├── Base ocean (blue MeshPhongMaterial)
├── Wireframe continents (green, transparent)
└── Atmosphere glow (BackSide rendering, 1.06 radius)
    ↓
Generate 1000 random stars (PointsMaterial)
    ↓
Position camera at (0, 0.3, 2.5)
    ↓
Add lighting (ambient + directional)
    ↓
Render loop (60 FPS)
├── Auto-rotate Earth (0.001 rad/frame)
├── Pulse impact marker (sin wave)
└── Render scene to canvas
```

**Coordinate Math**:
```javascript
// Latitude/Longitude → 3D Cartesian
phi = (90 - lat) × (π/180)        // Polar angle
theta = (lon + 180) × (π/180)     // Azimuthal angle

x = -r × sin(phi) × cos(theta)
y = r × cos(phi)
z = r × sin(phi) × sin(theta)
```

### 3. Impact Calculation Pipeline

```javascript
User adjusts: diameter, velocity, angle, density
User clicks "Calculate Impact Effects"
    ↓
Calculate Mass
├── volume = (4/3)π × (diameter/2)³
└── mass = volume × density
    ↓
Calculate Kinetic Energy
└── KE = 0.5 × mass × velocity²
    ↓
Convert to TNT Equivalent
├── tons = KE / 4.184×10⁹ J
└── megatons = tons / 10⁶
    ↓
Get Terrain (from Earth coordinates)
└── terrain = getTerrainFromCoordinates(lat, lon)
    ↓
Calculate Effects (with terrain multipliers)
├── Crater: 1.8 × MT^0.29 × 1000 × terrainMultiplier
├── Seismic: (0.67 × log₁₀(KE) - 5.87) × terrainMultiplier
├── Blast: MT^0.33 × 2.2 km
└── Tsunami: conditional logic (diameter, angle, terrain)
    ↓
Calculate Advanced Effects
├── Atmospheric (dust volume, temp drop)
├── Population (casualties by zone)
└── Historical comparison (find closest event)
    ↓
Display Results
└── Update all result cards + advanced effects panel
```

### 4. Deflection Mission Pipeline

```javascript
User selects deflection strategy (kinetic/gravity/nuclear/laser)
User adjusts warning time slider (0.5-20 years)
User clicks "Calculate Deflection Mission"
    ↓
Calculate Required Δv
├── requiredDeflection = 6,371 km (1 Earth radius)
├── timeToImpact = warningYears × 365.25 × 24 × 3600 s
└── deltaV = requiredDeflection / timeToImpact (m/s)
    ↓
Calculate Success Probability
├── timeRatio = warningYears / strategy.optimalWarning
├── sizeRatio = penalty for large asteroids
└── probability = timeRatio × sizeRatio × 100 (+ bonuses)
    ↓
Calculate Mission Parameters
├── duration = max(warningYears × 0.3, strategy.minWarning × 0.5)
└── cost = baseCost + (duration × costPerYear)
    ↓
Calculate Feasibility Score
├── 40% weight: success probability
├── 30% weight: time availability
└── 30% weight: technology readiness
    ↓
Display Mission Analysis
└── Update feasibility bar, cost, duration, notes
```

---

## 🚀 Launching

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection (for NASA API and CDN libraries)

### To use the appliction, simply go to https://rayyan-merchant.github.io/MeteorMadness-NasaSpaceAppsChallenge/

## 📖 Usage Guide

### Step 1: Explore Real Asteroids
1. Click **"Refresh NASA Data"** to fetch today's close approaches
2. Browse the list of 10 real near-Earth objects
3. Click any asteroid to auto-fill its parameters
4. Notice the ⚠️ icon for potentially hazardous asteroids

### Step 2: Choose Impact Location
**Option A: Use sliders**
- Drag **"Impact Latitude"** slider (-90° to +90°)
- Drag **"Impact Longitude"** slider (-180° to +180°)
- Watch the red marker move on the 3D Earth

**Option B: Random location**
- Click **"Random Location"** button
- System picks random coordinates
- Useful for exploring different terrains

**Option C: Interact with Earth**
- Click and drag to rotate the globe
- Scroll to zoom in/out
- Find specific regions visually

### Step 3: Adjust Impact Parameters
- **Diameter**: 10m to 1000m (default: 100m)
- **Velocity**: 5 km/s to 70 km/s (default: 20 km/s)
- **Impact Angle**: 0° (horizontal) to 90° (vertical)
- **Density**: Ice (2000), Stony (3000), Iron (5000) kg/m³

### Step 4: Calculate Impact
1. Click **"Calculate Impact Effects"**
2. View results in scrollable panel:
   - Impact Energy (Megatons TNT)
   - Crater Diameter (meters)
   - Seismic Magnitude (Richter scale)
   - Blast Radius (kilometers)
   - Tsunami Risk (None/Moderate/High/Extreme)
3. Scroll down for advanced effects:
   - Terrain type and description
   - Estimated casualties (direct + indirect)
   - Atmospheric effects (dust, temperature)
   - Historical comparison
   - Energy context

### Step 5: Plan Deflection Mission
1. Choose a **deflection strategy**:
   - Kinetic Impactor (best for 1-10 years)
   - Gravity Tractor (needs 10+ years)
   - Nuclear Device (high risk, 2-7 years)
   - Laser Ablation (experimental, 3-10 years)
2. Adjust **warning time** (0.5 to 20 years)
3. Click **"Calculate Deflection Mission"**
4. Review mission analysis:
   - Success probability (color-coded)
   - Required velocity change (Δv)
   - Mission duration
   - Estimated cost
   - Feasibility rating (Highly/Moderately/Low Feasible)

---

## 🔬 Scientific Accuracy

### Data Sources
- **NASA NeoWs API**: Official NASA asteroid catalog
- **Empirical formulas**: Peer-reviewed impact physics research
- **Scaling laws**: Nuclear test data, known impact craters
- **DART mission**: Proven kinetic impactor data (2022)

### Calculation Methods

#### Energy
```
KE = ½mv² (Newtonian mechanics)
```
✓ **Accurate** for non-relativistic velocities (<0.1c)

#### Crater Formation
```
D = 1.8 × E^0.29 × 1000 (meters)
```
✓ **Based on**: Collins et al. scaling laws, calibrated to Barringer Crater

#### Seismic Magnitude
```
M = 0.67 × log₁₀(E) - 5.87
```
✓ **Based on**: Chyba et al. (1993), earthquake energy-magnitude relationships

#### Blast Radius
```
R = E^0.33 × 2.2 (km at 5 psi overpressure)
```
✓ **Based on**: Sachs scaling from nuclear weapons research
**Why These Choices?**
Balance between educational value and computational complexity. The tool teaches correct intuitions (velocity matters more than size, early detection crucial) without requiring supercomputers.

---

## 👥 Team

### Team Members
- **Rayyan Merchant** - Team Owner (@rayyanmerchant)
- **Rija Ali** (@rijaa.)
- **Syed Ukkashah Ahmed Shah** (@syedukkashah)
- **Ibrahim Johar Farooqi** (@ibrahimjohar)
- **Riya Bhart** (@riyabhart)

**Location**: Karachi, Pakistan  
**Event**: NASA Space Apps Challenge 2025  
**Challenge**: Meteor Madness

### About the Team
Passionate about exploring space data, uncovering patterns, and turning them into creative, impactful solutions. Backgrounds in AI, data science, and software development with skills in Python, machine learning, data visualization, and full-stack development.

---

## 🙏 Acknowledgments

### Data & APIs
- **NASA**: NeoWs API and asteroid data
- **USGS**: Geospatial information
- **Three.js**: 3D graphics library

### Scientific References
- Collins et al. - Impact crater scaling laws
- Chyba et al. (1993) - Seismic magnitude formulas
- Sachs scaling - Blast radius calculations
- NASA DART Mission - Kinetic impactor validation

### Design Inspiration
- Glassmorphism UI trend
- Space-themed color palettes
- NASA's Eyes on Asteroids visualization

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🔗 Links

- **Live Demo**: [meteor-madness.example.com](#)
- **GitHub Repository**: [github.com/yourusername/meteor-madness](#)
- **NASA Space Apps**: [spaceappschallenge.org](#)
- **NASA NeoWs API**: [api.nasa.gov](https://api.nasa.gov)
---

## 💬 Contact
For questions, feedback, or collaboration:
- **Email**: ukkashahsyed@gmail.com
---

**Built with 🚀 for NASA Space Apps Challenge 2025**

*Making asteroid impact science accessible to everyone.*
