// timehelper.js
// =============
module.exports = {
  getCurrentServerDateTime:  function() {
    var currentDateTime = new Date();
    var displayTime = "Current Local Date Time at the server: " +
                      (currentDateTime.getMonth() + 1) + "/" +
                      currentDateTime.getDate() + "/" +
                      currentDateTime.getFullYear() + " " +
                      currentDateTime.getHours() + ":" +
                      currentDateTime.getMinutes() + ":" +
                      currentDateTime.getSeconds() + '\r\n';
    return displayTime;
  }
};
