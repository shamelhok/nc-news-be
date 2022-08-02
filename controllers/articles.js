const{selectArticle, selectUsers, updateVotes}= require('../models')
const {createRef}=require('../db/seeds/utils')

exports.getArticle= (req,res,next)=>{
    const {article_id}= req.params
    if (!/^\d+$/.test(article_id)){
        res.status(400).send({msg:'invalid id'})
    }else{
    Promise.all( [ selectArticle(article_id) , selectUsers() ]).then(([{rows},{rows:users}])=>{
        if(rows.length===0){
            res.status(404).send({msg:'article not found'})
        } else{
        const article = rows[0]
        const ref = createRef(users,'username','name')
        article.author = ref[article.author]
        res.status(200).send({article})
        }
    }).catch(next)
}}
exports.patchArticle= (req,res,next)=>{
    const {article_id}= req.params
    const inc_votes= req.body.inc_votes
    if (!/^\d+$/.test(article_id)){
        res.status(400).send({msg:'invalid id'})
    }else if(inc_votes===undefined){
        res.status(400).send({msg:'bad request'})
    } else {
        Promise.all( [ updateVotes(inc_votes,article_id) , selectUsers() ]).then(([{rows},{rows:users}])=>{
            if(rows.length===0){
                res.status(404).send({msg:'article not found'})
            } else{
            const article = rows[0]
            const ref = createRef(users,'username','name')
            article.author = ref[article.author]
            res.status(200).send({article})
            }
        }).catch(next)
    }
}