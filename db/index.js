/**
 * @description:数据库连接
 * @author smalltown
 * @created 2023/12/2
 * @modified 2023/12/2
 */
// 导入 mysql 模块

const mysql = require('mysql')

// 创建数据库连接对象

const db = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'rootmysql',
    database: 'testdb'
})

// 向外共享 db 数据库连接对象

module.exports = db