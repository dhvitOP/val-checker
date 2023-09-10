const { instance, jar } = require("../../utils/instance");
const { skins_headers } = require("../../constants");
const { url } = require("../../constants/riot_routes.json").userPenalty;
async function getPenalties(accData) {
    try { 
        if (accData.region.toLowerCase() == 'latam' || accData.region.toLowerCase() == 'br') region = 'na';
        skins_headers["Authorization"] = skins_headers["Authorization"].replace("{token}", accData.token);
        skins_headers['X-Riot-Entitlements-JWT'] = skins_headers['X-Riot-Entitlements-JWT'].replace("{ent_token}", accData.ent_token);
        
        const res = await instance.get(url.replace('{region}',accData.region.toLowerCase()), { headers: skins_headers });
        
        jar.removeAllCookies();
        return res.data.Penalties;
} catch (error) {
    console.log(error.response);
    console.log(skins_headers);
    jar.removeAllCookies();
    return "An error occured";
}
}
module.exports = getPenalties;