import json
import pathlib
import os
from selenium.webdriver.chrome.options import Options
from django.test import tag
from selenium_tests.selenium_test_base import SeleniumTestBase

URL = "http://localhost:8000/"
PATH = str(pathlib.Path().absolute())
query_parameters = ["voltage", "length", "r0", "ra", "x", "force", "awg", "relative_permeability"]


@tag('storage')
class TestStorage(SeleniumTestBase):
    def __init__(self, methods):
        super().__init__(methods)

    def test_if_upload_successfully(self):
        """ Test that upload file that assign correct value to input section """
        inputs = [
            {'name': 'voltage', 'value': '5', 'unit': ''},
            {'name': 'length', 'value': '5', 'unit': 'mm'},
            {'name': 'r0', 'value': '5', 'unit': 'mm'},
            {'name': 'ra', 'value': '5', 'unit': 'mm'},
            {'name': 'x', 'value': '5', 'unit': 'mm'},
            {'name': 'force', 'value': '5', 'unit': 'N'},
            {'name': 'awg', 'value': '5', 'unit': ''},
            {'name': 'relative_permeability', 'value': '5'},
        ]
        path = PATH + '/selenium_tests/'

        filename = 'test.json'
        with open(path + filename, 'w') as outfile:
            json.dump(inputs, outfile)

        self.driver.find_element_by_id('upload-data').send_keys(path + filename)

        for _ in query_parameters:
            self.assertEqual(self.driver.find_element_by_id("input-text-" + _).get_attribute('value'), '5')

            if _ in ['length', 'r0', 'ra', 'x']:
                self.assertEqual(self.driver.find_element_by_id("input-unit-" + _).get_attribute('value'), 'mm')

            if _ == 'force':
                self.assertEqual(self.driver.find_element_by_id("input-unit-force").get_attribute('value'), 'N')

        os.remove(path + filename)

    def test_if_download_successfully(self):
        """ Test that download file that contains correct information """

        self.chrome_options = Options()
        prefs = {"download.default_directory": PATH}

        self.chrome_options.add_experimental_option("prefs", prefs)
        test_value = "10"
        query_string = "?"
        for query_parameter in query_parameters:
            query_string += query_parameter + "=" + test_value + "&"
        query_string = query_string[:-1]

        self.driver.get(URL + query_string)
        self.driver.find_element_by_id("saving-data").click()
        for query_parameter in query_parameters:
            self.assertEqual(self.driver.find_element_by_id("input-text-" + query_parameter).get_attribute('value'),
                             test_value)

        with open(PATH + '/parameters.json') as f:
            data = json.load(f)
            for item in data:
                self.assertEqual(item['value'], test_value)

                if item['name'] in ['length', 'r0', 'ra', 'x']:
                    self.assertEqual(item['unit'], 'mm')

                if item['name'] == 'force':
                    self.assertEqual(item['unit'], 'N')

        os.remove(PATH + '/parameters.json')

    """
    def test_if_copy_link_successfully(self):
        self.driver.find_element_by_id("copy-link").click()
        time.sleep(2)
        text = clipboard.paste()
        self.assertEqual(URL, text)
    """
