/**
 * @api {post} /probelms/new 新建/更改题目接口
 * @apiGroup problems
 * @apiDescription 新建或更改题目
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
