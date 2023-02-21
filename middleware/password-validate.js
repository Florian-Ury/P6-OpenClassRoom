const passwordValidator = require('password-validator');


const passwordMiddle = new passwordValidator()
  .is().min(5)
  .is().max(100)
  .has().uppercase()
  .has().lowercase()
  .has().digits(2)
  .has().not().spaces()
  .is().not().oneOf(['Passw0rd', 'Password123']);

module.exports = passwordMiddle

