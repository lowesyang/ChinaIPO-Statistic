from urllib import request
from urllib.error import URLError
from lxml import etree
import pymysql

def get_page(url):
    req=request.Request(url)
    req.add_header('User-Agent', 'Mozilla/6.0 (iPhone; CPU iPhone OS 8_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/8.0 Mobile/10A5376e Safari/8536.25')
    data=request.urlopen(req).read()
    return data

# 连接数据库
conn=pymysql.connect(host='127.0.0.1',port=3306,user='root',password='root',database='chinaipo')
cursor=conn.cursor()

# 获取股票代码集合
cursor.execute('select * from code_copy')
code_list=cursor.fetchall()
# print(code_list[0][0])

for k in range(0,len(code_list)):
    code=code_list[k][0]
    url="http://www.chinaipo.com/stock/"+code+"/profile.html"

    flag=True
    while(flag):
        flag=False
        try:
            data=get_page(url)
        except URLError as e:
            flag=True

    html=etree.HTML(data)

    tr=html.xpath('//div[@class="f10_data"]//tr')
    # print(tr)

    founded_time=tr[18].xpath('td')[1].text
    # print(founded_time)

    capital=tr[21].xpath('td')[1].text
    # print(capital)

    staff=tr[22].xpath('td')[1].text
    # print(staff)

    registered_addr=tr[23].xpath('td')[1].text
    # print(registered_addr)

    office_addr=tr[25].xpath('td')[1].text
    # print(office_addr)

    sponsored_broker=tr[31].xpath('td')[1].text
    # print(sponsored_broker)

    market_maker=tr[32].xpath('td')[1].text
    # print(market_maker)

    law_firm=tr[33].xpath('td')[1].text
    # print(law_firm)

    accounting_firm=tr[34].xpath('td')[1].text
    # print(accounting_firm)

    cursor.execute('''update company_info set founded_time=%s,
    registered_capital=%s,staff=%s,registered_addr=%s,
    office_addr=%s,sponsored_broker=%s,market_maker=%s,
    law_firm=%s,accounting_firm=%s where code=%s''',
    [founded_time,capital,staff,registered_addr,office_addr,sponsored_broker,
    market_maker,law_firm,accounting_firm,code])

    conn.commit()
    print(code+"公司已爬取完成!")


