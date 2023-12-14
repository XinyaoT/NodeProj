/**
 * @description：用户路由
 * @author smalltown
 * @created 2023/12/2 14:09
 */
// Your JavaScript code goes here.
//导入用户路由处理函数
const express = require('express');
const userHandler = require("../router_handle/user")
const db = require('../db/index')
const sendmail = require("../nodemailer")
const path = require("path");
const svgCaptcha = require('svg-captcha')
let expectedCaptcha; // 声明全局变量

const router = express.Router();

//登陆后展示页面
router.get("/index", (req, res) => {
  const filePath = path.join(__dirname,'../', 'views', 'index.ejs');

   // 获取用户信息
  const user = req.session.user;
  console.log("ceshi",user)

  // 将用户信息传递给前端
  res.render('index', { user });
});

//about页面
router.get("/about", (req, res) => {
  const filePath = path.join(__dirname,'../', 'views', 'about.ejs');

   // 获取用户信息
  const user = req.session.user;

  // 将用户信息传递给前端
  res.render('about', { user });
});
//hobby页面
router.get("/photowall", (req, res) => {
  const filePath = path.join(__dirname,'../', 'views', 'photowall.ejs');

   // 获取用户信息
  const user = req.session.user;

  // 将用户信息传递给前端
  res.render('photowall', { user });
});
//商品展示
router.get("/shop", (req, res) => {
  const filePath = path.join(__dirname,'../', 'views', 'shop.ejs');

   // 获取用户信息
  const user = req.session.user;

  // 将用户信息传递给前端
  res.render('shop', { user });
});

//注册

router.post('/reguser',userHandler.regUser)
//jwt+session+salt登录

router.post('/login',userHandler.login)


// youxiang
router.get('/email', async (req, res) => {
    var email = req.query.email;//刚刚从前台传过来的邮箱
    console.log("youxiang",req.query)
    var code = await createSixNum();//生成的随机六位数，等等下面给代码
     time = new Date().getTime()
    //去数据库中找有没有同名的用户名
    db.query(`select * from user where user_email='${email}'`, (error, result) => {
        // 执行 SQL 语句失败
        console.log(result[0])
        const type = result.length === 0
        if (type === true) {
            res.send({
                code: -1,
                message: "该邮箱未注册"
            })
        } else {
            var mail = {
                // 发件人
                from: '<1255432396@qq.com>',
                // 主题
                subject: '接受凭证',//邮箱主题
                // 收件人
                to: email,//前台传过来的邮箱
                // 邮件内容，HTML格式
                text: '用' + code + '作为你的验证码'//发送验证码
            };
            const user={ ...result[0],user_psw:" "}
            req.session.user = user;
            Initcode = code
            sendmail(mail)

  res.send({
                code: 0,
                message: "发送成功",
                user
            })
        }
    })

})

function createSixNum() {
    var Num = "";
    for (var i = 0; i < 6; i++) {
        Num += Math.floor(Math.random() * 10);
    }
    return Num;
}
//图形验证码
router.get('/captcha', (req, res) => {
 // 下面这行代码是随机生成验证码图片和文本并返回给客户端
  const img = svgCaptcha.create({
    size: 4, // 验证码长度
    ignoreChars: '0o1i', // 验证码字符中排除 0o1i
    color: true, // 验证码是否有彩色
    noise: 2, //干扰线
    background: '#F3FEB0' // 背景颜色
  })
  console.log(img.text);
  res.send(img);

  // 在这里给 expectedCaptcha 赋值
    expectedCaptcha = img.text;

    console.log(expectedCaptcha);
})

router.post('/user/save', (req, res) => {
    const body = req.body
    console.log(req.body)
    const code = body.verificationCode
    console.log(code)
    const captcha = body.captcha; // Add captcha value
    console.log(captcha)
    console.log(expectedCaptcha)
    delete body.verificationCode
    delete body.captcha

    // Check if captcha matches
    if (captcha !== expectedCaptcha) {
        return res.send({
            code: -2, // Custom code for captcha mismatch
            msg: 'Invalid captcha. Please try again.'
        });
    }

    const attribute = []
    const data = []
    for (let i in body) {
        attribute.push(i)
        data.push(body[i])
    }
    const values = JSON.stringify(data).slice(1, JSON.stringify(data).length - 1)
    const registerTime = new Date().getTime()
    if (registerTime - time >= 5 *1000 * 60) {
        res.send({
            code: -1,
            msg: '验证码已过期'
        })
    }
    db.query(`select * from user where user_name='${body.username}'`, (error, result) => {
        const type = result.length === 0
        if (type === true) {
            if(code === Initcode) {
                db.query(`insert into user(${attribute.toString()}) values(${values})`, (error, result) => {
                    res.send({
                        code: 0,
                        msg: '登录成功'
                    })
                })
            }else{
                res.send({
                    code: -2,
                    msg: '验证码错误'
                })
                console.log("here")
            }
        } else {
            res.send({
                code: -3,
                msg: '账户名不存在'
            })
        }
    })
})


module.exports = router