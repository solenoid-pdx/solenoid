# Solenoid

This project is a web based calculator for solving the force of a solenoid given some design parameters. In addition to this, the calculator also allows backsolving and graphing of some parameters given a force and the other parameters
### Parameters
+ Voltage (volts)
+ Length
+ Gauge size
+ Coil radius 
+ Turn radius
+ Force

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

