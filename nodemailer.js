/**
 * @description
 * @author smalltown
 * @created 2023/12/3 17:17
 */
// Your JavaScript code goes here.

//nodemailer.js
const nodemailer = require('nodemailer');

//创建一个smtp服务器
const config = {
    host: 'smtp.qq.com',
    port: 465,
    auth: {
        user: '1255432396@qq.com', //注册的邮箱账号
        pass: 'vjlybddpdjiriddj' //邮箱的授权码，不是注册时的密码,等你开启的stmp服务自然就会知道了
    }
};
// 创建一个SMTP客户端对象
const transporter = nodemailer.createTransport(config);

//发送邮件
module.exports = function (mail){
    transporter.sendMail(mail, function(error, info){
        if(error) {
            return console.log(error);
        }
        console.log('mail sent:', info.response);
    });
};