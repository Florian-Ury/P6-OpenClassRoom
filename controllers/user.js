const bcrypt = require('bcrypt');
const User = require('../models/Users');
const jwt = require('jsonwebtoken');
const pwd = require('../middleware/password-validate');
require('dotenv').config();


exports.signup = (req, res) => {
  if (pwd.validate(req.body.password)) {
      bcrypt.hash(req.body.password, 10)
        .then(hash => {
          const user = new User({
            email : req.body.email,
            password : hash
          });
          user.save()
            .then( () => res.status(201).json({message : 'Utilisateur crée ! '}))
            .catch(error => res.status(400).json({error}));
        })
        .catch(error => res.status(500).json({error}));
  } else {
    res.status(401).json({error : "Paire identifiant/mot de passe incorrecte."})
  }
};

exports.login = (req, res) => {
  User.findOne({email : req.body.email})
    .then( user => {
      if (user === null) {
        res.status(401).json({error : "Paire identifiant/mot de passe incorrecte."});
      } else {
        bcrypt.compare(req.body.password, user.password)
          .then(valid => {
            if (!valid) {
              res.status(401).json({error : "Paire identifiant/mot de passe incorrecte."});
            } else {
              res.status(200).json({
                userId : user._id,
                token: jwt.sign(
                  { userId : user._id},
                  process.env.SECRET_TOKEN,
                  { expiresIn : '24h'}
                )
              });
            }
          })
          .catch( error => res.status(500).json({error}))
      }
    })
    .catch(error => {
      res.status(500).json({error});
    })
};


