var express = require('express');
var router = express.Router();
var user = require('../model/user.js');
var stock = require('../model/stock.js');

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

// DELETE call to delete a user by ID or by userId
router.delete('/user/:id?', function(req, res, next) {
  user.DeleteUser(req, res, next);
});

// GET call to get all stocks monitored by the system
router.get('/stocks/', function(req, res, next) {
  stock.GetAllMonitoredStocks(req, res, next);
});

// POST call to update a specific users stocks
router.post('/stock/', function(req, res, next) {
  stock.UpdateUserStocks(req, res, next);
});

// DELETE call to clean up any stocks that arent monitored by users
router.delete('/stocks/', function(req, res, next) {
  stock.CleanUpStocks(req, res, next);
});

module.exports = router;