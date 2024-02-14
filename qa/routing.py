from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
import time

driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))

def test_register_button():
    driver.get('http://34.16.169.60:3000')

    register_button = driver.find_elements(By.XPATH, "//button[contains(text(), 'Register')]")

    driver.execute_script("arguments[0].click();", register_button[0])

    time.sleep(1)

    url = driver.current_url

    if url.endswith('/registration'):
        print('SUCCESS')
    else:
        print('FAILURE')

def test_login_button():
    driver.get('http://34.16.169.60:3000')

    login_button = driver.find_elements(By.XPATH, "//button[contains(text(), 'Login')]")

    driver.execute_script("arguments[0].click();", login_button[0])

    time.sleep(1)

    url = driver.current_url

    if url.endswith('/login'):
        print('SUCCESS')
    else:
        print('FAILURE')

def test_invitations_button():
    driver.get('http://34.16.169.60:3000')

    invitations_button = driver.find_elements(By.XPATH, "//button[contains(text(), 'Invitations')]")

    driver.execute_script("arguments[0].click();", invitations_button[0])

    time.sleep(1)

    url = driver.current_url

    if url.endswith('/invitations'):
        print('SUCCESS')
    else:
        print('FAILURE')

def test_meetups_button():
    driver.get('http://34.16.169.60:3000')

    meetups_button = driver.find_elements(By.XPATH, "//button[contains(text(), 'View meetups')]")

    driver.execute_script("arguments[0].click();", meetups_button[0])

    time.sleep(1)

    url = driver.current_url

    if url.endswith('/viewMeetups'):
        print('SUCCESS')
    else:
        print('FAILURE')


test_register_button()
test_login_button()
test_meetups_button()
test_invitations_button()

driver.quit()
