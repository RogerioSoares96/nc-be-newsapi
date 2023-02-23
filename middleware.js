exports.psqlError = (err, req, res, next) => {
    if (err.code === '22P02') {
      res.status(400).send('Invalid Article');
    } else {
      next(err);
    }
};

exports.customErrorHandler = (err, req, res, next) => {
  if (err === 'article not found') {
    res.status(404).send({ msg: 'article not found'});
  } else if (err === 'id not found') {
    res.status(404).send({ msg: 'id not found'});
  } else {
    next(err);
  }
}
exports.endPointNotFound = (err, req, res, next) => {
    res.status(404).send('Not found!');
};
  
exports.serverError = (err, req, res, next) => {
    console.log(err);
    res.status(500).send('Internal Server Error');
};