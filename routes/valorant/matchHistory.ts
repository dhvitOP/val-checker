import { Hono, Context } from "hono";
const router = new Hono();

import { save, findOne } from '../../database/utils';

import config from '../../constants/config.json';
const apiUrl = config.apiUrl;


import axios from 'axios';
import getMatchHistory from '../../functions/info/getMatchHistory';
router.get('/', global.checkAuth, async (c:Context) => {
    const accID = c.req.query('accID');

    const data = await findOne("account",{ accID: accID });
    if (!data) return c.json({ msg: 'Account not found' });

    const auth = await axios.get(apiUrl + "/acc/reAuth?accID=" + accID);
    if(auth.data.err == "cookie_expired") return c.json({msg: "Cookie Expired, Go to /acc/:id/:password to reAuth", err: "cookie_expired"});
    if(!auth.data.data) return c.json({msg: "ID PASS Invalid, maybe password is changed"});

    const { token,ent_token } = auth.data.data;

    const history = await getMatchHistory({token:token,ent_token:ent_token,puuid:data.puuid,region:data.region});
    if(history == "An error occured") return c.json({msg: "An error occured"});
    
    
    const loadoutData = await findOne("loadout",{accID: accID});
    if(!loadoutData) {
        await save("loadout",{
            accID: accID,
            history: history
        });
    } else {
        loadoutData.history = history;
        await loadoutData.save();
    }
    return c.json({msg: "Match History Fetched Successfully", history: history});
    
});
export default router;