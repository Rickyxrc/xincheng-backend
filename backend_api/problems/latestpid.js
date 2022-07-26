/**
 * @api {post} /problems/latestpid 获得最前一条空pid
 * @apiGroup problems
 * @apiDescription 获得最前一条空pid
 *
 * @apiParamExample {json} 样例请求
 * {
 *   "session":"a-64-bit-hex-string"
 * }
 *
 * @apiError (Error 403) {String} mag 错误信息
 * @apiErrorExample  {json} 403 session无效或已过期
 * {
 *   "success": false,
 *   "msg": "access denied."
 * }
 *
 * @apiSuccess {Number} latest 最先一条未被占用的pid
 * @apiSuccessExample  {json} session有效且未过期
 * {
 *   "success":true,
 *   "data":{
 *     latest:9999
 *   }
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
  permission(res.query.session)
};
