const { gatherAllTopics } = require('./models')

exports.getAllTopics = (req, res, next) => {
    gatherAllTopics().then((returnValue) => {
        return res.status(200).send({ topics : returnValue });
   });
};