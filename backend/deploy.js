let http=require('http');
let createHandler=require('github-webhook-handler');
let handler=createHandler({path:'/',secret:'lowesyang'});

function run_cmd(cmd,args,callback){
    let spawn=require('child_process').spawn;
    let child=spawn(cmd,args);
    let resp="";

    child.stdout.on('data',(buffer)=>{
        resp+=buffer.toString()
    });
    child.stdout.on('end',()=>{
        callback(resp)
    });
}

handler.on('error',(err)=>{
    console.error('Error:',err.message);
});

handler.on('push',(ev)=>{
    console.log("Received a push event for %s", ev.payload.repository.name);
    run_cmd('sh',['./autoDeply.sh'],()=>{
        console.log('run sh completed!');
    });
});

http.createServer((req,res)=>{
    handler(req,res,(err)=>{
        res.statusCode=404;
        res.end('no such location');
    })
}).listen(18088);