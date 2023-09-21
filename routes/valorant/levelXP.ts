import { Router, Request, Response } from "express";
const router = Router();
import getAccLevel from '../../functions/info/getAccLevel';
import { save, findOne } from '../../database/utils';
import axios from 'axios';

import config from '../../constants/config.json';
const apiUrl = config.apiUrl;

router.get("/", global.checkAuth,async(req: Request, res: Response) => {

    const accID = req.query.accID;
    if(!accID) return res.send({msg: "Please provide an account ID"});

    const acc = await findOne("account", {accID:accID});
    if(!acc) return res.send({msg: "Account not found"});

    const auth = await axios.get(apiUrl + "/acc/reAuth?accID=" + accID);
    if(auth.data.err == "cookie_expired") return res.send({msg: "Cookie Expired, Go to /acc/:id/:password to reAuth", err: "cookie_expired"});
    if(!auth.data.data) return res.send({msg: "ID PASS Invalid, maybe password is changed"});

    const { token,ent_token } = auth.data.data;
    const level = await getAccLevel({token:token,ent_token:ent_token,puuid:acc.puuid,region:acc.region});
    if(level == "An error occured") return res.send({msg: "An error occured"});
    
    res.send({msg: "Level Fetched Successfully", level: level.level, xp: level.xp});

    const loadout = await findOne("loadout",{accID: accID});
    if(!loadout) {
        await save("loadout",{
            accID: accID,
            level: level.level,
            xp: level.xp,
        });
    } else {
        loadout.level = level.level;
        loadout.xp = level.xp;
        await loadout.save();
    }
});
export default router;