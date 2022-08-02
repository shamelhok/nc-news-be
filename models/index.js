const db = require(`${__dirname}/../db/connection.js`)

exports.selectTopics =()=>{
    return db.query('SELECT * FROM topics;')
}
exports.selectArticle = (id)=>{
    return db.query(`SELECT * FROM articles WHERE article_id = $1;`,[id])
}
exports.selectUsers=()=>{
    return db.query('SELECT * FROM users;')
}
exports.updateVotes = (votes,id)=>{
    return db.query(`UPDATE articles SET votes = votes +$1 WHERE article_id =$2 RETURNING *;`,[votes,id])
}
exports.selectArticleNew =(id)=>{
    return db.query(`SELECT title, COUNT(comment_id) AS comment_count, articles.article_id, topic, articles.author, articles.body, articles.created_at, articles.votes 
    FROM articles LEFT JOIN comments on articles.article_id=comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id 
   ;`,[id])
}
exports.selectAllArticles=()=>{
    return db.query(`SELECT title, COUNT(comment_id) AS comment_count, articles.article_id, topic, articles.author, articles.body, articles.created_at, articles.votes 
    FROM articles LEFT JOIN comments on articles.article_id=comments.article_id GROUP BY articles.article_id ORDER BY articles.created_at desc
   ;`)
}