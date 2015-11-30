var express = require('express');
var router = express.Router();
var user = require('../model/user.js');
var stock = require('../model/stock.js');
var jwt    = require('jsonwebtoken');
var app = require('../app');

// USED
// POST call to authenticate a user and return a token to be used
// with all other calls
router.post('/login', function(req, res, next) {
  user.Authenticate(req, res, next);
});

// USED
// POST call to authenticate a user and return a token to be used
// with all other calls
router.put('/register', function(req, res, next) {
  user.Register(req, res, next);
});

// Require all calls past this point to have user tokens to be able to access
// the functionality
router.use(function(req, res, next) {
  var token = req.body.token || req.query.token || req.headers['x-access-token'];
  
  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, app.get('secret'), function(err, decoded) {
      if (err) {
        return res.json({
          success: false,
          message: 'Failed to authenticate token.'
        });
      }
      else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });

  }
  else {

    // if there is no token
    // return an error
    return res.status(403).send({
      success: false,
      message: 'No token provided.'
    });

  }
});

// USED
// Get call to get a specific user with token support!
router.get('/user', function(req, res, next) {
  user.GetUser(req, res, next);
});

// USED
// POST call to update or add a user without an ID
router.post('/user', function(req, res, next) {
  user.PostUser(req, res, next);
});

// POST call to update a specific users stocks
router.post('/stock/', function(req, res, next) {
  stock.UpdateUserStocks(req, res, next);
});

// GET call to get all users 
router.get('/users', function(req, res, next) {
  user.GetUsers(req, res, next);
});

// PUT call to replace a user by ID or to add a new user
router.put('/user/:id?', function(req, res, next) {
  user.PutUser(req, res, next);
});

// Get call to get a specific user 
router.get('/user/:id', function(req, res, next) {
  user.GetUser(req, res, next);
});

// GET call to get user info by userId 
router.get('/users/userid/:userid', function(req, res, next) {
  user.GetUserByUserId(req, res, next);
});

// DELETE call to delete a user by ID or by userId
router.delete('/user/:id?', function(req, res, next) {
  user.DeleteUser(req, res, next);
});

// GET call to get all stocks monitored by the system
router.get('/stocks/', function(req, res, next) {
  stock.GetAllMonitoredStocks(req, res, next);
});

// DELETE call to clean up any stocks that arent monitored by users
router.delete('/stocks/', function(req, res, next) {
  stock.CleanUpStocks(req, res, next);
});

module.exports = router;