const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../../../models/user');
const errors = require('../../../services/utils');
const emailService = require('../../../services/mail')
const host = "http://localhost:8080"
function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

router.route('/user')
  .post(async (req, res) => { // Add user
    let user = new User(req.body);
    if (user.password) {
      user.password = bcrypt.hashSync(user.password, 10)
    }

    //Check model
    user.save()
      .then(async response => {
        console.log(response)

        //Add email check
        const token = makeid(30)
        const add_token = await User.updateOne({_id: response._id}, { email_confirmation: token})
        
        //Send Mail
        const mail_ack = await emailService.send_mail(response.email, "Confirmation email", "Welcome to the kingfisher, please confirm your email <a href='" + host + "?confirm=" + token + "'>here</a>")
        res.json({
          status: true,
          result: response
        });
      })
      .catch(error => errors.computeDbError(res, error));
  })

router.route('/user/confirm')
  .post(async (req, res) => {
    const token = req.body.token
    const response = await User.updateOne({email_confirmation: token}, { email_confirmation: "confirmed"})
    console.log(response)
    if (response.nModified > 0){
      res.json({status: true})
    } else {
      res.json({status: false, error: "Unknown"})
    }
  })
module.exports = router;