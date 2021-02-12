
from selenium import webdriver
from django.test import LiveServerTestCase, tag
from selenium.webdriver.common.keys import Keys
from selenium_tests.selenium_test_base import SeleniumTestBase
import time

@tag('ui')
class TestFormInput(SeleniumTestBase):
    """ UI Tests for solenoid chart """

    def __init__(self, methods):
        super().__init__(methods)

    def test_populate_defaults_button(self):
        self.driver.find_element_by_id("populate-defaults-button").click()
        time.sleep(10)
        graph_form_inputs = {"x": "Voltage", "y": "Force"}
        calculate_form_inputs = {"voltage": "5", "length": "27", "r0": "2.3", "ra": "4.5", "x": "0", "force": "", "awg": "30"}
        for key, value in calculate_form_inputs.items():
            self.assertEqual(self.driver.find_element_by_id("input-text-" + key).get_attribute('value'), value)
