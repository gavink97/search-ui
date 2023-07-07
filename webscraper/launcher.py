import schedule
import time as tm
from datetime import time, timedelta, datetime

# This section is where we will run all of our web scrapers
def job():

    with open('/pyapp/scripts/cl_austin.py', 'r') as file:
        cl_austin = file.read()
        exec(cl_austin)

    with open('/pyapp/scripts/cl_houston.py', 'r') as file:
        cl_houston = file.read()
        exec(cl_houston)

#  This section is where we run the script to load the spreadsheets into MySQL

    with open('/pyapp/scripts/to_mysql.py', 'r') as file:
        to_mysql = file.read()
        exec(to_mysql)
        

#running job on startup
job()

schedule.every(75).to(90).minutes.do(job)

while True:
    schedule.run_pending()
    tm.sleep(1)
