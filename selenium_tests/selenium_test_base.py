# To run these tests, it is required that you perform the following two actions first:
#   1. Install selenium webdriver and add it to your path variable
#       https://zwbetz.com/download-chromedriver-binary-and-add-to-your-path-for-automated-functional-testing/
#   2. Start the server running locally at the URL "http://localhost:8000/"

from selenium import webdriver
from django.test import LiveServerTestCase, tag
from selenium.webdriver.chrome.options import Options


URL = "http://localhost:8000/"

@tag('ui')
class SeleniumTestBase(LiveServerTestCase):
    """ Test Base for all Selenium Test Classes """

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