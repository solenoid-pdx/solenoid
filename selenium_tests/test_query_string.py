# To run these tests, it is required that you perform the following two actions first:
#   1. Install selenium webdriver and add it to your path variable
#       https://zwbetz.com/download-chromedriver-binary-and-add-to-your-path-for-automated-functional-testing/
#   2. Start the server running locally at the URL "http://localhost:8000/"

from selenium import webdriver
from django.test import LiveServerTestCase, tag
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.select import Select
from selenium_tests.selenium_test_base import SeleniumTestBase


URL = "http://localhost:8000/"

@tag('ui')
class TestUI(SeleniumTestBase):
    """UI Tests"""

    def __init__(self, methods):
        super().__init__(methods)
    
    def test_query_string_fills_form_fields(self):
        """ Test that passing in a query string to the end of a URL fills out the form """

        testValue = "5"
        queryParameters = ["voltage", "length", "r0", "ra", "x", "force", "awg", "relative_permeability"]
        queryString = "?"
        for queryParameter in queryParameters:
            queryString += queryParameter + "=" + testValue + "&"
        queryString = queryString[:-1]
        self.driver.get(URL + queryString)
        for queryParameter in queryParameters:
            self.assertEqual(self.driver.find_element_by_id("input-text-" + queryParameter).get_attribute('value'), testValue)

    def test_calculate_creates_query_string(self):
        """ Test that query string is updated after performing calculation """

        testValue = "6"
        queryString = "?"
        data = [
            {'name': 'voltage', 'value': testValue},
            {'name': 'length', 'value': testValue, 'unit': 'mm'},
            {'name': 'r0', 'value': testValue, 'unit': 'mm'},
            {'name': 'ra', 'value': testValue, 'unit': 'mm'},
            {'name': 'x', 'value': testValue, 'unit': 'mm'},
            {'name': 'force', 'value': '', 'unit': 'N'},
            {'name': 'awg', 'value': testValue},
            {'name': 'relative_permeability', 'value': testValue}
        ]

        for d in data:
            name = d.get('name')
            value = d.get('value')
            unit = d.get('unit')
            self.driver.find_element_by_id('input-text-' + name).send_keys(value)
            queryString += name + "=" + (value if name != 'force' else '0') + "&"
            if unit:
                self.driver.find_element_by_id('input-unit-' + name).send_keys(unit)
                queryString += name + "_unit=" + unit + "&"
        self.driver.find_element_by_xpath('//*[@id="input-submit-form"]/input[2]').click()
        
        queryString = queryString[:-1]
        self.assertEqual(self.driver.current_url, URL + queryString)
    
    def test_query_string_not_updated_invalid_calculate(self):
        """ Test that on an invalid calculation request the query string is not updated. """

        testValue = "7"
        formParameters = ["voltage", "length", "r0", "ra", "force", "x"]
        for formParameter in formParameters:
            self.driver.find_element_by_id('input-text-' + formParameter).send_keys(testValue)
        self.driver.find_element_by_xpath('//*[@id="input-submit-form"]/input[2]').click()
        self.assertEqual(self.driver.current_url, URL)

    def test_query_string_sets_graph_values(self):
        """ Test queery string correctly sets all graphing fields """

        x_value = "Voltage"
        y_value = "Force"
        step = '2'
        x_start = '2'
        x_end = '30'
        newUrl = URL + '?x_graph=' + x_value.lower() + '&y_graph=' + y_value.lower() + "&step=" + step + "&x_start=" + x_start + '&x_end=' + x_end

        self.driver.get(newUrl)
        x_input = Select(self.driver.find_element_by_id('x-values-input'))
        y_input = Select(self.driver.find_element_by_id('y-values-input'))
        self.assertEqual(x_input.first_selected_option.text, x_value)
        self.assertEqual(y_input.first_selected_option.text, y_value)
        self.assertEqual(self.driver.find_element_by_id('step-input').get_attribute('value'), step)
        self.assertEqual(self.driver.find_element_by_id('x-value-range').get_attribute('value'), x_start + ' - ' + x_end)