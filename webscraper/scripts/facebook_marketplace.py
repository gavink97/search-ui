from bs4 import BeautifulSoup
from collections import namedtuple
import datetime
import pytz
import os
import pandas as pd
import requests
import time
import sys
from selenium import webdriver
from selenium.webdriver import ActionChains
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from selenium.common.exceptions import ElementClickInterceptedException
from selenium.webdriver.chrome.service import Service
import random
from urllib.parse import urlencode, urlparse, parse_qs
from dotenv import load_dotenv
import logging

launcher_path = sys.argv[2]
search_query = sys.argv[3]

# launcher_path = "/Users/gavinkondrath/Desktop/DevOps/web_app/webscraper"
# search_query = "record player"

timezone = pytz.timezone('Asia/Jakarta')
current_time = datetime.datetime.now(timezone).strftime("%Y-%m-%d %H:%M")

load_dotenv()
fb_email = os.environ['FACEBOOK_EMAIL']
fb_pass = os.environ['FACEBOOK_PASSWORD']
proton_user = os.environ['PROTON_USER']
proton_pass = os.environ['PROTON_PASS']

logger = logging.getLogger("facebook_marketplace_logger")
logger.setLevel(logging.DEBUG)
handler = logging.FileHandler(f"{launcher_path}/temp/facebook_marketplace.log")
logger.addHandler(handler)
handler.setFormatter(logging.Formatter("%(asctime)s %(levelname)s Selenium -> %(message)s", "%Y-%m-%d %H:%M:%S"))

user_agent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/117.0'
driver_service = Service(log_output=f'{launcher_path}/temp/facebook_marketplace.log')
driver_option = Options()
driver_option.add_argument("--headless=new")
driver_option.add_argument(f"load-extension={launcher_path}/drivers/extensions/fbp")
driver_option.add_argument(f"load-extension={launcher_path}/drivers/extensions/proton")
driver_option.add_argument(f'--user-agent={user_agent}')
driver_option.add_argument("--disable-notifications")
driver_option.add_argument('--disable-dev-shm-usage')
driver_option.add_argument('--no-sandbox')
driver = webdriver.Chrome(options=driver_option, service=driver_service)

driver.implicitly_wait(9)
window_handles = driver.window_handles
wait = WebDriverWait(driver, 30)

page_load_timeout = 40
url = 'https://www.facebook.com/'
proton_vpn = 'chrome-extension://jplgfhpmjnbigmhklmmbgecoobifkmpa/popup.html'
vpn_location = "United States"
random_delay = random.uniform(0.4, 2.7)

print("Setting up VPN")
driver.set_window_size(370, 720)
driver.get(proton_vpn)
time.sleep(2)
chld = driver.window_handles[1]
driver.switch_to.window(chld)
driver.close()
time.sleep(2)
parent = driver.window_handles[0]
driver.switch_to.window(parent)
proton_sign_in = driver.find_element(By.CLASS_NAME, "sign-in-button")
proton_sign_in.click()
time.sleep(1)
parent = driver.window_handles[0]
driver.switch_to.window(parent)
proton_email = wait.until(EC.element_to_be_clickable((By.XPATH, '//*[@id="username"]')))
proton_email.click()
proton_email.clear()
for char in proton_user:
    proton_email.send_keys(char)
    delay = random.uniform(0.1, 0.2)
    time.sleep(delay)
proton_password = driver.find_element(By.XPATH, '//*[@id="password"]')
proton_password.click()
proton_password.clear()
for char in proton_pass:
    proton_password.send_keys(char)
    delay = random.uniform(0.1, 0.2)
    time.sleep(delay)
proton_password.send_keys(Keys.ENTER)
wait.until(EC.presence_of_element_located((By.XPATH, "//*[contains(text(), 'Open the Proton VPN')]")))
try:
    driver.set_page_load_timeout(page_load_timeout)
    driver.get(proton_vpn)
except TimeoutException as e:
    driver.close()
    raise TimeoutError(f"Selenium timed out waiting for the page to load: {e}")

proton_search = wait.until(EC.element_to_be_clickable((By.XPATH, '//*[@id="search-input"]')))
time.sleep(1)
proton_search.send_keys(vpn_location)
proton_search.send_keys(Keys.ENTER)
time.sleep(1)

print("Connected to VPN")
driver.set_window_size(1400, 1200)
time.sleep(1)

print(f"Now getting {search_query}s from Facebook Marketplace...")

try:
    driver.set_page_load_timeout(page_load_timeout)
    driver.get(url)
