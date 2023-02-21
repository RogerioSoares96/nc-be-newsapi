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