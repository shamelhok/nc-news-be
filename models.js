const db = require(`${__dirname}/db/connection.js`)

exports.selectTopics =()=>{
    return db.query('SELECT * FROM topics;')
}