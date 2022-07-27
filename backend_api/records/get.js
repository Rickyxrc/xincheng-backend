/**
 * @api {post} /records/get 获取评测记录
 * @apiGroup records
 * @apiDescription 根据评测编号rid 得到评测信息
 * 
 * @apiParam {String} session 会话session
 * @apiParam {Number} rid 评测编号
 * @apiParamExample {json} 样例请求
 * {
 *   "session": "exampleSession",
 *   "rid": "1"
 * }
 * 
 * @apiError (Error 4xx) {String} mag 错误信息
 * @apiErrorExample {json} 403 session无效或已过期
 * {
 *   "success": false,
 *   "msg": "access denied."
 * }
 * @apiErrorExample {json} 400 传入参数不完全
 * {
 *   "success": false,
 *   "msg": "bad request."
 * }
 * 
 * @apiSuccess {Number} problem 题目编号
 * @apiSuccess {String} user 用户编号
 * @apiSuccess {String} username 用户名
 * @apiSuccess {Number} usercol 用户名颜色
 * @apiSuccess {String} usertag 用户tag
 * @apiSuccess {String} code 用户代码
 * @apiSuccess {String} judgestat 评测状态
 * @apiSuccess {String} judgeinfo 评测信息
 * @apiSuccessExample {json} session 有效且未过期
 * {
 *   "success": true,
 *   "data": [
 *       {
 *           "problem": 1001,
 *           "user": 2,
 *           "username": "rickyxrc",
 *           "usercol": 0,
 *           "usertag": "Developer",
 *           "code": "#include<stdio.h>\nint main(){\n  return 0;\n}",
 *           "judgestat": 1,
 *           "judgeinfo": "WWW"
 *       }
 *   ]
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
      if (req.query.rid) {
        db.query(
          `SELECT problem,user,(SELECT username FROM users WHERE id=user)"username",(SELECT color FROM users WHERE id=user)"usercol",(SELECT tag FROM users WHERE id=user)"usertag",code,judgestat,judgeinfo FROM records WHERE id=${db.escape(
            req.query.rid
          )};`,
          (err, data) => {
            if (err) {
              console.log(err);
              return error(res);
            } else {
              db.query(
                `SELECT user FROM sessions WHERE session=${db.escape(
                  req.query.session
                )}`,
                (err, data_tmp) => {
                  db.query(
                    `SELECT permission FROM users WHERE id=${db.escape(
                      data_tmp[0].user
                    )}`,
                    (err, data_tmpp) => {
                      if (err) {
                        console.log(err);
                        return error(res);
                      } else {
                        // console.log(data);
                        // console.log(data_tmp);
                        // console.log(data_tmpp);
                        if (
                          data_tmpp[0].permission == 2 ||
                          data[0].user == data_tmp[0].user
                        )
                          if (data != []) return success(res, data);
                          else return notfound(res);
                        else return denied(res);
                      }
                    }
                  );
                }
              );
            }
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
