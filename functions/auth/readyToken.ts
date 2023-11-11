import config1 from "../../constants/riot_routes.json";
import { instance } from "../../utils/instance";
import headersConfig from "../../constants/index.json";
import fs from 'fs';

const authorization = config1.authorization;
const auth_headers = headersConfig.auth_headers;
const toData = headersConfig.data;

async function auth() {
    try { 
       
        const  res = await instance.post(authorization.url, toData, {  withCredentials: true, headers: auth_headers });
        
       
        let cookies = res.headers['Set-Cookie'];
        
        if(!cookies) {
            cookies = res.headers['set-cookie'];
        }
        if(!cookies) return "An error occured";
        const cookieHeader: string = cookies.map((cookie: string) => cookie.split(';')[0]).join('; ');
        //console.log(cookieHeader)
        return cookieHeader;
        
} catch (error) {
    console.log(error.response.statusText);
    return "An error occured";
}
}
export default auth;

