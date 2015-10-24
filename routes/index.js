var express = require('express');
var router = express.Router();
var user = require('../model/user.js');
// var view = require('../model/view.js');


// GET call for users
router.get('/users', function(req, res, next) {
  user.GetUsers(req, res, next);
});

// PUT call for users
router.put('/user/:id?', function(req, res, next) {
  user.PutUser(req, res, next);
});

// // POST call for edit page
// router.post('/', function(req, res, next) {
//   edit.PostEditPage(req, res, next);
// });

// // GET call for view page
// router.get('/view', function(req, res, next) {
//   view.GetView(req, res, next);
// });

module.exports = router;