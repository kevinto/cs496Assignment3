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

var StockModel = mongoose.model('stocks', StockSchema);

module.exports = {
  UpdateUserStocks: function(req, res, next) {
    var bodyUserId = req.body.userId;

    if (bodyUserId == null) {
      res.send("userId is needed to update stocks");
    }
    else {
      var promise = user.GetUserStocks(bodyUserId);
      promise.then(function(users) {
        return users[0].stockAlerts;
      }).then(function(stockAlerts) {
          var stockTickers = [];
          stockAlerts.forEach(function(stock) {
            stockTickers.push(
              {
                "stockTickerSymbol": stock.stockTickerSymbol,
              });
          });
          console.log(stockTickers);
          StockModel.collection.insert(stockTickers, function(err) {
            if (!err) {
              console.log("Stocks added successfully");
              res.send("Stocks added successfully");
            }
            else {
              console.log(err); // Most like this was a duplicate error. Acceptable
              res.send("Stocks already added");
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
        StockModel.find({}, function(err, stocks) {
          if (!err) {
            var dbStocks = [];
            stocks.forEach(function(stock) {
              dbStocks.push(stock.stockTickerSymbol);
            })
            
            var stocksToDelete = _.difference(dbStocks, uniqueStocks);
            StockModel.find({ 'stockTickerSymbol': { $in: stocksToDelete} }, function(err, stocks){
              if (!err) {
                console.log("Found stocks to delete");
              }
              else {
                res.send(err);
              }
            }).remove().exec(function() {
              res.send("Deleted stocks");
            });
          }
          else {
            console.log(err); // Most like this was a duplicate error. Acceptable
            res.send(err);
          }
        });
    })
  },
  
  GetAllMonitoredStocks: function(req, res, next) {
    StockModel.find({}, function(err, stocks) {
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