// ===== DEFLECTION-CALCULATOR.JS =====
// Calculates deflection mission parameters and feasibility

class DeflectionCalculator {
    constructor() {
        this.selectedStrategy = null;
        this.warningYears = 5;
        this.asteroidParams = null;
        this.impactResults = null;
        
        this.strategies = {
            kinetic: {
                name: 'Kinetic Impactor',
                efficiency: 0.0001,
                costPerYear: 0.5,
                baseCost: 2,
                techReadiness: 'Proven (DART mission)',
                minWarning: 1,
                optimalWarning: 5
            },
            gravity: {
                name: 'Gravity Tractor',
                efficiency: 0.00001,
                costPerYear: 0.3,
                baseCost: 3,
                techReadiness: 'Theoretical',
                minWarning: 5,
                optimalWarning: 15
            },
            nuclear: {
                name: 'Nuclear Device',
                efficiency: 0.001,
                costPerYear: 1,
                baseCost: 5,
                techReadiness: 'Conceptual',
                minWarning: 2,
                optimalWarning: 7
            },
            laser: {
                name: 'Laser Ablation',
                efficiency: 0.00005,
                costPerYear: 0.8,
                baseCost: 4,
                techReadiness: 'Experimental',
                minWarning: 3,
                optimalWarning: 10
            }
        };
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.updateTimeline();
    }
    
