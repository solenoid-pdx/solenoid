from numpy import *
from sympy import symbols, solve
from time import perf_counter
from solenoid_app.solenoid_math.solver import *

"""           mili Ohms / meter,  milimeters^2   """
AWGdata = {
    "0000": {"resistance": 0.1608, "area": 107},
    "000": {"resistance": 0.2028, "area": 85.0},
    "00": {"resistance": 0.2557, "area": 67.4},
    "0": {"resistance": 0.3224, "area": 53.5},
    "1": {"resistance": 0.4066, "area": 42.4},
    "2": {"resistance": 0.5127, "area": 33.6},
    "3": {"resistance": 0.6465, "area": 26.7},
    "4": {"resistance": 0.8152, "area": 21.2},
    "5": {"resistance": 1.028, "area": 16.8},
    "6": {"resistance": 1.296, "area": 13.3},
    "7": {"resistance": 1.634, "area": 10.5},
    "8": {"resistance": 2.061, "area": 8.37},
    "9": {"resistance": 2.599, "area": 6.63},
    "10": {"resistance": 3.277, "area": 5.26},
    "11": {"resistance": 4.132, "area": 4.17},
    "12": {"resistance": 5.211, "area": 3.31},
    "13": {"resistance": 6.571, "area": 2.62},
    "14": {"resistance": 8.286, "area": 2.08},
    "15": {"resistance": 10.45, "area": 1.65},
    "16": {"resistance": 13.17, "area": 1.31},
    "17": {"resistance": 16.61, "area": 1.04},
    "18": {"resistance": 20.95, "area": 0.823},
    "19": {"resistance": 26.42, "area": 0.653},
    "20": {"resistance": 33.31, "area": 0.518},
    "21": {"resistance": 42.00, "area": 0.410},
    "22": {"resistance": 52.96, "area": 0.326},
    "23": {"resistance": 66.79, "area": 0.258},
    "24": {"resistance": 84.22, "area": 0.205},
    "25": {"resistance": 106.2, "area": 0.162},
    "26": {"resistance": 133.9, "area": 0.129},
    "27": {"resistance": 168.9, "area": 0.102},
    "28": {"resistance": 212.9, "area": 0.0810},
    "29": {"resistance": 268.5, "area": 0.0642},
    "30": {"resistance": 338.6, "area": 0.0509},
    "31": {"resistance": 426.9, "area": 0.0404},
    "32": {"resistance": 538.3, "area": 0.0320},
    "33": {"resistance": 678.8, "area": 0.0254},
    "34": {"resistance": 856.0, "area": 0.0201},
    "35": {"resistance": 1079, "area": 0.0160},
    "36": {"resistance": 1361, "area": 0.0127},
    "37": {"resistance": 1716, "area": 0.0100},
    "38": {"resistance": 2164, "area": 0.00797},
    "39": {"resistance": 2729, "area": 0.00632},
    "40": {"resistance": 3441, "area": 0.00501}
}

permFree = 1.257 * (10 ** -6)

permRelIron = 350


def calculateForce22(volts, length, r0, ra, gauge, location):
    alpha = log(permRelIron)

    partOne = -((volts ** 2) * permRelIron * permFree) / (
            8 * pi * ((AWGdata[gauge]["resistance"] / 1000) ** 2) * ((length / 1000) ** 2))

    partTwo = ((r0 / 1000) ** 2 / (ra / 1000) ** 2)

    partThree = e ** (-(alpha / (length / 1000)) * (location / 1000))

    # print("partOne = " + str(partOne))
    # print("partTwo = " + str(partTwo))
    # print("partThree = " + str(partThree))
    # print("alpha = " + str(alpha))

    force = partOne * partTwo * alpha * partThree

    return force


