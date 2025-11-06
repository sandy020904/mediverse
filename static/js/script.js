// Enhanced Appointment Booking System
let userLocation = null;
let availableDoctors = [];
let selectedDoctor = null;

// Show appointment booking form
function showAppointmentForm() {
    const form = document.getElementById('appointment-form');
    if (form.style.display === 'none' || form.style.display === '') {
        form.style.display = 'block';
        resetAppointmentForm();
    } else {
        form.style.display = 'none';
    }
}

// Reset appointment form
function resetAppointmentForm() {
    userLocation = null;
    selectedDoctor = null;
    document.getElementById('doctor-selection').style.display = 'none';
    document.getElementById('selected-doctor-info').style.display = 'none';
    document.getElementById('doctors-list').innerHTML = '';
}

// Get user location
function getUserLocation() {
    const locationBtn = document.querySelector('.location-btn');
    locationBtn.innerHTML = '<div class="spinner"></div>Finding location...';
    locationBtn.disabled = true;

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                showDoctorSelection();
                loadNearbyDoctors();
            },
            (error) => {
                console.error('Error getting location:', error);
                userLocation = { lat: 17.3850, lng: 78.4867 };
                showDoctorSelection();
                loadNearbyDoctors();
                locationBtn.innerHTML = 'Using Demo Location - Click to Retry';
                locationBtn.disabled = false;
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000
            }
        );
    } else {
        alert('Geolocation is not supported by this browser. Using demo location.');
        userLocation = { lat: 17.3850, lng: 78.4867 };
        showDoctorSelection();
        loadNearbyDoctors();
    }
}

// Show doctor selection interface
function showDoctorSelection() {
    document.querySelector('.location-permission').style.display = 'none';
    document.getElementById('doctor-selection').style.display = 'block';
}

