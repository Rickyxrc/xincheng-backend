/**
 * @api {post} /users/info 用户信息接口
 * @apiGroup users
 * @apiDescription 根据会话session得到用户完整信息(密码除外)
 *
 * @apiParam {String} session 会话session
 * @apiParamExample {json} 样例请求
 * {
 *   "username": "testuser",
 * }
 *
 * @apiError (Error 4xx) {String} mag 错误信息
 * @apiErrorExample  {json} 403 session无效或已过期
 * {
 *   "success": false,
 *   "msg": "access denied."
 * }
 * @apiErrorExample  {json} 400 传入参数不完全
 * {
 *   "success": false,
 *   "msg": "bad request."
 * }
 *
 * @apiSuccess {String} username 用户名
 * @apiSuccess {String} mail 注册邮箱
 * @apiSuccess {Number} permission 用户权限
 * @apiSuccess {String} tag 用户标签
 * @apiSuccess {Number} color 用户颜色
 * @apiSuccessExample  {json} session有效且未过期
 * {
 *   "success": true,
 *   "data": {
 *     "username": "testuser",
 *     "mail": "testuser@oj.rickyxrc.top",
 *     "permission": 0,
 *     "tag": "tag",
 *     "color": 1
 *   }
 * }
 */

const db = require("../../database/conn");
const badrequest = require("../../common/badrequest");
const success = require("../../common/success");
const error = require("../../common/error");
const denied = require("../../common/denied");

module.exports = (req, res) => {
  if (req.query.session) {
    db.query(
      "SELECT user FROM sessions WHERE session=" +
        db.escape(req.query.session) +
        ";",
      (err, data) => {
        if (err) {
          console.log(err);
          return error(res);
        } else if (data.length == 0) {
          return denied(res);
        } else {
          db.query(
            "SELECT username,mail,permission,tag,color FROM users WHERE id=" +
              db.escape(data[0].user),
            (err, data) => {
              if (err || data.length == 0) {
                console.log(err);
                return error(res);
              }
              return success(res, data[0]);
            }
          );
        }
      }
    );
  } else return badrequest(res);
};
