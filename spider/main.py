# 爬虫脚本
from urllib import request
from urllib.error import URLError
from lxml import etree
import re
import pymysql


def get_page(url):
    req=request.Request(url)
    req.add_header('User-Agent', 'Mozilla/6.0 (iPhone; CPU iPhone OS 8_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/8.0 Mobile/10A5376e Safari/8536.25')
    data=request.urlopen(req).read()
    return data


# 连接数据库
conn=pymysql.connect(host='127.0.0.1',port=3306,user='root',password='root',database='chinaipo')
cursor=conn.cursor()

# 匹配生日的正则
birth_pattern=re.compile(r'(\d+年(\d+月)*(\d+日)*出?生)|(出?生于\d+年(\d+月)*(\d+日)*)') 

# 获取股票代码集合
cursor.execute('select * from code_copy')
code_list=cursor.fetchall()
# print(code_list[0][0])

for k in range(0,len(code_list)):
    info={}
    # 股票代码
    name_code=code_list[k][0]
    info['code']=name_code

    url="http://www.chinaipo.com/stock/"+name_code+"/management.html"

    flag=True
    while(flag):
        flag=False
        try:
            data=get_page(url)
        except URLError as e:
            flag=True
         
    html=etree.HTML(data)
    # 公司简称
    company=html.xpath('//div[@class="name_code"]/a')
    info['company']=company[0].text
    # print(company[0].text)

    info['senior']=[]

    # 高管简历
    senior_info=html.xpath('//div[@class="f10_data"][2]//table')
    for i in range(0,len(senior_info)):
        single={}
        tr=senior_info[i].xpath('tr')
        
        # 个人信息部分
        single_info=tr[0].xpath('td')
        name=single_info[0].text.replace('姓名:','')
        gender=single_info[1].text.replace('性别:','')
        education=single_info[2].text.replace('学历:','')
        title=single_info[3].text.replace('职位:','')

        # 工作经历部分
        experience=tr[2].xpath('td')[1].text
        # # 剔除非浙大校友
        # if(experience is None or experience.find("浙江大学")<0):
        #     continue

        birth=birth_pattern.search(experience)
        if birth:
            birth=birth.group()
        else:
            birth=""
        
        single['name']=name
        single['title']=title
        single['gender']=gender
        single['education']=education
        single['experience']=experience
        single['birth']=birth

        info['senior'].append(single)
    
    # 人员情况
    senior_single=html.xpath('//div[@class="f10_data"][1]//tr')
    # print(len(senior_single))
    senior=info['senior']
    for i in range(1,len(senior_single)):
        td=senior_single[i].xpath('td')
        name=td[0].text
        title=td[1].text
        education=td[2].text
        hold_stocks=td[3].text
        stock_ratio=td[4].text
        # print(hold_stocks)

         # 将信息注入到原信息数组
        for j in range(0,len(senior)):
            if(senior[j]['name']==name and senior[j]['title']==title):
                senior[j]['hold_stocks']=hold_stocks
                senior[j]['stock_ratio']=stock_ratio
                senior[j]['education']=education
        
        # for j in range(0,len(td)):
        #     print(td[j].text)
        # print("\n")

    # 插入数据库 
    for i in range(0,len(senior)):
        cursor.execute('''insert into info_all (name,gender,company,code,title,education,birth,
        hold_stocks,stock_ratio,experience) values (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s) ''',
        [senior[i]['name'],senior[i]['gender'],info['company'],info['code'],
        senior[i]['title'],senior[i]['education'],senior[i]['birth'],senior[i]['hold_stocks'],
        senior[i]['stock_ratio'],senior[i]['experience']])
    conn.commit()
    print(name_code+"公司已爬取完成")


cursor.close()
# print(info['senior'])

# birth=birth_pattern.search("武穆清，男，1937年11月生，中共党员，博士，教授，博士生导师，中国通信学会高级会员。1981年")
# if birth:
#     print(birth.group())


# tr=html.xpath('//div[@class="f10_data"][2]//tr')
# td=tr[0].xpath('td')
# print(td[0].text)