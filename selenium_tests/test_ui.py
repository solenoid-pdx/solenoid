# To run these tests, it is required that you perform the following two actions first:
#   1. Install selenium webdriver and add it to your path variable
#       https://zwbetz.com/download-chromedriver-binary-and-add-to-your-path-for-automated-functional-testing/
#   2. Start the server running locally at the URL "http://localhost:8000/"

from selenium import webdriver
from django.test import LiveServerTestCase, tag
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options


URL = "http://localhost:8000/"

@tag('ui')
class TestUI(LiveServerTestCase):
    """UI Tests"""

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
    
    def test_query_string_fills_form_fields(self):
        """ Test that passing in a query string to the end of a URL fills out the form """

        testValue = "5"
        queryParameters = ["voltage", "length", "r0", "ra", "x", "force", "awg"]
        queryString = "?"
        for queryParameter in queryParameters:
            queryString += queryParameter + "=" + testValue + "&"
        queryString = queryString[:-1]
        self.driver.get(URL + queryString)
        for queryParameter in queryParameters:
            self.assertEqual(self.driver.find_element_by_id("input-text-" + queryParameter).get_attribute('value') , testValue)
    
    def test_calculate_creates_query_string(self):
        """ Test that query string is updated after performing calculation """

        testValue = "6"
        formParameters = ["voltage", "length", "r0", "ra", "x", "awg"]
        for formParameter in formParameters:
            self.driver.find_element_by_id('input-text-' + formParameter).send_keys(testValue)
        self.driver.find_element_by_xpath('//*[@id="input-submit-form"]/input[2]').click()
        queryString = "?"
        for queryParameter in formParameters:
            queryString += queryParameter + "=" + testValue + "&"
        queryString = queryString[:-1]
        self.assertEqual(self.driver.current_url, URL + queryString)
    
    def test_query_string_not_updated_invalid_calculate(self):

        testValue = "7"
        formParameters = ["voltage", "length", "r0", "ra", "force", "awg"]
        for formParameter in formParameters:
            self.driver.find_element_by_id('input-text-' + formParameter).send_keys(testValue)
        self.driver.find_element_by_xpath('//*[@id="input-submit-form"]/input[2]').click()
        self.assertEqual(self.driver.current_url, URL)