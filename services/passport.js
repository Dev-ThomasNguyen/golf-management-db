
const passport = require('passport')
const  GoogleLogin = require('../controllers/googleLogin')
const  FacebookLogin = require('../controllers/facebookLogin')

module.exports = (app) => {
  app.use(passport.initialize());
  FacebookLogin.facebookStrategy();
  GoogleLogin.googleStrategy();
};
