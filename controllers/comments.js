const { createRef } = require('../db/seeds/utils')
const {selectComments, selectUsers, selectArticle}= require('../models')

exports.getComments = (req,res,next)=>{
    const {article_id}= req.params
    if (!/^\d+$/.test(article_id)){
        res.status(400).send({msg:'invalid id'})
    }else{
    Promise.all( [ selectComments(article_id) , selectUsers() ]).then(([{rows},{rows:users}])=>{
        if(rows.length===0){
            selectArticle(article_id).then(({rows})=>{
                if(rows.length===0){
                    res.status(404).send({msg:'article not found'})
                } else res.status(200).send({msg:'no comments',comments:[]})
            })
        } else{
            const ref = createRef(users,'username','name')
            rows.forEach(comment=>{
                if (ref.hasOwnProperty(comment.author)){ comment.author = ref[comment.author]} 
                })
            const comments = rows
            res.status(200).send({comments})
        }
    }).catch(next)
}
}