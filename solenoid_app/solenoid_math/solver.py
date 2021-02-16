from sympy import symbols, solve, lambdify
import numpy as np
from solenoid_app.solenoid_math.exceptions import TooManyVariables, IncorrectDataType, NoSolution
from scipy import optimize
from math import floor
from . import ureg

# Catch divide by 0 errors
import warnings
warnings.filterwarnings("error")

# Wire Gauge constants for copper
# Resistance per unit length and cross-sectional area
AWG_DATA = {
    #        mili Ohms / meter     milimeters^2
    "0000": {"resistance": 0.1608, "area": 107},
    "000":  {"resistance": 0.2028, "area": 85.0},
    "00":   {"resistance": 0.2557, "area": 67.4},
    "0":    {"resistance": 0.3224, "area": 53.5},
    "1":    {"resistance": 0.4066, "area": 42.4},
    "2":    {"resistance": 0.5127, "area": 33.6},
    "3":    {"resistance": 0.6465, "area": 26.7},
    "4":    {"resistance": 0.8152, "area": 21.2},
    "5":    {"resistance": 1.028,  "area": 16.8},
    "6":    {"resistance": 1.296,  "area": 13.3},
    "7":    {"resistance": 1.634,  "area": 10.5},
    "8":    {"resistance": 2.061,  "area": 8.37},
    "9":    {"resistance": 2.599,  "area": 6.63},
    "10":   {"resistance": 3.277,  "area": 5.26},
    "11":   {"resistance": 4.132,  "area": 4.17},
    "12":   {"resistance": 5.211,  "area": 3.31},
    "13":   {"resistance": 6.571,  "area": 2.62},
    "14":   {"resistance": 8.286,  "area": 2.08},
    "15":   {"resistance": 10.45,  "area": 1.65},
    "16":   {"resistance": 13.17,  "area": 1.31},
    "17":   {"resistance": 16.61,  "area": 1.04},
    "18":   {"resistance": 20.95,  "area": 0.823},
    "19":   {"resistance": 26.42,  "area": 0.653},
    "20":   {"resistance": 33.31,  "area": 0.518},
    "21":   {"resistance": 42.00,  "area": 0.410},
    "22":   {"resistance": 52.96,  "area": 0.326},
    "23":   {"resistance": 66.79,  "area": 0.258},
    "24":   {"resistance": 84.22,  "area": 0.205},
    "25":   {"resistance": 106.2,  "area": 0.162},
    "26":   {"resistance": 133.9,  "area": 0.129},
    "27":   {"resistance": 168.9,  "area": 0.102},
    "28":   {"resistance": 212.9,  "area": 0.0810},
    "29":   {"resistance": 268.5,  "area": 0.0642},
    "30":   {"resistance": 338.6,  "area": 0.0509},
    "31":   {"resistance": 426.9,  "area": 0.0404},
    "32":   {"resistance": 538.3,  "area": 0.0320},
    "33":   {"resistance": 678.8,  "area": 0.0254},
    "34":   {"resistance": 856.0,  "area": 0.0201},
    "35":   {"resistance": 1079,   "area": 0.0160},
    "36":   {"resistance": 1361,   "area": 0.0127},
    "37":   {"resistance": 1716,   "area": 0.0100},
    "38":   {"resistance": 2164,   "area": 0.00797},
    "39":   {"resistance": 2729,   "area": 0.00632},
    "40":   {"resistance": 3441,   "area": 0.00501}
}

# Permeability constants
# TODO: allow variable relative permeabilities to allow users to match their core
PERM_FREE = 1.257 * (10 ** -6)
PERM_RELATIVE = 350

