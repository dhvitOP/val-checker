import { UserInfo } from "../../constants/riot_routes.json";
import { instance } from "../../utils/instance";
import { token_headers, data } from "../../constants/index.json";

async function getInfo(token: string) {
    try {
        token_headers.Authorization = token_headers.Authorization.replace("{token}", token); 
        const res = await instance.post(UserInfo.url, data, { headers: token_headers });
        return res.data;
} catch (error) {
    //console.log(error);
    return "An error occured";
}
}
export default getInfo;