def solver22(volts, length, r0, ra, gauge, location, force):
    result = None
    a = log(permRelIron)
    f, v, l, R0, Ra, x = symbols('f v l R0 Ra x')

    if volts is None:
        l = length
        R0 = r0
        Ra = ra
        x = location
        f = force

        eq1 = ((v ** 2) * permRelIron * permFree) / (
                8 * pi * ((AWGdata[gauge]["resistance"] / 1000) ** 2) * ((l / 1000) ** 2))
        eq2 = ((R0 / 1000) ** 2 / (Ra / 1000) ** 2)
        eq3 = e ** (-(a / (l / 1000)) * (x / 1000))
        result = solve((eq1 * eq2 * eq3 * a) - f, v)

    elif length is None:
        v = volts
        R0 = r0
        Ra = ra
        x = location
        f = force

        eq1 = ((v ** 2) * permRelIron * permFree) / (
                8 * pi * ((AWGdata[gauge]["resistance"] / 1000) ** 2) * ((l / 1000) ** 2))
        eq2 = ((R0 / 1000) ** 2 / (Ra / 1000) ** 2)
        eq3 = e ** (-(a / (l / 1000)) * (x / 1000))
        result = solve((eq1 * eq2 * eq3 * a) - f, l)

    elif r0 is None:
        v = volts
        l = length
        Ra = ra
        x = location
        f = force

        eq1 = ((v ** 2) * permRelIron * permFree) / (
                8 * pi * ((AWGdata[gauge]["resistance"] / 1000) ** 2) * ((l / 1000) ** 2))
        eq2 = ((R0 / 1000) ** 2 / (Ra / 1000) ** 2)
        eq3 = e ** (-(a / (l / 1000)) * (x / 1000))
        result = solve((eq1 * eq2 * eq3 * a) - f, R0)

    elif ra is None:
        v = volts
        l = length
        R0 = r0
        x = location
        f = force

        eq1 = ((v ** 2) * permRelIron * permFree) / (
                8 * pi * ((AWGdata[gauge]["resistance"] / 1000) ** 2) * ((l / 1000) ** 2))
        eq2 = ((R0 / 1000) ** 2 / (Ra / 1000) ** 2)
        eq3 = e ** (-(a / (l / 1000)) * (x / 1000))
        result = solve((eq1 * eq2 * eq3 * a) - f, Ra)

    elif location is None:
        v = volts
        l = length
        Ra = ra
        R0 = r0
        f = force

        eq1 = ((v ** 2) * permRelIron * permFree) / (
                8 * pi * ((AWGdata[gauge]["resistance"] / 1000) ** 2) * ((l / 1000) ** 2))
        eq2 = ((R0 / 1000) ** 2 / (Ra / 1000) ** 2)
        eq3 = e ** (-(a / (l / 1000)) * (x / 1000))
        result = solve((eq1 * eq2 * eq3 * a) - f, x)

    elif force is None:
        v = volts
        l = length
        R0 = r0
        Ra = ra
        x = location

        eq1 = ((v ** 2) * permRelIron * permFree) / (
                8 * pi * ((AWGdata[gauge]["resistance"] / 1000) ** 2) * ((l / 1000) ** 2))
        eq2 = ((R0 / 1000) ** 2 / (Ra / 1000) ** 2)
        eq3 = e ** (-(a / (l / 1000)) * (x / 1000))
        result = solve((eq1 * eq2 * eq3 * a) - f, f)

    # print(result)

    if len(result) == 2:
        return result[1]
    else:
        return result[0]


def calculateForce(volts, length, r0, layers, diameter, gauge, location):
    alpha = log(permRelIron)
    # ra = r0 + ((layers * AWGdata[gauge]["diameter"]) / 2)
    ra = r0 + ((layers * diameter) / 2)

    partOne = -((volts ** 2) * permRelIron * permFree) / (
            8 * pi * ((AWGdata[gauge]["resistance"] / 1000) ** 2) * ((length / 1000) ** 2))

    partTwo = ((r0 / 1000) ** 2 / (ra / 1000) ** 2)

    partThree = e ** (-(alpha / (length / 1000)) * (location / 1000))

    # print("partOne = " + str(partOne))
    # print("partTwo = " + str(partTwo))
    # print("partThree = " + str(partThree))
    # print("alpha = " + str(alpha))

    # turns = ((length // AWGdata[gauge]["diameter"]))
    # turns = ((length / diameter))
    # N = layers * turns
    # print("Number of turns = " + str(turns) + ", Layers = " + str(layers) + ", N = " + str(N))
    # print("ra = " + str(ra) + "mm")

    force = partOne * partTwo * alpha * partThree

    return force


