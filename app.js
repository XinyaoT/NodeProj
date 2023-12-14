/**
 * @description:再加一个轮播图的类型、一个help类型
 * @author smalltown
 * @created 2023/12/2 13:59
 */
// Your JavaScript code goes here.

const express = require('express');
const app = express();
const path = require("path");
const ejs = require('ejs');
const bodyParser = require('body-parser');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.json());
/** 中间件 */

// CORS 中间件
const cors = require('cors');
app.use(cors());

// 表单解析中间件
app.use(express.urlencoded({ extended: false }));

// 静态资源中间件
// app.use( express.static(path.join(__dirname, 'public')));
app.use('/public',express.static(path.join(__dirname, 'public'), {
    setHeaders: (res, path) => {
        if (path.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
        }
    },
}));


// Token 解析中间件
const expressJWT = require('express-jwt');
const config = require('./config');
app.use(expressJWT({ secret: config.jwtSecretKey,algorithms:['HS256'] }).unless({
  path: [/^\/api\//, '/','/login' ,'/email', '/login2' /* 在这里添加根路径 */]
}));

// Session 和 Cookie 中间件
const session = require('express-session');
const cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(session({
  secret: 'my-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false,
    maxAge: 1000 * 60 * 60 * 24 * 5,
  },
}));



/** 路由 */


// 注册页面路由
app.get('/', (req, res) => {
  const filePath = path.join(__dirname, 'html', 'register.html');
  console.log("在 app 中", filePath)
  res.sendFile(filePath);
});
app.get('/email', (req, res) => {
  const filePath = path.join(__dirname, 'html', 'loginEmail.html');
  console.log("在 app 中", filePath)
  res.sendFile(filePath);
});
//注册页面路由
app.get('/login', (req, res) => {
  const filePath = path.join(__dirname, 'html', 'login2.html');
  console.log("在 app 中", filePath)
  res.sendFile(filePath);
});
// 首页路由
app.get("/index", (req, res) => {
  const filePath = path.join(__dirname, 'views', 'index.ejs');
  res.sendFile(filePath);
});



// 用户路由
const userRouter = require("./router/user");
app.use('/api', userRouter);

//获取用户信息的路由，用于验证token
app.get('/userinfo',(req,res)=>{
  console.log('user',req.auth)
        res.send({
          code:0,
          message: '用户信息',
          data:req.user
        })
})


// 错误处理中间件
app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    console.error('身份验证错误:', err.message);
    return res.status(401).json({ message: '身份认证失败！' });
  }
  console.error(err,err.message);
  res.status(500).json({ message: '服务器错误' });
});

/** 服务器设置 */

// 启动服务器
app.listen(8000, function () {
  console.log('服务器运行在 http://127.0.0.1:8000');
});
