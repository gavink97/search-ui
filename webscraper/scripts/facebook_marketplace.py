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
from selenium.webdriver.firefox.service import Service
from selenium.webdriver.firefox.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from selenium.common.exceptions import ElementClickInterceptedException
import random
from urllib.parse import urlencode, urlparse, parse_qs
from dotenv import load_dotenv

launcher_path = sys.argv[2]
search_query = sys.argv[3]

page_load_timeout = 90

#launcher_path = '/Users/gavinkondrath/Desktop/DevOps/web_app/webscraper'
#search_query = 'record player'

load_dotenv()
fb_email = os.environ['FACEBOOK_EMAIL']
fb_pass = os.environ['FACEBOOK_PASSWORD']

user_agent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/117.0'
firefox_driver_path = os.path.join(os.getcwd(), 'drivers', 'geckodriver')
firefox_service = Service(firefox_driver_path, log_path=os.path.devnull)
firefox_option = Options()
firefox_option.set_preference('general.useragent.override', user_agent)
firefox_option.set_preference("permissions.default.desktop-notification", 2)
driver = webdriver.Firefox(service=firefox_service, options=firefox_option)
driver.implicitly_wait(9)
driver.set_window_size(1400, 1000)
driver.install_addon(f'{launcher_path}/drivers/extensions/fbpurity.THRTYX-WX.xpi')
window_handles = driver.window_handles
wait = WebDriverWait(driver, 30)
url = 'https://www.facebook.com/'

random_delay = random.uniform(0.4, 2.7)

print(f"Now getting {search_query}s from Facebook Marketplace...")

try:
    driver.set_page_load_timeout(page_load_timeout)
    driver.get(url)
except TimeoutException as e:
    driver.close()
    raise TimeoutError(f"Selenium timed out waiting for the page to load: {e}")

time.sleep(3)
print("Logging into Facebook...")

email_address_field = driver.find_element(By.XPATH, '//*[@id="email"]')
email_address_field.click()
time.sleep(5)
for char in fb_email:
    email_address_field.send_keys(char)
    delay = random.uniform(0.1, .7)
    time.sleep(delay)

password_field = driver.find_element(By.XPATH, '//*[@id="pass"]')
time.sleep (3)
password_field.click()
for char in fb_pass:
    password_field.send_keys(char)
    delay = random.uniform(0.1, 1.8)
    time.sleep(delay)
time.sleep(random_delay)
password_field.send_keys(Keys.ENTER)
print("Logged into Facebook!")

time.sleep(10)
print("Waiting for facebook to load...")
try:
    market = wait.until(EC.element_to_be_clickable((By.XPATH, '//a[contains(@href, "https://www.facebook.com/marketplace/?ref=bookmark")]')))
    print("Navigating to Facebook Marketplace...")
    market.click()
    time.sleep(10)
    fbp_blocker = wait.until(EC.element_to_be_clickable((By.XPATH, '/html/body/div[1]/div[1]/div/table/tbody/tr/td[2]/a')))
    fbp_blocker.click()
    time.sleep(random_delay)
except ElementClickInterceptedException:
    print("Clicking FBP first...")
    fbp_blocker = wait.until(EC.element_to_be_clickable((By.XPATH, '/html/body/div[1]/div[1]/div/table/tbody/tr/td[2]/a')))
    fbp_blocker.click()
    time.sleep(5)
    market.click()
    time.sleep(10)

print(f"Searching for {search_query}s...")
search_field = wait.until(EC.element_to_be_clickable((By.XPATH, '/html/body/div[1]/div/div[1]/div/div[3]/div/div/div/div[1]/div[1]/div[1]/div/div[2]/div/div/div/span/div/div/div/div/label/input')))
for char in search_query:
    search_field.send_keys(char)
    delay = random.uniform(0.1, 1.7)
    time.sleep(delay)
time.sleep(random_delay)
search_field.send_keys(Keys.ENTER)
time.sleep(5)

