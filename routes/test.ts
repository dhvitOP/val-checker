import { Hono,Context } from "hono";
import { instance } from "../utils/instance";
import headers from "../constants/index.json"
import config from "../constants/config.json";
import axios from 'axios';
import { findOne } from "../database/utils";

const apiUrl = config.apiUrl;
const { skins_headers } = headers;
const router = new Hono();



router.get("/:accID", async (c:Context) => {
    
    const accID = c.req.param('accID');
    
    const acc = await findOne("account", {accID:accID});
    if(!acc) return c.json({msg: "Account not found"});

    const auth = await axios.get(apiUrl + "/acc/reAuth/" + accID);
    
    if(auth.data.err == "cookie_expired") return c.json({msg: "Cookie Expired, Go to /acc/:id/:password to reAuth", err: "cookie_expired"});
    if(!auth.data.data) return c.json({msg: "ID PASS Invalid, maybe password is changed"});
    
    const { token,ent_token } = auth.data.data;

    const headers = {
        ...skins_headers,
        "X-Riot-ClientVersion": "72.0.0.360.1382",
        "X-Riot-Entitlements-JWT": ent_token,
        "Authorization": "Bearer " + token
    }
    const res = await instance.get("https://glz-ap-1.ap.a.pvp.net/parties/v1/players/" + acc.puuid, {
        headers: headers
    });
    console.log(res.data)
    return c.json({msg: "Welcome to Valorant's API, for getting the list of all routes, go to /routes"});    
});
export default router;