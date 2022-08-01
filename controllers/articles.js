const{selectArticle, selectUsers}= require('../models')
const {createRef}=require('../db/seeds/utils')

exports.getArticle= (req,res,next)=>{
    const {article_id}= req.params
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
}