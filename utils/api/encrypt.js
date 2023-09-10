const aes = require("crypto-js/aes");
const { encryptKey } = require("../../constants/config.json");
async function encrypt(data) {
    return aes.encrypt(data, encryptKey).toString();
}
module.exports = encrypt;