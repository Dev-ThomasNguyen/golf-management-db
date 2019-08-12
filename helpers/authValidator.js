
class AuthValidator {

  static authInputValidator(req, res, next) {
    const emailReg = (/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/);
    const alphaOnly = (/^[a-zA-Z0-9]*$/);
    const whitespace = (/([\s]+)/g);
    const email = req.body.email
    const password = req.body.password;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Please fill all field'
      });
    }
    if (typeof email !== 'string'
    || typeof password !== 'string') {
      return res.status(400).json({
        status: 'error',
        error: 'Invalid input type'
      });
    }
    if (password.match(whitespace) || email.match(whitespace)) {
      return res.status(400).json({
        status: 'error',
        error: 'White spaces are not allowed in input'
      });
    }
    if (password.length < 6) {
      return res.status(400)
        .json({
          status: 'error',
          error: 'Password can only be six character and above'
        });
    }
    if (!email.match(emailReg)) {
      return res.status(400)
        .json({
          status: 'error',
          error: 'Please Enter a valid Email'
        });
    }
    if (!password.match(alphaOnly)) {
      return res.status(400)
        .json({
          status: 'error',
          error: 'Password can only be alphabets and numbers'
        });
    }
    if (email.length > 30) {
      return res.status(400).json({
        status: 'error',
        error: 'Email should be less than 30 char'
      });
    }
    if (password.length > 40) {
      return res.status(400).json({
        status: 'error',
        error: 'Password must be less than 40 char'
      });
    }
    next();
  }
}

module.exports = AuthValidator;
