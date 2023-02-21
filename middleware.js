exports.endPointNotFound = (err, req, res, next) => {
    console.log(err);
    res.status(404).send('Not found!');
  };