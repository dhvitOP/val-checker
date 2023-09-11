const valorant_api = "https://valorant-api.com/v1/";
import axios from 'axios';
async function fetchClientVersion() {
    const response = await axios.get(valorant_api + "version");
    return response.data.data.riotClientBuild;
}
export default fetchClientVersion;