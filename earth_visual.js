// ===== EARTH-VISUALIZATION.JS =====
// 3D Earth visualization with impact location

class EarthVisualization {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.impactLat = 0;
        this.impactLon = 0;
        this.impactMarker = null;
        
        this.init();
        this.animate();
        this.setupControls();
    }
    
    init() {
        // Scene setup
        this.scene = new THREE.Scene();
        
        // Camera setup
        this.camera = new THREE.PerspectiveCamera(
            45,
            this.canvas.clientWidth / this.canvas.clientHeight,
            0.1,
            1000
        );
        this.camera.position.z = 3;
        
        // Renderer setup
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        
        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 3, 5);
        this.scene.add(directionalLight);
        
        // Create Earth
        this.createEarth();
        
        // Create stars background
        this.createStars();
        
        // Mouse controls
        this.setupMouseControls();
        
        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());                                                                                                                 
        // Add this to the end of the init() method in EarthVisualization class:
        setTimeout(() => {
            this.canvas.parentElement.classList.add('loaded');
        }, 100);
    }

    
    createEarth() {
        // Earth geometry
        const geometry = new THREE.SphereGeometry(1, 64, 64);
        
        // Earth material with basic texture
        const material = new THREE.MeshPhongMaterial({
            color: 0x2233ff,
            emissive: 0x112244,
            shininess: 5,
            wireframe: false
        });
        
        // Add continents using wireframe overlay
        const wireframeMaterial = new THREE.MeshBasicMaterial({
            color: 0x44ff44,
            wireframe: true,
            transparent: true,
            opacity: 0.1
        });
        
        this.earth = new THREE.Mesh(geometry, material);
        this.earthWireframe = new THREE.Mesh(geometry, wireframeMaterial);
        
        this.scene.add(this.earth);
        this.scene.add(this.earthWireframe);
        
        // Add atmosphere glow
        const atmosphereGeometry = new THREE.SphereGeometry(1.05, 64, 64);
        const atmosphereMaterial = new THREE.MeshBasicMaterial({
            color: 0x4488ff,
            transparent: true,
            opacity: 0.15,
            side: THREE.BackSide
        });
        const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
        this.scene.add(atmosphere);
    }
    
    createStars() {
        const starsGeometry = new THREE.BufferGeometry();
        const starsMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.02,
            transparent: true,
            opacity: 0.8
        });
        
        const starsVertices = [];
        for (let i = 0; i < 1000; i++) {
            const x = (Math.random() - 0.5) * 20;
            const y = (Math.random() - 0.5) * 20;
            const z = (Math.random() - 0.5) * 20;
            starsVertices.push(x, y, z);
        }
        
        starsGeometry.setAttribute(
            'position',
            new THREE.Float32BufferAttribute(starsVertices, 3)
        );
        
        const stars = new THREE.Points(starsGeometry, starsMaterial);
        this.scene.add(stars);
    }
    
    updateImpactLocation(lat, lon) {
        this.impactLat = lat;
        this.impactLon = lon;
        
        // Remove old marker
        if (this.impactMarker) {
            this.scene.remove(this.impactMarker);
        }
        
        // Create impact marker
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lon + 180) * (Math.PI / 180);
        
        const x = -1.02 * Math.sin(phi) * Math.cos(theta);
        const y = 1.02 * Math.cos(phi);
        const z = 1.02 * Math.sin(phi) * Math.sin(theta);
        
        // Impact marker (red sphere)
        const markerGeometry = new THREE.SphereGeometry(0.05, 16, 16);
        const markerMaterial = new THREE.MeshBasicMaterial({
            color: 0xff0000,
            emissive: 0xff0000,
            emissiveIntensity: 0.5
        });
        this.impactMarker = new THREE.Mesh(markerGeometry, markerMaterial);
        this.impactMarker.position.set(x, y, z);
        this.scene.add(this.impactMarker);
        
        // Add impact zone ring
        const ringGeometry = new THREE.RingGeometry(0.08, 0.12, 32);
        const ringMaterial = new THREE.MeshBasicMaterial({
            color: 0xff4444,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.6
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.position.set(x, y, z);
        ring.lookAt(0, 0, 0);
        this.scene.add(ring);
        
        // Pulse animation for marker
        this.pulseMarker();
        
        // Update location details
        this.updateLocationDetails(lat, lon);
    }
    
    pulseMarker() {
        if (this.impactMarker) {
            const scale = 1 + Math.sin(Date.now() * 0.005) * 0.3;
            this.impactMarker.scale.set(scale, scale, scale);
        }
    }
    
    updateLocationDetails(lat, lon) {
        const locationDetails = document.getElementById('location-details');
        
        // Simple location description based on coordinates
        let location = '';
        if (lat > 60) location = 'Arctic Region';
        else if (lat < -60) location = 'Antarctic Region';
        else if (Math.abs(lon) < 30 && Math.abs(lat) < 40) location = 'Europe/Africa';
        else if (lon > 30 && lon < 150 && lat > 0) location = 'Asia';
        else if (lon < -60 && lon > -120 && lat > 15) location = 'North America';
        else if (lon < -30 && lon > -90 && lat < -10) location = 'South America';
        else if (lon > 110 && lon < 180 && lat < -10) location = 'Australia/Oceania';
        else location = 'Ocean';
        
        const hemisphere = lat >= 0 ? 'Northern' : 'Southern';
        
        locationDetails.innerHTML = `
            <strong style="color: #60a5fa;">${location}</strong><br>
            Coordinates: ${lat.toFixed(2)}°, ${lon.toFixed(2)}°<br>
            Hemisphere: ${hemisphere}
        `;
    }
    
    setupMouseControls() {
        let isDragging = false;
        let previousMousePosition = { x: 0, y: 0 };
        
        this.canvas.addEventListener('mousedown', (e) => {
            isDragging = true;
            previousMousePosition = { x: e.clientX, y: e.clientY };
        });
        
        this.canvas.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const deltaX = e.clientX - previousMousePosition.x;
                const deltaY = e.clientY - previousMousePosition.y;
                
                this.earth.rotation.y += deltaX * 0.005;
                this.earthWireframe.rotation.y += deltaX * 0.005;
                this.earth.rotation.x += deltaY * 0.005;
                this.earthWireframe.rotation.x += deltaY * 0.005;
                
                previousMousePosition = { x: e.clientX, y: e.clientY };
            }
        });
        
        this.canvas.addEventListener('mouseup', () => {
            isDragging = false;
        });
        
        this.canvas.addEventListener('mouseleave', () => {
            isDragging = false;
        });
        
        // Zoom with mouse wheel
        this.canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            this.camera.position.z += e.deltaY * 0.001;
            this.camera.position.z = Math.max(1.5, Math.min(5, this.camera.position.z));
        });
    }
    
    setupControls() {
        const latSlider = document.getElementById('impact-lat');
        const lonSlider = document.getElementById('impact-lon');
        const latValue = document.getElementById('lat-value');
        const lonValue = document.getElementById('lon-value');
        const randomBtn = document.getElementById('random-location-btn');
        
        latSlider.addEventListener('input', (e) => {
            const lat = parseFloat(e.target.value);
            latValue.textContent = lat;
            this.updateImpactLocation(lat, this.impactLon);
        });
        
        lonSlider.addEventListener('input', (e) => {
            const lon = parseFloat(e.target.value);
            lonValue.textContent = lon;
            this.updateImpactLocation(this.impactLat, lon);
        });
        
        randomBtn.addEventListener('click', () => {
            const randomLat = Math.floor(Math.random() * 181) - 90;
            const randomLon = Math.floor(Math.random() * 361) - 180;
            
            latSlider.value = randomLat;
            lonSlider.value = randomLon;
            latValue.textContent = randomLat;
            lonValue.textContent = randomLon;
            
            this.updateImpactLocation(randomLat, randomLon);
        });
        
        // Set initial location
        this.updateImpactLocation(0, 0);
    }
    
    onWindowResize() {
        const width = this.canvas.clientWidth;
        const height = this.canvas.clientHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        // Slow rotation
        this.earth.rotation.y += 0.001;
        this.earthWireframe.rotation.y += 0.001;
        
        // Pulse the impact marker
        this.pulseMarker();
        
        this.renderer.render(this.scene, this.camera);
    }
    
    getImpactCoordinates() {
        return {
            latitude: this.impactLat,
            longitude: this.impactLon
        };
    }
}

// Initialize when DOM is ready
let earthViz;
document.addEventListener('DOMContentLoaded', () => {
    earthViz = new EarthVisualization('earth-canvas');
});