print("Adjusting sort parameters...")
sort_by = driver.find_element(By.XPATH, '/html/body/div[1]/div/div[1]/div/div[3]/div/div/div/div[1]/div[1]/div[1]/div/div[3]/div[1]/div[2]/div[3]/div[2]/div[2]/div[1]')
sort_by.click()
time.sleep(1.5)
newest_first = wait.until(EC.element_to_be_clickable((By.XPATH, f"//*[contains(text(), 'Date listed: Newest first')]")))
newest_first.click()
time.sleep(2)
date_listed = wait.until(EC.element_to_be_clickable((By.XPATH, "//span[text()='Date listed']")))
date_listed.click()
time.sleep(1.5)
newest_first = wait.until(EC.element_to_be_clickable((By.XPATH, f"//*[contains(text(), 'Last 7 days')]")))
newest_first.click()
time.sleep(2)

print(f"Beginning to scrape for {search_query}s...")
print("Please wait as this can take some time.")

posts_html = []
scraped_hrefs = set()
to_stop = False

scroll_pause_time = 1.5
scroll_offset = 1200
actions = ActionChains(driver)

while not to_stop:
    while True:
        prev_height = driver.execute_script("return document.body.scrollHeight")

        actions.scroll_by_amount(0, scroll_offset).perform()
        time.sleep(scroll_pause_time)

        if "Results from outside your search" in driver.page_source:
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
                posts_html.extend(div)
                scraped_hrefs.add(href)

#with open(f'{launcher_path}/posts_html.txt', 'w', encoding='utf-8') as file:
#    for div in posts_html:
#        file.write(str(div) + '\n')

print('Collected {0} listings'.format(len(posts_html)))

FbPost = namedtuple('FbPost',
                            ['title', 'price', 'location', 'post_url', 'image_url'])
fb_posts = []
image_paths = []
image_counter = 0
total_images = len(posts_html)
default_image_path = f"{launcher_path}/images/no_image.png"

for posts_html in posts_html:
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
        old_price = price_elements[1].text.strip() if len(price_elements) >= 2 else None
    else:
        new_price = None
        old_price = None
    image_url = posts_html.find('img', referrerpolicy="origin-when-cross-origin").get('src') if posts_html.find('img') else ''
    parsed_image_url = urlparse(image_url)
    image_path_parsed = parsed_image_url.path
    cleaned_image_path = image_path_parsed.split('?')[0]
    post_url_end = posts_html.find('a', role='link').get('href') if posts_html.find('a') else ''
    post_url = f"facebook.com{post_url_end}"
    post_url_path = urlparse(post_url).path
    parsed_link = parse_qs(urlparse(post_url).query)
    if 'ref' in parsed_link:
        del parsed_link['ref']
    post_url_cleaned = f"{post_url_path}?{urlencode(parsed_link, doseq=True)}"
    fb_post_url = post_url_cleaned.split('?')[0]

    os.umask(0o002)
    create_dir = f"{launcher_path}/images/cl_images"
    if not (os.path.dirname(create_dir)):
        try:
            original_umask = os.umask(0)
            os.makedirs(os.path.dirname(create_dir, mode=777))
        finally:
            os.umask(original_umask)

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

    if image_url.strip() == '': # sometimes this errors out if the scroll_pause_time is too low
        image_url = 'No image'

    fb_posts.append(FbPost(title, new_price, location, fb_post_url, image_url))

df = pd.DataFrame(fb_posts)
timezone = pytz.timezone('Asia/Jakarta')
current_time = datetime.datetime.now(timezone).strftime("%m/%d %H:%M:%S")
df.insert(2, 'post_timestamp', current_time)
df.insert(0, 'time_added', current_time)
df.insert(0, 'is_new', "1")
df.insert(0, 'source', "facebook_marketplace")
df['data_pid'] = df['post_url'].str.extract(r'(\d+)')
df['image_path'] = image_paths
df.dropna(inplace=True)
df.to_csv(f'{launcher_path}/sheets/facebook_marketplace.csv', index=False)
print(f"Created facebook_marketplace.csv")
driver.close()
driver.quit()
