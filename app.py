from flask import Flask, render_template, request, jsonify, session, redirect, url_for
import json
import random
from datetime import datetime

app = Flask(__name__)
app.secret_key = 'mediverse_secret_key_2025'

users_db = {}
appointments_db = {}

# Sample medicine data for demonstration
def initialize_sample_medicine_data():
    sample_medicines = [
        {
            'name': 'Amoxicillin 500mg',
            'dosage': '1 tablet',
            'frequency': 'Three times daily',
            'duration': '7 days',
            'prescribed_for': 'Bacterial Infection',
            'prescribed_date': '2024-01-10',
            'status': 'completed',
            'instructions': 'Take after meals',
            'side_effects': 'None reported'
        },
        {
            'name': 'Paracetamol 500mg',
            'dosage': '1 tablet',
            'frequency': 'As needed for pain',
            'duration': '5 days',
            'prescribed_for': 'Fever and Body Pain',
            'prescribed_date': '2024-01-15',
            'status': 'completed',
            'instructions': 'Take with plenty of water',
            'side_effects': 'None reported'
        },
        {
            'name': 'Vitamin C 1000mg',
            'dosage': '1 tablet',
            'frequency': 'Once daily',
            'duration': '30 days',
            'prescribed_for': 'Immune Support',
            'prescribed_date': '2024-01-20',
            'status': 'ongoing',
            'instructions': 'Take in the morning',
            'side_effects': None
        },
        {
            'name': 'Metformin 500mg',
            'dosage': '1 tablet',
            'frequency': 'Twice daily',
            'duration': 'Ongoing',
            'prescribed_for': 'Diabetes Management',
            'prescribed_date': '2024-01-05',
            'status': 'ongoing',
            'instructions': 'Take with breakfast and dinner',
            'side_effects': 'Mild stomach discomfort'
        }
    ]
    
    # Add medicine history to existing users
    for username, user_data in users_db.items():
        if 'medicine_history' not in user_data:
            user_data['medicine_history'] = sample_medicines.copy()

disease_symptoms = {
    'Common Cold': ['cough', 'sneezing', 'runny nose', 'sore throat', 'fatigue'],
    'Flu': ['fever', 'body aches', 'fatigue', 'cough', 'headache'],
    'Allergies': ['sneezing', 'itchy eyes', 'runny nose', 'rash'],
    'Migraine': ['headache', 'nausea', 'sensitivity to light', 'dizziness'],
    'Food Poisoning': ['nausea', 'vomiting', 'diarrhea', 'stomach pain', 'fever'],
    'COVID-19': ['fever', 'cough', 'loss of taste', 'shortness of breath', 'fatigue'],
    'Diabetes': ['frequent urination', 'increased thirst', 'fatigue', 'blurred vision'],
    'Hypertension': ['headache', 'dizziness', 'chest pain', 'vision problems']
}

disease_treatments = {
    'Common Cold': {
        'first_aid': 'Rest, drink warm fluids, use over-the-counter cold medicine',
        'medication': 'Antihistamines, decongestants, pain relievers',
        'diet': 'Warm soup, herbal tea, vitamin C rich foods',
        'exercise': 'Light walking, avoid strenuous activity'
    },
    'Flu': {
        'first_aid': 'Rest, stay hydrated, use fever reducers like paracetamol',
        'medication': 'Antiviral drugs (oseltamivir), pain relievers',
        'diet': 'Broth, electrolyte drinks, easily digestible foods',
        'exercise': 'Complete rest until fever subsides'
    },
    'COVID-19': {
        'first_aid': 'Isolate, rest, monitor oxygen levels, stay hydrated',
        'medication': 'Consult doctor for antivirals, fever reducers',
        'diet': 'Nutrient-rich foods, plenty of fluids, zinc supplements',
        'exercise': 'Complete rest during infection period'
    },
    'Diabetes': {
        'first_aid': 'Monitor blood sugar levels, stay hydrated',
        'medication': 'Metformin, Insulin as prescribed',
        'diet': 'Low sugar, high fiber, balanced carbohydrates',
        'exercise': 'Regular walking, light aerobic exercises'
    },
    'Hypertension': {
        'first_aid': 'Rest in sitting position, monitor blood pressure',
        'medication': 'ACE inhibitors, beta blockers as prescribed',
        'diet': 'Low sodium, DASH diet, potassium-rich foods',
        'exercise': 'Regular cardio, stress-reduction activities'
    },
    'Migraine': {
        'first_aid': 'Rest in dark room, cold compress on forehead',
        'medication': 'Pain relievers, triptans, anti-nausea drugs',
        'diet': 'Avoid trigger foods, stay hydrated, regular meals',
        'exercise': 'Gentle stretching, avoid strenuous activity during attack'
    },
    'Allergies': {
        'first_aid': 'Avoid allergens, use saline nasal spray',
        'medication': 'Antihistamines, decongestants, nasal corticosteroids',
        'diet': 'Anti-inflammatory foods, local honey, omega-3 rich foods',
        'exercise': 'Indoor exercises during high pollen seasons'
    },
    'Food Poisoning': {
        'first_aid': 'Stay hydrated, rest, avoid solid foods initially',
        'medication': 'Anti-diarrheal, anti-nausea medications',
        'diet': 'BRAT diet (bananas, rice, applesauce, toast), clear fluids',
        'exercise': 'Complete rest until symptoms subside'
    }
}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/user_login', methods=['GET', 'POST'])
def user_login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        
        if username in users_db and users_db[username]['password'] == password:
            session['user_id'] = username
            return redirect(url_for('user_dashboard'))
        else:
            users_db[username] = {
                'password': password,
                'name': username,
                'medical_history': []
            }
            session['user_id'] = username
            return redirect(url_for('user_dashboard'))
    
    return render_template('user_login.html')

