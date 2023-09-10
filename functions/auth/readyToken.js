const { instance } = require("../../utils/instance");
const { auth_headers, data } = require("../../constants");
const axios = require("axios");
const { authorization } = require("../../constants/riot_routes.json");

async function auth(username,password) {
    try { 
        const res = await instance.post(authorization.url, data, { auth_headers })
} catch (error) {
    //console.log(error);
    return "An error occured";
}
}
module.exports = auth;

