
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

    def test_x_input_resricts_y(self):
        """ Test that selecting a value for x to graph restricts the user from selecting that value for y. """

        display_none_style = "display: none;"
        x_values = ["Voltage", "Length", "r0", "ra", "x", "Force"]
        for x_value in x_values:
            self.driver.find_element_by_id("option-x-" + x_value).click()
            # The following line is commented out because is_displayed was returning true?
            # self.assertFalse(self.driver.find_element_by_id("option-y-" + x_value).is_displayed())
            style_attribute = self.driver.find_element_by_id("option-y-" + x_value).get_attribute("style")
            self.assertEqual(display_none_style, style_attribute)