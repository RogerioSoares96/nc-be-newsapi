const { gatherAllTopics,
    gatherAllArticlesWithCommentCount,
    gatherSpecificArticleById,
    gatherSpecificCommentsByArticleId,
    checkIfArticleIdExistsAndReturnIt,
    addCommentByArticleId,
    updateVotesByArticleId,
    gatherAllUsers } = require('./models')

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
};


exports.getSpecificCommentsByArticleId = (req, res, next) => {
    checkIfArticleIdExistsAndReturnIt(req.params.article_id)
    .then(({article_id}) => {
        gatherSpecificCommentsByArticleId(article_id)
        .then((returnVal) => {
            return res.status(200).send({ article_comments : returnVal})
        })
    })
    .catch((err) => {
        next(err)
    })
};

exports.postCommentByArticleId = (req, res, next) => {
    const commentBody = req.body.body;
    const commentAuthor = req.body.username;
    checkIfArticleIdExistsAndReturnIt(req.params.article_id)
    .then(({article_id}) => {
        addCommentByArticleId(article_id, commentBody, commentAuthor)
        .then((returnVal) => {
            return res.status(201).send({ comment: returnVal })
        })
        .catch((err) => {
            next(err)
        })
    })
    .catch((err) => {
        next(err)
    })
};

exports.patchArticleVotesByArticleId = (req, res, next) => {
    const votesToUpdate = req.body.inc_votes
    checkIfArticleIdExistsAndReturnIt(req.params.article_id)
    .then(({article_id, votes}) => {
        updateVotesByArticleId(article_id, votes, votesToUpdate)
        .then((returnVal) => {
            return res.status(201).send({ article: returnVal })
        })
        .catch((err) => {
            next(err)
        })
    })
    .catch((err) => {
        next(err)
    })
};

exports.getAllUsers = (req, res, next) => {
    gatherAllUsers().then((returnVal) => {
        return res.status(200).send({ users : returnVal });
   });
};