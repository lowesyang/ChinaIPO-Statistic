let router=require("express").Router();
let query=require("../config").query;

router.get('/list/:page/:type/:keywords',(req,res)=>{
    let start=(parseInt(req.params.page)-1)*12;
    let end=start+12;
    let type=req.params.type;
    let keywords=req.params.keywords;
    if(!keywords){
        return res.json({
            code:-1,
            msg:'关键词不能为空!'
        })
    }
    switch(type){
        case '0': type='name';break;
        case '1':type='company';break;
        case '2':type='title';break;
        case '3':type='code';break;
        case '4':type='education';break;
        case '5':type='birth';break;
        case '6':type='hold_stocks';break;
        case '7':type='stock_ratio';break;
        default:type='name';break;
    }

    query("select * from info_all where "+type+" like ?",[`%${keywords}%`],(err,data)=>{
        if(err) return res.json({
            code:-1,
            msg:err.toString()
        })

        if(data){
            return res.json({
                code:0,
                msg:'获取高管列表成功',
                body:{
                    seniorList:data.slice(start,end),
                    numOfSenior:data.length
                }
            })
        }
        else{
            return res.json({
                code:-1,
                msg:'获取高管列表失败'
            })
        }
    })
});

// 985高校在管理层中的人数统计
router.get('/statistic/university',(req,res)=>{
    let university=["清华大学","北京大学","浙江大学","上海交通大学","复旦大学","武汉大学","哈尔滨工业大学","中国科学技术大学","中国人民大学","南京大学","中山大学"];
    let flag=0;         //flag==学校数量时，返回数据
    let result={};         //结果集
    for(let i=0;i<university.length;i++){
        (function(j){
            // 查询董事、总裁、经理、总监、监事
            query("(select count(DISTINCT name,company) as num from info_all where title like ? and title not like ? and experience like ?) union" +
                "(select count(DISTINCT name,company) as num from info_all where (title like ? or title like ?) and experience like ?) union " +
                "(select count(DISTINCT name,company) as num from info_all where title like ? and experience like ?) union " +
                "(select count(DISTINCT name,company) as num from info_all where title like ? and experience like ?) union " +
                "(select count(DISTINCT name,company) as num from info_all where title like ? and experience like ?)",
                ['%董事%','%秘书%',`%${university[j]}%`,'%总裁%','%副总%',`%${university[j]}%`,'%经理%',`%${university[j]}%`,'%总监%',`%${university[j]}%`,'%监事%',`%${university[j]}%`],
                (err,data)=>{
                    flag++;
                    if(err) {
                        return result[university[j]]=[];
                    }
                    if(data){
                        result[university[j]]=data.map((item)=>{
                            return item.num;
                        });
                    }
                    else{
                        result[university[j]]=[];
                    }
                    if(flag==university.length){
                        return res.json({
                            code:0,
                            msg:'985高管数据获取成功',
                            body:{
                                result
                            }
                        })
                    }
                })
        })(i);
    }
});


// 管理层的年龄分布
router.get('/statistic/birth/:type',(req,res)=>{
    let BIRTH = ['50后','60后','70后','80后','90后'];
    let YEAR=[1950,1960,1970,1980,1990,2000];

    let result={};
    let flag=0;

    let type=req.params.type;
    let sql="";
    if(type=='Director'){           //董事
        sql="select count(DISTINCT name,company) as num from info_all where year>=? and year<? and title like '%董事%' and title not like '%秘书%'";
    }
    else if(type=='President'){     //总裁
        sql="select count(DISTINCT name,company) as num from info_all where year>=? and year<? and (title like '%总裁%' or title like '%副总%')";
    }
    else if(type=='Manager'){       //经理
        sql="select count(DISTINCT name,company) as num from info_all where year>=? and year<? and title like '%经理%'";
    }
    else if(type=='Zongjian'){      //总监
        sql="select count(DISTINCT name,company) as num from info_all where year>=? and year<? and title like '%总监%'";
    }
    else if(type=='Supervisor'){    //监事
        sql="select count(DISTINCT name,company) as num from info_all where year>=? and year<? and title like '%监事%'";
    }
    else{   //所有管理层
        sql="select count(DISTINCT name,company) as num from info_all where year>=? and year<?";
    }
    for(let i=0;i<YEAR.length-1;i++){
        (function(j){
            query(sql,[YEAR[j],YEAR[j+1]], (err,data)=>{
                flag++;
                if(err){
                    return result[BIRTH[j]]=0;
                }
                if(data && data.length){
                    result[BIRTH[j]]=data[0].num || 0;
                }
                else{
                    result[BIRTH[j]]=0;
                }
                if(flag==BIRTH.length){
                    return res.json({
                        code:0,
                        msg:'管理层年龄分布获取成功',
                        body:{
                            result
                        }
                    })
                }
            })
        })(i);
    }
});

