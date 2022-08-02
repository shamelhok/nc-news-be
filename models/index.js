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