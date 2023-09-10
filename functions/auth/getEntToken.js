const { instance } = require("../../utils/instance");
const { token_headers, data } = require("../../constants");
const axios = require("axios");
const { Entitlement } = require("../../constants/riot_routes.json");
async function getEntToken(token) {
    try { 
        token_headers.Authorization = token_headers.Authorization.replace("{token}", token);
        const res = await instance.post(Entitlement.url, data, { headers: token_headers });
        return res.data;
} catch (error) {
    //console.log(error);
    return "An error occured";
}
}
module.exports = getEntToken;

