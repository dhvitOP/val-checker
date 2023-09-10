const cachedTime = require("../../index").cachedTime;
async function checkUpdated(date) {
    if(date < cachedTime) {
      return false;
    }
    return true;
  }
module.exports = checkUpdated;