import config from "../../constants/riot_routes.json";
import { instance } from "../../utils/instance";
import headersConfig from "../../constants/index.json";

const { token_headers, data } = headersConfig;
const { url } = config.UserInfo;

async function getInfo(token: string) {
    try {
        token_headers["Authorization"] = "Bearer " + token
        const res = await instance.post(url, data, { headers: token_headers });
        return res.data;
} catch (error) {
    //console.log(error);
    return "An error occured";
}
}
export default getInfo;

