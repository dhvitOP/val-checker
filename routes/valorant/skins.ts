import { Router, Request, Response } from "express";
import decrypt from '../../utils/api/decrypt';

import config from '../../constants/config.json';
const apiUrl = config.apiUrl;


import accSchema from '../../database/schemas/account';
import getSkins from '../../functions/info/getSkins';
import { skinsconverter } from '../../utils/converters/uidconverter';
import loadout from "../../database/schemas/loadout";
import axios from 'axios';

const router = Router();
router.get("/", global.checkAuth, async(req:Request, res:Response) => {
    const check = await (accSchema as any).findOne({accID:req.query.accID});
    if(!check) return res.send({msg:"Account not found, or token is invalid, go to /acc/:id/:password to add/create account"});


    const idpass = await decrypt(check.token);
    const auth = await axios.get(apiUrl + "/acc/reAuth?accID=" + req.query.accID);
    if(auth.data.err == "cookie_expired") return res.send({msg: "Cookie Expired, Go to /acc/:id/:password to reAuth", err: "cookie_expired"});
    if(!auth.data.data) return res.send({msg: "ID PASS Invalid, maybe password is changed"});
    const { token,ent_token } = auth.data.data;
    const { puuid, region} = check;
    const skins = await getSkins(token,ent_token, puuid,region);
    
     if(skins == "An error occured") return res.send({msg: "An error occured"});
    const filteredSkins = await skinsconverter(skins);
    if(filteredSkins == "An error occured") return res.send({msg: "An error occured"});
    res.send({filteredSkins, totalSkins: filteredSkins.length, msg: "Skins updated successfully"}); 
    const loadoutData = await (loadout as any).findOne({accID: req.query.accID});
    if(!loadoutData) {
        const newLoadout = new loadout({
            accID: req.query.accID,
            skins: filteredSkins
        });
        await newLoadout.save();
    } else {
        loadoutData.skins = filteredSkins;
        await loadoutData.save();
    }
});

export default router;