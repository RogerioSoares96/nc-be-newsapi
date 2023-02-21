const { getAllTopics, getAllArticlesWithCommentCount } = require('./controllers')
const { endPointNotFound } = require('./middleware');
const express = require('express');
const app = express();

app.use(express.json())

app.get('/api/topics', getAllTopics);

app.get('/api/articles', getAllArticlesWithCommentCount);

app.use(`*`, endPointNotFound);

module.exports = app;