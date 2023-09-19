import config from "../../constants/riot_routes.json";
import { instance, jar } from "../../utils/instance";
import querystring from "querystring";

const reAuth = config.reAuth;

async function reauth(cookieString: string) {
  try {
  
    const response = await instance.get(reAuth.url, {
      withCredentials: true,
  headers: {
    Cookie: cookieString, 
  },maxRedirects: 0,})
  jar.removeAllCookies();
  if (response.headers.location) {
    const redirectURL = response.headers.location;
    return extractToken(redirectURL);
  } else {
    console.log('No redirect URL found.');
  }
} catch (error: any) {
  jar.removeAllCookies();
  if (error.response) {
    if(error.response.status == 303) {
      const redirectURL = error.response.headers.location;
      return extractToken(redirectURL);
    } else {
      return "An error occured";
    }
  } else {
    return "An error occured";
  }
}
}
function extractToken(uri:string) {
  const pattern = /access_token=((?:[a-zA-Z]|\d|\.|-|_)*).*id_token=((?:[a-zA-Z]|\d|\.|-|_)*).*expires_in=(\d*)/;
  const match = uri.match(pattern);
if (match) {
    const fragment = uri.split('#')[1]; 
    const queryParams = querystring.parse(fragment);
    const access_token = queryParams.access_token;
    const id_token = queryParams.id_token;
    const expires_in = match[3];
    return { access_token, id_token, expires_in};
} else {
  return "No pattern found"
}
}
export default reauth;