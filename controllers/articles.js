const {
  selectArticle,
  selectUsers,
  updateVotes,
  selectArticleNew,
  selectAllArticles,
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
  if(!['asc','desc'].includes(order)){
    res.status(400).send({msg:'bad request',details:'invalid order query'})
  } else if(!['title','created_at','votes','article_id','comment_count','body','author','topic'].includes(sort_by)){
    res.status(400).send({msg:'bad request',details:'invalid sort_by query'})
  } else{
  selectAllArticles(sort_by,order,topic)
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