@echo off
echo Installing MediVerse Prototype...
pip install -r requirements.txt
echo Starting MediVerse...
echo Access your application at: http://127.0.0.1:5000
echo.
echo User Login: Any username/password
echo Hospital Login: hospital/hospital123
echo.
python app.py
pause