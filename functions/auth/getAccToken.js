const { auth_headers } = require("../../constants");
const { instance,jar } = require("../../utils/instance");
const querystring = require("querystring");
const { authorization } = require("../../constants/riot_routes.json");
async function getToken(username, password,msg) {
    const authData = {
        type: "auth",
        username: username,
        password: password,
    }
    try {
        const { data, config } = await instance.put(authorization.url, authData, { auth_headers });
        const uri = data.response.parameters.uri;
        const pattern = /access_token=((?:[a-zA-Z]|\d|\.|-|_)*).*id_token=((?:[a-zA-Z]|\d|\.|-|_)*).*expires_in=(\d*)/;
        const match = uri.match(pattern);
        //instance.defaults.jar._jar.removeAllCookiesSync();
        const cookiesArray = config.jar.toJSON().cookies;
        const cookiesString = cookiesArray.map(cookie => `${cookie.key}=${cookie.value}`).join('; ');
        if(msg == "keep") {
            setTimeout(() => {
                jar.removeAllCookies()
            }, 5000);
        } else {
            jar.removeAllCookies()
        }
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
        return "An error occured";
    }
}
module.exports = getToken;