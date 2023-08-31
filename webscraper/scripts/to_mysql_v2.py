import mysql.connector
import os
import pandas as pd
from dotenv import load_dotenv
import sys
import requests
import time
import hashlib

launcher_path = sys.argv[2]

load_dotenv()
db_host = os.environ['MYSQL_HOST']
db_port = os.environ['MYSQL_PORT']
db_user = os.environ['MYSQL_USER']
db_pass = os.environ['MYSQL_PASSWORD']
db_database = os.environ['MYSQL_DB']
cloud_name = os.environ['CLOUD_NAME']
cloud_api_key = os.environ['CLOUD_API_KEY']
cloud_api_secret = os.environ['CLOUD_API_SECRET']
cloudinary_url = os.environ['CLOUDINARY_URL']
cloudinary_resources_url = os.environ['CLOUDINARY_RESOURCES_URL']

db = mysql.connector.connect(
    user=f'{db_user}',
    password=f'{db_pass}',
    host=f'{db_host}',
    port=f'{db_port}',
    database=f'{db_database}'
)

def create_tables():
    cursor = db.cursor()

    create_sources_table = """
    CREATE TABLE IF NOT EXISTS sources (
        id INT AUTO_INCREMENT PRIMARY KEY,
        source VARCHAR(255) UNIQUE
    )
    """

    create_listings_table = """
    CREATE TABLE IF NOT EXISTS listings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        time_added TIMESTAMP,
        title VARCHAR(500),
        price VARCHAR(255),
        post_timestamp VARCHAR(255),
        location VARCHAR(255),
        post_url VARCHAR(255),
        image_url VARCHAR(500),
        data_pid VARCHAR(255) UNIQUE,
        image_path VARCHAR(500),
        is_new TINYINT(1) DEFAULT 1
    )
    """

    create_archived_listings_table = """
    CREATE TABLE IF NOT EXISTS archived_listings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        time_added TIMESTAMP,
        title VARCHAR(500),
        price VARCHAR(255),
        post_timestamp VARCHAR(255),
        location VARCHAR(255),
        post_url VARCHAR(255),
        image_url VARCHAR(500),
        data_pid VARCHAR(255),
        image_path VARCHAR(500),
        is_new TINYINT(1) DEFAULT 1
    )
    """

    create_data_sources_table = """
    CREATE TABLE IF NOT EXISTS data_sources (
        id INT AUTO_INCREMENT PRIMARY KEY,
        data_pid_id INT,
        source_id INT,
        FOREIGN KEY (source_id) REFERENCES sources(id),
        FOREIGN KEY (data_pid_id) REFERENCES listings(id) ON DELETE CASCADE,
        UNIQUE (data_pid_id, source_id)
    )
    """

    create_cloudinary_table = """
    CREATE TABLE IF NOT EXISTS cloudinary (
        id INT AUTO_INCREMENT PRIMARY KEY,
        data_pid_id INT UNIQUE,
        cloudinary_link VARCHAR(500),
        FOREIGN KEY (data_pid_id) REFERENCES listings(id) ON DELETE CASCADE
    )
    """

    cursor.execute(create_sources_table)
    cursor.execute(create_listings_table)
    cursor.execute(create_archived_listings_table)
    cursor.execute(create_data_sources_table)
    cursor.execute(create_cloudinary_table)
    db.commit()


csv_folder = f"{launcher_path}/filtered"

all_rows = []
unique_data_pids = set()

create_tables()

cursor = db.cursor()


def count_and_insert_sources(cursor, csv_folder):
    csv_files = [file for file in os.listdir(csv_folder) if file.endswith('.csv')]

    for csv_file in csv_files:
        source_name = os.path.splitext(csv_file)[0]
        cursor.execute("INSERT INTO sources (source) VALUES (%s) ON DUPLICATE KEY UPDATE source=source", (source_name,))


count_and_insert_sources(cursor, csv_folder)

for filename in os.listdir(csv_folder):
    if filename.endswith(".csv"):
        csv_path = os.path.join(csv_folder, filename)

        df = pd.read_csv(csv_path)

        unique_data_pids.update(df['data_pid'])
        all_rows.extend(df.to_dict(orient='records'))