// Load nearby doctors
function loadNearbyDoctors() {
    const doctorsList = document.getElementById('doctors-list');
    doctorsList.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p>Finding best doctors near you...</p>
        </div>
    `;

    setTimeout(() => {
        try {
            availableDoctors = generateSampleDoctors();
            displayDoctors(availableDoctors);
        } catch (error) {
            console.error('Error loading doctors:', error);
            doctorsList.innerHTML = `
                <div class="no-doctors">
                    <div style="font-size: 48px; margin-bottom: 10px;">❌</div>
                    <h3>Error Loading Doctors</h3>
                    <p>Please try again</p>
                    <button onclick="loadNearbyDoctors()" class="btn" style="margin-top: 10px;">
                        Retry
                    </button>
                </div>
            `;
        }
    }, 1500);
}

// Generate sample doctors
function generateSampleDoctors() {
    const specialties = ['General Physician', 'Cardiologist', 'Dermatologist', 'Pediatrician', 'Neurologist', 'Orthopedic'];
    const locations = [
        { lat: 17.3850, lng: 78.4989, area: 'Hitech City' },
        { lat: 17.4401, lng: 78.3490, area: 'Gachibowli' },
        { lat: 17.3606, lng: 78.4739, area: 'Madhapur' },
        { lat: 17.4254, lng: 78.5075, area: 'Kondapur' }
    ];
    const hospitals = ['Apollo Hospital', 'Max Healthcare', 'Fortis Hospital', 'Yashoda Hospitals'];
    
    const doctors = [];
    
    specialties.forEach((specialty, index) => {
        for (let i = 1; i <= 3; i++) {
            const location = locations[Math.floor(Math.random() * locations.length)];
            const distance = userLocation ? calculateDistance(userLocation.lat, userLocation.lng, location.lat, location.lng) : '5.0';
            const rating = (3.5 + Math.random() * 1.5).toFixed(1);
            
            doctors.push({
                id: `doc_${specialty.replace(' ', '_').toLowerCase()}_${i}`,
                name: `Dr. ${['Raj', 'Priya', 'Kumar', 'Anjali'][index % 4]} ${['Sharma', 'Patel', 'Reddy', 'Kumar'][i - 1]}`,
                specialty: specialty,
                hospital: hospitals[Math.floor(Math.random() * hospitals.length)],
                rating: parseFloat(rating),
                reviews: Math.floor(Math.random() * 300) + 50,
                experience: Math.floor(Math.random() * 25) + 5,
                fee: Math.floor(Math.random() * 1500) + 500,
                distance: distance,
                location: `${location.area}`,
                availableToday: Math.random() > 0.4,
                timeSlots: generateTimeSlots(true)
            });
        }
    });
    
    return doctors.sort((a, b) => b.rating - a.rating);
}

// Calculate distance
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return (R * c).toFixed(1);
}

// Generate time slots
function generateTimeSlots(availableToday) {
    const slots = [];
    const baseTime = availableToday ? new Date().getHours() + 2 : 9;
    
    for (let i = 0; i < 4; i++) {
        const hour = (baseTime + i) % 24;
        if (hour >= 9 && hour <= 20) {
            slots.push({
                time: `${hour.toString().padStart(2, '0')}:00`,
                available: Math.random() > 0.2
            });
        }
    }
    return slots.length > 0 ? slots : [{ time: '10:00', available: true }];
}

// Display doctors in table
function displayDoctors(doctors) {
    const doctorsList = document.getElementById('doctors-list');
    
    if (doctors.length === 0) {
        doctorsList.innerHTML = '<div class="no-doctors">No doctors found in your area.</div>';
        return;
    }
    
    doctorsList.innerHTML = `
        <div class="doctors-table-container">
            <table class="doctors-table">
                <thead>
                    <tr>
                        <th><div class="table-header"><span>👨‍⚕️ Doctor</span></div></th>
                        <th><div class="table-header"><span>⭐ Rating</span></div></th>
                        <th><div class="table-header"><span>📍 Distance</span></div></th>
                        <th><div class="table-header"><span>💰 Fee</span></div></th>
                        <th><div class="table-header"><span>📅 Availability</span></div></th>
                        <th><div class="table-header"><span>Action</span></div></th>
                    </tr>
                </thead>
                <tbody>
                    ${doctors.map(doctor => `
                        <tr id="doctor-row-${doctor.id}" class="${selectedDoctor?.id === doctor.id ? 'selected' : ''}">
                            <td>
                                <div class="doctor-main-info">
                                    <div class="doctor-name">${doctor.name}</div>
                                    <div class="doctor-specialty">${doctor.specialty}</div>
                                    <div class="doctor-hospital">${doctor.hospital}</div>
                                </div>
                            </td>
                            <td>
                                <div class="doctor-rating">
                                    <span class="rating-stars">${'★'.repeat(Math.floor(doctor.rating))}${doctor.rating % 1 >= 0.5 ? '½' : ''}</span>
                                    <span class="rating-value">${doctor.rating}/5</span>
                                </div>
                            </td>
                            <td>
                                <div class="doctor-details-compact">
                                    <div class="doctor-detail-item">
                                        <span>📍</span>
                                        <span><strong>${doctor.distance} km</strong></span>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div class="doctor-details-compact">
                                    <div class="doctor-detail-item">
                                        <span>💰</span>
                                        <span><strong>₹${doctor.fee}</strong></span>
                                    </div>
                                </div>
                            </td>
                            <td>
                                <div class="availability-badge ${doctor.availableToday ? 'availability-available' : 'availability-tomorrow'}">
                                    ${doctor.availableToday ? 'Available Today' : 'Available Tomorrow'}
                                </div>
                            </td>
                            <td>
                                <button class="select-doctor-btn ${selectedDoctor?.id === doctor.id ? 'selected' : ''}" 
                                        onclick="selectDoctor('${doctor.id}')"
                                        id="select-btn-${doctor.id}">
                                    ${selectedDoctor?.id === doctor.id ? 'Selected ✓' : 'Select Doctor'}
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;

    // Add click event to table rows
    doctors.forEach(doctor => {
        const row = document.getElementById(`doctor-row-${doctor.id}`);
        if (row) {
            row.addEventListener('click', function(e) {
                if (!e.target.closest('.select-doctor-btn')) {
                    selectDoctor(doctor.id);
                }
            });
        }
    });
}

// Select a doctor
function selectDoctor(doctorId) {
    selectedDoctor = availableDoctors.find(doc => doc.id === doctorId);
    
    if (!selectedDoctor) {
        console.error('Doctor not found:', doctorId);
        return;
    }
    
    // Update UI
    document.querySelectorAll('.doctors-table tbody tr').forEach(row => row.classList.remove('selected'));
    document.querySelectorAll('.select-doctor-btn').forEach(btn => {
        btn.textContent = 'Select Doctor';
        btn.classList.remove('selected');
    });
    
    const selectedRow = document.getElementById(`doctor-row-${doctorId}`);
    const selectedBtn = document.getElementById(`select-btn-${doctorId}`);
    if (selectedRow) selectedRow.classList.add('selected');
    if (selectedBtn) {
        selectedBtn.textContent = 'Selected ✓';
        selectedBtn.classList.add('selected');
    }
    
    // Show booking form
    document.getElementById('selected-doctor-info').style.display = 'block';
    document.getElementById('selected-doctor-name').textContent = selectedDoctor.name;
    document.getElementById('selected-doctor-specialty').textContent = selectedDoctor.specialty;
    document.getElementById('selected-doctor-rating').textContent = `${selectedDoctor.rating} ★`;
    document.getElementById('selected-doctor-distance').textContent = `${selectedDoctor.distance} km - ${selectedDoctor.location}`;
    document.getElementById('selected-doctor-id').value = selectedDoctor.id;
    
    // Populate time slots
    const timeSlotSelect = document.getElementById('time-slot');
    timeSlotSelect.innerHTML = '<option value="">Select Time Slot</option>';
    selectedDoctor.timeSlots.forEach(slot => {
        if (slot.available) {
            const option = document.createElement('option');
            option.value = slot.time;
            option.textContent = `${slot.time} - Available`;
            timeSlotSelect.appendChild(option);
        }
    });
    
    document.getElementById('selected-doctor-info').scrollIntoView({ behavior: 'smooth' });
}

// Filter and sort functions
function filterDoctors() {
    const specialty = document.getElementById('doctor-specialty').value;
    const filtered = specialty ? availableDoctors.filter(d => d.specialty === specialty) : availableDoctors;
    displayDoctors(filtered);
}

function sortDoctors() {
    const sortBy = document.getElementById('sort-by').value;
    const sorted = [...availableDoctors];
    
    switch(sortBy) {
        case 'rating': sorted.sort((a, b) => b.rating - a.rating); break;
        case 'distance': sorted.sort((a, b) => a.distance - b.distance); break;
        case 'availability': sorted.sort((a, b) => b.availableToday - a.availableToday); break;
    }
    displayDoctors(sorted);
}

// Appointment form submission
document.addEventListener('DOMContentLoaded', function() {
    const appointmentForm = document.getElementById('appointmentForm');
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (!selectedDoctor) {
                alert('Please select a doctor first.');
                return;
            }

            const formData = new FormData(this);
            const date = formData.get('date');
            const time_slot = formData.get('time_slot');
            
            if (!date || !time_slot) {
                alert('Please select both date and time slot.');
                return;
            }

            const appointmentData = {
                doctor_id: selectedDoctor.id,
                doctor_name: selectedDoctor.name,
                doctor_specialty: selectedDoctor.specialty,
                date: date,
                time_slot: time_slot,
                doctor_location: selectedDoctor.location,
                fee: selectedDoctor.fee
            };
            
            console.log('Sending appointment data:', appointmentData);
            
            // Show loading state
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.innerHTML = '<div class="spinner" style="width: 16px; height: 16px; border-width: 2px;"></div> Booking...';
            submitBtn.disabled = true;
            
            fetch('/book_appointment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(appointmentData)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Response data:', data);
                if (data.success) {
                    showAppointmentConfirmation(appointmentData);
                    this.reset();
                    resetAppointmentForm();
                } else {
                    alert('❌ ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('❌ Error booking appointment. Please check console for details.');
            })
            .finally(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            });
        });
    }
});

// Show appointment confirmation
function showAppointmentConfirmation(appointment) {
    const confirmationHTML = `
        <div style="text-align: center; padding: 20px;">
            <div style="font-size: 48px; margin-bottom: 10px;">✅</div>
            <h3 style="color: #27ae60; margin-bottom: 15px;">Appointment Booked Successfully!</h3>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; text-align: left; margin: 15px 0;">
                <p><strong>Doctor:</strong> ${appointment.doctor_name}</p>
                <p><strong>Specialty:</strong> ${appointment.doctor_specialty}</p>
                <p><strong>Date:</strong> ${appointment.date}</p>
                <p><strong>Time:</strong> ${appointment.time_slot}</p>
                <p><strong>Location:</strong> ${appointment.doctor_location}</p>
                <p><strong>Consultation Fee:</strong> ₹${appointment.fee}</p>
            </div>
            
            <p style="color: #666; font-size: 14px;">
                📞 You will receive a confirmation call shortly.<br>
                📍 Please arrive 15 minutes before your appointment.
            </p>
            
            <button onclick="closeCustomAlert()" style="padding: 10px 20px; background: #27ae60; color: white; border: none; border-radius: 5px; cursor: pointer; margin-top: 10px;">
                Close
            </button>
        </div>
    `;
    
    showCustomAlert(confirmationHTML);
}

// Utility functions
function showCustomAlert(content) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1001;
    `;
    
    modal.id = 'customAlertModal';
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        padding: 25px;
        border-radius: 15px;
        max-width: 500px;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    `;
    
    modalContent.innerHTML = content;
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
}

function closeCustomAlert() {
    const modal = document.getElementById('customAlertModal');
    if (modal) {
        modal.remove();
    }
}

// Emergency System Functions
function emergencyConnect() {
    const emergencyData = {
        patientName: getPatientName(),
        time: new Date().toLocaleString(),
        location: null,
        contacts: [
            { name: "Family Member", number: "+91 98765 43210", relation: "Primary Contact" },
            { name: "Emergency Contact", number: "+91 91234 56789", relation: "Secondary Contact" },
            { name: "Ambulance Service", number: "108", relation: "Emergency Services" },
            { name: "Nearby Hospital", number: "+91 80567 12345", relation: "Medical Facility" }
        ]
    };

    if (confirm('🚨 ACTIVATE EMERGENCY PROTOCOL?\n\nThis will alert emergency contacts and services with your location and medical information.')) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    emergencyData.location = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                        link: `https://maps.google.com/?q=${position.coords.latitude},${position.coords.longitude}`
                    };
                    showEmergencyDashboard(emergencyData);
                },
                () => {
                    emergencyData.location = {
                        lat: 17.3850,
                        lng: 78.4867,
                        link: "https://maps.google.com/?q=17.3850,78.4867"
                    };
                    showEmergencyDashboard(emergencyData);
                }
            );
        } else {
            emergencyData.location = {
                lat: 17.3850,
                lng: 78.4867,
                link: "https://maps.google.com/?q=17.3850,78.4867"
            };
            showEmergencyDashboard(emergencyData);
        }
    }
}