// 学历分布
router.get('/statistic/education',(req,res)=>{
    let EDU=['其他','大专','本科','硕士','博士'];

    let flag=0,result={};
    for(let i=0;i<EDU.length;i++){
        (function(j){
            query("(select count(DISTINCT name,company) as num from info_all where title like ? and title not like ? and education like ?) union" +
                "(select count(DISTINCT name,company) as num from info_all where (title like ? or title like ?) and education like ?) union " +
                "(select count(DISTINCT name,company) as num from info_all where title like ? and education like ?) union " +
                "(select count(DISTINCT name,company) as num from info_all where title like ? and education like ?) union " +
                "(select count(DISTINCT name,company) as num from info_all where title like ? and education like ?)",
                ['%董事%','%秘书%',`%${EDU[j]}%`,'%总裁%','%副总%',`%${EDU[j]}%`,'%经理%',`%${EDU[j]}%`,'%总监%',`%${EDU[j]}%`,'%监事%',`%${EDU[j]}%`],
                (err,data)=>{
                flag++;
                if(err){
                    return result[EDU[j]]=[];
                }
                if(data){
                    result[EDU[j]]=data.map((item)=>{
                        return item.num;
                    })
                }
                else{
                    result[EDU[j]]=[];
                }
                if(flag==EDU.length){
                    return res.json({
                        code:0,
                        msg:'获取高管学历分布成功',
                        body:{
                            result
                        }
                    })
                }
            })
        })(i);
    }
});

// 股份分布
router.get('/statistic/stock',(req,res)=>{
    query("(select format(avg(stock_ratio),4) as avg_ratio from (select distinct name,company,stock_ratio from info_all where stock_ratio!='-' and title like ? and title not like ?) as a) union " +
        "(select format(avg(stock_ratio),4) as avg_ratio from (select distinct name,company,stock_ratio from info_all where stock_ratio!='-' and title like ? and title like ?) as b) union " +
        "(select format(avg(stock_ratio),4) as avg_ratio from (select distinct name,company,stock_ratio from info_all where stock_ratio!='-' and title like ?) as c) union " +
        "(select format(avg(stock_ratio),4) as avg_ratio from (select distinct name,company,stock_ratio from info_all where stock_ratio!='-' and title like ?) as d) union " +
        "(select format(avg(stock_ratio),4) as avg_ratio from (select distinct name,company,stock_ratio from info_all where stock_ratio!='-' and title like ?) as f)",
        ['%董事%','%秘书%','%总裁%','%副总%','%经理%','%总监%','%监事%'],(err,data)=>{
            if(err){
                return res.json({
                    code:-1,
                    msg:'获取高管股份分布失败。'+err.toString()
                })
            }

            if(data){
                data=data.map((item)=>{
                    return item.avg_ratio;
                })
                return res.json({
                    code:0,
                    msg:'获取高管股份分布',
                    body:{
                        data
                    }
                })
            }
            else{
                return res.json({
                    code:-1,
                    msg:'数据库查询错误!'
                })
            }
        })
})

module.exports=router;