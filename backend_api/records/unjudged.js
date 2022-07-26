/**
 * @api {post} /records/unjudged
 * @apiGroup records
 * @apiDescription 查询为评测的提交记录
 *
 * @apiParam {String} session 会话session
 * @apiParamExample {json} 样例请求
 * {
 *   "session": "sessionExample",
 * }
 *
 * @apiError (Error 4xx) {String} mag 错误信息
 * @apiErrorExample  {json} 403 session无效或已过期
 * {
 *   "success": false,
 *   "msg": "access denied."
 * }
 *
 * @apiSuccess {Number} id 评测编号
 * @apiSuccessExample  {json} session有效且未过期
 * {
 *  "success": true,
 *  "data": [
 *      {
 *          "id": 111
 *      },
 *      {
 *         "id": 112
 *      },
 *      {
 *          "id": 113
 *      },
 *      {
 *          "id": 114
 *      }
 *  ]
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
    .then(() => {
      db.query("SELECT id FROM records WHERE judgestat=0;", (err, data) => {
        if (err) {
          console.log(err);
          return error(res);
        } else return success(res, data);
      });
    })
    .catch((err) => {
      if (err) {
        console.log(err);
        return error(res);
      } else return denied(res);
    });
};
