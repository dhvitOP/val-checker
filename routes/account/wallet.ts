import { Hono, Context } from "hono";
const router = new Hono();
import getAccWallet from '../../functions/info/getWallet';
import { save, findOne } from '../../database/utils';
import currentSorter from '../../utils/converters/currencySorter';
import axios from 'axios';

import config from '../../constants/config.json';
import { endTime, startTime } from "hono/timing";
const apiUrl = config.apiUrl;

router.get("/:accID", global.checkAuth,async(c:Context) => {

    const accID = c.req.param('accID');
    if(!accID) return c.json({msg: "Please provide an account ID"});

    const acc = await findOne("account", {accID:accID});
    if(!acc) return c.json({msg: "Account not found"});
    startTime(c, "Fetching_Level");
    const auth = await axios.get(apiUrl + "/acc/reAuth/" + accID);
    if(auth.data.err == "cookie_expired") return c.json({msg: "Cookie Expired, Go to /acc/:id/:password to reAuth", err: "cookie_expired"});
    if(!auth.data.data) return c.json({msg: "ID PASS Invalid, maybe password is changed"});

    const { token,ent_token } = auth.data.data;
    const wallet = await getAccWallet({token:token,ent_token:ent_token,puuid:acc.puuid,region:acc.region});
    if(wallet == "An error occured") return c.json({msg: "An error occured"});
    
    endTime(c, "Fetching_Level");

    const currencies = await currentSorter(wallet);

    const loadout = await findOne("loadout",{accID: accID});
    if(!loadout) {
        await save("loadout",{
            accID: accID,
            balance: currencies,
        });
    } else {
        loadout.balance = currencies;
        await loadout.save();
    }
    return c.json({msg: "Balance Fetched Successfully", currencies: currencies});
});
export default router;