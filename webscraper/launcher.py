import schedule
import time as tm
from datetime import time, timedelta, datetime

def job():

    with open('/pyapp/scripts/cl_austin.py', 'r') as file:
        cl_austin = file.read()
        exec(cl_austin)

    with open('/pyapp/scripts/cl_houston.py', 'r') as file:
        cl_houston = file.read()
        exec(cl_houston)
    
    with open('/pyapp/scripts/cl_san_antonio.py', 'r') as file:
        cl_san_antonio = file.read()
        exec(cl_san_antonio)

    with open('/pyapp/scripts/cl_dallas.py', 'r') as file:
        cl_dallas = file.read()
        exec(cl_dallas)

#  This section is where we run the script to load the spreadsheets into MySQL

    with open('/pyapp/scripts/austin_to_mysql.py', 'r') as file:
        austin_to_mysql = file.read()
        exec(austin_to_mysql)

    with open('/pyapp/scripts/houston_to_mysql.py', 'r') as file:
        houston_to_mysql = file.read()
        exec(houston_to_mysql)

    with open('/pyapp/scripts/san_antonio_to_mysql.py', 'r') as file:
        san_antonio_to_mysql = file.read()
        exec(san_antonio_to_mysql)
    
    with open('/pyapp/scripts/dallas_to_mysql.py', 'r') as file:
        dallas_to_mysql = file.read()
        exec(dallas_to_mysql)
        
# create an error handler
job()

schedule.every(75).to(90).minutes.do(job)

while True:
    schedule.run_pending()
    tm.sleep(1)
