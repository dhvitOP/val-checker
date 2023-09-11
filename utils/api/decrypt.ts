import  { AES } from "crypto-js";
import { encryptKey } from "../../constants/config.json";
import CryptoJS from "crypto-js";

async function decrypt(data:string) {
    return AES.decrypt(data, encryptKey).toString(CryptoJS.enc.Utf8).split(":");
}
export default decrypt;