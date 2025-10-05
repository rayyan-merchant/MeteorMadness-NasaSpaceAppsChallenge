# MeteorMadness-NasaSpaceAppsChallenge
# 🌍 Meteor Madness: Asteroid Impact Simulator

![Project Banner](https://img.shields.io/badge/NASA-Space%20Apps%20Challenge-blue)
![Status](https://img.shields.io/badge/status-active-success)

An interactive web-based asteroid impact simulator that combines **real NASA data** with **physics-based calculations** to model impact scenarios and evaluate planetary defense strategies.

---

## 🚀 Demo & Repository

* **Live Demo:** [Meteor Madness](https://rayyan-merchant.github.io/MeteorMadness-NasaSpaceAppsChallenge/)
* **GitHub Repo:** [Source Code](https://github.com/rayyan-merchant/MeteorMadness-NasaSpaceAppsChallenge/tree/main)
* **NASA NeoWs API:** [api.nasa.gov](https://api.nasa.gov)

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

## ✨ Features

* **NASA Data Integration**: Fetch real near-Earth object (NEO) data from NASA NeoWs.
* **3D Visualization**: Interactive globe (Three.js) with impact markers.
* **Physics-Based Calculations**: Energy, crater size, seismic magnitude, blast radius, tsunami risk.
* **Terrain & Population Effects**: Casualties, atmospheric changes, historical comparisons.
* **Deflection Planning**: Kinetic Impactor, Gravity Tractor, Nuclear, Laser — with feasibility, cost, and success probability.
* **User-Friendly Interface**: Clean space-themed design, sliders, tooltips, and mobile-friendly layout.

---

### Guided Workflow
```
1. Fetch NASA Data → View real asteroids
2. Select Asteroid → Auto-fills parameters
3. Adjust Location → Drag Earth or use sliders
4. Calculate Impact → See comprehensive results
5. Plan Defense → Evaluate deflection strategies
```
---

## 🛠️ Tech Stack

* **Frontend**: HTML5, CSS3 (glassmorphism), JavaScript (ES6+)
* **3D Graphics**: [Three.js](https://threejs.org/)
* **API**: [NASA NeoWs API](https://api.nasa.gov)
* **License**: MIT


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

---
## ⚡ Quick Start

1. Clone the repository:

   ```bash
   git clone https://github.com/rayyan-merchant/MeteorMadness-NasaSpaceAppsChallenge.git
   ```
2. Add your NASA API key to `config.js`:

   ```js
   const CONFIG = {
     NASA_API_KEY: "your_api_key_here",
   };
   ```
3. Open `index.html` in a modern browser — or use the [Live Demo](https://rayyan-merchant.github.io/MeteorMadness-NasaSpaceAppsChallenge/).

---

## 👥 Team

### Team Members
- **Rayyan Merchant** - Team Owner [(myGitHub)](https://github.com/rayyan-merchant)
- **Rija Ali** [(@rija)https://github.com/Srijaali]
- **Syed Ukkashah Ahmed Shah** [(@ukkashah)https://github.com/syedukkashah]
- **Ibrahim Johar Farooqi** [(@ibrahimjohar)](https://github.com/ibrahimjohar)
- **Riya Bhart** [(@riyabhart)](https://github.com/RiyaBhart)


**Challenge**: Meteor Madness
**Location**: Karachi, Pakistan  
**Event**: NASA Space Apps Challenge 2025  



---

### 👥 Project Contributors  

<div align="center">
  <a href="https://www.linkedin.com/in/rayyanmerchant2004/" target="_blank">
    <img src="https://img.shields.io/badge/Rayyan%20Merchant-%230077B5.svg?style=for-the-badge&logo=linkedin&logoColor=white" alt="Rayyan Merchant"/>
  </a>
  <a href="https://www.linkedin.com/in/syed-ukkashah-28b334214/" target="_blank">
    <img src="https://img.shields.io/badge/Syed%20Ukkashah%20Ahmed-%230077B5.svg?style=for-the-badge&logo=linkedin&logoColor=white" alt="Syed Ukkashah Ahmed"/>
  </a>
  <a href="https://www.linkedin.com/in/rija-ali-731095296" target="_blank">
    <img src="https://img.shields.io/badge/Syeda%20Rija%20Ali-%230077B5.svg?style=for-the-badge&logo=linkedin&logoColor=white" alt="Syeda Rija Ali"/>
  </a>
  <a href="https://www.linkedin.com/in/riya-bhart-339036287/" target="_blank">
    <img src="https://img.shields.io/badge/Riya%20Bhart-%230077B5.svg?style=for-the-badge&logo=linkedin&logoColor=white" alt="Riya Bhart"/>
  </a>
  <a href="https://www.linkedin.com/in/ibrahimjohar/" target="_blank">
    <img src="https://img.shields.io/badge/Ibrahim%20Johar-%230077B5.svg?style=for-the-badge&logo=linkedin&logoColor=white" alt="Ibrahim Johar"/>
  </a>
</div>


---

**Built with 🚀 for NASA Space Apps Challenge 2025**

*Making asteroid impact science accessible to everyone.*
