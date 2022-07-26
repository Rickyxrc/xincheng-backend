/**
 * @api {post} /probelms/new 新建/更改题目接口
 * @apiGroup problems
 * @apiDescription 新建或更改题目
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

let permission = require("../../common/permission");
let denied = require("../../common/denied");
let error = require("../../common/error");
let success = require("../../common/success");
let badrequest = require("../../common/badrequest");
let db = require("../../database/conn");

module.exports = (req, res) => {
  permission(req.query.session, 1)
    .then(() => {
      if (
        req.query.title &&
        req.query.content &&
        req.query.pid &&
        req.query.difficulty
      )
        db.query(
          `INSERT INTO problems VALUES(${db.escape(req.query.pid)},${db.escape(
            req.query.title
          )},${db.escape(req.query.active)},${db.escape(
            req.query.content
          )},${db.escape(
            Number(req.query.difficulty)
          )}) ON DUPLICATE KEY UPDATE title=${db.escape(
            req.query.title
          )},content=${db.escape(req.query.content)},active=${db.escape(
            Number(req.query.active)
          )},difficulty=${db.escape(Number(req.query.difficulty))};`,
          (err, data) => {
            if (err) {
              console.log(err);
              return error(res);
            }
            return success(res, undefined);
          }
        );
      else return badrequest(res);
    })
    .catch((err) => {
      if (err) {
        console.log(err);
        return error(res);
      }
      return denied(res);
    });
};
