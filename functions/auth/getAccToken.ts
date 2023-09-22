import config1 from "../../constants/riot_routes.json";
import { instance,jar } from "../../utils/instance";
import headersConfig from "../../constants/index.json";
import querystring from "querystring";
import { Cookie } from "tough-cookie";

const authorization = config1.authorization;
const headers = headersConfig.auth_headers;

async function getToken(username: string, password: string, cookies: string) {
    const authData = {
        type: "auth",
        username: username,
        password: password,
    }
    try {
        //headers['Cookie'] = cookies;
        //console.log(auth_headers);
      console.log(headers);
        let { data, config } = await instance.put(authorization.url, authData, {   headers  });
        let cookiesString = '';
        if (config && config.jar) {
            const serializedCookies: Cookie.Serialized[] = config.jar.toJSON().cookies;
            cookiesString = serializedCookies.map((cookie: Cookie.Serialized) => `${cookie.key}=${cookie.value}`).join('; ');
        }
        if(data.type == "multifactor") {
            return {msg:"multifactor",cookies: cookiesString};
        }
        const uri = data.response.parameters.uri;
        const pattern = /access_token=((?:[a-zA-Z]|\d|\.|-|_)*).*id_token=((?:[a-zA-Z]|\d|\.|-|_)*).*expires_in=(\d*)/;
        const match = uri.match(pattern);
        //instance.defaults.jar._jar.removeAllCookiesSync();
        
     
      jar.removeAllCookies((err) => {
        if (err) {
          console.error('Error removing cookies:', err);
        } else {
          //console.log('Cookies removed successfully');
        }
      });
       // jar.removeAllCookies()
        if (match) {
            const fragment = uri.split('#')[1]; 
            const queryParams = querystring.parse(fragment);
            const access_token = queryParams.access_token;
            const id_token = queryParams.id_token;
            const expires_in = match[3];
            return { access_token, id_token, expires_in,cookies: cookiesString };
        }
    } catch (error) {
        console.log(error);
        //console.log("error here")
        return "An error occured";
    }
}
export default getToken;