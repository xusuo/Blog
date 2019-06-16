const dbutil = require('./DBUtil')


function userRegister(username, password, repassword, callback) {
    let sql = "select * from `usertab` where username = ?;"
    let params = [username, password, repassword];

    let connection = dbutil.createConnection();
    connection.connect();
    connection.query(sql, username, (err, userInfo) => {
        if (err) {console.log(err)};
        if (userInfo.length == 0) {
            let sql = "INSERT INTO `usertab` (`username`, `password`) VALUES (?, ?)";
            let params = [username, password]
            connection.query(sql, params, (err, newUserInfo) => {
                if (err) {
                    console.log(err)
                }
                callback(newUserInfo)
                connection.end();
            })

        } else {
            res.send("用户名已注册~~~")
            connection.end();
        }
    })
}



module.exports.userRegister = userRegister;