const { gatherAllTopics, gatherAllArticlesWithCommentCount } = require('./models')

exports.getAllTopics = (req, res, next) => {
    gatherAllTopics().then((returnVal) => {
        return res.status(200).send({ topics : returnVal });
   });
};

exports.getAllArticlesWithCommentCount = (req, res, next) => {
    gatherAllArticlesWithCommentCount().then((returnVal) => {
        return res.status(200).send({ articles : returnVal }); 
    });
};