module.exports = (res) => {
    return res.status(403).json({success:false,msg:"access denied."})
}