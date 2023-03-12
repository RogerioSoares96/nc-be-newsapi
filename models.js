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

exports.checkIfArticleIdExistsAndReturnIt = (articleId) => {
    queryParams = [];
    queryParams.push(articleId);
    return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, queryParams)
    .then((queryResult) => {
        if (queryResult.rows.length === 0) {
            return Promise.reject('id not found')
        } else {
            return queryResult.rows[0]
        }
    });
};

exports.addCommentByArticleId = (articleId, commentBody, commentAuthor) => {
    queryParams = [];
    queryParams.push(articleId)
    queryParams.push(commentBody)
    queryParams.push(commentAuthor)
    return db
    .query(`INSERT INTO comments (article_id, body, author) 
            VALUES ($1, $2, $3) RETURNING *;`, queryParams)
    .then((queryResult) => {
        return queryResult.rows[0]
    })
    .catch((err) => {
        return Promise.reject(err)
    })
};

exports.updateVotesByArticleId = (articleId, votes, votesToUpdate) => {
    let updatedVotes = votes + votesToUpdate
    if (updatedVotes < 0) updatedVotes = 0 
    queryParams = []
    queryParams.push(updatedVotes)
    queryParams.push(articleId)
    return db
    .query(`UPDATE articles 
            SET votes = $1
            WHERE article_id = $2 RETURNING *;`, queryParams)
    .then((queryResult) => {
        return queryResult.rows[0];
    })
    .catch((err) => {
        return Promise.reject(err);
    })
};

exports.gatherAllUsers = () => {
    return db
    .query(`SELECT * from users;`)
    .then((queryResult) => {
        return queryResult.rows;
    })
}