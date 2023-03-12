const { query } = require('./db/connection');
const db = require('./db/connection');

exports.gatherAllTopics = () => {
    return db
    .query(`SELECT * FROM topics;`)
    .then((queryResult) => {
        return queryResult.rows;
    });
};

exports.gatherAllArticlesWithCommentCount = (queries) => {
    //refactor for simnplicity
     return Promise.all([db.query(`SELECT slug FROM topics;`), 
     db.query(`SELECT * FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'articles';`)])
     .then((values) => {
         const validQueryKeys = ['topic', 'sort_by', 'order']
         const validOrderOptions = ['asc', 'desc'];
         const validTopicSlugs = values[0].rows.map((row) => row.slug);
         const validColumnNames = values[1].rows.map((row) => {
             if (row.column_name !== 'body' || row.column_name !== 'article_img_url') {
                 return row.column_name
             }
         })

         const checkedQueryKeys = Object.keys(queries).filter((key) => !validQueryKeys.includes(key))

         if (checkedQueryKeys.length) {
             return Promise.reject('query key not found')
         }
         if (queries.topic && !validTopicSlugs.includes(queries.topic)) {
             return Promise.reject('topic is invalid')
         }
         if (queries.sort_by && !validColumnNames.includes(queries.sort_by)) {
             return Promise.reject('sorting selection is invalid')
         }
         if (queries.order && !validOrderOptions.includes(queries.order)) {
            return Promise.reject('order selection is invalid')
         }

        const queryParams = [];

        let queryString = `SELECT articles.* , CAST(COALESCE(SUM(comments.article_id),0) AS INT) AS comment_count 
        FROM articles 
        LEFT JOIN comments ON articles.article_id = comments.article_id`;

        if (queries.topic !== undefined) {
            queryParams.push(queries.topic)
            queryString += ` WHERE topic = $1`
        }

        queryString += ` GROUP BY articles.article_id`
        
        if (queries.sort_by !== undefined) {
            queryString += ` ORDER BY articles.${queries.sort_by}`
        } else {
            queryString += ` ORDER BY articles.created_at`;
        }

        if (queries.order !== undefined) {
            const upperCaseOrder = queries.order.toUpperCase()
            queryString += ` ${upperCaseOrder};`
        } else {
            queryString += ` DESC;`
        }

        return db
        .query(queryString, queryParams)
        .then((queryResult) => {
            return queryResult.rows
        })
    })
}


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