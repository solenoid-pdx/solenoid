# Solenoid

Solenoid is a calculator for determining what parameters are needed in order to obtain a certain force.

## Setup

**Clone the repository:**
```
git clone https://github.com/solenoid-pdx/solenoid.git
cd solenoid
```
It is recommended to use a virtual environment so the dependencies are not installed globally: 
```
python3 -m venv env
. env/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
```

### Running the Django server
```
python manage.py runserver
```
You should be able to visit the development server in your browser: 
+ http://localhost:8000/