function getPatientName() {
    const header = document.querySelector('h1');
    return header ? header.textContent.replace('Welcome, ', '').replace(' 👋', '') : 'MediVerse User';
}

function showEmergencyDashboard(emergencyData) {
    const medicalInfo = {
        bloodGroup: "O+",
        allergies: "None",
        conditions: "Hypertension",
        medications: "Blood pressure medication",
        lastCheckup: "2024-01-15"
    };

    let content = `
        <div style="background: linear-gradient(135deg, #e74c3c, #c0392b); color: white; padding: 20px; border-radius: 10px 10px 0 0; text-align: center;">
            <h2 style="margin: 0;">🚨 EMERGENCY PROTOCOL ACTIVATED</h2>
            <p style="margin: 5px 0; font-size: 14px;">Help is on the way! Stay calm.</p>
        </div>
        
        <div style="padding: 20px;">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px;">
                <div style="background: #fff3cd; padding: 15px; border-radius: 8px; text-align: center;">
                    <div style="font-size: 24px;">📱</div>
                    <strong>Alerts Sent</strong>
                    <div style="font-size: 20px; font-weight: bold; color: #e74c3c;">4/4</div>
                </div>
                <div style="background: #d1ecf1; padding: 15px; border-radius: 8px; text-align: center;">
                    <div style="font-size: 24px;">🚑</div>
                    <strong>Ambulance ETA</strong>
                    <div style="font-size: 20px; font-weight: bold; color: #e74c3c;">8-12 mins</div>
                </div>
                <div style="background: #d4edda; padding: 15px; border-radius: 8px; text-align: center;">
                    <div style="font-size: 24px;">🏥</div>
                    <strong>Hospital Ready</strong>
                    <div style="font-size: 20px; font-weight: bold; color: #27ae60;">Yes</div>
                </div>
            </div>

            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <h4 style="margin-top: 0;">📞 Contact Notifications</h4>
                ${emergencyData.contacts.map(contact => `
                    <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px; background: white; margin: 8px 0; border-radius: 6px; border-left: 4px solid #27ae60;">
                        <div style="flex: 1;">
                            <strong>${contact.name}</strong><br>
                            <small style="color: #666;">${contact.number} • ${contact.relation}</small>
                        </div>
                        <div style="color: #27ae60; font-weight: bold;">✅ Notified</div>
                    </div>
                `).join('')}
            </div>

            <div style="background: #e8f5e8; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <h4 style="margin-top: 0;">📋 Medical Information Shared</h4>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                    <div><strong>Blood Group:</strong> ${medicalInfo.bloodGroup}</div>
                    <div><strong>Allergies:</strong> ${medicalInfo.allergies}</div>
                    <div><strong>Conditions:</strong> ${medicalInfo.conditions}</div>
                    <div><strong>Medications:</strong> ${medicalInfo.medications}</div>
                </div>
            </div>

            <div style="background: #d1ecf1; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                <h4 style="margin-top: 0;">📍 Your Location</h4>
                <p>Coordinates: ${emergencyData.location.lat.toFixed(4)}, ${emergencyData.location.lng.toFixed(4)}</p>
                <a href="${emergencyData.location.link}" target="_blank" style="color: #3498db; text-decoration: none;">
                    🔗 View on Google Maps
                </a>
            </div>

            <div style="text-align: center;">
                <button onclick="simulateIncomingCall()" style="padding: 12px 20px; background: #27ae60; color: white; border: none; border-radius: 5px; cursor: pointer; margin: 5px; font-size: 16px;">
                    📞 Simulate Incoming Call
                </button>
                <button onclick="updateAmbulanceETA()" style="padding: 12px 20px; background: #3498db; color: white; border: none; border-radius: 5px; cursor: pointer; margin: 5px; font-size: 16px;">
                    🚑 Update Ambulance ETA
                </button>
                <button onclick="closeEmergency()" style="padding: 12px 20px; background: #e74c3c; color: white; border: none; border-radius: 5px; cursor: pointer; margin: 5px; font-size: 16px;">
                    ❌ Cancel Emergency
                </button>
            </div>
        </div>
    `;

    alertWithHTML(content);
    
    setTimeout(simulateAmbulanceResponse, 2000);
    setTimeout(simulateHospitalResponse, 5000);
}

