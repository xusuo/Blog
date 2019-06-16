const express = require('express')

const dbutil = require('../dao/DBUtil')

const router = express.Router();

router.get('/', (req, res) => {

    let sql = "select * from `category`"
    let type = req.query.type || ''
    dbutil.query(sql).then(categories => {
        let sql = ""
        let params = []
            if(type == ''){
                sql = "select count(*) as count from `content`"
                params = []
            }else{
                sql = "select count(*) as count from `content` where category = ?"
                params = [type]
            }
        dbutil.query(sql, params).then((count) => {
            let page = Number(req.query.page || 0)
            let num = count[0].count
            let pageSize = 2
            let pages = Math.ceil(num / pageSize)
            page = Math.min(page, pages)
            page = Math.max(page, 1)
            let sql = ""
            let params = []
            if(type == ''){
                sql = "select * from `content` limit ?, ?;"
                params = [(page - 1) * pageSize, pageSize]
            }else{
                sql = "select * from `content` where category = ? limit ?, ?;"
                params = [type, (page - 1) * pageSize, pageSize]
            }
            dbutil.query(sql, params).then((contents) => {
                res.render('main/index',{
                    userInfo:req.userInfo,
                    categories,
                    contents,
                    pages,
                    page,
                    count
                })
            })
        })
    })
   
    
    
   
  
})


router.get('/views',(req, res, next)=>{
    let sql = "select * from `category`;"
    dbutil.query(sql).then((categories) => {
        let id = req.query.id;
        let sql = "select * from `content` where id = ?"
        dbutil.query(sql, id).then((content)=>{
            let view = content[0].view + 1 
            let sql = "UPDATE `content` SET view = ? where id = ?"
            let params = [view, id]
            dbutil.query(sql ,params)
            res.render('main/detail',{
                userInfo: req.userInfo,
                content: content[0],
                categories
            });
        })
    })

    
})
 

module.exports = router