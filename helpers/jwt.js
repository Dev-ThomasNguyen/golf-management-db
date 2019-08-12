const jsonWebToken = require('jsonwebtoken');
        dotenv = require('dotenv')

dotenv.config();


class JWT {

  static generateToken(user, duration) {
    const token = jsonWebToken.sign({ user }, process.env.SECRET,
      {
        expiresIn: duration,
      });

    return token;
  }

  static verifyToken(userToken) {
    if (!userToken || typeof userToken !== 'string') {
      throw new Error('Please enter a valid token.');
    }
    try {
      const decodedToken = jsonWebToken.verify(userToken, SECRETKEY);
      return decodedToken;
    } catch (err) {
      return err;
    }
  }

  static authenticateUser(req, res, next) {
    if (!req.headers.authorization) {
      return res.status(401).json({
        status: 'error',
        message: 'Authentication failed: Please supply a valid user token.'
      });
    }
    try {
      const userToken = req.headers.authorization.split(' ')[1];
      const verifiedToken = JWTHelper.verifyToken(userToken);
      if (verifiedToken.name === 'JsonWebTokenError'
        || verifiedToken.name === 'TokenExpiredError') {
        return res.status(401).json({
          status: 'error',
          message: 'Authentication failed: Please supply a valid user token.'
        });
      }
      req.user = verifiedToken.user;
      return next();
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = JWT;