function simulateIncomingCall() {
    alert('📞 Incoming Call: Ambulance Service\n\n"Hello, this is ambulance control. We have received your emergency alert and are dispatching a team to your location. Please stay on the line and do not move."');
}

function updateAmbulanceETA() {
    const etas = ["5-8 minutes", "3-5 minutes", "Arriving now!"];
    const randomETA = etas[Math.floor(Math.random() * etas.length)];
    alert(`🚑 Ambulance ETA Updated: ${randomETA}\n\nEmergency team is approaching your location. Please wait for assistance.`);
}

function closeEmergency() {
    if (confirm('Are you sure you want to cancel the emergency alert?')) {
        alert('Emergency protocol cancelled. If you still need assistance, please click the emergency button again.');
        document.querySelectorAll('.patient-details-modal').forEach(modal => modal.remove());
    }
}

function simulateAmbulanceResponse() {
    showNotification('Ambulance Service', '🚑 Ambulance dispatched! Medical team is en route. ETA: 8 minutes.');
}

function simulateHospitalResponse() {
    showNotification('City Hospital', '🏥 Emergency department alerted. Medical team standing by with crash cart.');
}

// Feature Functions
function showFoodRecommendations() {
    const foodPlans = {
        'Diabetes': {
            'Recommended': ['Whole grains', 'Leafy greens', 'Berries', 'Nuts', 'Fish'],
            'Avoid': ['Sugary drinks', 'White bread', 'Processed snacks', 'Fried foods'],
            'Sample Meal': 'Breakfast: Oatmeal with berries | Lunch: Grilled chicken salad | Dinner: Baked salmon with quinoa'
        },
        'High Blood Pressure': {
            'Recommended': ['Bananas', 'Spinach', 'Yogurt', 'Beets', 'Oats'],
            'Avoid': ['Processed meats', 'Canned soups', 'Pickles', 'Fast food'],
            'Sample Meal': 'Breakfast: Greek yogurt with banana | Lunch: Vegetable soup | Dinner: Grilled fish with steamed vegetables'
        }
    };
    
    let content = `<h3>🍎 Personalized Food Recommendations</h3>`;
    
    Object.keys(foodPlans).forEach(condition => {
        content += `
            <div style="margin: 15px 0; padding: 15px; background: #e8f5e8; border-radius: 8px;">
                <h4>For ${condition}:</h4>
                <p><strong>✅ Recommended:</strong> ${foodPlans[condition].Recommended.join(', ')}</p>
                <p><strong>❌ Avoid:</strong> ${foodPlans[condition].Avoid.join(', ')}</p>
                <p><strong>🍽️ Sample Meal:</strong> ${foodPlans[condition]['Sample Meal']}</p>
            </div>
        `;
    });
    
    alertWithHTML(content);
}

