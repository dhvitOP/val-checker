import { Router, Request, Response } from "express";
import decrypt from '../../utils/api/decrypt';
import { apiUrl } from '../../constants/config.json';
import accSchema from '../../database/schemas/account';
import getSkins from '../../functions/info/getSkins';
import uidconverter from '../../utils/converters/uidconverter';
import axios from 'axios';

const router = Router();
router.get("/:accID", async(req:Request, res:Response) => {
    const check = await (accSchema as any).findOne({accID:req.params.accID});
    if(!check) return res.send({msg:"Account not found, or token is invalid, go to /acc/:id/:password to add/create account"});


    const idpass = await decrypt(check.token);
    const { data } = await axios.get(apiUrl+"/acc/reAuth"+`?accID=${req.params.accID}`);
    if(!data.data) {
        return res.send({msg: "ID PASS Invalid, maybe password is changed"});
    }
    if(data.err == "cookie_expired") return res.send({msg: "Cookie Expired, Go to /acc/:id/:password to reAuth", err: "cookie_expired"});
    const { token,ent_token } = data.data;
    const { puuid, region} = check;
    const skins = await getSkins(token,ent_token, puuid,region);
    
     if(skins == "An error occured") return res.send({msg: "An error occured"});
    const filteredSkins = await uidconverter(skins);
    if(filteredSkins == "An error occured") return res.send({msg: "An error occured"});
    await accSchema.findOneAndUpdate({accID:req.params.accID},{skins:{filteredSkins, totalSkins: filteredSkins.length}});
    res.send({filteredSkins, totalSkins: filteredSkins.length, msg: "Skins updated successfully"}); 
});

module.exports = router;