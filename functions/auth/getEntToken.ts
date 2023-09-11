import { Entitlement } from "../../constants/riot_routes.json";
import { token_headers, data } from "../../constants/index.json";
import { instance } from "../../utils/instance";

async function getEntToken(token: string) {
    try { 
        token_headers.Authorization = token_headers.Authorization.replace("{token}", token);
        const res = await instance.post(Entitlement.url, data, { headers: token_headers });
        return res.data;
} catch (error) {
    //console.log(error);
    return "An error occured";
}
}
export default getEntToken;