function showInsuranceClaims() {
    alert(`🏥 Insurance Claims Management\n\nIn full implementation, this would show:\n- Claim submission forms\n- Status tracking\n- Document upload\n- Approval process`);
}

function showPostMedicationCare() {
    alert(`💊 Post-Medication Care\n\nIn full implementation, this would provide:\n- Recovery plans\n- Follow-up schedules\n- Symptom monitoring\n- Rehabilitation exercises`);
}

function showExercisePlans() {
    alert(`🏋️ Exercise Plans\n\nIn full implementation, this would offer:\n- Personalized workouts\n- Physical therapy routines\n- Progress tracking\n- Video demonstrations`);
}

// ========== ENHANCED HOSPITAL DASHBOARD FUNCTIONS ==========
function getPatientsData() {
    const patientsData = document.getElementById('patientsData');
    return JSON.parse(patientsData.getAttribute('data-patients'));
}

function viewPatientDetails(patientName) {
    const patients = getPatientsData();
    const patient = patients.find(p => p.name === patientName);
    
    if (patient) {
        displayPatientDetails(patient);
    } else {
        alert('Patient data not found: ' + patientName);
    }
}

function displayPatientDetails(patient) {
    let content = `
        <h2>👤 Patient: ${patient.name}</h2>
        <div class="patient-summary">
            <p><strong>Total Medical Records:</strong> ${patient.medical_history ? patient.medical_history.length : 0}</p>
            <p><strong>Medicine History:</strong> ${patient.medicine_history ? patient.medicine_history.length : 0} prescriptions</p>
            <p><strong>Active Medications:</strong> ${patient.medicine_history ? patient.medicine_history.filter(m => m.status === 'ongoing').length : 0}</p>
        </div>

        <div class="tab-container">
            <div class="tab-buttons">
                <button class="tab-button active" onclick="switchTab('medical', this)">📋 Medical History</button>
                <button class="tab-button" onclick="switchTab('medicine', this)">💊 Medicine History</button>
                <button class="tab-button" onclick="switchTab('actions', this)">🛠️ Actions</button>
            </div>
            
            <div id="medical-tab" class="tab-content active">
    `;

    if (patient.medical_history && patient.medical_history.length > 0) {
        content += `<h3>📋 Complete Medical History</h3>`;
        
        const reversedHistory = [...patient.medical_history].reverse();
        
        reversedHistory.forEach((record, index) => {
            content += `
                <div class="medical-record">
                    <h4>🕒 Consultation: ${record.date}</h4>
                    <p><strong>Reported Symptoms:</strong></p>
                    <div class="symptoms-list">
            `;
            
            if (record.symptoms && record.symptoms.length > 0) {
                record.symptoms.forEach(symptom => {
                    content += `<span class="symptom-tag">${symptom}</span>`;
                });
            } else {
                content += `<em>No symptoms recorded</em>`;
            }
            
            content += `</div>`;

            if (record.possible_conditions && record.possible_conditions.length > 0) {
                content += `<p><strong>AI Diagnosis:</strong></p>`;
                
                record.possible_conditions.forEach(condition => {
                    content += `
                        <div style="margin: 10px 0; padding: 10px; background: white; border-radius: 5px;">
                            <strong>${condition.disease}</strong> 
                            <span class="condition-badge">${condition.probability}% probability</span>
                    `;
                    
                    if (condition.treatment) {
                        content += `
                            <div class="treatment-card">
                                <p><strong>🩹 First Aid:</strong> ${condition.treatment.first_aid || 'Not specified'}</p>
                                <p><strong>💊 Medication:</strong> ${condition.treatment.medication || 'Not specified'}</p>
                                <p><strong>🍎 Diet:</strong> ${condition.treatment.diet || 'Not specified'}</p>
                                <p><strong>🏃 Exercise:</strong> ${condition.treatment.exercise || 'Not specified'}</p>
                            </div>
                        `;
                    }
                    
                    content += `</div>`;
                });
            }

            content += `</div>`;
        });
    } else {
        content += `<p>No medical records available for this patient.</p>`;
    }

    content += `</div>`;

    // Medicine History Tab
    content += `
        <div id="medicine-tab" class="tab-content">
            <h3>💊 Complete Medicine History</h3>
            <div style="margin-bottom: 15px;">
                <button onclick="addPrescription('${patient.name}')" class="btn" style="padding: 8px 15px; font-size: 14px;">
                    ➕ Add New Prescription
                </button>
            </div>
    `;

    if (patient.medicine_history && patient.medicine_history.length > 0) {
        const reversedMeds = [...patient.medicine_history].reverse();
        
        reversedMeds.forEach((medicine, index) => {
            const statusClass = `status-${medicine.status}`;
            const statusText = medicine.status.charAt(0).toUpperCase() + medicine.status.slice(1);
            
            content += `
                <div class="medicine-record">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <h4 style="margin: 0;">${medicine.name}</h4>
                        <div>
                            <span class="medicine-status ${statusClass}">${statusText}</span>
                            <button onclick="updateMedicineStatus('${patient.name}', '${medicine.name}')" 
                                    style="margin-left: 10px; padding: 2px 8px; background: #3498db; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 12px;">
                                🔄
                            </button>
                        </div>
                    </div>
                    <p><strong>Dosage:</strong> ${medicine.dosage}</p>
                    <p><strong>Frequency:</strong> ${medicine.frequency}</p>
                    <p><strong>Duration:</strong> ${medicine.duration}</p>
                    <p><strong>Prescribed For:</strong> ${medicine.prescribed_for}</p>
                    <p><strong>Prescribed On:</strong> ${medicine.prescribed_date}</p>
                    <p><strong>Instructions:</strong> ${medicine.instructions}</p>
                    ${medicine.side_effects ? `<p><strong>⚠️ Side Effects Reported:</strong> ${medicine.side_effects}</p>` : ''}
                    <button onclick="reportSideEffect('${patient.name}', '${medicine.name}')" 
                            style="margin-top: 5px; padding: 4px 8px; background: #e74c3c; color: white; border: none; border-radius: 3px; cursor: pointer; font-size: 11px;">
                        🚨 Report Side Effect
                    </button>
                </div>
            `;
        });
    } else {
        content += `
            <p>No medicine history recorded for this patient.</p>
            <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 15px 0;">
                <p><strong>Sample Medicine Records (Demo):</strong></p>
                <div class="medicine-record">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <h4 style="margin: 0;">Amoxicillin 500mg</h4>
                        <span class="medicine-status status-completed">Completed</span>
                    </div>
                    <p><strong>Dosage:</strong> 1 tablet</p>
                    <p><strong>Frequency:</strong> Three times daily</p>
                    <p><strong>Duration:</strong> 7 days</p>
                    <p><strong>Prescribed For:</strong> Bacterial Infection</p>
                    <p><strong>Prescribed On:</strong> 2024-01-10</p>
                    <p><strong>Instructions:</strong> Take after meals</p>
                </div>
            </div>
        `;
    }

    content += `</div>`;

    // Actions Tab
    content += `
        <div id="actions-tab" class="tab-content">
            <h3>🛠️ Patient Management</h3>
            <div class="action-buttons">
                <button onclick="addPrescription('${patient.name}')" class="btn">💊 Add Prescription</button>
                <button onclick="scheduleFollowup('${patient.name}')" class="btn">📅 Schedule Follow-up</button>
                <button onclick="generateReport('${patient.name}')" class="btn">📊 Generate Medical Report</button>
                <button onclick="updateMedicineStatus('${patient.name}')" class="btn">🔄 Update Medicine Status</button>
                <button onclick="viewLabReports('${patient.name}')" class="btn">🔬 View Lab Reports</button>
                <button onclick="addMedicalNote('${patient.name}')" class="btn">📝 Add Medical Note</button>
            </div>
            
            <div style="margin-top: 20px; background: #f8f9fa; padding: 15px; border-radius: 8px;">
                <h4>Quick Actions</h4>
                <p><strong>Recent Activity:</strong></p>
                <ul>
                    <li>Last consultation: ${patient.medical_history && patient.medical_history.length > 0 ? patient.medical_history[patient.medical_history.length-1].date : 'No records'}</li>
                    <li>Active medications: ${patient.medicine_history ? patient.medicine_history.filter(m => m.status === 'ongoing').length : 0}</li>
                    <li>Completed treatments: ${patient.medicine_history ? patient.medicine_history.filter(m => m.status === 'completed').length : 0}</li>
                    <li>Next follow-up: Not scheduled</li>
                </ul>
            </div>
        </div>
    `;

    content += `</div>`;

    document.getElementById('patientDetailsContent').innerHTML = content;
    document.getElementById('patientModal').style.display = 'block';
}

