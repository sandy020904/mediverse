Mediverse – AI-Powered Healthcare Prototype

Mediverse is an intelligent healthcare assistant built using Flask and AI logic to assist patients with symptom analysis, doctor availability tracking, appointment scheduling, and secure health record management.
This prototype demonstrates how AI-driven healthcare systems can provide faster, more personalized, and reliable medical support.

🌐 Project Overview

Mediverse aims to simplify healthcare interactions through:

AI-based symptom diagnosis

Appointment booking system for patients

Secure storage of medical history

Doctor availability & timetable management

User-friendly dashboard for doctors and patients

⚙️ Tech Stack
Layer	Technology Used
Frontend	HTML, CSS, JavaScript
Backend	Python (Flask Framework)
Database	JSON & In-memory data structures
AI & ML	Rule-based symptom-disease mapping
Cloud/Local Server	Flask Development Server
Security	Flask Session Management, Secret Key Encryption
Other Tools	Responsive UI Design, Appointment Scheduling
🚀 Features

✅ Smart Symptom Checker – AI identifies possible diseases based on symptoms
✅ Doctor Availability System – Dynamically generates schedules
✅ Appointment Scheduling – Patients can book and manage appointments
✅ Health Record Management – Secure and accessible patient data
✅ Role-Based Access – Admin, doctor, and patient login support
✅ Encrypted Sessions – Ensures secure communication

🧩 Project Structure
mediverse/
│
├── static/                 # CSS, JS, and image files
├── templates/              # HTML pages (Flask Jinja templates)
├── app.py                  # Main Flask application
├── model.py                # AI logic for symptom prediction
├── database.json           # Stores user and patient data
├── requirements.txt        # Required Python dependencies
└── README.md               # Project documentation

🪜 Installation Guide
1️⃣ Clone this repository
git clone https://github.com/sandy020904/mediverse.git
cd mediverse

2️⃣ Create and activate a virtual environment
python -m venv venv
venv\Scripts\activate       # For Windows
# or
source venv/bin/activate    # For macOS/Linux

3️⃣ Install dependencies
pip install -r requirements.txt

4️⃣ Run the application
python app.py

5️⃣ Open in your browser

Visit 👉 http://127.0.0.1:5000/

🧪 Future Enhancements

🤖 AI-powered prescription and chatbot integration

🗣️ Voice-based symptom input (multilingual support)

☁️ Deployment on Render or AWS Cloud

📊 Advanced health analytics dashboard

📱 Mobile-responsive UI

📸 Screenshots

(Add UI images or GIFs here once deployed)
Example:
/static/images/homepage.png
/static/images/dashboard.png

👨‍💻 Contributors
Name	Role	GitHub
Sandeep Reddy	Lead Developer	@sandy020904

Team Mediverse	AI & Backend Support	—
📄 License

This project is licensed under the MIT License – see the LICENSE
 file for more information.

⭐ Support

If you found this project useful, please star the repository on GitHub 🌟
Your feedback helps make Mediverse even better!
