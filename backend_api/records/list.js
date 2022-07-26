/**
 * @api {post} /records/list 评测记录列表
 * @apiGroup records
 * @apiDescription 根据题目编号pid(可选) 查询评测记录
 *
 * @apiParam {String} session 会话session
 * @apiParam {String} pid 题目编号(可选，若不填写则显示全部)
 * @apiParam {String} page 页码
 * @apiParam {String} limit 每页最大评测记录数量
 * @apiParamExample {json} 样例请求
 * {
 *   "session": "sessionExample",
 *   "pid": 1001,
 *   "page": 1,
 *   "limit": 20
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
 * @apiSuccess {Number} usercol 用户名称颜色
 * @apiSuccess {String} usertag 用户tag
 * @apiSuccess {Number} problem 题目编号 
 * @apiSuccess {String} judgestat 评测状态
 * @apiSuccess {String} judgeinfo 评测信息
 * @apiSuccessExample  {json} session有效且未过期
 * {
 *  "success": true,
 *  "data": [
 *      {
 *          "username": "rickyxrc",
 *          "usercol": 0,
 *          "usertag": "Developer",
 *          "problem": 1001,
 *          "judgestat": 1,
 *          "judgeinfo": "C"
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
            if (req.query.page == undefined) {
                req.query.page = 1;
            }
            if (req.query.limit == undefined || req.query.limit > 20) {
                req.query.limit = 20;
            }

            var skipNum = (Number(req.query["page"]) - 1) * Number(req.query["limit"]);
            if (req.query.pid == undefined) {
                sql = 'SELECT (SELECT username FROM users WHERE id=user)"username", (SELECT color FROM users WHERE id=user)"usercol", (SELECT tag FROM users WHERE id=user)"usertag", problem, judgestat, judgeinfo FROM records LIMIT '
                    + Number(skipNum) + "," + Number(req.query["limit"]) + ";";
            } else {
                sql = 'SELECT (SELECT username FROM users WHERE id=user)"username", (SELECT color FROM users WHERE id=user)"usercol", (SELECT tag FROM users WHERE id=user)"usertag", problem, judgestat, judgeinfo FROM records WHERE problem='
                    + db.escape(req.query.pid) + ' LIMIT ' + Number(skipNum) + "," + Number(req.query["limit"]) + ";";
            }
            db.query(sql, (err, data) => {
                if (err) {
                    console.log(err);
                    return error(res);
                } else {
                    return success(res, data);
                }
            })
        })
        .catch((err) => {
            if (err) {
                console.log(err);
                return error(res);
            } else {
                return denied(res);
            }
        })
}