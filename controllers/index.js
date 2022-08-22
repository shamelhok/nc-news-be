const{getTopics, postTopic}= require('./topics')
const{getArticle, patchArticle, getAllArticles, postArticle, deleteArticle }= require('./articles')
const { getUsers } = require('./users')
const { getComments, postComment, deleteComment } = require('./comments')
const endpoints = require ('../endpoints.json')

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
exports.getEndpoints = (req,res,next)=>{
    res.status(200).send({endpoints})
}
exports.postArticle= postArticle
exports.postTopic= postTopic
exports.deleteArticle= deleteArticle