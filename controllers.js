const { gatherAllTopics, gatherAllArticlesWithCommentCount, gatherSpecificArticleById, gatherSpecificCommentsByArticleId, checkIfArticleIdExists} = require('./models')

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

exports.getSpecificArticleById = (req, res, next) => {
    gatherSpecificArticleById(req.params.article_id)
    .then((returnVal) => {
        return res.status(200).send({ article : returnVal })
    })
    .catch((err) => {
        next(err);
    })
}


exports.getSpecificCommentsByArticleId = (req, res, next) => {
    checkIfArticleIdExists(req.params.article_id)
    .then(({article_id}) => {
        gatherSpecificCommentsByArticleId(article_id)
        .then((returnVal) => {
            return res.status(200).send({ article_comments : returnVal})
        })
    })
    .catch((err) => {
        next(err)
    })
}