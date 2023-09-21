import config from "../../constants/riot_routes.json";
import { instance } from "../../utils/instance";
import querystring from "querystring";

const reAuth = config.reAuth;

async function reauth(cookieString: string) {
  try {
    const response = await instance.get(reAuth.url, {
      withCredentials: true,
      headers: {
        Cookie: cookieString,
      }, maxRedirects: 0, timeout: 2500
    })
    if (response.headers.location) {
      const redirectURL = response.headers.location;
      return extractToken(redirectURL);
    } else {
      return "An error occured + 1";
    }
  } catch (error: any) {
      if (error.response) {
      
        
        console.log(error.response)
        /*if(error.response.href.includes("access_token")) {
          console.log("XD")
          const redirectURL = error.response.headers.location;
          return extractToken(redirectURL);
        }*/
        if (error.response.status == 303) {

          const redirectURL = error.response.headers.location;
          return extractToken(redirectURL);
        } else {
          return "An error occured + 2";
        }
      } else {
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
    return "An error occured + 5";
  }
}
export default reauth;