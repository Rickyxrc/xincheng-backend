module.exports = (res) => {
    return res.status(500).json({success:false,msg:'server error'})
}