def solver(volts, length, r0, layers, diameter, gauge, location, force):
    result = None
    a = log(permRelIron)
    f, v, l, R0, L, x = symbols('f v l R0 L x')


    if volts is None:
        l = length
        R0 = r0
        L = layers
        x = location
        f = force

        Ra = R0 + ((L * diameter) / 2)
        eq1 = ((v ** 2) * permRelIron * permFree) / (
                8 * pi * ((AWGdata[gauge]["resistance"] / 1000) ** 2) * ((l / 1000) ** 2))
        eq2 = ((R0 / 1000) ** 2 / (Ra / 1000) ** 2)
        eq3 = e ** (-(a / (l / 1000)) * (x / 1000))
        result = solve((eq1 * eq2 * eq3 * a) - f, v)

    elif length is None:
        v = volts
        R0 = r0
        L = layers
        x = location
        f = force

        Ra = R0 + ((L * diameter) / 2)
        eq1 = ((v ** 2) * permRelIron * permFree) / (
                8 * pi * ((AWGdata[gauge]["resistance"] / 1000) ** 2) * ((l / 1000) ** 2))
        eq2 = ((R0 / 1000) ** 2 / (Ra / 1000) ** 2)
        eq3 = e ** (-(a / (l / 1000)) * (x / 1000))
        result = solve((eq1 * eq2 * eq3 * a) - f, l)

    elif r0 is None:
        v = volts
        l = length
        L = layers
        x = location
        f = force

        Ra = R0 + ((L * diameter) / 2)
        eq1 = ((v ** 2) * permRelIron * permFree) / (
                8 * pi * ((AWGdata[gauge]["resistance"] / 1000) ** 2) * ((l / 1000) ** 2))
        eq2 = ((R0 / 1000) ** 2 / (Ra / 1000) ** 2)
        eq3 = e ** (-(a / (l / 1000)) * (x / 1000))
        result = solve((eq1 * eq2 * eq3 * a) - f, R0)

    elif layers is None:
        v = volts
        l = length
        R0 = r0
        x = location
        f = force

        Ra = R0 + ((L * diameter) / 2)
        eq1 = ((v ** 2) * permRelIron * permFree) / (
                8 * pi * ((AWGdata[gauge]["resistance"] / 1000) ** 2) * ((l / 1000) ** 2))
        eq2 = ((R0 / 1000) ** 2 / (Ra / 1000) ** 2)
        eq3 = e ** (-(a / (l / 1000)) * (x / 1000))
        result = solve((eq1 * eq2 * eq3 * a) - f, L)

    elif location is None:
        v = volts
        l = length
        L = layers
        R0 = r0
        f = force

        Ra = R0 + ((L * diameter) / 2)
        eq1 = ((v ** 2) * permRelIron * permFree) / (
                8 * pi * ((AWGdata[gauge]["resistance"] / 1000) ** 2) * ((l / 1000) ** 2))
        eq2 = ((R0 / 1000) ** 2 / (Ra / 1000) ** 2)
        eq3 = e ** (-(a / (l / 1000)) * (x / 1000))
        result = solve((eq1 * eq2 * eq3 * a) - f, x)

    elif force is None:
        v = volts
        l = length
        R0 = r0
        L = layers
        x = location

        Ra = R0 + ((L * diameter) / 2)
        eq1 = ((v ** 2) * permRelIron * permFree) / (
                8 * pi * ((AWGdata[gauge]["resistance"] / 1000) ** 2) * ((l / 1000) ** 2))
        eq2 = ((R0 / 1000) ** 2 / (Ra / 1000) ** 2)
        eq3 = e ** (-(a / (l / 1000)) * (x / 1000))
        result = solve((eq1 * eq2 * eq3 * a) - f, f)

    # print(result)

    if len(result) == 2:
        return result[1]
    else:
        return result[0]


def solve_equations():
    a = log(permRelIron)
    f, v, l, R0, Ra, x, g = symbols('f v l R0 Ra x g')

    eq1 = ((v ** 2) * permRelIron * permFree) / (
            8 * pi * (g ** 2) * (l ** 2))
    eq2 = (R0 ** 2 / Ra ** 2)
    eq3 = e ** (-(a/l) * x)

    # result = solve((eq1 * eq2 * eq3 * a) - f, v)
    # print(result)
    #
    # result = solve((eq1 * eq2 * eq3 * a) - f, l)
    # print(result)

    result = solve((eq1 * eq2 * eq3 * a) - f, R0)
    print(result)

    # result = solve((eq1 * eq2 * eq3 * a) - f, Ra)
    # print(result)
    #
    # result = solve((eq1 * eq2 * eq3 * a) - f, x)
    # print(result)
    #
    # result = solve((eq1 * eq2 * eq3 * a) - f, f)
    # print(result)


