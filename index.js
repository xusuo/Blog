
const express = require('express')

const dbutil = require('./dao/DBUtil')

const swig = require('swig')
// 引入body-parse，处理传递过来的数据
const bodyParse = require('body-parser');

const app = express()

// cookies
const Cookies = require('cookies');
// 设置静态文件托管，如果访问/pub，则转到public下找资源文件，并不解析为html
app.use('/public', express.static(`${__dirname}/public`));
// 设置模版引擎
app.engine('html', swig.renderFile);
// 设置模版文件存放目录 第一个参数固定为views
app.set('views', './views');
// 注册模版引擎，第一个参数固定为view engine
app.set('view engine', 'html');
// 在开发过程中取消模版的缓存
swig.setDefaults({
    cache: false
});
// 设置body-parse
app.use(bodyParse.urlencoded({
    extended: true
}));

// 设置cookies

app.use((req, res, next) => {
    req.cookies = new Cookies(req, res);
    req.userInfo = {}
    
    if (req.cookies.get('userInfo')) {
        try {
            req.userInfo = JSON.parse(req.cookies.get('userInfo'))

            let sql = "select * from `usertab` where id = ?;"
            const params = req.userInfo.id; 

            dbutil.query(sql, params).then((userInfo) => {
                req.userInfo.isAdmin = Boolean (userInfo[0].isAdmin)
                
                next()
            })  
        }catch(error) {
            next()
        }        
    }else{
        next()
    } 

})


// 访问后台页面
app.use('/admin', require('./routers/admin'));
// 访问api接口
app.use('/api', require('./routers/api'));
// 访问页面
app.use('/', require('./routers/main'));

app.listen(8889)