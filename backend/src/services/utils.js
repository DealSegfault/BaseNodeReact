const axios = require("axios")
const computeDbResponse = (res, response) => {
  if (response) {
    if (response.n <= 0) {
      res.status(500).send({
        status: false,
        code: 'NOTFOUND',
        result: response
      });
    } else if (response.nModified <= 0) {
      res.status(500).send({
        status: false,
        code: 'NOTMODIFIED',
        result: response
      });
    } else {
      res.json({
        status: true,
        result: response
      });
    }
  } else {
    res.status(500).send({
      status: false,
      code: 'ERROR',
      result: response
    });
  }
}

const computeDbError = (res, error) => {
  switch (error.name) {
    case 'ValidationError':
      res.status(200).send({
        status: false,
        code: 'NOTVALID',
        result: `The given information is incomplete`
      });
      break;
    case 'MongoError':
      if (error.code === 11000) {
        let field = error.errmsg.split('index: ')[1];
        field = field.split(' dup key')[0];
        field = field.substring(0, field.lastIndexOf('_'));
        res.status(200).send({
          status: false,
          code: 'DUPLICATEKEY',
          field,
          result: `Sorry this ${field} already exists`
        });
      }
      break;
    default:
      res.status(200).send({
        status: false,
        code: 'DBERROR',
        result: `Oops something went wrong with our database...`
      });
      
  }
}

const fetch_profile = (token) => {
  return new Promise((resolve, reject) => {
    const request = axios
      .get('http://localhost:7778/api/account', {
        headers: {
          Authorization: token,
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
      })
      .then((result) => {
        resolve(result.data)
      })
      .catch((error) => resolve(error.data))
  })
}

module.exports = {
  computeDbResponse,
  computeDbError,
  fetch_profile
}