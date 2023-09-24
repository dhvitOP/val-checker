import { Hono, Context } from "hono";
const router = new Hono();


import { save, findAndUpdate, findOne } from '../../database/utils';

import config from '../../constants/config.json';
const apiUrl = config.apiUrl;


import axios from "axios";
import getPenalties from "../../functions/info/getPenalties";

router.get("/:accID", global.checkAuth, async(c:Context) => {
    const accID = c.req.param('accID');

    const data = await findOne("account", { accID: accID });
    if (!data) return c.json({ msg: 'Account not found' });

    const auth = await axios.get(apiUrl + "/acc/reAuth/" + accID);
    
    if(auth.data.err == "cookie_expired") return c.json({msg: "Cookie Expired, Go to /acc/:id/:password to reAuth", err: "cookie_expired"});
    if(!auth.data.data) return c.json({msg: "ID PASS Invalid, maybe password is changed"});
    
    const { token,ent_token } = auth.data.data;

    const penalties = await getPenalties({token:token,ent_token:ent_token,puuid:data.puuid,region:data.region});
    if(penalties == "An error occured") return c.json({msg: "An error occured"});

    return c.json({msg: "Penalties Fetched Successfully", penalties: penalties})
});
export default router;