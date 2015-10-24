var express = require('express');
var router = express.Router();
var user = require('../model/user.js');

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

// POST call to update or add a user without an ID
router.post('/user', function(req, res, next) {
  user.PostUser(req, res, next);
});

module.exports = router;