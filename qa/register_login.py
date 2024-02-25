from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
import time
import random
import string

driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()))

def generate_random_word(count) -> str:
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for _ in range(count))

def register_account(driver):
    driver.get('http://34.16.169.60:3000')
    time.sleep(1)

    register_button = driver.find_elements(By.XPATH, "//button[contains(text(), 'Register')]")

    driver.execute_script("arguments[0].click();", register_button[0])

    time.sleep(1)

    url = driver.current_url

    if url.endswith('/registration'):
        school_dropdown = driver.find_elements(By.XPATH,
                          '/html/body/div/div/form/div[1]/div')

        school_dropdown[0].click()
        baylor = driver.find_elements(By.XPATH, '/html/body/div[2]/div[3]/ul/li[2]')
        baylor[0].click()
        time.sleep(1)

        first_name_box = driver.find_elements(By.XPATH, '/html/body/div/div/form/div[2]/div/input')
        first_name = generate_random_word(8)
        first_name_box[0].send_keys(first_name)
        time.sleep(1)

        last_name_box = driver.find_elements(By.XPATH, '/html/body/div/div/form/div[3]/div/input')
        last_name = generate_random_word(8)
        last_name_box[0].send_keys(last_name)
        time.sleep(1)

        email_box = driver.find_elements(By.XPATH, '/html/body/div/div/form/div[4]/div/input')
        email = generate_random_word(8) + '@test.com'
        email_box[0].send_keys(email)
        time.sleep(1)

        username_box = driver.find_elements(By.XPATH, '/html/body/div/div/form/div[5]/div/input')
        username = 'user' + generate_random_word(6)
        username_box[0].send_keys(username)
        time.sleep(1)

        password_box = driver.find_elements(By.XPATH, '/html/body/div/div/form/div[6]/div/input')
        password = generate_random_word(10)
        password_box[0].send_keys(password)
        time.sleep(1)

        confirm_password_box = driver.find_elements(By.XPATH, '/html/body/div/div/form/div[7]/div/input')
        confirm_password_box[0].send_keys(password)
        time.sleep(1)

        student_radio = driver.find_elements(By.XPATH, '/html/body/div/div/form/div[8]/label[1]/span[1]/input')
        student_radio[0].click()
        time.sleep(1)

        next_button = driver.find_elements(By.XPATH, '/html/body/div/div/form/div[9]/button')
        next_button[0].click()
        time.sleep(5)

    else:
        print('ROUTING FAILURE')

register_account(driver)
driver.quit()
