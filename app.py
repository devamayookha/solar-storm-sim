from flask import Flask, render_template, request, jsonify
import random
import os

app = Flask(__name__)

# === Simulation Data & Logic (unchanged) ===
SYSTEMS = {
    "GPS": {
        "name": "GPS Navigation",
        "icon": "📡",
        "desc": "Highly sensitive to ionospheric disturbances caused by solar storms."
    },
    "SatCom": {
        "name": "Satellite Communication",
        "icon": "📡",
        "desc": "Radio blackouts and signal interference are common during peak storm activity."
    },
    "EarthObs": {
        "name": "Earth Observation",
        "icon": "🛰️",
        "desc": "Imaging sensors and radar systems suffer from atmospheric noise and delayed recovery."
    }
}

PHASES = ["Onset", "Peak", "Decay", "Recovery"]

PRECAUTIONS = {
    "low": ["Monitor systems regularly", "Keep backup channels ready"],
    "medium": ["Switch to redundant systems", "Reduce transmission rates", "Prepare for signal loss"],
    "high": ["Activate emergency protocols", "Shut down non-critical systems", 
             "Use ground-based backups", "Delay sensitive operations"]
}

def get_system_severity(sys, flare_class, progress):
    base = {"B": 25, "C": 45, "M": 70, "X": 90}
    base_sev = base.get(flare_class, 50)
    
    if sys == "GPS":
        return min(100, int(base_sev * (progress / 45)) + random.randint(-8, 8))
    elif sys == "SatCom":
        if progress < 50:
            return min(100, int(base_sev * (progress / 55)))
        else:
            return min(100, int(base_sev * (1 - (progress - 50)/70)) + random.randint(-10, 10))
    else:  
        return min(100, int(base_sev * (progress / 65)) + random.randint(-5, 12))

def get_status(severity):
    if severity < 30: return "Minimal Impact", "green"
    elif severity < 60: return "Moderate Degradation", "yellow"
    elif severity < 85: return "Severe Disruption", "red"
    else: return "Critical / Blackout", "red"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/simulate', methods=['POST'])
def simulate():
    try:
        data = request.get_json()
        
        # Basic error handling
        flare_class = data.get('flare_class', 'M')
        duration = int(data.get('duration', 12))
        
        if flare_class not in ['B', 'C', 'M', 'X']:
            flare_class = 'M'
        if duration < 1:
            duration = 1
        if duration > 72:
            duration = 72

        steps = 12
        timeline = []
        
        for i in range(steps + 1):
            progress = int((i / steps) * 100)
            hour = int((i / steps) * duration)
            phase_idx = min(3, int(progress / 25))
            phase = PHASES[phase_idx]
            
            system_status = {}
            for sys_key in SYSTEMS:
                severity = get_system_severity(sys_key, flare_class, progress)
                status_text, color = get_status(severity)
                system_status[sys_key] = {
                    "severity": severity,
                    "color": color,
                    "status": status_text,
                    "percent": f"{severity}%"
                }
            
            timeline.append({
                "time": f"+{hour}h",
                "progress": progress,
                "phase": phase,
                "systems": system_status
            })
        
        recovery_hours = {"B": 4, "C": 9, "M": 22, "X": 42}.get(flare_class, 15) + random.randint(0, 8)
        max_sev = max([max(s["severity"] for s in t["systems"].values()) for t in timeline])
        precaution_level = "high" if max_sev > 75 else "medium" if max_sev > 45 else "low"
        
        return jsonify({
            "timeline": timeline,
            "recovery_hours": recovery_hours,
            "precaution_level": precaution_level,
            "precautions": PRECAUTIONS[precaution_level],
            "flare_class": flare_class,
            "duration": duration,
            "systems_info": SYSTEMS
        })
        
    except Exception as e:
        return jsonify({"error": "Invalid input. Please try again."}), 400

if __name__ == '__main__':
    # For local development
    app.run(debug=True)
else:
    # For Render deployment
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)