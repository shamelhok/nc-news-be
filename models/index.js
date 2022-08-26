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
exports.selectUserByUsername=(username)=>{
    return db.query('SELECT * FROM users WHERE username = $1;',[username])
}
exports.updateVotes = (votes,id)=>{
    return db.query(`UPDATE articles SET votes = votes +$1 WHERE article_id =$2 RETURNING *;`,[votes,id])
}
exports.updateCommentVotes = (votes,id)=>{
    return db.query(`UPDATE comments SET votes = votes +$1 WHERE comment_id =$2 RETURNING *;`,[votes,id])
}
exports.selectArticleNew =(id)=>{
    return db.query(`SELECT title, COUNT(comment_id) AS comment_count, articles.article_id, topic, articles.author, articles.body, articles.created_at, articles.votes 
    FROM articles LEFT JOIN comments on articles.article_id=comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id 
   ;`,[id])
}
exports.selectAllArticles=(sort_by='created_at',order='desc',topic)=>{
    if(sort_by==='author'){ sort_by= 'users.name'}
    let filter =''
    let array =[]
    if(topic){
        filter = ` WHERE topic = $1 `
        array.push(topic)
    }
    return db.query(`SELECT title, COUNT(comment_id) AS comment_count, articles.article_id, topic, users.name AS author, articles.body, articles.created_at, articles.votes 
    FROM articles LEFT JOIN comments on articles.article_id=comments.article_id JOIN users ON articles.author = users.username ${filter} GROUP BY articles.article_id, users.name ORDER BY ${sort_by} ${order}
   ;`,array )
}
exports.selectComments = (id)=>{
    return db.query(`SELECT comment_id, comments.votes, comments.created_at, comments.author, comments.body FROM comments JOIN articles ON articles.article_id=comments.article_id WHERE articles.article_id =$1
    ;`,[id])
}
exports.insertComment = (id,author,body)=>{
    return db.query (`INSERT INTO comments (author, body,  article_id)
    VALUES ($1,$2,$3) RETURNING *;`,[author,body,id])
}
exports.deleteCommentSql= (comment_id)=>{
    return db.query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *;`,[comment_id])
}
exports.insertArticle = (author,title, body,topic)=>{
    return db.query (`INSERT INTO articles (author, title, body,topic)
    VALUES ($1,$2,$3,$4) RETURNING *;`,[author,title, body,topic])
}
exports.insertTopic = (slug,description)=>{
    return db.query (`INSERT INTO topics (slug,description)
    VALUES ($1,$2) RETURNING *;`,[slug,description])
}
exports.deleteArticleSql= (id)=>{
    return db.query(`DELETE FROM articles WHERE article_id = $1 RETURNING *;`,[id])
}
exports.selectAllArticlesNew=(sort_by='created_at',order='desc',topic,limit=10,p=1)=>{
    if(sort_by==='author'){ sort_by= 'users.name'}
    let filter =''
    let array =[limit,(p-1)*limit]
    if(topic){
        filter = ` WHERE topic = $3 `
        array.push(topic)
    }
    return db.query(`SELECT title, COUNT(comment_id) AS comment_count, articles.article_id, topic, users.name AS author, articles.body, articles.created_at, articles.votes 
    FROM articles LEFT JOIN comments on articles.article_id=comments.article_id JOIN users ON articles.author = users.username ${filter} GROUP BY articles.article_id, users.name ORDER BY ${sort_by} ${order}
    LIMIT $1 OFFSET $2;`,array )
}
exports.insertUser = (username,name,avatar_url)=>{
    return db.query (`INSERT INTO users (username,name,avatar_url)
    VALUES ($1,$2,$3) RETURNING *;`,[username,name,avatar_url])
}