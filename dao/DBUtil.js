const mysql = require("mysql");

function createConnection() {
    const connection = mysql.createConnection({
        host: "localhost",
        port: "3306",
        user: "root",
        password: "root",
        database: "my_blog"
    });
    return connection;
}


const pool = mysql.createPool({
    host: 'localhost',
    port: "3306",
    user: 'root',
    password: 'root',
    database: 'my_blog'
})


let query = function (sql, values) {
    return new Promise((resolve, reject) => {
        pool.getConnection(function (err, connection) {
            if (err) {
                reject(err)
            } else {
                connection.query(sql, values, (err, res) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(res)
                    }
                    // 结束会话
                    connection.release()
                })
            }
        })
    })
}

module.exports.query = query

module.exports.createConnection = createConnection;