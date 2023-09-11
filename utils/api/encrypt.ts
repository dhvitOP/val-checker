import aes from "crypto-js/aes";
import { encryptKey } from "../../constants/config.json";
async function encrypt(data:string) {
    return aes.encrypt(data, encryptKey).toString();
}
export default encrypt;