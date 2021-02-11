# To run these tests, it is required that you perform the following two actions first:
#   1. Install selenium webdriver and add it to your path variable
#       https://zwbetz.com/download-chromedriver-binary-and-add-to-your-path-for-automated-functional-testing/
#   2. Start the server running locally at the URL "http://localhost:8000/"

from selenium import webdriver
from django.test import LiveServerTestCase, tag
from selenium.webdriver.common.keys import Keys
from selenium_tests.selenium_test_base import SeleniumTestBase


URL = "http://localhost:8000/"

@tag('ui')
class TestUnitSelectTag(SeleniumTestBase):
    """ Test unit select field"""

    def __init__(self, methods):
        super().__init__(methods)

    def test_select_tag_is_created(self):
        """ Test every unit's select field and options are exist, and the selected value changed correctly """

        units = ['mm', 'cm', 'm', 'inch', 'feet']
        parameters = ['length','r_not','r_a','x']
        for parameter in parameters :
            index = 1
            for unit in units :
                self.driver.find_element_by_xpath(".//*[@id='input-unit-" + parameter + "']/option[" + str(index) + "]").click()
                index += 1
                self.assertEqual(self.driver.find_element_by_id("input-unit-" + parameter).get_attribute('value'),unit)

        self.driver.find_element_by_xpath(".//*[@id='input-unit-force']/option[1]").click()
        self.assertEqual(self.driver.find_element_by_id("input-unit-force").get_attribute('value'), 'N')
        self.driver.find_element_by_xpath(".//*[@id='input-unit-force']/option[2]").click()
        self.assertEqual(self.driver.find_element_by_id("input-unit-force").get_attribute('value'), 'lbf')
