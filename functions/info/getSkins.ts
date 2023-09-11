import { Skins } from '../../constants/riot_routes.json';
import { instance,jar } from '../../utils/instance';
import { skins_headers, data } from '../../constants/index.json';

async function getSkins(token: string,ent_token: string,puuid: string,region: string) {
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
export default getSkins;

