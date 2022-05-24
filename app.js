/*
 * Simple-User e-mail server
 * connecting to Tencent Cloud SendMail API
 * Copyright (C) by SimpleAstronaut 2022
 */
const express = require('express');
var app = express();
const tencentcloud = require("tencentcloud-sdk-nodejs");
const SesClient = tencentcloud.ses.v20201002.Client;
const bodyParser=require('body-parser')
const fs = require('fs')

app.use(bodyParser.urlencoded({extended:false}))

/*
 * 写入日志函数
 * 目标：./save/log.txt
 */
function log(msg){
    const time_now = Date.now();
    msg = time_now+'--'+msg + "\n";
    fs.writeFile('./save/log.txt', msg,{ flag: 'a' } , err => {
        if (err) {
            console.error(err)
            return
        }
    });
    return 1;
} 

/*
 * 获取post请求参数
 * 注意：需要填充自己的腾讯云secretId和secretKey
 * 需要填充FromEmailAssress
 */
app.post('/', function (req, res) {
    console.log(req.body);
    const target = req.body.target;
    const mode = req.body.mode;
    const time = Date();
    const num = Math.round(Math.random()*89999+10000);
    //console.log(target);
    const clientConfig = {
        credential: {
            
            //需要填充ID和KEY!!!
            secretId: "", 
            secretKey: "",
        },
        region: "ap-hongkong",
        profile: {
            httpProfile: {
                endpoint: "ses.tencentcloudapi.com",
            },
        },
    };

    const client = new SesClient(clientConfig);
    const params = {
        "FromEmailAddress": "简单设计团队 <jdsjteam@mail.jdsj.site>",
        "ReplyToAddresses": "escscience@163.com",
        "Destination": [
            target
        ],
        "Template": {
            "TemplateID": 27793,
            "TemplateData": "{\"mode\":\""+mode+"\",\"code\":"+num+",\"time\":\""+time+"\"}"
        },
        "Subject": "TestMail"
    };
    client.SendEmail(params).then(
        (data) => {
            res.send(JSON.stringify(num));
            log(target+'--'+'mode:'+mode+'--'+num);
            //console.log(data);
            //console.log(target,num,time);
        },
        (err) => {
            //console.error("error", err);
        }
    );
})

var server = app.listen(8081, function(){
    console.log("server on");
})
