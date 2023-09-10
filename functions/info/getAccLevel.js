const { url } = require('../../constants/riot_routes.json').LevelXp;
const { instance, jar } = require('../../utils/instance');
const { skins_headers } = require('../../constants');
async function getAccLevel(accData) {
    try {
        if (accData.region.toLowerCase() == 'latam' || accData.region.toLowerCase() == 'br') accData.region = 'na';
        skins_headers.Authorization = skins_headers.Authorization.replace("{token}", accData.token);
        skins_headers['X-Riot-Entitlements-JWT'] = skins_headers['X-Riot-Entitlements-JWT'].replace("{ent_token}", accData.ent_token);
        const res = await instance.get(url.replace('{puuid}', accData.puuid).replace('{region}',accData.region), { headers: skins_headers });
        jar.removeAllCookies();
        return {
            level: res.data.Progress.Level, 
            xp: res.data.Progress.XP,
            history: res.data.History
        };
    } catch (error) {
        //console.log(error);
        jar.removeAllCookies();
        return "An error occured";
    }
}
module.exports = getAccLevel;