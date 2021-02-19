# Write unit/integration tests here using the following:
# - Class extending either SimpleTestCase || TestCase from django.test
# - class methods with the naming convention beginning with "test_" and using snake_case

# See the official docs for writing and executing test cases here:
# https://docs.djangoproject.com/en/3.1/topics/testing/overview/

import unittest
from django.test import SimpleTestCase

from solenoid_app.solenoid_math.solver import solenoid_convert
from . import ureg

class TestSolver(SimpleTestCase):
    def setUp(self) -> None:
        pass

    def tearDown(self) -> None:
        pass

    def test_convert_from_imperial_to_SI(self):
        r0 = 4.3        #inch
        ra = 4.5        #inch
        length = 5      #inch
        location = 2    #inch
        force = 8       #pound
        
        converted_r0 = 0.10922      #meter
        converted_ra = 0.1143       #meter
        converted_length = 0.127    #meter
        converted_location = 0.0508 #meter
        converted_force = 35.58577  #newton

        r0 = r0 * ureg.inch
        r0.ito_base_units()
        r0 = float(r0.magnitude)

        ra = ra * ureg.inch
        ra.ito_base_units()
        ra = float(ra.magnitude)

        length = length * ureg.inch
        length.ito_base_units()
        length = float(length.magnitude)

        location = location * ureg.inch
        location.ito_base_units()
        location = float(location.magnitude)

        force = force * ureg.lbf
        force.ito_base_units()
        force = float(force.magnitude)
        self.assertAlmostEqual(converted_r0,r0,4)
        self.assertAlmostEqual(converted_ra,ra,4)
        self.assertAlmostEqual(converted_length,length,4)
        self.assertAlmostEqual(converted_location,location,4)
        self.assertAlmostEqual(converted_force,force,4)

    """
        -All units are in SI
        -Simple test case for solving for force
    """
    def test_solve_for_force_mm_n(self):
        result = solenoid_convert(5, 27 * ureg.millimeter, 2.3 * ureg.millimeter, 4.5 * ureg.millimeter,"30", 0 * ureg.millimeter,None,'newton')
        self.assertAlmostEqual(result,8.01266,4)


    """
        -length will be in millimeter
        -r0 will in inches
        -ra will be in meter
        -output force will be in pound
        -The input units are all converted manually to their respective measurement based on the test set that we have.
    """
    def test_solve_for_force_multiple_units(self):
        result = solenoid_convert(5, 27 * ureg.millimeter, 0.09055118 * ureg.inch, 0.0045 * ureg.meter, "30", 0 * ureg.millimeter, None, 'lbf')
        self.assertAlmostEqual(result,1.8013,4) #Comparing the result to the pre-converted answer from newton to lbl

    """
        -Similar to the above test function,
        -force will be in lbf
    """
    def test_solve_for_volt_multiple_units(self):
        result = solenoid_convert(None, 27 * ureg.millimeter, 0.09055118 * ureg.inch, 0.0045 * ureg.meter, "30", 0 * ureg.millimeter, 1.80131 * ureg.lbf, 'volt')
        self.assertAlmostEqual(result,5.0,2)

    """
        -Similar to the above testings function
        -Test the equation for solving location (newton's method)
    """
    def test_solve_for_length_multiple_units(self):
        result = solenoid_convert(5, None, 0.09055118 * ureg.inch, 0.0045 * ureg.meter, "30", 0 * ureg.millimeter, 1.80131 * ureg.lbf, 'millimeter')
        self.assertAlmostEqual(result,27.0,2)

    """
        -Testing for r0 with the expected output in millimeter
    """
    def test_solve_for_r0_multiple_units(self):
        result = solenoid_convert(5, 27 * ureg.millimeter, None, 0.0045 * ureg.meter, "30", 0 * ureg.millimeter, 1.80131 * ureg.lbf, 'millimeter')
        self.assertAlmostEqual(result, 2.3, 2)

    """
        -Solving for length with length that is non zero
        -For even more sauce, we're doing it with mix ups units!!!
        -r0 will be in inches 2.3 mm -> 0.0905518
        -ra will be in standard millimeter
        -force will be in pound force
        -location will be in meter
        -The resulting length will be in millimeter
        -Implementing delta instead of correctness by decimal places since the conversion and inaccurary of newton method will affect the result
    """ 
    def test_solve_for_length_nonzero_location(self):
        result = solenoid_convert(5, None, 0.09055118 * ureg.inch, 4.5 * ureg.millimeter, "30", 0.05 * ureg.meter, 0.00550422 * ureg.lbf, 'millimeter')
        self.assertAlmostEqual(result,300.0,None,"Not equal",0.5)