def equations(volts, length, r0, ra, gauge, location, force):
    result = None
    a = log(permRelIron)
    # f, v, l, R0, Ra, x = symbols('f v l R0 Ra x')

    if volts is None:

        result = (2 * sqrt(2 * pi) * sqrt(force) * (AWGdata[gauge]["resistance"] / 1000) * (length / 1000) * (
                    ra / 1000) * e ** (((location / 1000) * a) / (2 * (length / 1000)))) / (
                             (r0 / 1000) * sqrt(permRelIron) * sqrt(permFree) * sqrt(a))

    elif length is None:

        result = 1000 * (sqrt(a) * (r0 / 1000) * sqrt(permFree) * sqrt(permRelIron) * volts) / (
                    2 * sqrt(2 * pi) * sqrt(force) * (AWGdata[gauge]["resistance"] / 1000) * (ra / 1000))

    elif r0 is None:

        result = 1000 * (2 * sqrt(2 * pi) * sqrt(force) * (AWGdata[gauge]["resistance"] / 1000) * (length / 1000) *
                        (ra / 1000) * e ** (((location / 1000) * a) / (2 * (length / 1000)))) / (
                             sqrt(permRelIron) * sqrt(permFree) * volts * sqrt(a))

    elif ra is None:

        result = 1000 * ((r0 / 1000) * sqrt(permRelIron) * sqrt(permFree) * volts * sqrt(a) * e ** -(
                    ((location / 1000) * a) / (2 * (length / 1000)))) / (
                             2 * sqrt(2 * pi) * sqrt(force) * (AWGdata[gauge]["resistance"] / 1000) * (length / 1000))

    elif location is None:
        v = volts
        l = length
        Ra = ra
        R0 = r0
        f = force

        result = 0

    elif force is None:
        v = volts
        l = length
        R0 = r0
        Ra = ra
        x = location

        eq1 = ((v ** 2) * permRelIron * permFree) / (
                8 * pi * ((AWGdata[gauge]["resistance"] / 1000) ** 2) * ((l / 1000) ** 2))
        eq2 = ((R0 / 1000) ** 2 / (Ra / 1000) ** 2)
        eq3 = e ** (-(a / (l / 1000)) * (x / 1000))
        result = eq1 * eq2 * eq3 * a

    return result
    # print(result)

    # if len(result) == 2:
    #     return result[1]
    # else:
    #     return result[0]

def solver_performance(loops, volts, length, r0, ra, gauge, location, force):
    vals = []
    result = 0


    print("Values used - Volts: %f, length: %f, r0: %f, ra: %f, gauge: %s, location: %f, force: %f" %
          (volts, length, r0, ra, gauge, location, force))

    for i in range(loops):
        time1 = perf_counter()
        # solver22(None, length, r0, ra, gauge, location, force)
        result = equations(None, length, r0, ra, gauge, location, force)
        time2 = perf_counter()

        vals.append(time2 - time1)

    minVal = min(vals)
    maxVal = max(vals)
    total = sum(vals)
    avg = total / len(vals)

    print("Volts -- Loops: %d, Result: %f, Total: %f, Min: %f, Max: %f, Avg: %f" % (loops, result, total, minVal, maxVal, avg))

    for i in range(loops):
        time1 = perf_counter()
        result = equations(volts, None, r0, ra, gauge, location, force)
        # result = solver22(volts, None, r0, ra, gauge, location, force)
        time2 = perf_counter()

        vals.append(time2 - time1)

    minVal = min(vals)
    maxVal = max(vals)
    total = sum(vals)
    avg = total / len(vals)

    print("Length -- Loops: %d, Result: %f, Total: %f, Min: %f, Max: %f, Avg: %f" % (loops, result, total, minVal, maxVal, avg))

    for i in range(loops):
        time1 = perf_counter()
        result = equations(volts, length, None, ra, gauge, location, force)
        time2 = perf_counter()

        vals.append(time2 - time1)

    minVal = min(vals)
    maxVal = max(vals)
    total = sum(vals)
    avg = total / len(vals)

    print("r0 -- Loops: %d, Result: %f, Total: %f Min: %f, Max: %f, Avg: %f" % (loops, result, total, minVal, maxVal, avg))

    for i in range(loops):
        time1 = perf_counter()
        result = equations(volts, length, r0, None, gauge, location, force)
        time2 = perf_counter()

        vals.append(time2 - time1)

    minVal = min(vals)
    maxVal = max(vals)
    total = sum(vals)
    avg = total / len(vals)

    print("rA -- Loops: %d, Result: %f, Total: %f, Min: %f, Max: %f, Avg: %f" % (loops, result, total, minVal, maxVal, avg))

    # for i in range(loops):

    #     time1 = perf_counter()
    #     solver22(volts, length, r0, ra, gauge, None, force)
    #     time2 = perf_counter()

    #     vals.append(time2-time1)

    # minVal = min(vals)
    # maxVal = max(vals)
    # total = sum(vals)
    # avg = total / len(vals)

    # print("Location (x) -- Loops: %d, Result: %f, Total: %f, Min: %f, Max: %f, Avg: %f" % (loops, result, total, minVal, maxVal, avg))

    for i in range(loops):
        time1 = perf_counter()
        result = equations(volts, length, r0, ra, gauge, location, None)
        time2 = perf_counter()

        vals.append(time2 - time1)

    minVal = min(vals)
    maxVal = max(vals)
    total = sum(vals)
    avg = total / len(vals)

    print("Force -- Loops: %d, Result: %f, Total: %f, Min: %f, Max: %f, Avg: %f" % (loops, result, total, minVal, maxVal, avg))


