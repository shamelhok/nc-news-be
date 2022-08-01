const express = require('express');
const app = express();
app.use(express.json());

const{getTopics, badUrl}=require('./controllers')

app.get('/api/topics',getTopics)

///////////////////////////
app.all('*', badUrl);
///////////////////////////////////////////
app.use((err, req, res, next) => {
    if(err){
        console.log(err)
        res.send(err)
    }
    });
  
module.exports = app;