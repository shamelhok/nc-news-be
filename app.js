const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json())

const{getTopics, badUrl, getArticle, handleCatch, patchArticle, getUsers, getAllArticles, getComments, postComment, deleteComment, getEndpoints, postArticle, postTopic, deleteArticle}=require('./controllers');
const { getUserByUsername } = require('./controllers/users');
const { patchComment } = require('./controllers/comments');

app.get('/api/topics',getTopics)
app.get('/api/articles/:article_id',getArticle)
app.patch('/api/articles/:article_id',patchArticle)
app.get('/api/users/:username',getUserByUsername)
app.get('/api/users',getUsers)
app.get('/api/articles',getAllArticles)
app.get('/api/articles/:article_id/comments',getComments)
app.post('/api/articles/:article_id/comments',postComment)
app.delete('/api/comments/:comment_id',deleteComment)
app.patch('/api/comments/:comment_id',patchComment)
app.get('/api',getEndpoints)
app.post('/api/articles',postArticle)
app.post('/api/topics',postTopic)
app.delete('/api/articles/:article_id',deleteArticle)
///////////////////////////
app.all('*', badUrl);

app.use(handleCatch);
  
module.exports = app;