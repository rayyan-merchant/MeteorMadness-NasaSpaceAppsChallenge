// ===== ADVANCED_EFFECTS.JS =====
// Advanced impact effects including terrain, population, atmospheric, and historical data

// Historical impact data
const HISTORICAL_IMPACTS = {
    tunguska: {
        name: 'Tunguska Event (1908)',
        energy: 15,
        diameter: 50,
        location: 'Siberia, Russia',
        casualties: 0,
        description: 'Airburst that flattened 2,000 km² of forest'
    },
    chelyabinsk: {
        name: 'Chelyabinsk Meteor (2013)',
        energy: 0.5,
        diameter: 20,
        location: 'Russia',
        casualties: 1500,
        description: 'Airburst that damaged 7,200 buildings'
    },
    barringer: {
        name: 'Barringer Crater (50,000 years ago)',
        energy: 10,
        diameter: 50,
        location: 'Arizona, USA',
        casualties: 0,
        description: 'Created 1.2 km crater in desert'
    },
    chicxulub: {
        name: 'Chicxulub Impact (66 million years ago)',
        energy: 100000000,
        diameter: 10000,
        location: 'Yucatán Peninsula, Mexico',
        casualties: 'Mass extinction',
        description: 'Caused dinosaur extinction, 180 km crater'
    }
};

// Terrain types and effects
const TERRAIN_EFFECTS = {
    ocean: {
        name: 'Ocean',
        tsunamiMultiplier: 3.0,
        craterMultiplier: 0.3,
        seismicMultiplier: 0.7,
        populationDensity: 0,
        description: 'Generates massive tsunamis, reduced crater formation'
    },
    coastal: {
        name: 'Coastal Region',
        tsunamiMultiplier: 2.5,
        craterMultiplier: 0.8,
        seismicMultiplier: 0.9,
        populationDensity: 250,
        description: 'High tsunami risk, moderate population impact'
    },
    urban: {
        name: 'Urban Area',
        tsunamiMultiplier: 0,
        craterMultiplier: 1.0,
        seismicMultiplier: 1.3,
        populationDensity: 5000,
        description: 'Maximum casualties, infrastructure collapse'
    },
    rural: {
        name: 'Rural/Agricultural',
        tsunamiMultiplier: 0,
        craterMultiplier: 1.0,
        seismicMultiplier: 1.0,
        populationDensity: 50,
        description: 'Lower casualties, agricultural devastation'
    },
    desert: {
        name: 'Desert',
        tsunamiMultiplier: 0,
        craterMultiplier: 1.2,
        seismicMultiplier: 0.8,
        populationDensity: 5,
        description: 'Minimal casualties, enhanced crater formation'
    },
    mountain: {
        name: 'Mountainous',
        tsunamiMultiplier: 0,
        craterMultiplier: 0.9,
        seismicMultiplier: 1.5,
        populationDensity: 20,
        description: 'Extreme seismic activity, landslides'
    }
};

// Determine terrain from coordinates
function getTerrainFromCoordinates(lat, lon) {
    // Ocean detection
    if ((Math.abs(lon) > 20 && Math.abs(lon) < 160 && Math.abs(lat) < 50) ||
        (lon < -60 && lon > -120 && Math.abs(lat) < 40)) {
        if (Math.abs(lat) > 30 || Math.abs(lon) > 140) {
            return 'coastal';
        }
        return 'ocean';
    }
    
    // Desert regions
    if ((lat > 15 && lat < 35 && lon > -10 && lon < 50) ||
        (lat > 30 && lat < 45 && lon > -120 && lon < -100)) {
        return 'desert';
    }
    
    // Mountain regions
    if ((lat > 25 && lat < 45 && lon > 60 && lon < 100) ||
        (lat > 35 && lat < 50 && lon > -115 && lon < -105)) {
        return 'mountain';
    }
    
    // Urban detection
    const cities = [
        {lat: 40.7, lon: -74}, {lat: 51.5, lon: -0.1},
        {lat: 35.7, lon: 139.7}, {lat: 19.4, lon: -99.1},
        {lat: -23.5, lon: -46.6}
    ];
    
    for (const city of cities) {
        const distance = Math.sqrt(Math.pow(lat - city.lat, 2) + Math.pow(lon - city.lon, 2));
        if (distance < 2) return 'urban';
    }
    
    return 'rural';
}

// Calculate atmospheric effects
function calculateAtmosphericEffects(megatons, diameter) {
    const effects = {
        dustCloud: Math.pow(megatons, 0.4) * 0.5,
        temperatureDrop: 0,
        globalEffects: false,
        duration: ''
    };
    
    if (megatons > 1000) {
        effects.temperatureDrop = Math.min(15, Math.log10(megatons) * 2);
        effects.globalEffects = true;
        effects.duration = 'Years to decades';
    } else if (megatons > 100) {
        effects.temperatureDrop = Math.min(5, Math.log10(megatons));
        effects.globalEffects = true;
        effects.duration = 'Months to years';
    } else if (megatons > 10) {
        effects.temperatureDrop = 1;
        effects.duration = 'Weeks to months';
    } else {
        effects.duration = 'Days';
    }
    
    return effects;
}