for data_pid in unique_data_pids:
    cursor.execute("SELECT * FROM listings WHERE data_pid = %s", (data_pid,))
    existing_data = cursor.fetchone()

    row = next((r for r in all_rows if r['data_pid'] == data_pid), None)
    if row:
        is_new = row['is_new']

        if existing_data:
            update_query = """
            UPDATE listings
            SET title=%s,
                price=%s,
                post_timestamp=%s,
                location=%s,
                image_url=%s,
                image_path=%s,
                is_new = %s
            WHERE data_pid=%s
            """
            cursor.execute(update_query, (
                row['title'], row['price'], row['post_timestamp'], row['location'], row['image_url'], row['image_path'],
                0,
                data_pid))
        else:
            insert_query = """
            INSERT INTO listings (
                time_added,
                title,
                price,
                post_timestamp,
                location,
                post_url,
                image_url,
                data_pid,
                image_path,
                is_new
            )
            VALUES (
                NOW(),
                %s,
                %s,
                %s,
                %s,
                %s,
                %s,
                %s,
                %s,
                %s
            )
            """

            cursor.execute(insert_query, (
                row['title'],
                row['price'],
                row['post_timestamp'],
                row['location'],
                row['post_url'],
                row['image_url'],
                data_pid,
                row['image_path'],
                is_new
            ))

        db.commit()

for row in all_rows:
    data_pid = row['data_pid']

    cursor.execute(
        'INSERT INTO data_sources (data_pid_id, source_id) VALUES ((SELECT id FROM listings WHERE data_pid=%s),'
        ' (SELECT id FROM sources WHERE source=%s)) ON DUPLICATE KEY UPDATE source_id=source_id',
        (data_pid, row['source']))
    cursor.execute("INSERT IGNORE INTO cloudinary (data_pid_id) SELECT id FROM listings WHERE data_pid=%s", (data_pid,))

    db.commit()

data_pid_values = [row['data_pid'] for row in all_rows]

cloudinary_links_to_delete = []
current_cloud_images = set()

get_parms = {
            "max_results": 500
        }

cloudinary_resources_image = f"{cloudinary_resources_url}/image"
req_cloud_images = requests.get(cloudinary_resources_image, params=get_parms)
if req_cloud_images.status_code == 200:
    print("Successfully grabbed images from Cloudinary")
    response_data = req_cloud_images.json()
    current_cloud_images = set(item['public_id'] for item in response_data.get('resources', []))
else:
    print("An error occured while getting Cloudinary images. Status code:", req_cloud_images.status_code)
    print("Response content:", req_cloud_images.content)

cloudinary_link_query = """
    SELECT c.cloudinary_link
    FROM cloudinary c
    LEFT JOIN listings l ON l.id = c.data_pid_id
    WHERE l.data_pid = %s"""

cursor_for_query = db.cursor()

for data_pid in data_pid_values:
    cursor_for_query.execute(cloudinary_link_query, (data_pid,))
    cloudinary_links = cursor_for_query.fetchone()
    print(cloudinary_links)

cursor_for_query.close()
        # if cloudinary_link[0] is not None:
         #    cloudinary_links_to_delete.append(cloudinary_link)

            # if cloudinary_link[0] in current_cloud_images:
             #   if cloudinary_link[0] is not cloudinary_link[0] != "no_image":

if cloudinary_links_to_delete:

    for cloudinary_link in cloudinary_links_to_delete:
        timestamp = int(time.time())
        signature_data = f"public_id={cloudinary_link}&timestamp={timestamp}{cloud_api_secret}"
        signature = hashlib.sha1(signature_data.encode()).hexdigest()

        data = {
            "api_key": cloud_api_key,
            "public_id": cloudinary_link,
            "signature": signature,
            "timestamp": timestamp
        }

        try:
            cloudinary_url_with_params = f"{cloudinary_url}/destroy"
            print("Deleting Cloudinary resource:", cloudinary_link)
            response = requests.post(cloudinary_url_with_params, data=data)
            if response.status_code == 200:
                print("Cloudinary image deleted successfully:", cloudinary_link)
            else:
                print("Error deleting Cloudinary resource. Status code:", response.status_code)
                print("Response content:", response.content)

        except Exception as e:
            print("Error deleting Cloudinary resource:", str(e))

if not cloudinary_links_to_delete:
    print("There are no Cloudinary images to remove")

cursor.execute("INSERT INTO archived_listings SELECT * FROM listings WHERE data_pid NOT IN (%s)" % ",".join(
    ["%s"] * len(data_pid_values)), data_pid_values)
cursor.execute("DELETE FROM listings WHERE data_pid NOT IN (%s)" % ",".join(["%s"] * len(data_pid_values)),
               data_pid_values)
db.commit()

cursor.close()
db.close()
