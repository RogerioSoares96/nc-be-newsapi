const db = require('./db/connection');

exports.gatherAllTopics = () => {
    return db
    .query(`SELECT * FROM topics;`)
    .then((queryResult) => {
        return queryResult.rows;
    });
};

exports.gatherAllArticlesWithCommentCount = () => {
    return db
    .query(`SELECT articles.* , CAST(COALESCE(SUM(comments.article_id),0) AS INT) AS comment_count 
            FROM articles 
            LEFT JOIN comments ON articles.article_id = comments.article_id 
            GROUP BY articles.article_id
            ORDER BY articles.created_at DESC;`)
    .then((queryResult) => {
        return queryResult.rows
    })
};

exports.gatherSpecificArticleById = (articleId) => {
    queryParams = [];
    queryParams.push(articleId);
    return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, queryParams)
    .then((queryResult) => {
        if (queryResult.rows.length === 0) {
            return Promise.reject('article not found')
        } else {
            return queryResult.rows[0]
        }
    });
};

exports.gatherSpecificCommentsByArticleId = (articleId) => {
    queryParams = [];
    queryParams.push(articleId);
    return db
    .query(`SELECT * 
            FROM comments 
            WHERE article_id = $1 ORDER BY created_at DESC;`, queryParams)
    .then((queryResult) => {
        return queryResult.rows
    });
};

exports.checkIfArticleIdExists = (articleId) => {
    queryParams = [];
    queryParams.push(articleId);
    return db
    .query(`SELECT article_id FROM articles WHERE article_id = $1;`, queryParams)
    .then((queryResult) => {
        if (queryResult.rows.length === 0) {
            return Promise.reject('id not found')
        } else {
            return queryResult.rows[0]
        }
    });
};