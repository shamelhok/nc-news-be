exports.badUrl = (req,res,next)=>{
    res.status(404).send({msg:'URL not found'})
}
exports.handleCatch = (err, req, res, next) => {
    if(err){
        console.log(err)
        res.status(500).send(err)
    }
    }