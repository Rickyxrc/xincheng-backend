let express = require('express')
let app = express()
let cors = require('cors')
let bodyParser = require('body-parser')
let sqlinit = require('./database/init')

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

    //? 新建题目
    //! BETA
    //* permission>=1
    // app.all('/problems/new', require('./backend_api/problems/new'));

    //? 更改题目
    //! BETA
    //* permission>=1
    // app.all('/problems/edit', require('./backend_api/problems/deit'));

    //? 删除题目
    //! BETA
    //* permission>=1
    // app.all('/problems/delete', require('./backend_api/problems/delete'));

    app.listen(80, () => {
        console.log('server started.');
    });
}
