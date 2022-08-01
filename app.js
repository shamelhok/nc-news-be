const express = require('express');
const app = express();


const{getTopics, badUrl, getArticle, handleCatch}=require('./controllers')

app.get('/api/topics',getTopics)
app.get('/api/articles/:article_id',getArticle)

///////////////////////////
app.all('*', badUrl);

app.use(handleCatch);
  
module.exports = app;