const { AES } = require("crypto-js");
const CryptoJS = require("crypto-js");
const { encryptKey } = require("../../constants/config.json");
async function decrypt(data) {
    return AES.decrypt(data, encryptKey).toString(CryptoJS.enc.Utf8).split(":");
}
module.exports = decrypt;