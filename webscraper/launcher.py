import schedule
import time
import os
import pandas as pd
from dotenv import load_dotenv

load_dotenv()
db_host = os.environ['MYSQL_HOST']
db_port = os.environ['MYSQL_PORT']
db_user = os.environ['MYSQL_USER']
db_pass = os.environ['MYSQL_PASSWORD']
db_database = os.environ['MYSQL_DB']

launcher_path = os.path.dirname(os.path.abspath(__file__))

def job():
    try:
        print("Starting Job...")

        file_names = [
            'cl_austin.py',
            'cl_dallas.py',
            'cl_houston.py',
            'cl_san_antonio.py',
            'cl_san_marcos.py',
            'cl_killeen.py',
            'cl_waco.py',
            'cl_college_station.py',
            'cl_galveston.py',
            'cl_victoria.py',
            'cl_laredo.py',
            'cl_corpus_christi.py',
            'cl_beaumont.py',
            'cl_san_angelo.py',
            'cl_east_texas.py',
            'cl_del_rio.py',
            'cl_abilene.py',
            'cl_wichita_falls.py',
            'cl_deep_east.py',
            'cl_texoma.py',
            'cl_odessa.py',
            'cl_mcallen.py',
            'cl_brownsville.py',
            'cl_texarkana.py',
            #Louisiana
            'cl_lake_charles.py',
            'cl_shreveport.py',
            'cl_lafayette.py',
            #Oklahoma
            'cl_lawton.py',
            'cl_oklahoma_city.py',
            'remove_extra_images.py',
            'filter_csv.py',
            'to_mysql.py'
                      ]

        for file_name in file_names:
            print(f"Processing: {file_name}")
            file_path = os.path.join(launcher_path, 'scripts', file_name)
            with open(file_path, 'r') as file:
                script = file.read()
                exec(script)

        print("Job Complete!")

    except Exception as e:
        print(f"Error: {e}")
        job()
job()

schedule.every(70).to(90).minutes.do(job)

while True:
    schedule.run_pending()
    time.sleep(1)
