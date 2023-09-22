import  index from '../../index';
async function checkUpdated(date: Number) {
    if(date < index.time) {
      return false;
    }
    return true;
  }
export default checkUpdated;