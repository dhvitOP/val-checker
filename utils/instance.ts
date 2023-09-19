import axios, { AxiosInstance } from "axios";
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';
import  fetchVersion  from "./misc/fetchClientVersion";
import headersConfig from "../constants/index.json";

const headers = headersConfig.instance_headers;

const jar = new CookieJar();
const httpClient: AxiosInstance = wrapper(axios.create({
  headers: headers,
  jar,
}));

async function main() {
  const riotClientVersion = await fetchVersion();
  console.log(riotClientVersion);
  headers['User-Agent'] = headers['User-Agent'].replace('{RiotClientVersion}', riotClientVersion);
httpClient.interceptors.request.use(
  (config) => {
    config.headers['User-Agent'] = headers['User-Agent'].replace('{RiotClientVersion}', riotClientVersion);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
}
main();
export {
  httpClient as instance,
  jar,
};
