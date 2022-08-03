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
exports.selectAllArticles=(sort_by='created_at',order='desc')=>{
    if(sort_by==='author'){ sort_by= 'users.name'}
    return db.query(`SELECT title, COUNT(comment_id) AS comment_count, articles.article_id, topic, users.name AS author, articles.body, articles.created_at, articles.votes 
    FROM articles LEFT JOIN comments on articles.article_id=comments.article_id JOIN users ON articles.author = users.username GROUP BY articles.article_id, users.name ORDER BY ${sort_by} ${order}
   ;`)
}
exports.selectComments = (id)=>{
    return db.query(`SELECT comment_id, comments.votes, comments.created_at, comments.author, comments.body FROM comments JOIN articles ON articles.article_id=comments.article_id WHERE articles.article_id =$1
    ;`,[id])
}
exports.insertComment = (id,author,body)=>{
    return db.query (`INSERT INTO comments (author, body,  article_id)
    VALUES ($1,$2,$3) RETURNING *;`,[author,body,id])
}