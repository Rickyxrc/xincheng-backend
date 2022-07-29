/**
 * @api {post} /records/set 更新评测状态
 * @apiGroup records
 * @apiDescription 根据评测编号和目标评测状态更新评测状态
 *
 * @apiParam {String} session 会话session
 * @apiParam {Number} rid 评测编号
 * @apiParam {String} status 目标评测状态
 * @apiParamExample {json} 样例请求
 * {
 *   "session": "sessionExample",
 *   "rid": "70",
 *   "status": "1",
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
 * @apiSuccessExample  {json} session有效且未过期
 * {
 *  "success": true
 * }
 */

let permission = require("../../common/permission");
let denied = require("../../common/denied");
let badrequest = require("../../common/badrequest");
let success = require("../../common/success");
let db = require("../../database/conn");
let notfound = require("../../common/notfound");
let error = require("../../common/error");

module.exports = (req, res) => {
  permission(req.query.session, 0)
    .then((level) => {
      if (req.query.rid && req.query.status) {
        db.query(
          `UPDATE records SET judgeinfo = ${db.escape(req.query.status)} WHERE id=${db.escape(req.query.rid)}`,
          (err, data) => {
            if (err) {
              console.log(err);
              return error(res);
            } else return success(res);
          }
        );
      } else return badrequest(res);
    })
    .catch((err) => {
      if (err) {
        console.log(err);
        return error(res);
      } else return denied(res);
    });
};
