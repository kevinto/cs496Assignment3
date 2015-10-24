// user.js
// =============
var mongoose = require("mongoose");

var title = "CS496 A2 Edit Page";

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
var UserModel = mongoose.model('users', UserSchema);


module.exports = {
  GetUsers: function(req, res, next) {
    UserModel.find({}, function(err, users) {
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
    UserModel.find({ '_id': req.params.id}, function(err, users) {
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
    var newUser = new UserModel(req.body);
    if (typeof(req.params.id) == "undefined") {
      // User key was not passed in. Try to save user as
      // a new user. Replace a matching record if it exists
      var upsertData = newUser.toObject();
      delete upsertData._id;
      UserModel.findOneAndUpdate({ userId: newUser.userId }, upsertData, {upsert: true}, function(err) {
        if (!err) {
          console.log("New User created: " + newUser.userId);
          res.send("PUT COMPLETED.");
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
      UserModel.findByIdAndUpdate(req.params.id, data, {upsert: true}, function(err) {
        if (!err) {
          console.log("New User created: " + newUser.userId);
          res.send("PUT COMPLETED.");
        }
        else {
          console.log(err);
        }
      });
    }
  },
  
  PostUser: function(req, res, next) {
    var newUser = new UserModel(req.body);
    var upsertData = newUser.toObject();
    delete upsertData._id;
    
    if (newUser.userId == null || newUser.email == null || newUser.firstName == null || newUser.lastName == null)
    {
      res.send("Post did not update or add a user because of missing fields. The required fields are: userId, email, firstName, lastName");
    }
    
    UserModel.findOneAndUpdate({ userId: newUser.userId, email: newUser.email }, upsertData, {upsert: true}, function(err) {
      if (!err) {
        res.send("POST COMPLETED");
      }
      else {
        console.log(err);
      }
    });
  }
};

// newUser.save(function(err) {
      //   if (!err) {
      //     return console.log("New User created: " + newUser.userId);
      //   }
      //   else {
      //     return console.log(err);
      //   }
      // });
      
function ShowEdit(res, params) {
  res.render('editpage', {
    title: title,
    isPerson: params[0],
    OS: params[1],
    email: params[2],
    number: params[3],
    date: params[4]
  });
}

function CreateTestUser() {
  // Test create new user and save.
  var johndoe = new UserModel({
    userId: "test2",
    firstName: "k2",
    lastName: "t2",
    email: "bah2",
    stockAlerts: [{
      "stockTickerSymbol": "GOOG",
      "amountOwned": 12,
      "sellPrice": 800,
      "buyPrice": 500
    }, {
      "stockTickerSymbol": "GOOG",
      "amountOwned": 13,
      "sellPrice": 800,
      "buyPrice": 500
    }]
  });
  johndoe.save(function(err) {
    if (err) {
      console.log(err);
    }
  });
}
