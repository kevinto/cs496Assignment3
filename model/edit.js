// edit.js
// =============
var redisHelper = require('../helpers/redisHelper.js');

var title = "CS496 A2 Edit Page";

module.exports = {
  GetEditPage: function(req, res, next) {
    res.render('editpage', { title: title, isPerson: "", OS: "", email: "", number: "", date: "" });
    // var keys = ["isPerson", "OS", "email", "number", "date"];
    // redisHelper.mgetFromRedis(keys, res, ShowEdit);
  },
  
  PostEditPage: function(req, res, next) {
    var action = req.body.action;
    if (typeof(action) != "undefined" && action == "add_form_info") {
      var isPerson = typeof(req.body.isPerson) == "undefined" ? "" : req.body.isPerson;
      var OS = typeof(req.body.OS) == "undefined" ? "" : req.body.OS;
      var email = typeof(req.body.email) == "undefined" ? "" : req.body.email;
      var number = typeof(req.body.number) == "undefined" ? "" : req.body.number;
      var date = typeof(req.body.date) == "undefined" ? "" : req.body.date;
      
      var keys = [];
      var values = [];
      
      keys.push("isPerson"); 
      keys.push("OS"); 
      keys.push("email"); 
      keys.push("number"); 
      keys.push("date");
      
      values.push(isPerson);
      values.push(OS);
      values.push(email);
      values.push(number);
      values.push(date);
      
      // Add fields to the database 
      var result = redisHelper.msetIntoRedis(keys, values, res, ShowEdit);
      if (result == false) {
        console.log("Error occurred on redis insert");
      }
    }
    else {
      res.render('editpage', { title: title });
    }
  }
};

function ShowEdit(res, params) {
  res.render('editpage', { title: title, isPerson: params[0], OS: params[1], email: params[2], number: params[3], date: params[4] });
}