"""
Solves for a single missing variable within the solenoid force equation.

The variable being solved for is inputted as a None value. All other
arguments are then required and cannot be None

Parameters:
    volts (float | None): Voltage applied to the solenoid - Volts
    length (float | None): Overall length of the solenoid coil - Millimeters
    r0 (float | None): Inner radius of the solenoid coil - Millimeters
    ra (float | None): Outer radius of the solenoid coil - Millimeters
    gauge (string): A value between "0000" -> "40"
    location (float | None): Location (Stroke) of the solenoid core within the coil - Millimeters
    force (float | None): The force produced by the solenoid - Newtons

Returns:
    result (float): The solved value of specified variable
"""
def solenoid_solve(volts, length, r0, ra, gauge, location, force):
    # verify only 1 argument is being solved for
    none_count = sum(isinstance(arg, type(None)) for arg in [volts, length, r0, ra, gauge, location, force])
    if none_count > 1:
        raise TooManyVariables

    for arg in ['volts', 'length', 'r0', 'ra', 'location', 'force']:
        if not isinstance(locals()[arg], (type(None), int, float)):
            raise IncorrectDataType(type(arg).__name__, arg)

    if type(gauge) is not str:
        raise IncorrectDataType(type(gauge).__name__, "gauge")

    result = None
    a = np.log(PERM_RELATIVE)
    f, v, l, R0, RA, x = symbols('f v l R0 RA x')

    # Generalized equation
    eq1 = ((v ** 2) * PERM_RELATIVE * PERM_FREE) / (
            8 * np.pi * ((AWG_DATA[gauge]["resistance"] / 1000) ** 2) * ((l / 1000) ** 2))
    eq2 = ((R0 / 1000) ** 2 / (RA / 1000) ** 2)
    eq3 = np.e ** (-(a / (l / 1000)) * (x / 1000))

    # Set equation equal to 0
    origin_eq = (eq1 * eq2 * eq3 * a) - f

    # Solve for specified variable

    if volts is None:
        origin_eq = origin_eq.subs(l, length)
        origin_eq = origin_eq.subs(R0, r0)
        origin_eq = origin_eq.subs(RA, ra)
        origin_eq = origin_eq.subs(x, location)
        origin_eq = origin_eq.subs(f, force)
        result = solve(origin_eq, v)

    elif length is None:
        origin_eq = origin_eq.subs(v, volts)
        origin_eq = origin_eq.subs(R0, r0)
        origin_eq = origin_eq.subs(RA, ra)
        origin_eq = origin_eq.subs(x, location)
        origin_eq = origin_eq.subs(f, force)
        result = solve(origin_eq, l)

    elif r0 is None:
        origin_eq = origin_eq.subs(v, volts)
        origin_eq = origin_eq.subs(RA, ra)
        origin_eq = origin_eq.subs(l, length)
        origin_eq = origin_eq.subs(x, location)
        origin_eq = origin_eq.subs(f, force)
        result = solve(origin_eq, R0)

    elif ra is None:
        origin_eq = origin_eq.subs(v, volts)
        origin_eq = origin_eq.subs(R0, r0)
        origin_eq = origin_eq.subs(l, length)
        origin_eq = origin_eq.subs(x, location)
        origin_eq = origin_eq.subs(f, force)
        result = solve(origin_eq, RA)

    elif location is None:
        # TODO: handle with error (here or at frontend)
        origin_eq = origin_eq.subs(v, volts)
        origin_eq = origin_eq.subs(R0, r0)
        origin_eq = origin_eq.subs(RA, ra)
        origin_eq = origin_eq.subs(l, length)
        origin_eq = origin_eq.subs(f, force)
        # result = solve(origin_eq, x)
        result = -1

    elif force is None:
        origin_eq = origin_eq.subs(v, volts)
        origin_eq = origin_eq.subs(R0, r0)
        origin_eq = origin_eq.subs(RA, ra)
        origin_eq = origin_eq.subs(x, location)
        origin_eq = origin_eq.subs(l, length)
        result = solve(origin_eq, f)

    # Return the correctly signed value due to solving squares in function
    if len(result) == 2:
        return float(result[1])
    else:
        return float(result[0])


