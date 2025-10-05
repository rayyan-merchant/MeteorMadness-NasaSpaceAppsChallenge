// ===== CONFIG.JS =====
// Configuration file for API keys and constants
// Note: In frontend apps, API keys are always visible to users
// NASA's API is designed for public use with rate limits

const CONFIG = {
    NASA_API_KEY: 'wMcWgAmOxOHqK1fCDN1V1zmb59UGTvqfm9eONeoM',
    NASA_NEO_API: 'https://api.nasa.gov/neo/rest/v1/feed',
    
    // Physics constants
    TNT_ENERGY_JOULES: 4.184e9, // 1 ton of TNT in Joules
    
    // Default impact parameters
    DEFAULT_PARAMS: {
        diameter: 100,
        velocity: 20,
        angle: 45,
        density: 3000
    }
};