// Calculate population impact
function calculatePopulationImpact(blastRadius, terrain, megatons) {
    const populationDensity = TERRAIN_EFFECTS[terrain].populationDensity;
    const blastAreaKm2 = Math.PI * Math.pow(blastRadius, 2);
    const directCasualties = Math.floor(blastAreaKm2 * populationDensity * 0.9);
    
    const extendedRadius = blastRadius * 2;
    const extendedAreaKm2 = Math.PI * Math.pow(extendedRadius, 2) - blastAreaKm2;
    const extendedCasualties = Math.floor(extendedAreaKm2 * populationDensity * 0.3);
    
    let tsunamiCasualties = 0;
    if (TERRAIN_EFFECTS[terrain].tsunamiMultiplier > 0 && megatons > 1) {
        tsunamiCasualties = Math.floor(100000 * Math.log10(megatons) * 0.5);
    }
    
    return {
        direct: directCasualties,
        extended: extendedCasualties,
        tsunami: tsunamiCasualties,
        total: directCasualties + extendedCasualties + tsunamiCasualties,
        affected: Math.floor((directCasualties + extendedCasualties + tsunamiCasualties) * 3)
    };
}

// Find historical comparison
function findHistoricalComparison(megatons) {
    let closest = null;
    let minDiff = Infinity;
    
    for (const impact of Object.values(HISTORICAL_IMPACTS)) {
        const diff = Math.abs(Math.log10(megatons) - Math.log10(impact.energy));
        if (diff < minDiff) {
            minDiff = diff;
            closest = impact;
        }
    }
    
    return closest;
}

// Get energy comparison text
function getEnergyComparison(megatons) {
    if (megatons < 0.01) {
        return `Equivalent to ${(megatons * 1000).toFixed(0)} tons of TNT - smaller than most conventional bombs.`;
    } else if (megatons < 1) {
        return `Comparable to a large conventional explosion or small tactical nuclear weapon.`;
    } else if (megatons < 15) {
        return `Similar to early nuclear weapons. Comparable to the Hiroshima bomb (15 kt) to early thermonuclear tests.`;
    } else if (megatons < 100) {
        return `Comparable to large thermonuclear weapons. Similar to the Castle Bravo test (15 MT).`;
    } else if (megatons < 1000) {
        return `Approaching extinction-level event. Would cause regional devastation and global climate effects.`;
    } else if (megatons < 100000) {
        return `Mass extinction event. Similar to the asteroid that created the Chicxulub crater.`;
    } else {
        return `Civilization-ending event. Would cause global mass extinction comparable to or exceeding the K-Pg extinction.`;
    }
}

// Display advanced effects in HTML
function displayAdvancedEffects(results) {
    const advancedSection = document.getElementById('advanced-effects');
    if (!advancedSection) return;
    
    advancedSection.classList.remove('hidden');
    
    // Terrain
    document.getElementById('terrain-name').textContent = results.terrain.name;
    document.getElementById('terrain-desc').textContent = results.terrain.description;
    
    // Population
    document.getElementById('casualties-total').textContent = results.population.total.toLocaleString();
    document.getElementById('casualties-breakdown').innerHTML = `
        Direct: ${results.population.direct.toLocaleString()} | 
        Extended Zone: ${results.population.extended.toLocaleString()}
        ${results.population.tsunami > 0 ? ` | Tsunami: ${results.population.tsunami.toLocaleString()}` : ''}
    `;
    document.getElementById('casualties-affected').textContent = 
        `Total affected: ${results.population.affected.toLocaleString()}`;
    
    // Atmospheric
    document.getElementById('dust-cloud').textContent = 
        `${results.atmospheric.dustCloud.toFixed(1)} km³`;
    document.getElementById('atmospheric-details').innerHTML = `
        Temperature drop: ${results.atmospheric.temperatureDrop.toFixed(1)}°C<br>
        Duration: ${results.atmospheric.duration}<br>
        ${results.atmospheric.globalEffects ? 
            '<strong style="color: #ef4444;">Global climate impact expected</strong>' : 
            'Regional effects only'}
    `;
    
    // Historical
    document.getElementById('historical-name').textContent = results.historical.name;
    document.getElementById('historical-energy').textContent = 
        `${results.historical.energy} Megatons`;
    document.getElementById('historical-details').innerHTML = `
        ${results.historical.description}<br>
        Location: ${results.historical.location}<br>
        ${typeof results.historical.casualties === 'number' ? 
            `Casualties: ${results.historical.casualties.toLocaleString()}` : 
            `Impact: ${results.historical.casualties}`}
    `;
    
    // Energy comparison
    document.getElementById('comparison-text').textContent = 
        getEnergyComparison(parseFloat(results.megatons));
}