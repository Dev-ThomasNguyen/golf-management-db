

const passport = require('passport')
googleStrategyOauth2 = require('passport-google-oauth')
JWT = require('../helpers/jwt');
Employee = require("../models/employee");

const duration = '1d';
class GoogleLogin {

  static googleStrategy() {
    const GoogleStrategy = googleStrategyOauth2.OAuth2Strategy;
    passport.use(
      new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL
      }, GoogleLogin.googleStrategyCallback)
    );
  }


  static async googleStrategyCallback(accessToken, refreshToken,
    profile, done) {
    const userData = {
      email: profile.emails[0].value,
      firstName: profile.name.givenName,
      lastName: profile.name.familyName,
      profile,
    };
    const employeeInstance = new Employee(
        null,
        profile.name.givenName,
        profile.name.familyName,
        null,
        profile.emails[0].value,
        null,
        new Date(),
        null,
        null,
        null,

    );
    const employeeData = await employeeInstance.getEmployeeByEmail()
    if(employeeData === 'No data returned from the query.'){
        const user = await employeeInstance.save()
        delete user.password
        const token = JWT.generateToken(user, duration); 
        userData.token = token;
        userData.isNewUser = true;
        userData.userInfo = user;
        done(null, userData);

    }else{
        delete employeeData.password
        const token = JWT.generateToken(employeeData, duration);
        userData.token = token;
        userData.isNewUser = true;
        userData.userInfo = employeeData;
        done(null, userData);
    }
  }


  static async googleCallback(req, res) {
    const isNewUser = req.user.isNewUser;
    const token = req.user.token
    if (isNewUser) {
      return res.status(201).json({
        status: 'success',
        message: 'Registration Successful',
        user: req.user.userInfo,
        token,
      });
    }
    return res.status(200).json({
      status: 'success',
      message: 'Login Successful',
      user: req.user.userInfo,
      token,
    });
  }
}


module.exports = GoogleLogin;
