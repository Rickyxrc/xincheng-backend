/**
 * @api {post} /records/submit 提交代码接口
 * @apiGroup records
 * @apiDescription 向指定题目提交代码
 *
 * @apiParam {String} session 会话session
 * @apiParam {Number} pid 题目编号
 * @apiParam {String} code 用户代码
 * @apiParamExample {json} 样例请求
 * {
 *   "session": "sessionExample",
 *   "pid": 1001,
 *   "code": "codeExample"
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
 * @apiSuccess {String} rid 评测编号
 * {
 *     "success": true,
 *     "data": {
 *     "rid": 114
 *     }
 * }
 */

let permission = require("../../common/permission");
let denied = require("../../common/denied");
let badrequest = require("../../common/badrequest");
let success = require("../../common/success");
let db = require("../../database/conn");
let error = require("../../common/error");

module.exports = (req, res) => {
  permission(req.query.session, 0)
    .then(() => {
      if (req.query.pid && req.query.code)
        db.query(
          `INSERT INTO records VALUES(NULL,${db.escape(req.query.pid)},(SELECT user FROM sessions WHERE session=${db.escape(req.query.session)}),${db.escape(req.query.code)},0,'J');`,
          (err, data) => {
            if (err) {
              console.log(err);
              return error(res);
            }
            else {
              return success(res,{'rid':data.insertId});
            }
          }
        );
      else
        return badrequest(res);
    })
    .catch((err) => {
      if (err) {
        console.log(err);
        return error(res);
      } else return denied(res);
    });
};
