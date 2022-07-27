/**
 * @api {post} /probelms/new 查询题目接口
 * @apiGroup problems
 * @apiDescription 查询题目，获取题目内容
 *
 * @apiParam {String} title 题目标题
 * @apiParam {String} content 题目内容
 * @apiParam {Number} pid 题目编号
 * @apiParam {Number} difficulty 题目难度
 * @apiParamExample {json} 样例请求
 * {
 *   "session": "a-64-bit-hex-string",
 *   "title": "testtitle",
 *   "content": "# sample\ncontent\nusing *Markdown*",
 *   "pid": 9999,
 *   "difficulty": 1
 * }
 *
 * @apiSuccess {String} session 会话session
 * @apiSuccessExample  {json} 用户名和密码均正确
 * {
 *   "success":true
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
  if (req.query.pid != undefined) {
    db.query(
      "SELECT active FROM problems WHERE pid=" + db.escape(req.query.pid),
      (err, data) => {
        var nperms;
        if (data.length == 0) return notfound(res);
        if (data[0].active) nperms = 0;
        else nperms = 1;
        permission(req.query.session, nperms)
          .then((level) => {
            db.query(
              "SELECT active,title,content,difficulty FROM problems WHERE pid=" +
                db.escape(req.query.pid) +
                ";",
              (err, data) => {
                if (data != []) success(res, data[0]);
                else badrequest(res);
              }
            );
          })
          .catch((err) => {
            if (err) {
              console.log(err);
              return error(res);
            }
            return denied(res);
          });
      }
    );
  } else return badrequest(res);
};
