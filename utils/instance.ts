import axios, { AxiosInstance } from "axios";
import fetchVersion from "./misc/fetchClientVersion";
import headersConfig from "../constants/index.json";
import config from "../constants/config.json";
const httpAgent = new (require('http').Agent)({ keepAlive: true });
const httpsAgent = new (require('https').Agent)({ keepAlive: true });

const apiUrl = config.apiUrl;
const headers = headersConfig.instance_headers;

const httpClient: AxiosInstance = axios.create({
  headers: headers,
  withCredentials: true,
  httpAgent,
  httpsAgent
})



async function main() {
  const riotClientVersion = await fetchVersion();
  console.log(riotClientVersion);
  headers['User-Agent'] = headers['User-Agent'].replace('{RiotClientVersion}', riotClientVersion);
  axios.interceptors.request.use(
    (config) => {
      let url = config.url;
      if (config.url && url.includes(apiUrl) && url.includes("reAuth")) {
        config.headers["Authorization"] = "Bearer vedant_is_da_best_programmer";
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
    
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
  httpClient as instance
};