#    driver.execute_cdp_cmd('Network.enable', {})
except TimeoutException as e:
    driver.close()
    raise TimeoutError(f"Selenium timed out waiting for the page to load: {e}")

wait.until(EC.presence_of_element_located((By.XPATH, '//input[@id="email"]')))
print("Logging into Facebook...")

time.sleep(random_delay)
email_address_field = driver.find_element(By.XPATH, '//*[@id="email"]')
email_address_field.click()
time.sleep(.2)
for char in fb_email:
    email_address_field.send_keys(char)
    delay = random.uniform(0.1, 0.4)
    time.sleep(delay)

password_field = driver.find_element(By.XPATH, '//*[@id="pass"]')
time.sleep(random_delay)
password_field.click()
for char in fb_pass:
    password_field.send_keys(char)
    delay = random.uniform(0.1, 0.4)
    time.sleep(delay)
time.sleep(random_delay)
password_field.send_keys(Keys.ENTER)
print("Logged into Facebook!")

wait.until(EC.presence_of_element_located((By.XPATH, '//a[contains(@href, "https://www.facebook.com/marketplace/?ref=bookmark")]')))
print("Waiting for facebook to load...")
time.sleep(random_delay)
try:
    market = wait.until(EC.element_to_be_clickable((By.XPATH, '//a[contains(@href, "https://www.facebook.com/marketplace/?ref=bookmark")]')))
    print("Navigating to Facebook Marketplace...")
    market.click()
    # optimize this because really really slow
    wait.until(EC.presence_of_element_located((By.XPATH, '/html/body/div[1]/div/div[1]/div/div[3]/div/div/div/div[1]/div[1]/div[1]/div/div[2]/div/div/div/span/div/div/div/div/label/input')))
    time.sleep(random_delay)
except ElementClickInterceptedException:
    print("Clicking FBP first...")
    fbp_blocker = wait.until(EC.element_to_be_clickable((By.XPATH, '/html/body/div[1]/div[1]/div/table/tbody/tr/td[2]/a')))
    fbp_blocker.click()
    time.sleep(5)
    market.click()
    time.sleep(10)

print(f"Searching for {search_query}s...")
search_field = driver.find_element(By.XPATH, '/html/body/div[1]/div/div[1]/div/div[3]/div/div/div/div[1]/div[1]/div[1]/div/div[2]/div/div/div/span/div/div/div/div/label/input')
for char in search_query:
    search_field.send_keys(char)
    delay = random.uniform(0.1, 0.4)
    time.sleep(delay)
time.sleep(random_delay)
search_field.send_keys(Keys.ENTER)
wait.until(EC.presence_of_element_located((By.XPATH, '/html/body/div[1]/div/div[1]/div/div[3]/div/div/div/div[1]/div[1]/div[1]/div/div[3]/div[1]/div[2]/div[3]/div[2]/div[2]/div[1]')))

print("Adjusting sort parameters...")
sort_by = driver.find_element(By.XPATH, '/html/body/div[1]/div/div[1]/div/div[3]/div/div/div/div[1]/div[1]/div[1]/div/div[3]/div[1]/div[2]/div[3]/div[2]/div[2]/div[1]')
sort_by.click()
time.sleep(1.5)
newest_first = wait.until(EC.element_to_be_clickable((By.XPATH, "//*[contains(text(), 'Date listed: Newest first')]")))
newest_first.click()
time.sleep(2)
date_listed = wait.until(EC.element_to_be_clickable((By.XPATH, "//span[text()='Date listed']")))
date_listed.click()
time.sleep(1.5)
# Options: Last 24 hours, Last 7 days, Last 30 days
newest_first = wait.until(EC.element_to_be_clickable((By.XPATH, "//*[contains(text(), 'Last 7 days')]")))
newest_first.click()
time.sleep(2)

print(f"Beginning to scrape for {search_query}s...")
print("Please wait as this can take some time.")

FbPost = namedtuple('FbPost',
                    ['title', 'price', 'location', 'post_url', 'image_url'])
fb_posts = []
image_paths = []
image_counter = 0
batch_count = 0

default_image_path = f"{launcher_path}/images/no_image.png"