@app.route('/hospital_login', methods=['GET', 'POST'])
def hospital_login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        
        if username == 'hospital' and password == 'hospital123':
            session['hospital_id'] = username
            return redirect(url_for('hospital_dashboard'))
        else:
            return render_template('hospital_login.html', error='Invalid credentials')
    
    return render_template('hospital_login.html')

@app.route('/user_dashboard')
def user_dashboard():
    if 'user_id' not in session:
        return redirect(url_for('user_login'))
    
    user_data = users_db.get(session['user_id'], {'name': session['user_id'], 'medical_history': []})
    
    # Ensure medicine history exists
    if 'medicine_history' not in user_data:
        user_data['medicine_history'] = []
    
    # Pass today's date for the appointment form
    today = datetime.now().strftime("%Y-%m-%d")
    
    return render_template('user_dashboard.html', user=user_data, today=today)

@app.route('/symptom_checker', methods=['GET', 'POST'])
def symptom_checker():
    if 'user_id' not in session:
        return redirect(url_for('user_login'))
    
    if request.method == 'POST':
        symptoms = request.form.getlist('symptoms')
        
        possible_conditions = []
        for disease, disease_syms in disease_symptoms.items():
            match_count = len(set(symptoms) & set(disease_syms))
            if match_count > 0:
                probability = min(100, (match_count / len(disease_syms)) * 100)
                possible_conditions.append({
                    'disease': disease,
                    'probability': round(probability),
                    'treatment': disease_treatments.get(disease, {})
                })
        
        possible_conditions.sort(key=lambda x: x['probability'], reverse=True)
        
        # Update user's medical history
        if session['user_id'] in users_db:
            users_db[session['user_id']]['medical_history'].append({
                'date': datetime.now().strftime("%Y-%m-%d %H:%M"),
                'symptoms': symptoms,
                'possible_conditions': possible_conditions
            })
        
        return render_template('symptom_checker.html', 
                             symptoms_list=list_disease_symptoms(),
                             results=possible_conditions,
                             submitted=True)
    
    return render_template('symptom_checker.html', 
                         symptoms_list=list_disease_symptoms(),
                         results=None,
                         submitted=False)

@app.route('/book_appointment', methods=['POST'])
def book_appointment():
    if 'user_id' not in session:
        return jsonify({'success': False, 'message': 'Not logged in'})
    
    try:
        data = request.get_json()
        
        print("Received appointment data:", data)
        
        # Validate required fields
        required_fields = ['doctor_name', 'date', 'time_slot']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'success': False, 'message': f'Missing required field: {field}'})
        
        appointment_id = len(appointments_db) + 1
        appointments_db[appointment_id] = {
            'user_id': session['user_id'],
            'doctor_id': data.get('doctor_id', 'N/A'),
            'doctor_name': data.get('doctor_name'),
            'doctor_specialty': data.get('doctor_specialty', 'General Physician'),
            'date': data.get('date'),
            'time_slot': data.get('time_slot'),
            'location': data.get('doctor_location', 'Unknown Location'),
            'fee': data.get('fee', 0),
            'status': 'Confirmed',
            'booked_at': datetime.now().strftime("%Y-%m-%d %H:%M")
        }
        
        response_data = {
            'success': True, 
            'message': f'Appointment confirmed with {data.get("doctor_name")} on {data.get("date")} at {data.get("time_slot")}',
            'appointment_id': appointment_id
        }
        
        print("Appointment booked successfully:", response_data)
        return jsonify(response_data)
    
    except Exception as e:
        print("Error in book_appointment:", str(e))
        return jsonify({'success': False, 'message': f'Error: {str(e)}'})

