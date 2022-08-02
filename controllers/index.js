const{getTopics}= require('./topics')
const{getArticle, patchArticle, getAllArticles }= require('./articles')
const { getUsers } = require('./users')

exports.getTopics= getTopics
exports.getArticle=getArticle
exports.badUrl= require('./errorhandling').badUrl
exports.handleCatch= require('./errorhandling').handleCatch
exports.patchArticle=patchArticle
exports.getUsers = getUsers
exports.getAllArticles= getAllArticles