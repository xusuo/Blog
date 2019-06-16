const express = require('express')

const mysql = require("mysql");

const router = express.Router();


const dbutil = require('../dao/DBUtil')



router.post('/user/register',(req, res , next) => {
    let sql = "select * from `usertab` where username = ?;"

    const [username, password] = [req.body.username, req.body.password];

    dbutil.query(sql, username).then((userInfo) => {
        if (userInfo.length == 0) {
            let sql = "INSERT INTO `usertab` (`username`, `password`) VALUES (?, ?)";
            let params = [username, password]
            dbutil.query(sql, params).then((newUserInfo) => {
                return res.send({
                    code: 0,
                    msg: '注册成功'
                })
            })

        } else {
            return res.send({
                code: 1,
                msg: "用户名已注册~~~"
            })
        }
    })      
})



router.post('/user/login', (req ,res) => {
    let sql = "select * from `usertab` where username = ? and password = ?;"

    const params = [req.body.username, req.body.password]; 

    dbutil.query(sql, params).then((userInfo) => {
        if (userInfo.length >= 1) {
            req.cookies.set('userInfo', JSON.stringify({
                id: userInfo[0].id,
                username: userInfo[0].username
            }))
            return res.send({
                code: 0,
                data: {
                    msg: '登录成功',
                    id: userInfo[0].id,
                    username: userInfo[0].username
                }
            })

        } else {
            return res.send({
                code: 1,
                msg: '用户名或密码错误'
            })
        }
    }) 
})


router.post('/user/loginOut', (req, res, next) => {
    req.cookies.set('userInfo', null);
    return res.send("退出成功~~");
});


router.post('/comment',(req, res, next)=>{
    let content_id = req.body.content_id
    let userName = req.userInfo.username
    let postTime = new Date()
    let msg = req.body.msg
    
    let params = [content_id, userName, postTime, msg]
    let sql = "insert into `comment` (`content_id`,`userName`,`postTime`,`msg`) values (?, ?, ?, ?);"

    dbutil.query(sql, params).then(() => {
        res.json({
            code: 0,
            data: "评论成功"
        });
    }) 
});


router.get('/comment',(req, res, next)=>{
    let id = req.query.content_id || '';
    let sql = "SELECT * FROM `comment` where content_id = ? ORDER BY postTime DESC"
    dbutil.query(sql, id).then((contents)=>{
        res.json({
            code: 0,
            commentList: contents
        })
    })
})

module.exports = router;