function switchTab(tabName, button) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(tabName + '-tab').classList.add('active');
    button.classList.add('active');
}

function closePatientModal() {
    document.getElementById('patientModal').style.display = 'none';
}

// Enhanced Medicine Management Functions
function addPrescription(patientName) {
    const prescriptionForm = `
        <h3>💊 Add New Prescription</h3>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 15px 0;">
            <p><strong>Patient:</strong> ${patientName}</p>
            
            <div style="display: grid; gap: 10px; margin-top: 15px;">
                <div>
                    <label><strong>Medicine Name:</strong></label>
                    <input type="text" id="medName" placeholder="e.g., Amoxicillin 500mg" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                </div>
                <div>
                    <label><strong>Dosage:</strong></label>
                    <input type="text" id="medDosage" placeholder="e.g., 1 tablet" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                </div>
                <div>
                    <label><strong>Frequency:</strong></label>
                    <input type="text" id="medFrequency" placeholder="e.g., Three times daily" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                </div>
                <div>
                    <label><strong>Duration:</strong></label>
                    <input type="text" id="medDuration" placeholder="e.g., 7 days" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                </div>
                <div>
                    <label><strong>Prescribed For:</strong></label>
                    <input type="text" id="medFor" placeholder="e.g., Bacterial Infection" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                </div>
                <div>
                    <label><strong>Instructions:</strong></label>
                    <textarea id="medInstructions" placeholder="Special instructions..." style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; height: 60px;"></textarea>
                </div>
            </div>
            
            <div style="margin-top: 15px; text-align: center;">
                <button onclick="submitPrescription('${patientName}')" style="padding: 10px 20px; background: #27ae60; color: white; border: none; border-radius: 5px; cursor: pointer; margin: 5px;">
                    ✅ Submit Prescription
                </button>
                <button onclick="closeCustomAlert()" style="padding: 10px 20px; background: #95a5a6; color: white; border: none; border-radius: 5px; cursor: pointer; margin: 5px;">
                    ❌ Cancel
                </button>
            </div>
        </div>
    `;
    
    showCustomAlert(prescriptionForm);
}

