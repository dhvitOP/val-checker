import  { AES } from "crypto-js";
import config from "../../constants/config.json";
import CryptoJS from "crypto-js";

const encryptKey = config.encryptKey;
const multifactorKey = config.multifactorKey;

async function decrypt(data:string, type?: string) {
    if(type == 'multifactor') return AES.decrypt(data, multifactorKey).toString(CryptoJS.enc.Utf8);
    return AES.decrypt(data, encryptKey).toString(CryptoJS.enc.Utf8).split(":");
}
export default decrypt;