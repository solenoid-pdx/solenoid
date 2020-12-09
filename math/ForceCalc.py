from sympy import *
import numpy as np
from time import perf_counter

unit_flag = 0
    # Data for the gauge
AWGdata = {
    "0000": {"resistance": 0.1608, "area": 107, "diameter": 11.684},
    "000": {"resistance": 0.2028, "area": 85.0, "diameter": 10.405},
    "00": {"resistance": 0.2557, "area": 67.4, "diameter": 9.266},
    "0": {"resistance": 0.3224, "area": 53.5, "diameter": 8.251},
    "1": {"resistance": 0.4066, "area": 42.4, "diameter": 7.348},
    "2": {"resistance": 0.5127, "area": 33.6, "diameter": 6.544},
    "3": {"resistance": 0.6465, "area": 26.7, "diameter": 5.827},
    "4": {"resistance": 0.8152, "area": 21.2, "diameter": 5.189},
    "5": {"resistance": 1.028, "area": 16.8, "diameter": 4.621},
    "6": {"resistance": 1.296, "area": 13.3, "diameter": 4.115},
    "7": {"resistance": 1.634, "area": 10.5, "diameter": 3.665},
    "8": {"resistance": 2.061, "area": 8.37, "diameter": 3.264},
    "9": {"resistance": 2.599, "area": 6.63, "diameter": 2.906},
    "10": {"resistance": 3.277, "area": 5.26, "diameter": 2.588},
    "11": {"resistance": 4.132, "area": 4.17, "diameter": 2.305},
    "12": {"resistance": 5.211, "area": 3.31, "diameter": 2.053},
    "13": {"resistance": 6.571, "area": 2.62, "diameter": 1.828},
    "14": {"resistance": 8.286, "area": 2.08, "diameter": 1.628},
    "15": {"resistance": 10.45, "area": 1.65, "diameter": 1.450},
    "16": {"resistance": 13.17, "area": 1.31, "diameter": 1.291},
    "17": {"resistance": 16.61, "area": 1.04, "diameter": 1.150},
    "18": {"resistance": 20.95, "area": 0.823, "diameter": 1.024},
    "19": {"resistance": 26.42, "area": 0.653, "diameter": 0.912},
    "20": {"resistance": 33.31, "area": 0.518, "diameter": 0.812},
    "21": {"resistance": 42.00, "area": 0.410, "diameter": 0.723},
    "22": {"resistance": 52.96, "area": 0.326, "diameter": 0.644},
    "23": {"resistance": 66.79, "area": 0.258, "diameter": 0.573},
    "24": {"resistance": 84.22, "area": 0.205, "diameter": 0.511},
    "25": {"resistance": 106.2, "area": 0.162, "diameter": 0.455},
    "26": {"resistance": 133.9, "area": 0.129, "diameter": 0.405},
    "27": {"resistance": 168.9, "area": 0.102, "diameter": 0.361},
    "28": {"resistance": 212.9, "area": 0.0810, "diameter": 0.321},
    "29": {"resistance": 268.5, "area": 0.0642, "diameter": 0.286},
    "30": {"resistance": 338.6, "area": 0.0509, "diameter": 0.255},
    "31": {"resistance": 426.9, "area": 0.0404, "diameter": 0.227},
    "32": {"resistance": 538.3, "area": 0.0320, "diameter": 0.202},
    "33": {"resistance": 678.8, "area": 0.0254, "diameter": 0.180},
    "34": {"resistance": 856.0, "area": 0.0201, "diameter": 0.160},
    "35": {"resistance": 1079, "area": 0.0160, "diameter": 0.143},
    "36": {"resistance": 1361, "area": 0.0127, "diameter": 0.127},
    "37": {"resistance": 1716, "area": 0.0100, "diameter": 0.113},
    "38": {"resistance": 2164, "area": 0.00797, "diameter": 0.101},
    "39": {"resistance": 2729, "area": 0.00632, "diameter": 0.0897},
    "40": {"resistance": 3441, "area": 0.00501, "diameter": 0.0799}
}

permFree = 1.257 * (10**-6)
permRelIron = 350

#Prototype of unit conversion before calculation
#This depends on user input 
def conversionToMeter(length, R0, RA):
    if unit_flag == 0: ## flag 0 is for meter
        return length, R0, RA
    elif unit_flag == 1: ## decimeter to meter
        length = length / 10
        R0 = R0 / 10
        RA = RA / 10
        return length, R0, RA
    elif unit_flag == 2:  ## user entered cm, converting to meter
        length = length / 100
        R0 = R0 / 100
        RA = RA / 100
        return length, R0, RA
    elif unit_flag == 3:  ## user entered mm, converting to meter
        length = length / 1000
        R0 = R0 / 1000
        RA = RA / 1000
        return length, R0, RA

