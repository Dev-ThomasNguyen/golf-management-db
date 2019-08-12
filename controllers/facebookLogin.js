
const passport = require('passport'),
    dotenv = require('dotenv'),
    FacebookStrategy = require('passport-facebook').Strategy,
    JWT = require('../helpers/jwt'),
    Employee = require("../models/employee");

// import passwordHash from '../../../helpers/auth/passwordHash';

dotenv.config();
const { FACEBOOK_APP_ID, FACEBOOK_APP_SECRET,
  FACEBOOK_CALLBACK_URL } = process.env;
const duration = '1d';

class FaceBookLogin {

  static facebookStrategy() {
    passport.use(new FacebookStrategy({
      clientID: FACEBOOK_APP_ID,
      clientSecret: FACEBOOK_APP_SECRET,
      callbackURL: FACEBOOK_CALLBACK_URL,
    }, FaceBookLogin.facebookCallback));
  }

  static async facebookCallback(accessToken, refreshToken, profile, done) {
    const names = profile.displayName.split(' ');
    console.log('this is the names', names[0])
    const userData = {
      firstName: names[0],
      lastName: names[1],
      email: `${profile.id}@facebook.com`,
      token: accessToken,
    };
    console.log('this is the email of the data that is needed', userData.email)
    const employeeInstance = new Employee(
        null,
        userData.firstName,
        userData.lastName,
        null,
        userData.email,
        null,
        new Date(),
        null,
        null,
        null,

    );
    const employeeData = await employeeInstance.getEmployeeByEmail()
    console.log('I should get down here')
    if(employeeData === 'No data returned from the query.'){
        const user = await employeeInstance.save()
        delete user.password
        const token = JWT.generateToken(user, duration); 
        userData.token = token;
        userData.isNewUser = true;
        userData.userInfo = user;
        done(null, userData);

    }else{
        delete employeeData.password;
        employeeData.email = userData.email;
        const token = JWT.generateToken(employeeData, duration);
        userData.token = token;
        userData.isNewUser = true;
        userData.userInfo = employeeData;
        done(null, userData);
    }
  }

  /**
   * @param {object} req
   * @param {object} res
   * @returns {object} response
   */
  static facebookControllerCallback(req, res) {
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

module.exports = FaceBookLogin;
