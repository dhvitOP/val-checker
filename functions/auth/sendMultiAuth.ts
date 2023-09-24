const url = "https://auth.riotgames.com/api/v1/authorization";
import { instance } from "../../utils/instance";
import headersConfig from "../../constants/index.json";
import querystring from "querystring";

const auth_headers = headersConfig.auth_headers;

async function getToken(username: string, password: string,code: string, cookies: string) {
    
    const authData = {
        "type": "multifactor",
        "code": code,
        "rememberDevice": false,
    }
    try {
        auth_headers['Cookie'] = cookies;
        const { data, headers } = await instance.put(url, authData, {  withCredentials: true, headers: auth_headers });
        
        const uri = data.response.parameters.uri;
        const pattern = /access_token=((?:[a-zA-Z]|\d|\.|-|_)*).*id_token=((?:[a-zA-Z]|\d|\.|-|_)*).*expires_in=(\d*)/;
        const match = uri.match(pattern);
        
        const cookiesHeader = headers['Set-Cookie'] || headers['set-cookie'];
        const cookieString: string = cookiesHeader.map((cookie: string) => cookie.split(';')[0]).join('; ');
        /*if (config && config.jar) {
            const serializedCookies: Cookie.Serialized[] = config.jar.toJSON().cookies;
            cookiesString = serializedCookies.map((cookie: Cookie.Serialized) => `${cookie.key}=${cookie.value}`).join('; ');
        }*/
        if (match) {
            const fragment = uri.split('#')[1]; 
            const queryParams = querystring.parse(fragment);
            const access_token = queryParams.access_token;
            const id_token = queryParams.id_token;
            const expires_in = match[3];
            return { access_token, id_token, expires_in,cookies: cookieString };
        }
    } catch (error) {
        console.log(error.response.statusText);
        return "An error occured";
    }
}
export default getToken;