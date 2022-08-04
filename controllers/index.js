const{getTopics}= require('./topics')
const{getArticle, patchArticle, getAllArticles }= require('./articles')
const { getUsers } = require('./users')
const { getComments, postComment, deleteComment } = require('./comments')

exports.getTopics= getTopics
exports.getArticle=getArticle
exports.badUrl= require('./errorhandling').badUrl
exports.handleCatch= require('./errorhandling').handleCatch
exports.patchArticle=patchArticle
exports.getUsers = getUsers
exports.getAllArticles= getAllArticles
exports.getComments=getComments
exports.postComment= postComment
exports.deleteComment = deleteComment
