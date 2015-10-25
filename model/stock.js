// stock.js
// =============
var mongoose = require("mongoose");
var _ = require("underscore-node");
var user = require('../model/user.js');

var StockSchema = new mongoose.Schema({
  stockTickerSymbol: {
    type: String,
    required: true,
    unique: true,
    dropDups: true
  },
  stockName: {
    type: String,
    required: true
  },
  currentStockPrice: {
    type: Number,
  }
});
GLOBAL.StockModel = mongoose.model('stocks', StockSchema);

module.exports = {
  UpdateUserStocks: function(req, res, next, message) {
    var bodyUserId = req.body.userId;

    if (bodyUserId == null) {
      res.send("userId is needed to update stocks");
    }
    else {
      // var promise = user.GetUserStocks(bodyUserId);
      var promise = GetUserStocks(bodyUserId);
      promise.then(function(users) {
        return users[0].stockAlerts;
      }).then(function(stockAlerts) {
          var stockTickers = [];
          stockAlerts.forEach(function(stock) {
            stockTickers.push(
              {
                "stockTickerSymbol": stock.stockTickerSymbol,
                "stockName": "!!NeedsUpdate!! Feature not implemented",
                "currentStockPrice": "-1"
              });
          });
          // console.log(stockTickers);
          GLOBAL.StockModel.collection.insert(stockTickers, function(err) {
            if (!err) {
              console.log("Stocks added successfully");
              sendResponse(res, "Stocks added successfully", message)
            }
            else {
              console.log(err); // Most like this was a duplicate error. Acceptable
              sendResponse(res, "Stocks already added", message)
            }
          });
      })
    }
  },
  
  CleanUpStocks: function(req, res, next) {
    var promise = user.GetAllUserStocks();
    promise.then(function(users) {
      // Create an array of stock tickers in the database that exist for users
      var stocksTickers = [];
      users.forEach(function(user){
        user.stockAlerts.forEach(function(stockAlert) {
          stocksTickers.push(stockAlert.stockTickerSymbol);  
        })
      });
      return stocksTickers;
    }).then(function(stockTickers) {
        // Find stocks that are not associated to any users
        var uniqueStocks = stockTickers.filter(function(item, pos) {
          return stockTickers.indexOf(item) == pos;
        });
        
        // Delete the stocks that have no user association
        GLOBAL.StockModel.find({}, function(err, stocks) {
          if (!err) {
            var dbStocks = [];
            stocks.forEach(function(stock) {
              dbStocks.push(stock.stockTickerSymbol);
            })
            
            var stocksToDelete = _.difference(dbStocks, uniqueStocks);
            GLOBAL.StockModel.find({ 'stockTickerSymbol': { $in: stocksToDelete} }, function(err, stocks){
              if (!err) {
                console.log("Found stocks to delete");
              }
              else {
                sendResponse(res, err);
              }
            }).remove().exec(function() {
              sendResponse(res, "Deleted stocks");
            });
          }
          else {
            console.log(err); // Most like this was a duplicate error. Acceptable
            sendResponse(res, err);
          }
        });
    })
  },

  GetAllMonitoredStocks: function(req, res, next) {
    GLOBAL.StockModel.find({}, function(err, stocks) {
      if (!err) {
        res.send(stocks);
        console.log("GET ALL STOCKS COMPLETED");
      }
      else {
        console.log(err);
      }
    });
  }
};

function sendResponse(res, defaultMessage, specialMessage) {
  if (specialMessage != null) {
    res.send(specialMessage);
  } 
  else {
    res.send(defaultMessage);
  }
}

function GetAllUserStocks() {
  // Gets all the stocks used by users
  var promise = GLOBAL.UserModel.find({}).exec();
  return promise;
}

function GetUserStocks(puserId) {
  // Gets the stocks for a specific user
  var promise = GLOBAL.UserModel.find({ userId: puserId }).exec();
  return promise;
}
