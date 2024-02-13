from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
import time

driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))

def test_register_button():
    driver.get('http://34.16.169.60:3000')

    register_button = driver.find_elements(
                     By.XPATH, '//*[@id="__next"]/main/div/div[2]/a[3]/button')

    driver.execute_script("arguments[0].click();", register_button[0])

    time.sleep(2)

    url = driver.current_url

    if url.endswith('/registration'):
        print('SUCCESS')

def test_login_button():
    driver.get('http://34.16.169.60:3000')

    login_button = driver.find_elements(
                   By.XPATH, '//*[@id="__next"]/main/div/div[2]/a[1]/button')

    driver.execute_script("arguments[0].click();", login_button[0])

    time.sleep(2)

    url = driver.current_url

    if url.endswith('/login'):
        print('SUCCESS')

test_register_button()
test_login_button()
driver.quit()
