var db = require("../../database/conn");
const { createHash } = require("crypto");

module.exports = (req, res) => {
  if (req.query["username"] && req.query["password"] && req.query["mail"]) {
    db.query(
      'SELECT * from users WHERE username="' +
        req.query["username"] +
        '" OR mail="' +
        req.query["mail"] +
        '";',
      (err, data) => {
        if (err) {
          console.log(err);
          error(res);
        } else {
          var hash = createHash("sha256");
          hash.update(req.query["password"]);
          if (data.length == 0) {
            hash_res = hash.digest("hex");
            db.query(
              "INSERT INTO users VALUES (NULL," +
                db.escape(req.query["username"]) +
                "," +
                db.escape(req.query["mail"]) +
                "," +
                db.escape(hash_res) +
                ",0,'',1);",
              (err, data) => {
                res.json({ success: true });
              }
            );
          } else res.json({ success: false, msg: "Same username or mail." });
        }
      }
    );
  } else res.json({ success: false, msg: "invalid request." });
};
