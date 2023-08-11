import requests
import os
from dotenv import load_dotenv
import mysql.connector

load_dotenv()
cloud_url = os.environ['CLOUDINARY_URL']
db_host = os.environ['MYSQL_HOST']
db_port = os.environ['MYSQL_PORT']
db_user = os.environ['MYSQL_USER']
db_pass = os.environ['MYSQL_PASSWORD']
db_database = os.environ['MYSQL_DB']

db = mysql.connector.connect(
    user=f'{db_user}',
    password=f'{db_pass}',
    host=f'{db_host}',
    port=f'{db_port}',
    database=f'{db_database}'
)

cursor = db.cursor()

query = """
    SELECT l.id, l.image_path, c.data_pid_id, c.cloudinary_link
    FROM listings l
    LEFT JOIN cloudinary c ON l.id = c.data_pid_id
    WHERE c.cloudinary_link IS NULL
"""
cursor.execute(query)
rows = cursor.fetchall()

if not rows:
    print("No images to upload!")

else:
    for index, row in enumerate(rows, start=1):
        data_pid_id = row[0]
        image_path = row[1]
        cloudinary_link = row[3]

        print(f"Uploading image {index}/{len(rows)}: {image_path}")

        cloudinary_params = {
            "file": ( open(image_path, 'rb'))
        }

        cloudinary_url_with_params = f"{cloud_url}?upload_preset=ml_default"

        response = requests.post(cloudinary_url_with_params, files=cloudinary_params)
        cloudinary_response = response.json()

        cloudinary_link = cloudinary_response['secure_url']

        update_query = """
            UPDATE cloudinary
            SET cloudinary_link = %s
            WHERE data_pid_id = %s
        """

        cursor.execute(update_query, (cloudinary_link, data_pid_id))
        db.commit()

print("Completed uploading to Cloudinary.")

cursor.close()
db.close()
