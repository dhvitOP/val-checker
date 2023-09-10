const { instance, jar } = require("../../utils/instance");
const { skins_headers } = require("../../constants");
const { url } = require("../../constants/riot_routes.json").matchHistory;
async function getHistory(accData) {
    try {
        if (accData.region.toLowerCase() == 'latam' || accData.region.toLowerCase() == 'br') accData.region = 'na';
        skins_headers.Authorization = skins_headers.Authorization.replace("{token}", accData.token);
        skins_headers['X-Riot-Entitlements-JWT'] = skins_headers['X-Riot-Entitlements-JWT'].replace("{ent_token}", accData.ent_token);
        const res = await instance.get(url.replace('{puuid}', accData.puuid).replace('{region}',accData.region), { headers: skins_headers });
        jar.removeAllCookies();
        return res.data.History;
    } catch (error) {
        jar.removeAllCookies();
        //console.log(error);
        return "An error occured";
    }
}
module.exports = getHistory;