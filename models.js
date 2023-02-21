const db = require('./db/connection');

exports.gatherAllTopics = () => {
    return db
    .query(`SELECT * FROM topics;`)
    .then((queryResult) => {
        return queryResult.rows;
    });
};