##      Equation 22 from the paper separated into 3 different parts      ##
def calculateForce22(volts, length, r0, rA, gauge, location):
    alpha = np.log(permRelIron)
    partOne = -((volts ** 2) * permRelIron * permFree) / (
                8 * np.pi * ((AWGdata[gauge]["resistance"] / 1000) ** 2) * (
                (length / 1000) ** 2))
    
    partTwo = ((r0/1000) / (rA/1000))**2
    partThree = np.e**(-(alpha/(length / 1000)) * (location / 1000)) 

    force = partOne*partTwo*alpha*partThree
    return force


def mainSolver(volts, length, r0, rA, gauge, location, force):
    result = None
    a = np.log(permRelIron) 
    f,v,l,R0,RA,x = symbols('f v l R0 RA x')

    ##      Generalized equation       ##
    eq1 = ((v ** 2) * permRelIron * permFree) / (
                    8 * np.pi * ((AWGdata[gauge]["resistance"] / 1000) ** 2) * (
                    (l / 1000) ** 2))
    eq2 = ((R0/1000)**2 / (RA/1000)**2)
    eq3 = np.e**(-(a/(l / 1000)) * (x / 1000))

    ## Unsure of this part
    originEq = eq1 * eq2 * eq3 * a

    ##      Performing series of substitution depend on the missing variable      ##
    ##      NOTICE: using sympy.subs will directly simplify the equation          ##
    if volts is None:
        originEq = originEq.subs(l,length) 
        originEq = originEq.subs(R0, r0)
        originEq = originEq.subs(RA,rA)
        originEq = originEq.subs(x,location)
        originEq = originEq.subs(f,force)
        result = solve(originEq, v)

    ##      Repetitive but gets the work done       ##
    elif length is None:
        originEq = originEq.subs(v,volts)
        originEq = originEq.subs(R0,r0) 
        originEq = originEq.subs(RA,rA)
        originEq = originEq.subs(x,location) 
        originEq = originEq.subs(f,force)
        result = solve(originEq,l)

    elif r0 is None:
        originEq = originEq.subs(v,volts)
        originEq = originEq.subs(RA,rA)
        originEq = originEq.subs(l,length)
        originEq = originEq.subs(x,location)
        originEq = originEq.subs(f,force)
        result = solve(originEq,R0)

    elif rA is None:
        originEq = originEq.subs(v,volts)
        originEq = originEq.subs(R0,r0)
        originEq = originEq.subs(l,length)
        originEq = originEq.subs(x,location) 
        originEq = originEq.subs(f,force)
        result = solve(originEq,RA)

    elif location is None: 
        originEq = originEq.subs(v,volts)
        originEq = originEq.subs(R0,r0)
        originEq = originEq.subs(RA,rA)
        originEq = originEq.subs(l,length)
        originEq = originEq.subs(f,force)
        result = solve(originEq,l)
    
    elif force is None:  
        originEq = originEq.subs(v,volts)
        originEq = originEq.subs(R0,r0)
        originEq = originEq.subs(RA,rA)
        originEq = originEq.subs(x,location)
        originEq = originEq.subs(l,length)
        result = solve(originEq,f)

def main():
    start = perf_counter()
    print("\n-------- Force Calculated from Function 22 --------")
    print("Inputs: 5v, 27mm length, 2.3mm r0, 4.5mm ra, 30 AWG, 0 mm stroke(x)")
    print("Force22 = " + str(calculateForce22(5, 27, 2.3, 4.5, "30", 0)) + "\n")

    print("-------- Results from Solver (Force rounded for display) --------")
    print(("Using above values: \n  Force = %g (N)" % mainSolver(5, 27, 2.3, 4.5, "30", 0, None)))
    print("\nSolved using above values and force value:")
    print(" Volts = %g (V)" % mainSolver(None, 27, 2.3, 4.5, "30", 0, 8.01266694554291))
    print(" length = %g (mm)" % mainSolver(5, None, 2.3, 4.5, "30", 0, 8.01266694554291))
    print(" R0 = %g (mm)" % mainSolver(5, 27, None, 4.5, "30", 0, 8.01266694554291))
    print(" Ra = %g (mm)" % mainSolver(5, 27, 2.3, None, "30", 0, 8.01266694554291))
    print("\nTime to complete all calculations " + f"{perf_counter() - start:0.4f} seconds")


if __name__ == "__main__":
    main()