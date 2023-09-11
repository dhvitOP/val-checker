import { authorization } from "../../constants/riot_routes.json";
import { instance } from "../../utils/instance";
import { auth_headers, data } from "../../constants/index.json";

async function auth() {
    try { 
        const res = await instance.post(authorization.url, data, { headers: auth_headers })
} catch (error) {
    //console.log(error);
    return "An error occured";
}
}
export default auth;

