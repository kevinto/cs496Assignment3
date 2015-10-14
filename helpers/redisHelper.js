// redisHelper.js
// =============

module.exports = {
  getFromRedis: function(key) {
    GLOBAL.redis.get(key, function(error, result) {
      if (error) {
        console.log('Error: '+ error)
      }
      else {
        console.log("result: " + result);
        return result;
      }
    });
  },
  
  mgetFromRedis: function(keys, res, callbackFunc) {
    GLOBAL.redis.mget(keys, function(error, result) {
      if (error) {
        console.log('Error: '+ error)
      }
      else {
        console.log("mget result: " + result);
        callbackFunc(res, result);
        return result;
      }
    });
  }, 
  
  msetIntoRedis: function(keys, values, res, callbackFunc) {
    var result = GLOBAL.redis.mset(keys[0], values[0],
                                    keys[1], values[1],
                                    keys[2], values[2],
                                    keys[3], values[3],
                                    keys[4], values[4],
                                    callbackFunc(res, values)); 
    return result;
  } 
};
