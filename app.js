const express = require('express');
const app = express();
app.use(express.json())

const{getTopics, badUrl, getArticle, handleCatch, patchArticle, getUsers, getAllArticles, getComments, postComment, deleteComment, getEndpoints}=require('./controllers')

app.get('/api/topics',getTopics)
app.get('/api/articles/:article_id',getArticle)
app.patch('/api/articles/:article_id',patchArticle)
app.get('/api/users',getUsers)
app.get('/api/articles',getAllArticles)
app.get('/api/articles/:article_id/comments',getComments)
app.post('/api/articles/:article_id/comments',postComment)
app.delete('/api/comments/:comment_id',deleteComment)
app.get('/api',getEndpoints)
///////////////////////////
app.all('*', badUrl);

app.use(handleCatch);
  
module.exports = app;