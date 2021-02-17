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

