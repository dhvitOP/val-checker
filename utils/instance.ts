import axios, { AxiosInstance } from "axios";
import  fetchVersion  from "./misc/fetchClientVersion";
import headersConfig from "../constants/index.json";

const headers = headersConfig.instance_headers;

const httpClient: AxiosInstance = axios.create({
  headers: headers,
  withCredentials: true,
  timeout: 6000

})



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
  httpClient as instance
};