function submitPrescription(patientName) {
    const medName = document.getElementById('medName').value;
    const medDosage = document.getElementById('medDosage').value;
    
    if (!medName || !medDosage) {
        alert('Please fill in at least Medicine Name and Dosage');
        return;
    }
    
    setTimeout(() => {
        showNotification('Prescription System', `✅ Prescription for ${medName} added successfully for ${patientName}`);
        closeCustomAlert();
    }, 1000);
}

function updateMedicineStatus(patientName, medicineName = null) {
    if (medicineName) {
        let content = `
            <h3>🔄 Update Medicine Status</h3>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0;">
                <p><strong>Medicine:</strong> ${medicineName}</p>
                <p><strong>Patient:</strong> ${patientName}</p>
                
                <div style="margin: 15px 0;">
                    <label><strong>New Status:</strong></label>
                    <select id="newStatus" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; margin-top: 5px;">
                        <option value="ongoing">🟡 Ongoing - Continue treatment</option>
                        <option value="completed">🟢 Completed - Course finished</option>
                        <option value="paused">🔴 Paused - Temporarily stopped</option>
                    </select>
                </div>
                
                <div style="text-align: center; margin-top: 15px;">
                    <button onclick="submitStatusUpdate('${patientName}', '${medicineName}')" style="padding: 10px 20px; background: #3498db; color: white; border: none; border-radius: 5px; cursor: pointer;">
                        ✅ Update Status
                    </button>
                    <button onclick="closeCustomAlert()" style="padding: 10px 20px; background: #95a5a6; color: white; border: none; border-radius: 5px; cursor: pointer; margin-left: 10px;">
                        ❌ Cancel
                    </button>
                </div>
            </div>
        `;
        
        showCustomAlert(content);
    } else {
        alert(`🔄 Update Medicine Status for: ${patientName}\n\nIn full implementation, this would show a list of all medications with status update options.`);
    }
}

