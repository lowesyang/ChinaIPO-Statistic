let router=require("express").Router();
let query=require("../config").query;

router.get('/list/:page/:type/:keywords',(req,res)=>{
    let start=(parseInt(req.params.page)-1)*12;
    let end=start+12;
    let type=req.params.type;
    let keywords=req.params.keywords=='null'?'':req.params.keywords;
    switch(type){
        case '0': type='code';break;
        case '1':type='company';break;
        case '2':type='legal_representative';break;
        default:type='code';break;
    }

    query("select * from company_info where "+type+" like ?",[`%${keywords}%`],(err,data)=>{
        if(err) return res.json({
            code:-1,
            msg:err.toString()
        })

        if(data){
            return res.json({
                code:0,
                msg:'获取公司列表成功',
                body:{
                    companyList:data.slice(start,end),
                    numOfCompany:data.length
                }
            })
        }
    })
});

// router.get('/',(req,res)=>{
//
// });
//
// router.get('/',(req,res)=>{
//
// });

module.exports=router;
