import config1 from "../../constants/riot_routes.json";
import { instance } from "../../utils/instance";
import headersConfig from "../../constants/index.json";
import querystring from "querystring";
import { Cookie } from "tough-cookie";

const authorization = config1.authorization;
const auth_headers = headersConfig.auth_headers;

async function getToken(username: string, password: string, cookies: any) {
  const authData = {
    type: "auth",
    username: username,
    password: password,
    language: "en_US"
  }
  //console.log(authData)
  try {
    auth_headers['Cookie'] = cookies;
    let { data, headers } = await instance.put(authorization.url, authData, { headers: auth_headers, withCredentials: true });

    //console.log(data)
    const cookiesH = headers['Set-Cookie'] || headers['set-cookie'];
    const cookiesString: string = cookiesH.map((cookie: string) => cookie.split(';')[0]).join('; ');
    if (data.type == "multifactor") {
      return { msg: "multifactor", cookies: cookiesString };
    }
    const uri = data.response.parameters.uri;
    const pattern = /access_token=((?:[a-zA-Z]|\d|\.|-|_)*).*id_token=((?:[a-zA-Z]|\d|\.|-|_)*).*expires_in=(\d*)/;
    const match = uri.match(pattern);



    if (match) {
      const fragment = uri.split('#')[1];
      const queryParams = querystring.parse(fragment);
      const access_token = queryParams.access_token;
      const id_token = queryParams.id_token;
      const expires_in = match[3];
      //console.log(access_token)
      return { access_token, id_token, expires_in, cookies: cookiesString };
    }
  } catch (error) {
    //console.log(error);
    console.log(error.response.data);

    return "An error occured";
  }
}
export default getToken;