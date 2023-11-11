import config from "../../constants/riot_routes.json";
import { instance } from "../../utils/instance";
import querystring from "querystring";

const reAuth = config.reAuth;

async function reauth(cookieString: string) {
  
  let redirectURL: string | undefined;
  try {
    
    const response = await instance.get(reAuth.url, {
      withCredentials: true,
      headers: {
        Cookie: cookieString,
      }, timeout: 5000,
      beforeRedirect: (options) => {
        redirectURL = options.href;
      }
    })
    if (response.headers.location) {
      redirectURL = response.headers.location;
      return extractToken(redirectURL);
    } else {
      console.log(response.statusText + 1);
      return "An error occured + 1";
    }
  } catch (error: any) {
    
    if(redirectURL != "" || redirectURL != undefined) {
      return extractToken(redirectURL!);
    }
      if (error.response) {
        if (error.response.status == 303) {

          redirectURL = error.response.headers.location;
          return extractToken(redirectURL);
        } else {

          return "An error occured + 2";
        }
      } else {
        console.log(error.response.statusText + 3);
        return "An error occured + 3";
      }
    
}
}
function extractToken(uri: string) {
  try {
    const pattern = /access_token=((?:[a-zA-Z]|\d|\.|-|_)*).*id_token=((?:[a-zA-Z]|\d|\.|-|_)*).*expires_in=(\d*)/;
    const match = uri.match(pattern);
    if (match) {
      const fragment = uri.split('#')[1];
      const queryParams = querystring.parse(fragment);
      const access_token = queryParams.access_token;
      const id_token = queryParams.id_token;
      const expires_in = match[3];
      return { access_token, id_token, expires_in };
    } else {
      return "No pattern found + 4"
    }
  } catch (error) {
    console.log(error + "5");
    return "An error occured + 5";
  }
}
export default reauth;