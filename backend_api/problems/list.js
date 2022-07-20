var db = require("../../database/conn");
var permission = require("../../common/permission");
var denied = require("../../common/denied");
var error = require("../../common/error");
var success = require("../../common/success");

module.exports = (req, res) => {
	if (req.query.data == undefined) req.query.data = "";
	if (req.query.limit == undefined || req.query.limit > 20) req.query.limit = 20;
	if (req.query.page == undefined) req.query.page = 1;
	permission(req.query["session"], 1)
		.then((level) => {
			db.query("SELECT pid,title,difficulty,active FROM problems WHERE title LIKE '%" + req.query.data + "%'" +
				"OR pid LIKE '%" + req.query.data + "%'" +
				" LIMIT " + db.escape(req.query.limit) + ";", (err, data) => {
				if (err) {
					console.log(err);
					return error(res, err.message);
				}
				return success(res, data);
			});
		})
		.catch((err) => {
			if (err) {
				console.log(err);
				return error(res);
			}
			permission(req.query["session"], 0).then((level) => {
				sql = "SELECT title,difficulty,active FROM problems WHERE active=1 AND (title LIKe '%" +
					req.query.data +
					"%') LIMIT " + db.escape(Number(req.query.limit)) +
					" OFFSET " + db.escape(Number(req.query.page)) + ";";
				db.query(sql
					, (err, data) => {
						if (err) {
							console.log(err);
							return error(res);
						}
						return success(res, data);
					});
			}).catch((err) => {
				if (err) {
					console.log(err);
					return error(res);
				}
				return denied(res);
			})
		});
};
