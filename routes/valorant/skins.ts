import { Context, Hono } from "hono";
import decrypt from '../../utils/api/decrypt';

import config from '../../constants/config.json';
const apiUrl = config.apiUrl;


import { save, findOne } from '../../database/utils';

import getSkins from '../../functions/info/getSkins';
import { skinsconverter } from '../../utils/converters/uidconverter';
import axios from 'axios';

const router = new Hono();
router.get("/", global.checkAuth, async(c:Context) => {
    const check = await findOne("account",{accID:c.req.query('accID')});
    if(!check) return c.json({msg:"Account not found, or token is invalid, go to /acc/:id/:password to add/create account"});



    const auth = await axios.get(apiUrl + "/acc/reAuth?accID=" + c.req.query('accID'));
    if(auth.data.err == "cookie_expired") return c.json({msg: "Cookie Expired, Go to /acc/:id/:password to reAuth", err: "cookie_expired"});
    if(!auth.data.data) return c.json({msg: "ID PASS Invalid, maybe password is changed"});

    const { token,ent_token } = auth.data.data;
    const { puuid, region} = check;

    const skins = await getSkins(token,ent_token, puuid,region);
    if(skins == "An error occured") return c.json({msg: "An error occured"});

    const filteredSkins = await skinsconverter(skins);
    if(filteredSkins == "An error occured") return c.json({msg: "An error occured"});

    
    const loadoutData = await findOne("loadout",{accID: c.req.query('accID')});
    if(!loadoutData) {
        await save("loadout",{
            accID: c.req.query('accID'),
            skins: filteredSkins
        });
    } else {
        loadoutData.skins = filteredSkins;
        await loadoutData.save();
    }
    return c.json({filteredSkins, totalSkins: filteredSkins.length, msg: "Skins updated successfully"}); 

});

export default router;