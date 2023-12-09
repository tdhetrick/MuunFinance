from applitools.selenium import Eyes, Target
from selenium.webdriver import Chrome
from selenium.webdriver.common.by import By


def test_login(webdriver: Chrome, eyes: Eyes) -> None:

  # Load the login page.
  #webdriver.get("http://127.0.0.1:5000/")
  webdriver.get("http://slapkins.com/")

  # Verify the full login page loaded correctly.
  eyes.check(Target.window().fully().with_name("MuunFinance Login"))

  # Perform login.
  webdriver.find_element(By.ID, "email").send_keys("todd@todd.com")
  webdriver.find_element(By.ID, "password").send_keys("123456")
  webdriver.find_element(By.ID, "login_btn").click()

  # Verify the full main page loaded correctly.
  # This snapshot uses LAYOUT match level to avoid differences in closing time text.
  eyes.check(Target.window().fully().with_name("MuunFinance Homepage").layout())