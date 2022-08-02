const express = require('express');
const app = express();
app.use(express.json())

const{getTopics, badUrl, getArticle, handleCatch, patchArticle}=require('./controllers')

app.get('/api/topics',getTopics)
app.get('/api/articles/:article_id',getArticle)
app.patch('/api/articles/:article_id',patchArticle)

///////////////////////////
app.all('*', badUrl);

app.use(handleCatch);
  
module.exports = app;