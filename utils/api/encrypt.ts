import aes from "crypto-js/aes";
import config from "../../constants/config.json";

const encryptKey = config.encryptKey;
const multifactorKey = config.multifactorKey;

async function encrypt(data:string, type?: string) {
    if(type == 'multifactor') return aes.encrypt(data, multifactorKey).toString();
    return aes.encrypt(data, encryptKey).toString();
}
export default encrypt;