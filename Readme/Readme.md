# 项目配置文档

## 项目环境：

IDE：Pycharm2022.3.3

DataBase：Mysql5.7

## 项目环境配置：

1. 文档目录树：

   ```cmd
   E:\NODEPROJ
   ├─.idea
   │  └─inspectionProfiles
   ├─db
   │  └─index.js
   ├─html
   │  ├─login2.html
   │  ├─loginEmail.html
   │  └─register.html
   ├─node_modules
   │
   ├─public
   │  ├─css
   │  │  ├─about.css
   |  |  ├─bootstrap.min.css
   │  │  ├─index.css
   │  │  ├─index.css
   │  │  ├─photowall.css
   │  │  └─shop.css
   │  ├─img
   │  └─js
   |     ├─bootstrap.min.js
   |     └─click.js
   ├─Readme
   |	└─Readme.md
   ├─router
   |	 └─user.js
   ├─router_handle
   |	 └─user.js
   ├─views
   |  ├─about.ejs
   │  ├─index.ejs
   |  ├─shop.ejs
   │  └─photowall.ejs
   ├─app.js
   ├─config.js
   ├─nodemailer.js
   ├─package.json
   └─package-lock.json
   ```

   2. 解压 `web项目.zip`

      1. 配置数据库

      在本机使用了如下命令导出testdb数据库为dump_file.sql文件。

      ```bash
      mysqldump -P 3306 -u root -ppassword -B testdb > path/to/dump_file.sql
      ```

      请在您的机器上运行以下命令，导入sql文件，注意替换用户名、密码、路径。

      ```bash
      mysql -u target_username -p target_password target_database < path/to/dump_file.sql
      ```

      2. 导入 `NodeProj`进入 `Pycharm`，运行下面的命令安装相印的模块。

      ```bash
      npm i
      ```

      

2. 运行 `app.js`，即可访问。

> 注意：经过后面测试发现，以下在shop.js中引入的库，需要开加速器才能正常请求到资源，如果出现格式混乱，可以考虑这个原因。
>
> ```
> <link rel="stylesheet"href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
> ```
>
> 
>
> ```
> <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
> ```