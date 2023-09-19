import config1 from "../../constants/riot_routes.json";
import { instance,jar } from "../../utils/instance";
import headersConfig from "../../constants/index.json";

const authorization = config1.authorization;
const auth_headers = headersConfig.auth_headers;
const toData = headersConfig.data;

async function auth() {
    try { 
       
        const {data, headers } = await instance.post(authorization.url, toData, {  withCredentials: true, headers: auth_headers });
        let cookiesString = '';
        /*if (config && config.jar) {
            const serializedCookies: Cookie.Serialized[] = config.jar.toJSON().cookies;
            cookiesString = serializedCookies.map((cookie: Cookie.Serialized) => `${cookie.key}=${cookie.value}`).join('; ');
        } */
        //const Cookies = headers['Set-Cookie'];
        //console.log(Cookies);
        /*const serializedCookies = parseCookie(Cookies, {
            decodeValues: true
        }); */
        //console.log(serializedCookies)
        //cookiesString = serializedCookies.map((cookie: any) => `${cookie.key}=${cookie.value}`).join('; ');
        //cookiesString = Cookies.join('');
        //console.log(cookiesString + "cookies");
        return {cookies: cookiesString};
} catch (error) {
    console.log(error);
    return "An error occured";
}
}
export default auth;

