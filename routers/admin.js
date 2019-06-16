const express = require('express')

const dbutil = require('../dao/DBUtil')

const router = express.Router();


router.use((req, res, next) => {

    if (!req.userInfo.isAdmin) {
        res.send('对不起，您不具有此页面的访问权限');
        return;
    }
    next();

});

router.get('/', (req, res) => {

    res.render('admin/index', {
        userInfo: req.userInfo
    })

})

router.get('/user', (req, res, next) => {
    let sql = "select count(*) as count from `usertab`"

    dbutil.query(sql).then((count) => {
        let page = Number(req.query.page || 0)
        let num = count[0].count
        let pageSize = 2
        let pages = Math.ceil(num / pageSize)
        page = Math.min(page, pages)
        page = Math.max(page, 1)
        let sql = "select * from `usertab` limit ?, ?;"
        let params = [(page - 1) * pageSize, pageSize]
        dbutil.query(sql, params).then((users) => {
            res.render('admin/user_index', {
                userInfo: req.userInfo,
                users,
                count:num,
                pages,
                pageSize,
                page
            });
        })
    })

})


router.get('/category', (req, res, next) => {

  
        let sql = "select * from `category`;"
        
        dbutil.query(sql).then((result) => {
            let categories = JSON.parse(JSON.stringify(result))
            res.render('admin/category_index', {
                userInfo: req.userInfo,
                categories
            });
        })
    

})


router.get('/category/add',(req,res,next)=>{
    res.render('admin/category_add',{
        userInfo: req.userInfo
    });
});


router.post('/category/add',(req,res,next)=>{
    let name = req.body.name || '';
    if( name == '' ){
        res.render('admin/error',{
            userInfo: req.userInfo,
            msg: "分类名称不能为空"
        });
        return;
    }
    let sql = "select * from `category` where name = ?;"
    dbutil.query(sql, name).then((categoryName) => {
        if( categoryName.length > 0 ){
            res.render('admin/error',{
                userInfo: req.userInfo,
                msg: "该分类已经存在"
            });
            return Promise.reject();
        } else {
            let sql = "insert into `category` (`name`) values (?);"
            return dbutil.query(sql, name)
        }
    }).then((newCategory) => {
        if(newCategory){
            
            res.render('admin/success',{
                userInfo: req.userInfo,
                msg: "分类添加成功",
                url: '/admin/category'
            })
        }
    }).catch(()=>{});  
 
});


router.get('/category/edit',(req, res, next)=>{
    let id = req.query.id || '';
    let sql = "select * from `category` where id = ?"
    dbutil.query(sql, id).then((result)=>{
        let category = JSON.parse(JSON.stringify(result))[0]
        if(category.length < 1){
            res.render('admin/error',{
                userInfo: req.userInfo,
                msg: '分类名称不存在'
            });
        } else {
            res.render('admin/category_edit',{
                userInfo: req.userInfo,
                category
            });
        }
    }); 
});


router.post('/category/edit',(req, res, next)=>{
    let id = req.query.id || '';
    let name = req.body.name || '';

    let sql = "select * from `category` where id = ?"
    dbutil.query(sql, id).then(result => {
        let category = JSON.parse(JSON.stringify(result))[0]
        if(category.length < 1){
            res.render('admin/error',{
                userInfo: req.userInfo,
                msg: '分类名称不存在'
            });
        }else {
            if(name == category.name){
                res.render('admin/success',{
                    userInfo: req.userInfo,
                    msg: '分类修改成功',
                    url: '/admin/category'
                });
                return Promise.reject();
            } else {
                let sql = "select * from `category` where name = ?"
                return dbutil.query(sql, name)
            }
        }
    }).then((result)=>{
        
        let sameCategory = JSON.parse(JSON.stringify(result))[0]
        if(sameCategory){
            res.render('admin/error',{
                userInfo: req.userInfo,
                msg: '数据库中存在同名分类'
            });
            return Promise.reject(); 
        } else {
            let sql = "UPDATE `category` SET name = ? where id =?"
            let params =[name, id]
            return dbutil.query(sql, params)
        }
    }).then(()=>{
        res.render('admin/success',{
            userInfo: req.userInfo,
            msg: '分类修改成功',
            url: '/admin/category'
        });
    }).catch(()=>{});
});


router.get('/category/delete',(req, res, next)=>{
    let id = req.query.id;
    let sql = "delete from `category` where id = ?"
    dbutil.query(sql, id).then((delCategory)=>{
        res.render('admin/success',{
            userInfo: req.userInfo,
            msg: '删除分类成功',
            url: '/admin/category'
        }); 
    });
});


router.get('/content',(req, res, next)=>{

    let sql = "select * from `content`;"
        
    dbutil.query(sql).then((result) => {
        let contents = JSON.parse(JSON.stringify(result))
        res.render('admin/content_index', {
            userInfo: req.userInfo,
            contents
        });
    })


});


router.get('/content/add',(req, res, next)=>{
    let sql = "select * from `category`"
    dbutil.query(sql).then((categories)=>{
        res.render('admin/content_add',{
            userInfo: req.userInfo,
            categories
        })
    });
});

router.post('/content/add',(req, res, next)=>{
   let category =  req.body.category
   let title = req.body.title
   let description = req.body.description
   let content = req.body.content
   let user = req.userInfo.username
   let addTime = new Date().toLocaleString()

   let sql = "insert into `content` (`category`,`title`,`description`,`content`,`user`,`addTime`) values (?, ?, ?, ?, ?, ?);"
   let params = [category, title, description, content, user, addTime] 
   dbutil.query(sql, params).then(() => {
        res.render('admin/success',{
            userInfo: req.userInfo,
            msg: '文章保存成功',
            url: '/admin/content'
        })
   })
});


router.get('/content/edit',(req, res, next)=>{
    let id = req.query.id;
    let categoryList = [];
    let sql = "select * from `category`;"
        
    dbutil.query(sql).then((result) => {
        categoryList = result
        let sql = "select * from `content` where id = ?"
        return dbutil.query(sql, id)
    }).then((result)=>{
        let content = JSON.parse(JSON.stringify(result))[0]
        if(content.length < 1){
            res.render('admin/error',{
                userInfo: req.userInfo,
                msg: '分类名称不存在'
            });
        } else {
            res.render('admin/content_edit',{
                userInfo: req.userInfo,
                content,
                categoryList
            });
        }
    }).catch(()=>{});
});

router.post('/content/edit',(req, res, next)=>{
    let id = req.query.id || '';
    let category =  req.body.category
    let title = req.body.title
    let description = req.body.description
    let content = req.body.content
    let user = req.userInfo.username
    let addTime = new Date().toLocaleString()

    let sql = "UPDATE `content` SET category = ?, title = ?,  description = ?, content = ?, user = ?, addTime = ? where id =?"
    let params =[category, title, description, content, user, addTime, id]
    dbutil.query(sql, params).then(() => {
        res.render('admin/success',{
            userInfo: req.userInfo,
            msg: '保存成功',
            url: `/admin/content/edit?id=${id}`
        });
        
    })



});

router.get('/content/delete',(req, res, next)=>{
    let id = req.query.id;
    let sql = "delete from `content` where id = ?"
    dbutil.query(sql, id).then(()=>{
        res.render('admin/success',{
            userInfo: req.userInfo,
            msg: '删除文章成功',
            url: '/admin/content'
        }); 
    });
});







module.exports = router