def process_batch(batch):
    global batch_count
    global image_counter
    batch_count += 1
    total_images = len(scraped_hrefs)
    print(f"Processing Batch #{batch_count}")
    for posts_html in batch:
        title_loc_element = posts_html.find('img', referrerpolicy="origin-when-cross-origin").get('alt') if posts_html.find('img') else ''
        alt_splits = title_loc_element.split(" in ")
        if len(alt_splits) >= 2:
            title = alt_splits[0].strip()
            location = alt_splits[-1].strip()
            if location == '':
                location = "Ships to you"
        price_elements = posts_html.find_all('span', string=lambda x: x and '$' in x)
        if price_elements:
            new_price = price_elements[0].text.strip()
        else:
            new_price = None
        image_url = posts_html.find('img', referrerpolicy="origin-when-cross-origin").get('src') if posts_html.find('img') else ''
        parsed_image_url = urlparse(image_url)
        image_path_parsed = parsed_image_url.path
        cleaned_image_path = image_path_parsed.split('?')[0]
        post_url_end = posts_html.find('a', role='link').get('href') if posts_html.find('a') else ''
        post_url_path = urlparse(post_url_end).path
        parsed_link = parse_qs(urlparse(post_url_end).query)
        if 'ref' in parsed_link:
            del parsed_link['ref']
        post_url_cleaned = f"{post_url_path}?{urlencode(parsed_link, doseq=True)}"
        fb_post_url = post_url_cleaned.split('?')[0]
        post_url = f"https://www.facebook.com{fb_post_url}"

        create_dir = f"{launcher_path}/images/cl_images"
        if not os.path.exists(create_dir):
            os.makedirs(create_dir)

        image_path = ""
        image_counter += 1

        if image_url:
            image_file_name = os.path.basename(cleaned_image_path)
            image_path = os.path.join(create_dir, image_file_name)

            if not os.path.exists(image_path):
                response = requests.get(image_url)
                if response.status_code == 200:
                    with open(image_path, "wb") as file:
                        file.write(response.content)
                        print(f"Image downloaded ({image_counter}/{total_images}): {image_path}")
            else:
                print(f"Image already exists ({image_counter}/{total_images}): {image_path}")
        else:
            image_path = f'{default_image_path}'
            print(f"No image found ({image_counter}/{total_images}): using default image")
        image_paths.append(image_path)

        if image_url.strip() == '':  # sometimes this errors out if the scroll_pause_time is too low
            image_url = 'No image'

        fb_posts.append(FbPost(title, new_price, location, post_url, image_url))


scraped_hrefs = set()
to_stop = False
scroll_pause_time = 1.5
scroll_offset = 1200
actions = ActionChains(driver)
batch_size = 50
batch = []
scroll_count = 0

while not to_stop:
    while True:
        prev_height = driver.execute_script("return document.body.scrollHeight")
        actions.scroll_by_amount(0, scroll_offset).perform()
        scroll_count += 1
        time.sleep(scroll_pause_time)

        new_height = driver.execute_script("return document.body.scrollHeight")
        if new_height == prev_height:
            break

    search_results = driver.find_element(By.XPATH, '/html/body/div[1]/div/div[1]/div/div[3]/div/div/div/div[1]/div[1]/div[2]/div/div/div[3]/div[1]/div[2]')
    soup = BeautifulSoup(search_results.get_attribute('innerHTML'), 'html.parser')
    valid_styles = [
        "max-width: 381px; min-width: 242px;",
        "max-width:381px;min-width:242px"
    ]
    for div in soup.find_all('div', style=valid_styles):
        span = div.find('span', style='display: none;')
        if span:
            continue
        a_tag = div.find('a')
        if a_tag:
            href = a_tag.get('href')
            if href not in scraped_hrefs:
                batch.extend(div)
                scraped_hrefs.add(href)

    if len(batch) >= batch_size:
        print(f"scroll count = {scroll_count}")
        process_batch(batch)
        batch = []
        scroll_count = 0

    if "Results from outside your search" in driver.page_source:
        print("Stopping: found results in page source")
        break

    if scroll_count >= 20:
        print("Reached the end of the page")
        break

if batch:
    print(f"scroll count = {scroll_count}")
    process_batch(batch)

# with open(f'{launcher_path}/temp/facebook_marketplace.txt', 'w', encoding='utf-8') as file:
#    for div in posts_html:
#        file.write(str(div) + '\n')

print('Collected {0} listings'.format(len(scraped_hrefs)))

df = pd.DataFrame(fb_posts)
df.insert(2, 'post_timestamp', current_time)
df.insert(0, 'time_added', current_time)
df.insert(0, 'is_new', "1")
df.insert(0, 'source', "facebook_marketplace")
df['data_pid'] = df['post_url'].str.extract(r'/(\d+)/')
df['image_path'] = image_paths
df.dropna(inplace=True)
df.to_csv(f'{launcher_path}/sheets/facebook_marketplace.csv', index=False)
print("Created facebook_marketplace.csv")
driver.close()
driver.quit()
