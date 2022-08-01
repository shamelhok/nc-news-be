exports.badUrl = (req,res,next)=>{
    res.status(404).send({msg:'URL not found'})
}
exports.handleCatch = (err, req, res, next) => {
    if(err.code ==='22P02'){
        res.status(400).send({msg:'invalid id'})
    }else if(err){   
    console.log(err)
        res.status(500).send({msg:'bad request'})
    }
}