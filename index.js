let express = require("express");
let app = express();
let cors = require("cors");
let bodyParser = require("body-parser");
let sqlinit = require("./database/init");
let getenv = require("./common/getenv.js");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());

if (sqlinit() != 0) {
  console.log("error:sql init failed.");
  process.exit();
} else {
  console.log("loading router...");

  //? 创建用户
  //TODO 邮箱验证
  app.all("/users/new", require("./backend_api/users/new"));

  //? 删除用户
  //! BETA
  app.all("/users/delete", require("./backend_api/users/delete"));

  //? 用户列表
  //! BETA
  app.all("/users/list", require("./backend_api/users/list"));

  //? 用户登录接口
  app.all("/users/login", require("./backend_api/users/login"));

  //? 题目列表
  //* permission>=0 , permission>=1
  app.all("/problems/list", require("./backend_api/problems/list"));

  //? 获取题目信息
  //* permission>=0
  app.all("/problems/get", require("./backend_api/problems/get"));

  //? 新建题目
  //* permission>=1
  app.all("/problems/new", require("./backend_api/problems/new"));

  //? 删除题目
  //! BETA
  //* permission>=1
  app.all("/problems/delete", require("./backend_api/problems/delete"));

  //? 根据session获取用户信息
  //* permission>=1
  app.all("/users/info", require("./backend_api/users/info"));

  //? 提交题目代码
  //* permission>=0
  app.all("/records/submit", require("./backend_api/records/submit"));

  //? 获取题目评测记录
  //! BETA
  //* user == owner || permission=2
  app.all("/records/get", require("./backend_api/records/get"));

  //? 获取题目评测记录列表
  //! BETA
  //* user == owner || permission=2
  app.all("/records/list", require("./backend_api/records/list"));

  app.listen(getenv("PORT", 0, 80), () => {
    console.log("server is listening on port " + getenv("PORT", 0, 80) + ".");
  });
}
