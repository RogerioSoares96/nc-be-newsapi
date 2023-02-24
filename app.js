const { getAllTopics,
        getAllArticlesWithCommentCount, 
        getSpecificArticleById, 
        getSpecificCommentsByArticleId, 
        postCommentByArticleId, 
        patchArticleVotesByArticleId} = require('./controllers')
const { endPointNotFound, serverError, psqlError, customErrorHandler } = require('./middleware');
const express = require('express');
const app = express();

app.use(express.json())

app.get('/api/topics', getAllTopics);

app.get('/api/articles', getAllArticlesWithCommentCount);

app.get('/api/articles/:article_id', getSpecificArticleById);

app.get('/api/articles/:article_id/comments', getSpecificCommentsByArticleId);

app.post('/api/articles/:article_id/comments', postCommentByArticleId);

app.patch('/api/articles/:article_id', patchArticleVotesByArticleId);

app.all(`*`, endPointNotFound);

app.use(psqlError);
app.use(customErrorHandler);
app.use(serverError);

module.exports = app;