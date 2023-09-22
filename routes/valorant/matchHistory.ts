import { Router, Request, Response } from "express";
const router = Router();

import { save, findAndUpdate, findOne } from '../../database/utils';

import config from '../../constants/config.json';
const apiUrl = config.apiUrl;


import axios from 'axios';
import getMatchHistory from '../../functions/info/getMatchHistory';
router.get('/', global.checkAuth, async (req: Request, res:Response) => {
    const accID = req.query.accID;

    const data = await findOne("account",{ accID: accID });
    if (!data) return res.send({ msg: 'Account not found' });

    const auth = await axios.get(apiUrl + "/acc/reAuth?accID=" + accID);
    if(auth.data.err == "cookie_expired") return res.send({msg: "Cookie Expired, Go to /acc/:id/:password to reAuth", err: "cookie_expired"});
    if(!auth.data.data) return res.send({msg: "ID PASS Invalid, maybe password is changed"});

    const { token,ent_token } = auth.data.data;

    const history = await getMatchHistory({token:token,ent_token:ent_token,puuid:data.puuid,region:data.region});
    if(history == "An error occured") return res.send({msg: "An error occured"});
    
    res.send({msg: "Match History Fetched Successfully", history: history});
    
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
});
export default router;