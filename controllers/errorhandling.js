exports.badUrl = (req,res,next)=>{
    res.status(404).send({msg:'URL not found'})
}
exports.handleCatch = (err, req, res, next) => {
    if(err.code ==='22P02'){
        console.log('22P02');
        res.status(400).send({msg:'bad request'})
    }else if(err.code ==='23502'){
        console.log('23502, violates no-null');
        res.status(400).send({msg:'bad request'})
    }else if(err.code ==='23503'){
        console.log('23503, violates reference');
        res.status(400).send({msg:'bad request'})
    }else if(err){   
        console.log(err)
        res.status(500).send({msg:'server error'})
    }
}