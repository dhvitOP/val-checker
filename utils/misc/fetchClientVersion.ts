const valorant_api = "https://valorant-api.com/v1/";
import axios from 'axios';

let riotClientVersion: string;
async function fetchClientVersion() {
    const response = await axios.get(valorant_api + "version");
    riotClientVersion = response.data.data.riotClientVersion;
    return response.data.data.riotClientBuild;
}
export default fetchClientVersion
