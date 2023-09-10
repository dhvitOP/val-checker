const axios = require("axios");
const { wrapper } = require('axios-cookiejar-support');
const { CookieJar } = require('tough-cookie');
const riotClientVersion = require("../index").ClientVersion;
console.log(riotClientVersion)
const headers = require("../constants").instance_headers;
const jar = new CookieJar();
headers['User-Agent'] = headers['User-Agent'].replace('{RiotClientVersion}', riotClientVersion);
const httpClient = wrapper(axios.create({
  headers: headers,
  withCredentials: true,
  keepAlive: true,
  jar,
}))
httpClient.interceptors.request.use(
  (config) => {
    config.headers['User-Agent'] = headers['User-Agent'].replace('{RiotClientVersion}', riotClientVersion);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
module.exports = {
  instance: httpClient,
  jar: jar,
}