exports.badUrl = (req,res,next)=>{
    res.status(404).send({msg:'URL not found'})
}
exports.handleCatch = (err, req, res, next) => {
    if(err.code ==='22P02'){
        res.status(400).send({msg:'bad request', details:'invalid input'})
    }else if(err.code ==='23502'){
        res.status(400).send({msg:'bad request', details:'missing input'})
    }else if(err.code ==='23503'){
        res.status(400).send({msg:'bad request', details:'violates referencing within database'})
    }else if(err){   
        console.log(err)
        res.status(500).send({msg:'server error'})
    }
}