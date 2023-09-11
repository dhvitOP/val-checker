import cachedTime from '../../index';
async function checkUpdated(date: Number) {
    if(date < cachedTime) {
      return false;
    }
    return true;
  }
export default checkUpdated;