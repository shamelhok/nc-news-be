const { createRef } = require('../db/seeds/utils')
const {selectComments, selectUsers, selectArticle, insertComment, deleteCommentSql}= require('../models')

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
exports.postComment = (req,res,next)=>{
    const {article_id}= req.params
    const username =req.body.username
    const body =req.body.body
    if (!/^\d+$/.test(article_id)){
        res.status(400).send({msg:'invalid id'})
    }else{
        selectArticle(article_id).then(({rows})=>{
            if(rows.length===0){
                res.status(404).send({msg:'article not found'})
            }
        }).then(()=>{
            return Promise.all([insertComment(article_id,username,body),selectUsers()])}
        ).then(([{rows:comments},{rows:users}])=>{
            const new_comment =comments[0]
            const ref = createRef(users,'username','name')
            if (ref.hasOwnProperty(new_comment .author)){
                new_comment. author = ref[new_comment. author]} 
            res.status(201).send({new_comment})
        }).catch(next)
    }
}
exports.deleteComment = (req,res,next)=>{
    const comment_id=req.params.comment_id
    if (!/^\d+$/.test(comment_id)){
        res.status(400).send({msg:'invalid id'})
    }else{
    deleteCommentSql(comment_id).then(({rows})=>{
        if (rows.length===0){
            res.status(404).send({msg:'comment not found'})
        } else res.sendStatus(204)
    })
}
}