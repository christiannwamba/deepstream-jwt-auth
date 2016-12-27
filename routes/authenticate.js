var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();

router.post('/', function(req, res) {
  
  var users = {
    wolfram: {
      username: 'wolfram',
      password: 'password'
    },
    phillipp: {
      username: 'phillipp',
      password: 'password'
    },
    chris: {
      username: 'chris',
      password: 'password'
    }
  }

  var user = users[req.body.authData.username];

  if (!user) {
      res.status(403).send('Invalid User')
    } else {
      // check if password and username matches
      if (user.username != req.body.authData.username || user.password != req.body.authData.password) {
        res.status(403).send('Invalid Password')
      } else {

        
        // if user is found and password is right
        // create a token
        var token = jwt.sign(user, 'abrakadabra');


        // return the information including token as JSON
        res.status(200).send({
          username: user.username,
          clientData: { 
            success: true,
            message: 'Have your token!', 
            token: token,
            user: user
          },
        });
      }   
    }
});

module.exports = router;
