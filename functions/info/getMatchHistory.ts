
import { matchHistory } from "../../constants/riot_routes.json";
import { instance, jar } from "../../utils/instance";
import { skins_headers } from "../../constants/index.json";

const { url } = matchHistory;

interface accData {
    puuid: string;
    region: string;
    token: string;
    ent_token: string;
}

async function getHistory(accData: accData) {
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
export default getHistory;