    setupEventListeners() {
        // Strategy selection
        document.querySelectorAll('.strategy-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const strategy = e.currentTarget.dataset.strategy;
                this.selectStrategy(strategy);
            });
        });
        
        // Warning time slider
        const warningSlider = document.getElementById('warning-years');
        const warningValue = document.getElementById('warning-years-value');
        
        warningSlider.addEventListener('input', (e) => {
            this.warningYears = parseFloat(e.target.value);
            warningValue.textContent = this.warningYears;
            this.updateTimeline();
        });
        
        // Calculate deflection button
        document.getElementById('calculate-deflection-btn').addEventListener('click', () => {
            this.calculateDeflection();
        });
    }
    
    selectStrategy(strategy) {
        this.selectedStrategy = strategy;
        
        // Update UI
        document.querySelectorAll('.strategy-card').forEach(card => {
            card.classList.remove('selected');
        });
        document.querySelector(`[data-strategy="${strategy}"]`).classList.add('selected');
    }
    
    updateTimeline() {
        const progress = document.getElementById('timeline-progress');
        const marker = document.getElementById('timeline-marker');
        const impactDate = document.getElementById('impact-date');
        const feasibilityLabel = document.getElementById('feasibility-label');

        // Mission launch bar logic
        const clampedYears = Math.max(0.5, this.warningYears);
        const launchPoint = Math.min((clampedYears / 20) * 100, 90);
        
        progress.style.width = launchPoint + '%';
        marker.style.left = launchPoint + '%';

        // Default color before feasibility is calculated
        progress.style.background = 'linear-gradient(90deg, #ff1744, #ff9100)';

        // If feasibility exists, adjust color live
        if (feasibilityLabel && feasibilityLabel.classList.contains('high')) {
            progress.style.background = 'linear-gradient(90deg, #00c853, #64dd17)';
        } else if (feasibilityLabel && feasibilityLabel.classList.contains('medium')) {
            progress.style.background = 'linear-gradient(90deg, #ffeb3b, #fdd835)';
        } else if (feasibilityLabel && feasibilityLabel.classList.contains('low')) {
            progress.style.background = 'linear-gradient(90deg, #ff5252, #ff1744)';
        }

        // Update impact year
        const futureDate = new Date();
        futureDate.setFullYear(futureDate.getFullYear() + this.warningYears);
        impactDate.textContent = futureDate.getFullYear();
    }

    setAsteroidParams(params, results) {
        this.asteroidParams = params;
        this.impactResults = results;
    }
    
    calculateDeflection() {
        if (!this.selectedStrategy) {
            alert('Please select a deflection strategy first!');
            return;
        }
        
        if (!this.asteroidParams || !this.impactResults) {
            alert('Please calculate impact effects first!');
            return;
        }
        
        const strategy = this.strategies[this.selectedStrategy];
        const { diameter, velocity, density } = this.asteroidParams;
        
        // Calculate required velocity change
        const earthRadius = 6371;
        const timeToImpact = this.warningYears * 365.25 * 24 * 3600;
        const requiredDeflection = earthRadius * 1000;
        const deltaV = requiredDeflection / timeToImpact;
        
        // Calculate success probability
        let successProb = this.calculateSuccessProbability(strategy, deltaV);
        
        // Calculate mission duration
        const missionDuration = Math.max(
            this.warningYears * 0.3,
            strategy.minWarning * 0.5
        );
        
        // Calculate cost
        const missionCost = strategy.baseCost + (missionDuration * strategy.costPerYear);
        
        // Determine feasibility
        const feasibility = this.calculateFeasibility(strategy, successProb, this.warningYears);
        
        // Display results
        this.displayDeflectionResults({
            successProb,
            deltaV,
            missionDuration,
            missionCost,
            techStatus: strategy.techReadiness,
            feasibility,
            strategy
        });
    }
    
    calculateSuccessProbability(strategy, deltaV) {
        // Base probability on warning time vs optimal time
        let timeRatio = this.warningYears / strategy.optimalWarning;
        timeRatio = Math.min(timeRatio, 1);
        
        // Factor in if we have minimum time
        if (this.warningYears < strategy.minWarning) {
            timeRatio *= 0.3;
        }
        
        // Factor in asteroid size
        const { diameter } = this.asteroidParams;
        let sizeRatio = 1;
        if (diameter > 500) sizeRatio = 0.6;
        else if (diameter > 300) sizeRatio = 0.75;
        else if (diameter > 100) sizeRatio = 0.9;
        
        // Calculate final probability
        let probability = timeRatio * sizeRatio * 100;
        
        // Strategy-specific adjustments
        if (this.selectedStrategy === 'kinetic' && this.warningYears >= 3) {
            probability *= 1.1;
        }
        if (this.selectedStrategy === 'gravity' && this.warningYears < 10) {
            probability *= 0.7;
        }
        
        return Math.min(Math.max(probability, 5), 95);
    }
    
    calculateFeasibility(strategy, successProb, warningYears) {
        let score = 0;
        
        // Success probability weight (40%)
        score += (successProb / 100) * 40;
        
        // Time availability weight (30%)
        const timeScore = Math.min(warningYears / strategy.optimalWarning, 1) * 30;
        score += timeScore;
        
        // Technology readiness weight (30%)
        const techScores = {
            'Proven (DART mission)': 30,
            'Theoretical': 20,
            'Experimental': 15,
            'Conceptual': 10
        };
        score += techScores[strategy.techReadiness] || 15;
        
        return score;
    }
    
    displayDeflectionResults(results) {
        const placeholder = document.getElementById('deflection-placeholder');
        const output = document.getElementById('deflection-output');
        
        placeholder.style.display = 'none';
        output.classList.remove('hidden');
        
        // Update values
        const successProbElem = document.getElementById('success-prob');
        successProbElem.textContent = results.successProb.toFixed(1) + '%';
        successProbElem.className = 'value ' + 
            (results.successProb > 70 ? 'high-prob' : 
             results.successProb > 40 ? 'medium-prob' : 'low-prob');
        
        document.getElementById('delta-v').textContent = results.deltaV.toFixed(4) + ' m/s';
        document.getElementById('mission-duration').textContent = results.missionDuration.toFixed(1) + ' years';
        document.getElementById('mission-cost').textContent = '$' + results.missionCost.toFixed(1) + 'B';
        document.getElementById('tech-status').textContent = results.techStatus;
        
        // Update feasibility bar with color coding
        const feasibilityFill = document.getElementById('feasibility-fill');
        const feasibilityLabel = document.getElementById('feasibility-label');
        
        // Remove existing color classes
        feasibilityFill.classList.remove('high', 'medium', 'low');
        feasibilityLabel.classList.remove('high', 'medium', 'low');
        
        // Set width
        feasibilityFill.style.width = results.feasibility + '%';
        
        // Determine feasibility level and apply color class
        let feasibilityText = '';
        let feasibilityClass = '';
        if (results.feasibility > 70) {
            feasibilityText = 'HIGHLY FEASIBLE';
            feasibilityClass = 'high';
        } else if (results.feasibility > 40) {
            feasibilityText = 'MODERATELY FEASIBLE';
            feasibilityClass = 'medium';
        } else {
            feasibilityText = 'LOW FEASIBILITY';
            feasibilityClass = 'low';
        }
        
        // Apply the color class to BOTH the fill bar and label
        feasibilityFill.classList.add(feasibilityClass);
        feasibilityLabel.classList.add(feasibilityClass);
        
        // Update text
        feasibilityLabel.textContent = feasibilityText;
        
        // Update timeline colors to match
        this.updateTimeline();
        
        // Update mission notes
        this.updateMissionNotes(results);
    }
    
    updateMissionNotes(results) {
        const notes = document.getElementById('mission-notes');
        let noteText = '';
        
        if (results.successProb > 70) {
            noteText = `✓ Mission has high success probability with ${this.warningYears} years warning time. ${results.strategy.name} is well-suited for this scenario.`;
        } else if (results.successProb > 40) {
            noteText = `⚠ Mission has moderate success probability. Consider earlier detection or alternative strategies to improve odds.`;
        } else {
            noteText = `✗ Mission has low success probability with current parameters. Requires more warning time or different approach. Consider combining multiple deflection methods.`;
        }
        
        if (this.warningYears < results.strategy.minWarning) {
            noteText += ` WARNING: Below minimum recommended warning time of ${results.strategy.minWarning} years.`;
        }
        
        if (this.asteroidParams.diameter > 500) {
            noteText += ' Large asteroid requires significant resources and potentially multiple missions.';
        }
        
        notes.textContent = noteText;
    }
}

// Initialize when DOM is ready
let deflectionCalc;
document.addEventListener('DOMContentLoaded', () => {
    deflectionCalc = new DeflectionCalculator();
});