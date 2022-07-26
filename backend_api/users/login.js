/**
 * @api {post} /users/login 用户登录接口
 * @apiGroup users
 * @apiDescription 根据用户名和密码得到会话session
 *
 * @apiParam {String} username 用户名
 * @apiParam {String} password 密码
 * @apiParamExample {json} 样例请求
 * {
 *   "username": "testuser",
 *   "password": "samplepassword"
 * }
 *
 * @apiError (Error 403) {String} mag 错误信息
 * @apiErrorExample  {json} 用户名或密码错误
 * {
 *   success: false,
 *   msg: "invalid username or email.",     
 * }
 *
 *
 *
 * @apiSuccess {String} session 会话session
 * @apiSuccessExample  {json} 用户名和密码均正确
 * {
 *   "success":true,
 *   "session":"a-64-bit-hex-string"
 * }
 */

var db = require("../../database/conn");
var unixdate = require("../../common/unixdate");
var error = require("../../common/error");
const { createHash } = require("crypto");
const badrequest = require("../../common/badrequest");

module.exports = (req, res) => {
  var hash = createHash("sha256");
  if (req.query["username"] && req.query["password"]) {
    hash.update(req.query["password"]);
    hash_res = hash.digest("hex");
    db.query(
      "SELECT id FROM users WHERE (username = " +
        db.escape(req.query["username"]) +
        " OR mail = " +
        db.escape(req.query["username"]) +
        ") AND password = " +
        db.escape(hash_res) +
        ";",
      (err, data) => {
        if (err) {
          console.log(err);
          return error(res);
        } else if (data.length == 0)
          return res.json({
            success: false,
            msg: "invalid username or email.",
          });
        else {
          var hash = createHash("sha256");
          hash.update(unixdate() + "XinchengAUth" + req.query["username"]);
          session = hash.digest("hex");
          db.query(
            "INSERT INTO sessions Values (" +
              db.escape(data[0]["id"]) +
              "," +
              db.escape(session) +
              "," +
              db.escape(unixdate() + 86400) +
              ");",
            (err, data) => {
              return res.json({ success: true, session: session });
            }
          );
        }
      }
    );
  } else return badrequest(res);
};
