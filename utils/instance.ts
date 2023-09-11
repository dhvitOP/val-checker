import axios, { AxiosInstance } from "axios";
import { wrapper } from 'axios-cookiejar-support';
import { CookieJar } from 'tough-cookie';
import  fetchClientVersion  from "./misc/fetchClientVersion";
import { instance_headers as headers } from "../constants/index.json";


const riotClientVersion = "71.0.0.287.1382";

const jar = new CookieJar();
const httpClient: AxiosInstance = wrapper(axios.create({
  headers: headers,
  withCredentials: true,
  jar,
}));

async function main() {
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
