const { instance,jar } = require("../../utils/instance");
const { skins_headers, data } = require("../../constants");
const axios = require("axios");
const { Skins } = require("../../constants/riot_routes.json");
async function getSkins(token,ent_token,puuid,region) {
    try { 
        if (region.toLowerCase() == 'latam' || region.toLowerCase() == 'br') region = 'na';
        skins_headers.Authorization = skins_headers.Authorization.replace("{token}", token);
        skins_headers['X-Riot-Entitlements-JWT'] = skins_headers['X-Riot-Entitlements-JWT'].replace("{ent_token}", ent_token);
        const res = await instance.get(Skins.url.replace('{region}',region).replace('{puuid}',puuid), { headers: skins_headers });
        jar.removeAllCookies();
        return res.data.Entitlements;
} catch (error) {
    console.log(error);
    return "An error occured";
}
}
module.exports = getSkins;

