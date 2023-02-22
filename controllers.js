const { gatherAllTopics, gatherAllArticlesWithCommentCount, gatherSpecificArticleById } = require('./models')

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
    const articleId  = Number(req.params.article_id)
    if (Number.isInteger(articleId)) {
        gatherSpecificArticleById(articleId).then((returnVal) => {
            return res.status(200).send({ article : returnVal })
        });
    } else {
        return res.status(400).send({ msg : 'Bad Request Buddy !'}) // How to use error handling
    }
};