"""
Solves directly for a single missing variable within the solenoid force equation.

Performs much faster than the sympy equivalents in solenoid_solve

The variable being solved for is inputted as a None value. All other
arguments are then required and cannot be None

Parameters:
    volts (float | None): Voltage applied to the solenoid - Volts
    length (float | None): Overall length of the solenoid coil - Meters
    r0 (float | None): Inner radius of the solenoid coil - Meters
    ra (float | None): Outer radius of the solenoid coil - Meters
    gauge (string): A value between "0000" -> "40"
    location (float | None): Location (Stroke) of the solenoid core within the coil - Meters
    force (float | None): The force produced by the solenoid - Newtons

Returns:
    result (float): The solved value of specified variable
"""
def solenoid_performance(volts, length, r0, ra, gauge, location, force):
    result = None
    a = np.log(PERM_RELATIVE)

    # verify outer radius is not smaller than inner radius
    if ra is not None and r0 is not None:
        if ra < r0:
            raise NoSolution

    if volts is None:
        try:
            result = (2 * np.sqrt(2 * np.pi) * np.sqrt(force) * (
                        AWG_DATA[gauge]["resistance"] / 1000) * length * ra * np.e ** ((location * a) / (2 * length))) / (
                                 r0 * np.sqrt(PERM_RELATIVE) * np.sqrt(PERM_FREE) * np.sqrt(a))
        except RuntimeError:
            raise NoSolution
        except RuntimeWarning:
            raise NoSolution

    elif length is None:

        if location == 0:
            try:
                result = (np.sqrt(a) * r0 * np.sqrt(PERM_FREE) * np.sqrt(PERM_RELATIVE) * volts) / (
                        2 * np.sqrt(2 * np.pi) * np.sqrt(force) * (AWG_DATA[gauge]["resistance"] / 1000) * ra)
            except RuntimeError:
                raise NoSolution
            except RuntimeWarning:
                raise NoSolution

        else:
            # THIS IS NOT THE SOLUTION, TEMPORARY PLACE HOLDER UNTIL WE DISCOVER THE CORRECT WAY OF SOLVING THIS!!!
            try:
                x = symbols('x')
                func = (((volts ** 2) * PERM_FREE * PERM_RELATIVE) / (
                            8 * np.pi * ((AWG_DATA[gauge]["resistance"] / 1000) ** 2) * (x ** 2))) * (
                               (r0 / ra) ** 2) * a * np.e ** (-1 * (a / x) * location) - force

                f = lambdify(x, func, modules=["scipy", "numpy"])
                funcPrime = func.diff(x)
                fder = lambdify(x, funcPrime, modules=["scipy", "numpy"])
                funcPrime2 = funcPrime.diff(x)
                fder2 = lambdify(x, funcPrime2, modules=["scipy", "numpy"])
                result = optimize.newton(fder, 0.5, fprime=fder, fprime2=fder2, maxiter=1000)
            except OverflowError:
                raise NoSolution
            except RuntimeError:
                raise NoSolution
            except RuntimeWarning:
                raise NoSolution

    elif r0 is None:
        try:
            result = (2 * np.sqrt(2 * np.pi) * np.sqrt(force) * (
                        AWG_DATA[gauge]["resistance"] / 1000) * length * ra * np.e ** ((location * a) / (2 * length))) / (
                                 np.sqrt(PERM_RELATIVE) * np.sqrt(PERM_FREE) * volts * np.sqrt(a))

            # verify outer radius is not smaller than inner radius
            if ra < result:
                raise NoSolution
        except RuntimeError:
            raise NoSolution
        except RuntimeWarning:
            raise NoSolution

    elif ra is None:
        try:
            result = (r0 * np.sqrt(PERM_RELATIVE) * np.sqrt(PERM_FREE)) * volts * np.sqrt(a) * np.e ** -(
                        (location * a) / (2 * length)) / (
                                 2 * np.sqrt(2 * np.pi) * np.sqrt(force) * (AWG_DATA[gauge]["resistance"] / 1000) * length)
            # verify outer radius is not smaller than inner radius
            if result < r0:
                raise NoSolution
        except RuntimeError:
            raise NoSolution
        except RuntimeWarning:
            raise NoSolution

    elif location is None:

        try:
            x = symbols('x')
            func = (((volts ** 2) * PERM_FREE * PERM_RELATIVE) / (
                        8 * np.pi * ((AWG_DATA[gauge]["resistance"] / 1000) ** 2) * (length ** 2))) * (
                               (r0 / ra) ** 2) * a * np.e ** (-1 * (a / length * x)) - force

            f = lambdify(x, func, modules=["numpy", "scipy"])
            funcPrime = func.diff(x)
            fder = lambdify(x, funcPrime, modules=["numpy", "scipy"])
            result = (optimize.newton(f, 0, fprime=fder, maxiter=1000))
        except OverflowError:
            raise NoSolution
        except RuntimeError:
            raise NoSolution
        except RuntimeWarning:
            raise NoSolution

    elif force is None:

        try:
            result = ((volts ** 2) * PERM_RELATIVE * PERM_FREE) / (
                        8 * np.pi * ((AWG_DATA[gauge]["resistance"] / 1000) ** 2) * (length ** 2)) * (
                                 r0 ** 2 / ra ** 2) * np.e ** (-(a / length) * location) * a
        except RuntimeError:
            raise NoSolution
        except RuntimeWarning:
            raise NoSolution

    return result


