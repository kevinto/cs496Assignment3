// user.js
// =============
var mongoose = require("mongoose");
var stock = require('../model/stock.js');

var UserSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
    dropDups: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    dropDups: true
  },
  stockAlerts: {
    type: Array,
    "default": []
  }
});
GLOBAL.UserModel = mongoose.model('users', UserSchema);

module.exports = {
  GetUsers: function(req, res, next) {
    GLOBAL.UserModel.find({}, function(err, users) {
      if (!err) {
        res.send(users);
        console.log("GET USERS COMPLETED");
      }
      else {
        console.log(err);
      }
    });
  },
  
  GetUser: function(req, res, next) {
    GLOBAL.UserModel.find({ '_id': req.params.id}, function(err, users) {
      if (!err) {
        res.send(users)
        console.log("GET USER COMPLETED");
      }
      else {
        console.log(err);
      }
    })
  },
  
  PutUser: function(req, res, next) {
    var newUser = new GLOBAL.UserModel(req.body);
    if (typeof(req.params.id) == "undefined") {
      // User key was not passed in. Try to save user as
      // a new user. Replace a matching record if it exists
      var upsertData = newUser.toObject();
      delete upsertData._id;
      GLOBAL.UserModel.findOneAndUpdate({ userId: newUser.userId }, upsertData, {upsert: true}, function(err) {
        if (!err) {
          console.log("New User created: " + newUser.userId);
          stock.UpdateUserStocks(req, res, next, "PUT COMPLETED");
        }
        else {
          console.log(err);
        }
      });
    }
    else {
      // ID was passed in. Attempt to add or replace. Beware if you specify
      // an ID type that mongoose does not recognize, then there will be an error.
      console.log("req.params.id: " + req.params.id);
      console.log("This needs to be implemented...");
      var data = newUser.toObject();
      delete data._id;
      GLOBAL.UserModel.findByIdAndUpdate(req.params.id, data, {upsert: true}, function(err) {
        if (!err) {
          console.log("New User created: " + newUser.userId);
          stock.UpdateUserStocks(req, res, next, "PUT COMPLETED");
        }
        else {
          console.log(err);
        }
      });
    }
  },
  
  PostUser: function(req, res, next) {
    var newUser = new GLOBAL.UserModel(req.body);
    var upsertData = newUser.toObject();
    delete upsertData._id;
    
    if (newUser.userId == null || newUser.email == null || newUser.firstName == null || newUser.lastName == null)
    {
      res.send("Post did not update or add a user because of missing fields. The required fields are: userId, email, firstName, lastName");
    }
    
    GLOBAL.UserModel.findOneAndUpdate({ userId: newUser.userId, email: newUser.email }, upsertData, {upsert: true}, function(err) {
      if (!err) {
        stock.UpdateUserStocks(req, res, next, "PUT COMPLETED");
      }
      else {
        console.log(err);
      }
    });
  },
  
  DeleteUser: function(req, res, next) {
    var user = new GLOBAL.UserModel(req.body);
    if (typeof(req.params.id) == "undefined" && user.userId == null)
    {
      res.send("Need id in url params or userId in request body in order to delete user");
      return;
    }
    
    if (typeof(req.params.id) != "undefined")
    {
      // Delete by id
      GLOBAL.UserModel.findByIdAndRemove(req.params.id, function(err) {
        if (!err) {
          console.log("DELETE COMPLETED");
          stock.CleanUpStocks(req, res, next, "DELETE COMPLETED");
        }
        else {
          console.log(err);
        }
      });     
    }
    else {
      // Delete by userId 
      GLOBAL.UserModel.findOneAndRemove({ userId: user.userId }, function(err) {
        if (!err) {
          console.log("DELETE COMPLETED");
          stock.CleanUpStocks(req, res, next, "DELETE COMPLETED");
        }
        else {
          console.log(err);
        }
      }); 
    }
  }
};