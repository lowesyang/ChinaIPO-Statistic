let express=require("express");
let app=express();
let fs=require("fs");
let bodyParser=require("body-parser");
let company=require("./route/company");
let senior=require("./route/senior");

app.use(express.static("./"));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.all('*',(req,res,next)=>{
    res.header("Access-Control-Allow-Origin","*");
    res.header("Access-Control-Allow-Headers","X-Requested-With");
    next();
});

app.use('/company',company);
app.use('/senior',senior);

app.listen(8088);