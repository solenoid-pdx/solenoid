# Write unit/integration tests here using the following:
# - Class extending either SimpleTestCase || TestCase from django.test
# - class methods with the naming convention beginning with "test_" and using snake_case

# See the official docs for writing and executing test cases here:
# https://docs.djangoproject.com/en/3.1/topics/testing/overview/

import unittest
from django.test import SimpleTestCase, Client, tag
from django.urls import reverse, resolve

from solenoid_app.views import indexView


@tag('unit')
class TestUrls(SimpleTestCase):
    """Url Tests"""

    # This method is automatically invoked before each test case is run. Use when necessary
    def setUp(self):
        pass

    # This method is automatically invoked after each test case is run. Use when necessary
    def tearDown(self):
        pass

    def test_base_url_is_resolved(self):
        # You can use doc strings to give your tests a human readable name when executing
        """Test '/' url resolves"""

        url = reverse('indexUrl')
        self.assertEquals(resolve(url).func, indexView)

    def test_base_url_response_code(self):
        """Assert 200 response code on base '/' url request"""

        client = Client()
        response = client.get('')
        self.assertEqual(response.status_code, 200)

    def check_if_test_work(self):
        assert 1 == 2
