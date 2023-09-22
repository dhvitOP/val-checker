import { Context, Hono } from "hono";
import decrypt from '../../utils/api/decrypt';

import config from '../../constants/config.json';
const apiUrl = config.apiUrl;


import { save, findOne } from '../../database/utils';

import getSkins from '../../functions/info/getSkins';
import { skinsconverter } from '../../utils/converters/uidconverter';
import axios from 'axios';
import { endTime, startTime } from "hono/timing";

const router = new Hono();
router.get("/:accID", global.checkAuth, async(c:Context) => {
    const accID = c.req.param('accID');

    const check = await findOne("account",{accID:accID});
    if(!check) return c.json({msg:"Account not found, or token is invalid, go to /acc/:id/:password to add/create account"});


    startTime(c, "Fetching_Skins");

    const auth = await axios.get(apiUrl + "/acc/reAuth/" + accID);
    if(auth.data.err == "cookie_expired") return c.json({msg: "Cookie Expired, Go to /acc/:id/:password to reAuth", err: "cookie_expired"});
    if(!auth.data.data) return c.json({msg: "ID PASS Invalid, maybe password is changed"});

    const { token,ent_token } = auth.data.data;
    const { puuid, region} = check;

    const skins = await getSkins(token,ent_token, puuid,region);
    if(skins == "An error occured") return c.json({msg: "An error occured"});

    endTime(c, "Fetching_Skins");
    startTime(c, "Converting_Data");

    const filteredSkins = await skinsconverter(skins);
    if(filteredSkins == "An error occured") return c.json({msg: "An error occured"});

    endTime(c, "Converting_Data");
    startTime(c, "Saving_Data");
    
    const loadoutData = await findOne("loadout",{accID: accID});
    if(!loadoutData) {
        await save("loadout",{
            accID: accID,
            skins: filteredSkins
        });
    } else {
        loadoutData.skins = filteredSkins;
        await loadoutData.save();
    }
    endTime(c, "Saving_Data");

    return c.json({filteredSkins, totalSkins: filteredSkins.length, msg: "Skins updated successfully"}); 

});

export default router;