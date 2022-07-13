module.exports = (res,msg) => {
    return res.status(500).json({success:false,msg:msg})
}