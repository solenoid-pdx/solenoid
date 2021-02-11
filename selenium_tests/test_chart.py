
from selenium import webdriver
from django.test import LiveServerTestCase, tag
from selenium.webdriver.common.keys import Keys
from selenium_tests.selenium_test_base import SeleniumTestBase

@tag('ui')
class TestChart(SeleniumTestBase):
    """ UI Tests for solenoid chart """

    def __init__(self, methods):
        super().__init__(methods)

    def test_chart_is_rendered(self):
        """ Test that after clicking the graph button that the chart gets rendered. """
        
        self.driver.find_element_by_xpath("//*[@id='calc-container']/button").click()
        self.driver.find_element_by_xpath("//*[@id='graph-select']/button").click()
        self.assertTrue(self.driver.find_element_by_id("voltage-Chart").is_enabled())