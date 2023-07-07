import mysql.connector
import pandas as pd
import io
import os
import time

db = mysql.connector.connect(
    user='root',
    password='football',
    host="mysql",
    port=3306,
    database='test'
)

# df should go to each spreadsheet and read the data and create a table based on that spreadsheet
# if the data already exists it should update not be inserted, however if the data no longer exists it should be deleted


source_name = 'cl_dallas'
df = pd.read_excel(f'/pyapp/sheets/{source_name}.xlsx')

cursor = db.cursor()

columns = ", ".join([f"{col} VARCHAR(255)" for col in df.columns])
drop_query = f"DROP TABLE IF EXISTS {source_name};"
create_table_query = f"CREATE TABLE IF NOT EXISTS {source_name} ({columns}, id INT AUTO_INCREMENT PRIMARY KEY);"
cursor.execute(drop_query)
print(f"dropped old {source_name} table")
time.sleep(1)
cursor.execute(create_table_query)
print(f"Table {source_name} created")

insert_query = f"INSERT INTO {source_name} ({', '.join(df.columns)}) VALUES ({', '.join(['%s'] * len(df.columns))})"
values = [tuple(row) for row in df.values]
cursor.executemany(insert_query, values)
db.commit()

print(f"{len(df)} rows inserted into {source_name}")

db.close()
cursor.close()
