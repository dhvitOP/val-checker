import config1 from "../../constants/riot_routes.json";
import headersConfig from "../../constants/index.json";
import { instance } from "../../utils/instance";

const Entitlement = config1.Entitlement;
const { token_headers, data } = headersConfig;

async function getEntToken(token: string) {
  try {
    token_headers['Authorization'] = "Bearer " + token

    const res = await instance.post(Entitlement.url, data, { withCredentials: true, headers: token_headers });
    return res.data;
  } catch (error) {
    console.log(error.response.statusText);
    return "An error occured";
  }
}
export default getEntToken;

