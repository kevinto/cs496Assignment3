var express = require('express');
var router = express.Router();
var edit = require('../model/edit.js');
var view = require('../model/view.js');


// GET call for edit page
router.get('/', function(req, res, next) {
  edit.GetEditPage(req, res, next);
});

// POST call for edit page
router.post('/', function(req, res, next) {
  edit.PostEditPage(req, res, next);
});

// GET call for view page
router.get('/view', function(req, res, next) {
  view.GetView(req, res, next);
});

module.exports = router;