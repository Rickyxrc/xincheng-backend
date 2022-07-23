module.exports = (res) => {
  return res.status(400).json({ success: false, msg: "bad request." });
};
