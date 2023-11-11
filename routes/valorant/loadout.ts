import { Context, Hono } from "hono";
const router = new Hono();


import { save, findOne } from '../../database/utils';

import config from '../../constants/config.json';
const apiUrl = config.apiUrl;

import axios from 'axios';
import getUserLoadout from '../../functions/info/getUserLoadout';
import { spraysconverter, skinsconverter } from '../../utils/converters/uidconverter';
import { getPlayerCards, getPlayerTitles } from "../../utils/converters/playerDetails";
import { endTime, startTime } from "hono/timing";

interface playerCard {
    displayName: string,
    wideArt: string,
    largeArt: string,
    displayIcon: string,
}

router.get('/:accID',global.checkAuth, async (c:Context) => {
    const accID = c.req.param('accID');
    const data = await findOne("account",{ accID: accID });
    if (!data) return c.json({ msg: 'Account not found' });
    startTime(c, "Fetching_Loadout");
    const auth = await axios.get(apiUrl + "/acc/reAuth/" + accID);
    
    if(auth.data.err == "cookie_expired") return c.json({msg: "Cookie Expired, Go to /acc/:id/:password to reAuth", err: "cookie_expired"});
    if(!auth.data.data) return c.json({msg: "ID PASS Invalid, maybe password is changed"});
    
    const { token,ent_token } = auth.data.data;
    const loadout = await getUserLoadout({token:token,ent_token:ent_token,puuid:data.puuid,region:data.region});
    if(loadout == "An error occured") return c.json({msg: "An error occured"});

    endTime(c, "Fetching_Loadout");

    const { PlayerTitleID, PlayerCardID } = loadout.Identity;
    const { Sprays, Guns } = loadout;

    startTime(c, "Converting_Data");

    const filteredSprays = await spraysconverter(Sprays);
    const filteredGuns = await skinsconverter(Guns);
    const playerCard = (await getPlayerCards(PlayerCardID)) as playerCard;
    if(!playerCard || typeof playerCard == "string") return c.json({msg: "An error occured"});
    const playerTitle: String = await getPlayerTitles(PlayerTitleID);

    endTime(c, "Converting_Data");
    startTime(c, "Saving_Data");
    
    const loadoutData = await findOne("loadout",{accID: accID});
    if(!loadoutData) {
        await save("loadout",{
            accID: accID,
            sprays: filteredSprays,
            equippedSkins: filteredGuns,
            
            playerTitle: playerTitle,
            playerCard: playerCard,
        });
    } else {
        loadoutData.sprays = filteredSprays;
        loadoutData.equippedSkins = filteredGuns;
        loadoutData.playerTitle = playerTitle;
        loadoutData.playerCard = playerCard;
        await loadoutData.save();
    }
    endTime(c, "Saving_Data");
    return c.json({msg: "User's Loadout Fetched Successfully", sprays: filteredSprays, skins: filteredGuns, playerTitle, playerCard:playerCard});

});
export default router;