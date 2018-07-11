
//引入http模块
let http = require("http");
//引入文件模块
let fs = require("fs");
//生成路径
let path = require("path");
//配置网站根目录
let rootPath = path.join(__dirname,"www"); 
// 引入 querystring 模块 
let querystring = require('querystring');
// require mime模块 第三方模块
let mime = require("mime");

//打开服务器软件
http.createServer((request,response)=>{
    //将文件转化成绝对路径
    let filePath = path.join(rootPath,querystring.unescape(request.url));
    console.log(filePath);
    //判断访问目录是否存在
    let isExist = fs.existsSync(filePath);
    if(isExist){
       //www目录下存在文件
       fs.readdir(filePath,(err,files)=>{
            if(err){
                //说明www目录下没有文件夹,只有文件
                //那么就开始读文件
                fs.readFile(filePath,(err,data)=>{
                    if(err){
                        //读取文件 未知错误
                        console.log(err);
                    }else{
                        //读取文件成功,
                        //设置响应头,并返回数据
                                //设置响应头
                        response.writeHead(200,{"content-type":mime.getType(filePath)});
                        response.end(data);
                    }
                });

            }else {
                //说明www目录下存在文件夹,或则文件夹和文件都存在
                console.log(files);
                //判断文件夹中是否含有首页
                if(files.indexOf("index.html") != -1){
                    //存在首页,
                    fs.readFile(path.join(filePath,"index.html"),(err,data)=>{
                        if(err){
                            //读取文件错误
                            console.log(err);
                        }else {
                        //读取文件成功,
                        //设置响应头,并返回数据
                        //设置响应头???这个地方为什么不设置响应头
                       // response.writeHead(200,{"content-type":mime.getType(filePath)});
                            response.end(data);
                        }
                    })
                }else{
                    //www目录下的文件夹里 不存在首页
                    let backData="";
                    for(var i=0;i<files.length;i++){
                       backData += `<h2><a href="${
                        request.url == "/" ? "" : request.url
                      }/${files[i]}">${files[i]}</a></h2>`; 
                    }
                    //设置响应头,并返回数据
                    //设置响应头
                    response.writeHead(200,{"content-type":"text/html;charset=utf-8"});
                    response.end(backData);
                }
            }
       });
    }else{
        //不存在文件,需要报404错误
        //设置响应头
        response.writeHead(404,{"content-type":"text/html;charset=utf-8"});
        response.end(`
            <!DOCTYPE HTML PUBLIC "-//IETF//DTD HTML 2.0//EN">
            <html><head>
            <title>404 Not Found</title>
            </head><body>
            <h1>Not Found</h1>
            <p>The requested URL /index.hththt was not found on this server.</p>
            </body></html>
        `);
    }


  }).listen(89,"127.0.0.1",()=>{console.log("开启监听:127.0.0.1:89 成功");})