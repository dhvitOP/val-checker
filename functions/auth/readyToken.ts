import config1 from "../../constants/riot_routes.json";
import { instance,jar } from "../../utils/instance";
import headersConfig from "../../constants/index.json";
import { Cookie } from "tough-cookie";

const authorization = config1.authorization;
const { auth_headers, data } = headersConfig;

async function auth() {
    try { 
       
        const { config } = await instance.post(authorization.url, data, {  withCredentials: true, headers: auth_headers });
        let cookiesString = '';
        if (config && config.jar) {
            const serializedCookies: Cookie.Serialized[] = config.jar.toJSON().cookies;
            cookiesString = serializedCookies.map((cookie: Cookie.Serialized) => `${cookie.key}=${cookie.value}`).join('; ');
        }
        //console.log(cookiesString + "cookies");
        return {cookies: cookiesString};
} catch (error) {
    //console.log(error);
    return "An error occured";
}
}
export default auth;

