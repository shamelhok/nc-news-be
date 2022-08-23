const {
  selectArticle,
  selectUsers,
  updateVotes,
  selectArticleNew,
  selectAllArticles,
  insertArticle,
  deleteArticleSql,
  selectAllArticlesNew,
} = require("../models");
const { createRef } = require("../db/seeds/utils");

exports.getArticle = (req, res, next) => {
  const { article_id } = req.params;
  if (!/^\d+$/.test(article_id)) {
    res.status(400).send({ msg: "invalid id" });
  } else {
    Promise.all([selectArticleNew(article_id), selectUsers()])
      .then(([{ rows }, { rows: users }]) => {
        if (rows.length === 0) {
          res.status(404).send({ msg: "article not found" });
        } else {
          const article = rows[0];
          const ref = createRef(users, "username", "name");
          article.author = ref[article.author];
          article.comment_count = parseInt(article.comment_count);
          res.status(200).send({ article });
        }
      })
      .catch(next);
  }
};
exports.patchArticle = async (req, res, next) => {
  const { article_id } = req.params;
  const inc_votes = req.body.inc_votes;
  if (!/^\d+$/.test(article_id)) {
    res.status(400).send({ msg: "invalid id" });
  } else if (typeof inc_votes !== "number") {
    res.status(400).send({ msg: "bad request" });
  } else {
    await updateVotes(inc_votes, article_id);
    exports.getArticle(req, res, next);
  }
};
exports.getAllArticles = (req, res, next) => {
  const sort_by = req.query.sort_by || 'created_at'
  const order= req.query.order || 'desc'
  const topic = req.query.topic
  const limit = req.query.limit || 10
  const p = req.query.p ||1
  if(!['asc','desc'].includes(order)){
    res.status(400).send({msg:'bad request',details:'invalid order query'})
  } else if(!['title','created_at','votes','article_id','comment_count','body','author','topic'].includes(sort_by)){
    res.status(400).send({msg:'bad request',details:'invalid sort_by query'})
  }  else {
  selectAllArticlesNew(sort_by,order,topic,limit,p)
    .then(({ rows: articles }) => {
      let msg='here are the articles'
      if (articles.length === 0) {
       msg="articles not found" 
      }
        articles.forEach((article) => {
          article.comment_count = parseInt(article.comment_count);
          delete article.body;
        });
        res.status(200).send({ msg, articles});
    })
    .catch(next);
  }
};
exports.postArticle = (req,res,next)=>{
  try {const {author,title,body,topic} =req.body
  insertArticle(author,title,body,topic)
      .then(({rows})=>{
          const new_article =rows[0]
          res.status(201).send({new_article})
      }).catch(next)
  } catch {res.status(400).send({msg:'bad request'})}
}
exports.deleteArticle = (req,res,next)=>{
  const article_id=req.params.article_id
  if (!/^\d+$/.test(article_id)){
      res.status(400).send({msg:'invalid id'})
  }else{
  deleteArticleSql(article_id).then(({rows})=>{
      if (rows.length===0){
          res.status(404).send({msg:'article not found'})
      } else res.sendStatus(204)
  }).catch(next)
}
}