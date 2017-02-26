let mysql=require("mysql");
let pool=mysql.createPool({
    host:'127.0.0.1',
    user:'root',
    password:'root',
    database:'chinaipo'
});

let query=(sql,data,callback)=>{
    pool.getConnection((err,conn)=>{
        if(err) callback(err,null,null);
        else{
            conn.query(sql,data,(qerr,response)=>{
                conn.release();
                callback(qerr,response);
            })
        }
    })
}

module.exports={
    query:query
}