if __name__ == "__main__":

    # solve_equations()

    # equations(None, 27, 2.3, 4.5, "30", 0, 8.01266694554291)

    solver_performance(100, 5, 27, 2.3, 4.5, "30", 0, 8.01266694554291)

    # start = perf_counter()
    # #                                volts, length, r0, ra, gauge, location
    # print("\n-------- Force Calculated from Function 22 --------")
    # print("Inputs: 5v, 27mm length, 2.3mm r0, 4.5mm ra, 30 AWG, 0 mm stroke(x)")
    # print("Force22 = " + str(calculateForce22(5, 27, 2.3, 4.5, "30", 0)) + "\n")

    # print("-------- Results from Solver (Force rounded for display) --------")
    # print(("Using above values: \n  Force = %g (N)" % solver22(5, 27, 2.3, 4.5, "30", 0, None)))
    # print("\nSolved using above values and force value:")
    # print(" Volts = %g (V)" % solver22(None, 27, 2.3, 4.5, "30", 0, 8.01266694554291))
    # print(" length = %g (mm)" % solver22(5, None, 2.3, 4.5, "30", 0, 8.01266694554291))
    # print(" R0 = %g (mm)" % solver22(5, 27, None, 4.5, "30", 0, 8.01266694554291))
    # print(" Ra = %g (mm)" % solver22(5, 27, 2.3, None, "30", 0, 8.01266694554291))

    # print("\nTime to complete all calculations " + f"{perf_counter() - start:0.4f} seconds")

    # start = perf_counter()
    # #                               volts, length, r0, layers, diameter, gauge, location
    # print("\n\n\n-------- Force Calculated from Function w/ layers --------")
    # print("Inputs: 5v, 27mm length, 2.3mm r0, 10 layers, 0.47mm diameter 30 AWG, 0 mm stroke(x)")
    # print("Force = " + str(calculateForce(5, 27, 2.3, 10, 0.41, "30", 0)) + "\n")

    # print("-------- Results from Solver (Force rounded for display) --------")
    # print(("Using above values: \n  Force = %g (N)" % solver(5, 27, 2.3, 10, 0.41, "30", 0, None)))
    # print("\nSolved using above values and force value:")
    # print(" Volts = %g (V)" % solver(None, 27, 2.3, 10, 0.41, "30", 0, 8.574792212828324))
    # print(" length = %g (mm)" % solver(5, None, 2.3, 10, 0.41, "30", 0, 8.574792212828324))
    # print(" R0 = %g (mm)" % solver(5, 27, None, 10, 0.41, "30", 0, 8.574792212828324))
    # print(" Layers = %g" % solver(5, 27, 2.3, None, 0.41, "30", 0, 8.574792212828324))

    # print("\nTime to complete all calculations " + f"{perf_counter() - start:0.4f} seconds")

    # for i in range(3, 7):
    #     for j in range(24, 29):
    #         for k in list(np.arange(2.3, 2.7, 0.1)):
    #             for l in list(np.arange(4.5, 4.9, 0.1)):
    #                 for m in AWG_DATA.keys():
    #                     volts = i
    #                     length = j
    #                     r0 = k
    #                     ra = l
    #                     gauge = m
    #                     location = 0
    #
    #                     force1 = float(solenoid_solve(volts, length, r0, ra, gauge, location, None))
    #                     force2 = solenoid_performance(volts, length, r0, ra, gauge, location, None)
    #
    #                     if force1 != force2:
    #                         print("\nForce Val mismatch using: Volts = %g | Length = %g | R0 = %g | RA = %g "
    #                               "| Gauge = %s | Location(Stroke) = %g" % (volts, length, r0, ra, gauge, location))
    #                         print("Force1: %f | Force2: %f" % (force1, force2))
    #
    #                     if solenoid_solve(None, length, r0, ra, gauge, location, force1) != \
    #                             solenoid_performance(None, length, r0, ra, gauge, location, force1):
    #                         print("\nVoltage Val mismatch using: Force1 = %g - Force2 = %g | Length = %g | R0 = %g "
    #                               "| RA = %g | Gauge = %s | Location(Stroke) = %g"
    #                               % (force1, force2, length, r0, ra, gauge, location))
    #
    #                     if solenoid_solve(volts, None, r0, ra, gauge, location, force1) != \
    #                             solenoid_performance(volts, None, r0, ra, gauge, location, force1):
    #                         print("\nLength Val mismatch using: Force1 = %g - Force2 = %g | Volts = %g | R0 = %g "
    #                               "| RA = %g | Gauge = %s | Location(Stroke) = %g"
    #                               % (force1, force2, volts, r0, ra, gauge, location))
    #
    #                     if solenoid_solve(volts, length, None, ra, gauge, location, force1) != \
    #                             solenoid_performance(volts, length, None, ra, gauge, location, force1):
    #                         print("\nR0 Val mismatch using: Force1 = %g - Force2 = %g | Length = %g | Volts = %g "
    #                               "| RA = %g | Gauge = %s | Location(Stroke) = %g"
    #                               % (force1, force2, length, volts, ra, gauge, location))
    #
    #                     if solenoid_solve(volts, length, r0, None, gauge, location, force1) != \
    #                             solenoid_performance(volts, length, r0, None, gauge, location, force1):
    #                         print("\nRA Val mismatch using: Force1 = %g - Force2 = %g | Length = %g | R0 = %g "
    #                               "| Volts = %g | Gauge = %s | Location(Stroke) = %g"
    #                               % (force1, force2, length, r0, volts, gauge, location))
    volts = 5
    length = 27
    r0 = 2.3
    ra = 4.5
    gauge = "30"
    location = 0

    print("\nValues: Volts = %g | Length = %g | R0 = %g | RA = %g | Gauge = %s | Location(Stroke) = %g" % (volts, length, r0, ra, gauge, location))

    print("\nSolenoid_solve:")
    force = solenoid_solve(volts, length, r0, ra, gauge, location, None)
    print(" Force = %f (N)" % force)
    print(" Volts = %f (V)" % solenoid_solve(None, length, r0, ra, gauge, location, force))
    print(" length = %f (mm)" % solenoid_solve(volts, None, r0, ra, gauge, location, force))
    print(" R0 = %f (mm)" % solenoid_solve(volts, length, None, ra, gauge, location, force))
    print(" Ra = %f" % solenoid_solve(volts, length, r0, None, gauge, location, force))
    # print("Location = %g (mm)" % solenoid_solve(volts, length, r0, ra, gauge, None, force))

    print("\nSolenoid_peformance:")
    force = solenoid_performance(volts, length, r0, ra, gauge, location, None)
    print(" Force = %f (N)" % force)
    print(" Volts = %f (V)" % solenoid_performance(None, length, r0, ra, gauge, location, force))
    print(" length = %f (mm)" % solenoid_performance(volts, None, r0, ra, gauge, location, force))
    print(" R0 = %f (mm)" % solenoid_performance(volts, length, None, ra, gauge, location, force))
    print(" Ra = %f\n" % solenoid_performance(volts, length, r0, None, gauge, location, force))

    print(solenoid_range(None, length, r0, ra, gauge, location, None, "volts", 1, 10, 1))
    print(solenoid_range(volts, None, r0, ra, gauge, location, None, "length", 20, 30, 1))
    print(solenoid_range(volts, length, None, ra, gauge, location, None, "r0", 2.0, 3.0, 0.1))
    print(solenoid_range(volts, length, r0, None, gauge, location, None, "ra", 4.0, 5.0, 0.1))
    print(solenoid_range(volts, length, r0, ra, None, location, None, "gauge"))
    print(solenoid_range(volts, length, r0, ra, gauge, None, None, "location", 0, 10.0, 1))

