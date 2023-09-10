const valorant_api = "https://valorant-api.com/v1/";
const axios = require("axios");
async function fetchClientVersion() {
    const response = await axios.get(valorant_api + "version");
    return response.data.data.riotClientBuild;
}
module.exports = fetchClientVersion;