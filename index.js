let express = require('express');
let app = express();
let cors = require('cors');
let bodyParser = require('body-parser');
let sqlinit = require('./database/init');
let getenv = require('./common/getenv.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());

if (sqlinit() != 0) {
    console.log('error:sql init failed.');
    process.exit();
}
else{
    console.log('loading router...');

    //? 创建用户
    //TODO 邮箱验证
    app.all('/users/new',require('./backend_api/users/new'));

    //? 用户登录接口
    app.all('/users/login', require('./backend_api/users/login'));
    
    //? 题目列表
    //! DEBUG
    //* permission>=0 , permission>=1
    app.all('/problems/list', require('./backend_api/problems/list'));

    //? 获取题目信息
    //! BETA
    //* permission>=0
    app.all('/problems/get', require('./backend_api/problems/get'));

    //? 新建题目
    //! BETA
    //* permission>=1
    app.all('/problems/new', require('./backend_api/problems/new'));

    //? 更改题目
    //! BETA
    //* permission>=1
    app.all('/problems/edit', require('./backend_api/problems/edit'));

    //? 删除题目
    //! BETA
    //* permission>=1
    app.all('/problems/delete', require('./backend_api/problems/delete'));

    //? 根据session获取用户信息
    //! BETA
    //* permission>=1
    app.all('/users/getsession', require('./backend_api/users/getsession'));

    app.listen(getenv("PORT",0,80), () => {
        console.log('server is listening on port '+getenv("PORT",0,80)+'.');
    });
}
