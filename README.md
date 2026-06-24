# Solar Storm Impact Simulator
An interactive web app that simulates how solar storms affect satellite systems over time.
A clean, educational project built to demonstrate real-world space weather impacts on critical satellite infrastructure.

## 🎯 Problem It Solves
Solar storms can disrupt GPS, satellite communication, and Earth observation systems. This simulator helps visualize:

* How impacts unfold over time (not just a single snapshot)
* Different vulnerability levels across systems
* Recovery timelines and practical precautions

Perfect for understanding space weather effects in an engaging way.

## ✨ Features

* Realistic per-system impact simulation (GPS, SatCom, Earth Observation)
* Animated timeline with storm phases (Onset → Peak → Decay → Recovery)
* Live color-coded status indicators (Green = Minimal, Yellow = Moderate, Red = Severe)
* Educational explanations for each system
* Recovery time estimation + recommended precautions
* Download simulation report as text file
* Clean, modern, professional UI

## 🛠️ Tech Stack

* Backend: Python + Flask
* Frontend: HTML5, CSS3, Vanilla JavaScript
* Fully local (no databases, no external APIs, no internet required)

## 🚀 How to Run Locally

1. Clone or download the project folder
2. Open the project folder in your terminal / command prompt
3. Install Flask:

```
pip install flask
```

4. Run the application:

```bash
python app.py
```

5. Open your browser and go to: http://127.0.0.1:5000

## 📸 What It Looks Like

* Modern dark space-themed design
* Simple input form with flare class (B/C/M/X) and duration slider
* Live animated timeline showing storm progression
* Three system cards that dynamically change color and status
* Final results section with insights and two action buttons

## 🛠️ Possible Future Improvements (Version 2)

* Add visual charts for impact curves
* More satellite systems
* Adjustable simulation parameters
* Side-by-side simulation comparison
* Light/Dark mode toggle

## 📌 Learning Outcomes

* Full-stack web development using Flask
* Building interactive simulations with rule-based modeling
* Dynamic UI updates using vanilla JavaScript
* Clean code structure and user-friendly interface design
* Basic error handling