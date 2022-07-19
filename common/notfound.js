module.exports = (res) => {
    res.status(404).json({success:false,data:'resource not found.'})
}