"""
Solves for a single missing variable over a range of values provided for 1 other variable

The independent variable and the variable to solve for are both inputted as None. The independent
variable is selected by entering variable the name for the idv argument.

Parameters:
    volts (float | None): Voltage applied to the solenoid - Volts
    length (pint Quantity | None): Overall length of the solenoid coil
    r0 (pint Quantity | None): Inner radius of the solenoid coil
    ra (pint Quantity | None): Outer radius of the solenoid coil
    gauge (string): A value between "0000" -> "40"
    location (pint Quantity | None): Location (Stroke) of the solenoid core within the coil - Meters
    force (pint Quantity | None): The force produced by the solenoid - Newtons
    output_unit (string): unit identifier string the dependant variable - e.x.: "mm", "meters", "lbf", etc...
    idv (string): Independent variable - one of ["volts", "length", "r0", "ra", "force", "gauge", "location"]
    idv_unit (string): unit identifier string the independent variable
    start (int | float): Starting value of the independent variable range
    stop (int | float): Stopping value of the independent variable range
    step (int | float): range granularity

Returns:
    result (list of tuples): A list of tuples containing (x, y) pairs for graphing
"""
def solenoid_range(volts, length, r0, ra, gauge, location, force, output_unit,idv, idv_unit, start=0.0, stop=1.0, step=1.0):
    result = []

    if idv == "voltage":
        for i in list(np.arange(start, stop, step)):
            try:
                result.append((i, solenoid_convert(i, length, r0, ra, gauge, location, force, output_unit)))
            except NoSolution:
                pass

    elif idv == "length":
        for i in list(np.arange(start, stop, step)):
            value = i * ureg(idv_unit)
            try:
                result.append((i, solenoid_convert(volts, value, r0, ra, gauge, location, force, output_unit)))
            except NoSolution:
                pass

    elif idv == "r0":
        for i in list(np.arange(start, stop, step)):
            value = i * ureg(idv_unit)
            try:
                result.append((i, np.around(solenoid_convert(volts, length, value, ra, gauge, location, force, output_unit), decimals=2)))
            except NoSolution:
                pass

    elif idv == "ra":
        for i in list(np.arange(start, stop, step)):
            value = i * ureg(idv_unit)
            try:
                result.append((i, np.around(solenoid_convert(volts, length, r0, value, gauge, location, force, output_unit), decimals=2)))
            except NoSolution:
                pass

    elif idv == "force":
        for i in list(np.arange(start, stop, step)):
            value = i * ureg(idv_unit)
            try:
                result.append((i, solenoid_convert(volts, length, r0, ra, gauge, location, value, output_unit)))
            except NoSolution:
                pass

    elif idv == "gauge":
        for item in AWG_DATA.keys():
            try:
                result.append((item, solenoid_convert(volts, length, r0, ra, item, location, force, output_unit)))
            except NoSolution:
                pass

    elif idv == "x":
        for i in list(np.arange(start, stop, step)):
            value = i * ureg(idv_unit)
            try:
                result.append((i, solenoid_convert(volts, length, r0, ra, gauge, value, force, output_unit)))
            except NoSolution:
                pass

    return result


"""
Wrapper for solenoid_performance. This function takes in values of differing units, converts them to base SI units, then
solves for the specified parameter. When a solution is found, it is converted back to the expected output units.

The variable being solved for is inputted as a None value. All other
arguments are then required and cannot be None

Parameters:
    volts (float | None): Voltage applied to the solenoid - Volts
    length (pint Quantity | None): Overall length of the solenoid coil
    r0 (pint Quantity | None): Inner radius of the solenoid coil
    ra (pint Quantity | None): Outer radius of the solenoid coil
    gauge (string): A value between "0000" -> "40"
    location (pint Quantity | None): Location (Stroke) of the solenoid core within the coil
    force (pint Quantity | None): The force produced by the solenoid
    output_unit (string): unit identifier string the result - e.x.: "mm", "meters", "lbf", etc...

Returns:
    result (float): The solved value of specified variable
"""
def solenoid_convert(volts, length, r0, ra, gauge, location, force, output_unit):

    chosen = None

    # convert all entered parameters to base SI units
    if length is not None:
        length = length.to_base_units()
        length = float(length.magnitude)
    else:
        chosen = "length"

    if r0 is not None:
        r0 = r0.to_base_units()
        r0 = float(r0.magnitude)
    else:
        chosen = "r0"

    if ra is not None:
        ra = ra.to_base_units()
        ra = float(ra.magnitude)
    else:
        chosen = "ra"

    if location is not None:
        location = location.to_base_units()
        location = float(location.magnitude)
    else:
        chosen = "location"

    if force is not None:
        force = force.to_base_units()
        force = float(force.magnitude)
    else:
        chosen = "force"

    if volts is None:
        chosen = "volts"

    result = solenoid_performance(volts, length, r0, ra, gauge, location, force)

    # convert result to expected units
    if chosen in ["length", "r0", "ra", "location"]:
        result = result * ureg.meters
        result.ito(ureg(output_unit))
        result = float(result.magnitude)
        if result < 0 and floor(abs(result)) != 0:
            raise NoSolution
        return abs(result)

    elif chosen == "force":
        result = result * ureg.newtons
        result.ito(ureg(output_unit))
        result = float(result.magnitude)
        if result < 0 and floor(abs(result)) != 0:
            raise NoSolution
        return abs(result)

    elif chosen == "volts":
        result = float(result)
        if result < 0 and floor(abs(result)) != 0:
            raise NoSolution
        return abs(result)
