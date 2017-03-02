import pymysql
import re

conn=pymysql.connect(host='127.0.0.1',port=3306,user='root',password='root',database='chinaipo')
cursor=conn.cursor()

cursor.execute('select id,birth from info_all')
birth_info=cursor.fetchall()
# print(birth_info)

year=[]
birth_pattern=re.compile(r'\d+年')
for i in range(0,len(birth_info)):
    id=birth_info[i][0]
    year=birth_pattern.search(birth_info[i][1])
    if year:
        year=year.group()[:-1]
    else:
        year=""
    cursor.execute('''update info_all set year=%s where id=%s''',[year,id])
    print("处理完"+str(id))
conn.commit()