@app.route('/hospital_dashboard')
def hospital_dashboard():
    if 'hospital_id' not in session:
        return redirect(url_for('hospital_login'))
    
    # Initialize medicine data for all patients
    for user_data in users_db.values():
        if 'medicine_history' not in user_data:
            user_data['medicine_history'] = []
    
    patients = list(users_db.values())
    appointments = list(appointments_db.values())
    
    return render_template('hospital_dashboard.html', 
                         patients=patients, 
                         appointments=appointments)

@app.route('/add_prescription', methods=['POST'])
def add_prescription():
    if 'hospital_id' not in session:
        return jsonify({'success': False, 'message': 'Hospital login required'})
    
    try:
        data = request.json
        patient_name = data.get('patient_name')
        medicine_data = {
            'name': data.get('medicine_name'),
            'dosage': data.get('dosage'),
            'frequency': data.get('frequency'),
            'duration': data.get('duration'),
            'prescribed_for': data.get('prescribed_for'),
            'prescribed_date': datetime.now().strftime("%Y-%m-%d"),
            'status': 'ongoing',
            'instructions': data.get('instructions', ''),
            'side_effects': None
        }
        
        # Find patient and add prescription
        for username, user_data in users_db.items():
            if user_data['name'] == patient_name:
                if 'medicine_history' not in user_data:
                    user_data['medicine_history'] = []
                user_data['medicine_history'].append(medicine_data)
                return jsonify({'success': True, 'message': 'Prescription added successfully'})
        
        return jsonify({'success': False, 'message': 'Patient not found'})
    
    except Exception as e:
        return jsonify({'success': False, 'message': f'Error: {str(e)}'})

@app.route('/update_medicine_status', methods=['POST'])
def update_medicine_status():
    if 'hospital_id' not in session:
        return jsonify({'success': False, 'message': 'Hospital login required'})
    
    try:
        data = request.json
        patient_name = data.get('patient_name')
        medicine_name = data.get('medicine_name')
        new_status = data.get('status')
        
        # Find patient and update medicine status
        for username, user_data in users_db.items():
            if user_data['name'] == patient_name and 'medicine_history' in user_data:
                for medicine in user_data['medicine_history']:
                    if medicine['name'] == medicine_name:
                        medicine['status'] = new_status
                        return jsonify({'success': True, 'message': 'Medicine status updated'})
        
        return jsonify({'success': False, 'message': 'Medicine not found'})
    
    except Exception as e:
        return jsonify({'success': False, 'message': f'Error: {str(e)}'})

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('index'))

def list_disease_symptoms():
    all_symptoms = set()
    for symptoms in disease_symptoms.values():
        all_symptoms.update(symptoms)
    return sorted(list(all_symptoms))

# Initialize sample data when the app starts
def initialize_app():
    # Add some sample users with medical history
    sample_users = {
        'john': {
            'password': 'password123',
            'name': 'John Doe',
            'medical_history': [
                {
                    'date': '2024-01-15 10:30',
                    'symptoms': ['fever', 'cough', 'fatigue'],
                    'possible_conditions': [
                        {'disease': 'Flu', 'probability': 80, 'treatment': disease_treatments['Flu']},
                        {'disease': 'COVID-19', 'probability': 60, 'treatment': disease_treatments['COVID-19']}
                    ]
                }
            ]
        },
        'mary': {
            'password': 'password123', 
            'name': 'Mary Smith',
            'medical_history': [
                {
                    'date': '2024-01-20 14:15',
                    'symptoms': ['headache', 'dizziness', 'chest pain'],
                    'possible_conditions': [
                        {'disease': 'Hypertension', 'probability': 75, 'treatment': disease_treatments['Hypertension']},
                        {'disease': 'Migraine', 'probability': 50, 'treatment': disease_treatments['Migraine']}
                    ]
                }
            ]
        }
    }
    
    # Merge sample users with existing users_db
    for username, user_data in sample_users.items():
        if username not in users_db:
            users_db[username] = user_data
    
    # Initialize medicine data
    initialize_sample_medicine_data()

if __name__ == '__main__':
    # Initialize sample data
    initialize_app()
    
    print("🚀 Starting MediVerse Prototype...")
    print("🌐 Access the application at: http://127.0.0.1:5000")
    print("👤 User Login: Any username/password")
    print("   Sample users: john/password123, mary/password123")
    print("🏥 Hospital Login: hospital/hospital123")
    print("----------------------------------------")
    print("💊 New Features: Medicine History Tracking")
    print("   - Complete prescription records")
    print("   - Medicine status management") 
    print("   - Side effects monitoring")
    print("----------------------------------------")
    app.run(debug=True, host='127.0.0.1', port=5000)