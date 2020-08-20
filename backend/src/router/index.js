const express = require('express');
const router = express.Router();
const passport = require('passport');

router.use((req, res, next) => {
  // console.log('Something is happening.');
  next();
});

router.use('/api', require('./controllers/auth'));
router.use('/api', require('./controllers/user/user'));


router.use('/api', passport.authenticate('jwt', {session: false}), require('./controllers/user/account'));
router.use('/api', passport.authenticate('jwt', {session: false}),require('./controllers/user/profile'));
router.use('/api', passport.authenticate('jwt', {session: false}), require('./controllers/user/password'));


module.exports = router;