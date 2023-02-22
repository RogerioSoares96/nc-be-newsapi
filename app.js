const { getAllTopics, getAllArticlesWithCommentCount, getSpecificArticleById} = require('./controllers')
const { endPointNotFound, serverError, psqlError, customErrorHandler } = require('./middleware');
const express = require('express');
const app = express();

app.use(express.json())

app.get('/api/topics', getAllTopics);

app.get('/api/articles', getAllArticlesWithCommentCount);

app.get('/api/articles/:article_id', getSpecificArticleById);


//app.use(`*`, endPointNotFound); app.all
app.use(psqlError);
app.use(customErrorHandler);
app.use(serverError);

module.exports = app;