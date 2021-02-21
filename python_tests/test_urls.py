# Write unit/integration tests here using the following:
# - Class extending either SimpleTestCase || TestCase from django.test
# - class methods with the naming convention beginning with "test_" and using snake_case

# See the official docs for writing and executing test cases here:
# https://docs.djangoproject.com/en/3.1/topics/testing/overview/

import unittest
from django.test import SimpleTestCase, Client, tag, RequestFactory
from django.urls import reverse, resolve
from ast import literal_eval
from django.http import QueryDict
from solenoid_app.views import indexView, voltageChart, formHandle
from solenoid.urls import INDEX_URL_NAME, FORM_HANDLE_URL_NAME, VOLTAGE_CHART_URL_NAME

STATUS_CODE_200 = 200

@tag('unit')
class TestUrls(SimpleTestCase):
    """Url Tests"""

    def __init__(self, methodName):
        super().__init__(methodName)
        self.client = Client()
        self.factory = RequestFactory()

    # This method is automatically invoked before each test case is run. Use when necessary
    def setUp(self):
        pass

    # This method is automatically invoked after each test case is run. Use when necessary
    def tearDown(self):
        pass

    def test_base_url_is_resolved(self):
        # You can use doc strings to give your tests a human readable name when executing
        """Test '/' url resolves"""

        url = reverse(INDEX_URL_NAME)
        self.assertEqual(resolve(url).func, indexView)
    
    def test_base_url_response_code(self):
        """Assert 200 response code on base '/' url request"""

        url = reverse(INDEX_URL_NAME)       
        response = self.client.get(url)
        self.assertEqual(response.status_code, STATUS_CODE_200)
    
    def test_form_handle_route_is_resolved(self):
        """ [DPN-53] - Assert that the 'formHandle/' route resolves """

        url = reverse(FORM_HANDLE_URL_NAME)
        self.assertEqual(resolve(url).func, formHandle)
    
    def test_form_handle_200_status_code(self):
        """ Assert 200 response code on 'formHandle' url request """

        url = reverse(FORM_HANDLE_URL_NAME)
        data = "[{'voltage': '5', 'length': '27', 'r0': '2.3', 'ra': '4.5', 'x': '0', 'force': '', 'awg': '30', 'relative_permeability': '350', 'compute': 'force', 'xGraph': 'voltage', 'length_unit': 'mm', 'r0_unit': 'mm', 'ra_unit': 'mm', 'x_unit': 'mm', 'force_unit': 'newton'}]"
        data = literal_eval(data)
        qd = QueryDict(mutable=True)
        for item in data:
            qd.update(item)
        
        request = self.factory.post(url)
        request.POST = qd
        response = formHandle(request)
        self.assertEqual(response.status_code, STATUS_CODE_200)

    def test_voltage_chart_route_is_resolved(self):
        """ Assert that the 'voltageChart/' route resolves """

        url = reverse(VOLTAGE_CHART_URL_NAME)
        self.assertEqual(resolve(url).func, voltageChart)
    
    def test_voltage_chart_200_status_code(self):
        """ Assert 200 response code on 'voltageChart' url request """

        url = reverse(VOLTAGE_CHART_URL_NAME)
        data = "[{'voltage': '5', 'length': '27', 'r0': '2.3', 'ra': '4.5', 'x': '0', 'force': '0', 'awg': '30', 'relative_permeability': '350', 'compute': 'force', 'xGraph': 'voltage', 'length_unit': 'mm', 'r0_unit': 'mm', 'ra_unit': 'mm', 'x_unit': 'mm', 'force_unit': 'newton'}]"
        data = literal_eval(data)
        qd = QueryDict(mutable=True)
        for item in data:
            qd.update(item)
        
        request = self.factory.post(url)
        request.POST = qd
        response = voltageChart(request)
        self.assertEqual(response.status_code, STATUS_CODE_200)