function submitStatusUpdate(patientName, medicineName) {
    const newStatus = document.getElementById('newStatus').value;
    
    setTimeout(() => {
        showNotification('Medicine Management', `✅ ${medicineName} status updated to ${newStatus} for ${patientName}`);
        closeCustomAlert();
    }, 1000);
}

function reportSideEffect(patientName, medicineName) {
    const content = `
        <h3>🚨 Report Side Effect</h3>
        <div style="background: #ffebee; padding: 15px; border-radius: 8px; margin: 15px 0;">
            <p><strong>Medicine:</strong> ${medicineName}</p>
            <p><strong>Patient:</strong> ${patientName}</p>
            
            <div style="margin: 15px 0;">
                <label><strong>Side Effect Description:</strong></label>
                <textarea id="sideEffectDesc" placeholder="Describe the side effect in detail..." style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; height: 80px;"></textarea>
            </div>
            
            <div style="text-align: center;">
                <button onclick="submitSideEffect('${patientName}', '${medicineName}')" style="padding: 10px 20px; background: #e74c3c; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    🚨 Submit Report
                </button>
                <button onclick="closeCustomAlert()" style="padding: 10px 20px; background: #95a5a6; color: white; border: none; border-radius: 5px; cursor: pointer; margin-left: 10px;">
                    ❌ Cancel
                </button>
            </div>
        </div>
    `;
    
    showCustomAlert(content);
}

function submitSideEffect(patientName, medicineName) {
    const description = document.getElementById('sideEffectDesc').value;
    
    if (!description) {
        alert('Please describe the side effect');
        return;
    }
    
    setTimeout(() => {
        showNotification('Side Effect Report', `✅ Side effect reported for ${medicineName}`);
        closeCustomAlert();
    }, 1000);
}

function scheduleFollowup(patientName) {
    alert(`📅 Schedule Follow-up for: ${patientName}\n\nThis would open a calendar to schedule:\n- Follow-up appointment date\n- Doctor assignment\n- Reminder settings\n- Telemedicine option`);
}

function generateReport(patientName) {
    alert(`📊 Generate Medical Report for: ${patientName}\n\nThis would create a comprehensive report including:\n- Patient medical history\n- Diagnosis summary\n- Treatment plans\n- Lab results\n- Doctor recommendations`);
}

function viewLabReports(patientName) {
    alert(`🔬 View Lab Reports for: ${patientName}\n\nAvailable Lab Reports:\n- Blood Tests\n- Urine Analysis\n- MRI/CT Scans\n- X-Ray Reports\n- Pathology Reports\n- Latest Results & Trends`);
}

function addMedicalNote(patientName) {
    alert(`📝 Add Medical Note for: ${patientName}\n\nMedical Notes System:\n- Progress Notes\n- Clinical Observations\n- Treatment Response\n- Patient Compliance\n- Future Recommendations\n- Digital Signature`);
}

// Utility Functions
function showCustomAlert(content) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1001;
    `;
    
    modal.id = 'customAlertModal';
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        padding: 25px;
        border-radius: 15px;
        max-width: 500px;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    `;
    
    modalContent.innerHTML = content;
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
}

function closeCustomAlert() {
    const modal = document.getElementById('customAlertModal');
    if (modal) {
        modal.remove();
    }
}

function showNotification(title, message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: white;
        padding: 15px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 1002;
        max-width: 300px;
        border-left: 4px solid #27ae60;
        animation: slideIn 0.3s ease-out;
    `;
    
    notification.innerHTML = `
        <strong>${title}</strong>
        <p style="margin: 5px 0; font-size: 14px;">${message}</p>
        <small style="color: #666;">Just now</small>
        <button onclick="this.parentElement.remove()" style="float: right; background: none; border: none; cursor: pointer; color: #666;">×</button>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

function alertWithHTML(content) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        padding: 30px;
        border-radius: 15px;
        max-width: 500px;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    `;
    
    modalContent.innerHTML = content + `
        <div style="text-align: center; margin-top: 20px;">
            <button onclick="this.parentElement.parentElement.parentElement.remove()" 
                    style="padding: 10px 20px; background: #3498db; color: white; border: none; border-radius: 5px; cursor: pointer;">
                Close
            </button>
        </div>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('patientModal');
    if (event.target === modal) {
        closePatientModal();
    }
    
    const customModal = document.getElementById('customAlertModal');
    if (event.target === customModal) {
        closeCustomAlert();
    }
}