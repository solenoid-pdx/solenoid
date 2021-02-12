import json
import pathlib
import os
from selenium import webdriver
from django.test import LiveServerTestCase, tag
from selenium.webdriver.chrome.options import Options

URL = "http://localhost:8000/"


@tag('storage')
class TestStorage(LiveServerTestCase):
    def __init__(self, methods):
        super().__init__(methods)
        chrome_options = Options()
        chrome_options.add_argument("--headless")
        self.driver = webdriver.Chrome(chrome_options=chrome_options)

        # This method is automatically invoked before each test case is run.

    def setUp(self):
        self.driver.get(URL)
        # This method is automatically invoked after each test case is run.

    def tearDown(self):
        self.driver.quit()

    def test_if_upload_successfully(self):
        inputs = [
            {'name': 'voltage', 'value': '5'},
            {'name': 'length', 'value': '5'},
            {'name': 'r_not', 'value': '5'},
            {'name': 'r_a', 'value': '5'},
            {'name': 'x', 'value': '5'},
            {'name': 'force', 'value': '5'},
            {'name': 'awg', 'value': '5'},
        ]
        path = str(pathlib.Path().absolute()) + '/selenium_tests/'

        filename = 'test.json'
        with open(path + filename, 'w') as outfile:
            json.dump(inputs, outfile)

        self.driver.find_element_by_id('upload-data').send_keys(path + filename)
        variable = ["voltage", "length", "r_not", "r_a", "x", "force", "awg"]

        for _ in variable:
            self.assertEqual(self.driver.find_element_by_id("input-text-" + _ ).get_attribute('value'), '5')

        os.remove(path + filename)







