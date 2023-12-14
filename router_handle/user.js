/**
 * @description:在这里定义和用户路由处理相关的函数，供router/user使用
 * @author smalltown
 * @created 2023/12/2 14:09
 */
// Your JavaScript code goes here.

const db = require('../db/index')
const bcrypt = require('bcryptjs')
// 导入配置文件
const config = require('../config')
const jwt = require("jsonwebtoken");
const path = require("path");
const svgCaptcha = require("svg-captcha");
const sendmail = require("../nodemailer")
global.time = 0; // 初始化为0或其他默认值

//注册
exports.regUser = (req,res) => {
    // 接收表单数据
    const userinfo = req.body
    console.log(userinfo)
    // 判断数据是否合法
    if (!userinfo.newUsername || !userinfo.newPassword) {return res.send({ status: 1, message: '用户名或密码不能为空！' })}
    const sql = `select * from user where user_name=?`
    db.query(sql, [userinfo.newUsername], function (err, results) {
        // 执行 SQL 语句失败
        if (err) {return res.send({ status: 1, message: err.message })}
        // 用户名被占用
        if (results.length > 0) {return res.send({ status: 1, message: '用户名被占用，请更换其他用户名！' })}
        // 对用户的密码,进行 bcrype 加密，返回值是加密之后的密码字符串
        userinfo.newPassword = bcrypt.hashSync(userinfo.newPassword, 10)
        console.log(userinfo.newPassword)
        const sql = 'insert into user set ?'
        db.query(sql, { user_name: userinfo.newUsername, user_psw: userinfo.newPassword, user_phone: userinfo.phone, user_email: userinfo.email}, function
            (err, results) {
            // 执行 SQL 语句失败
            if (err) return res.send({ status: 1, message: err.message })
            // SQL 语句执行成功，但影响行数不为 1
            if (results.affectedRows !== 1) {
                return res.send({ status: 1, message: '注册用户失败，请稍后再试！' })
            }
            // 注册成功
            res.send({ status: 0, message: '注册成功！' })
        })

    })

}

//登录
exports.login = (req,res) => {
   const userinfo = req.body
    console.log("in handle",req.body)
    const sql = `select * from user where user_name=?`
    db.query(sql, userinfo.username, function (err, results) {
        // 执行 SQL 语句失败
        console.log(results[0])

        if (err) return res.cc(err)
        // 执行 SQL 语句成功，但是查询到数据条数不等于 1

        if (results.length !== 1)
        {

            return res.send('登录失败！')
        }
        // TODO：判断用户输入的登录密码是否和数据库中的密码一致
        // 拿着用户输入的密码,和数据库中存储的密码进行对比

        const compareResult = bcrypt.compareSync(userinfo.password, results[0].user_psw)
        console.log(results[0].user_psw)
        // 生成 Token 字符串
        const user={ ...results[0],user_psw:" "}
        const tokenStr = jwt.sign(user, config.jwtSecretKey, {
            expiresIn: '10h', // token 有效期为 10 个小时

        })
        console.log("handle",tokenStr)
        //res.header('Authorization',tokenStr).send(user)
        console.log(results[0].user_id)
        req.session["id"]=results[0].user_id
        req.session.user = user
        console.log("session",req.session)
        // 如果对比的结果等于 false, 则证明用户输入的密码错误

        if (!compareResult) {
            console.log("here")
            return res.send('登录失败！')
        }
        return res.send({
            status:0,
            message:"登陆成功",
            token: "Bearer " + tokenStr,
            user
        })



    })

}

