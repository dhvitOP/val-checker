import { Router, Request, Response } from "express";
const router = Router();
import accSchema from '../../database/schemas/account';
import { apiUrl } from '../../constants/config.json';
import axios from 'axios';
import getUserLoadout from '../../functions/info/getUserLoadout';
import loadoutSchema from "../../database/schemas/loadout";
import { spraysconverter, skinsconverter } from '../../utils/converters/uidconverter';
import { getPlayerCards, getPlayerTitles } from "../../utils/converters/playerDetails";

interface playerCard {
    displayName: string,
    wideArt: string,
    largeArt: string,
    displayIcon: string,
}

router.get('/', async (req: Request, res:Response) => {
    const accID = req.query.accID;
    const data = await (accSchema as any).findOne({ accID: accID });
    if (!data) return res.send({ msg: 'Account not found' });

    const auth = await axios.get(apiUrl + "/acc/reAuth?accID=" + accID);
    
    if(auth.data.err == "cookie_expired") return res.send({msg: "Cookie Expired, Go to /acc/:id/:password to reAuth", err: "cookie_expired"});
    if(!auth.data.data) return res.send({msg: "ID PASS Invalid, maybe password is changed"});
    
    const { token,ent_token } = auth.data.data;
    const loadout = await getUserLoadout({token:token,ent_token:ent_token,puuid:data.puuid,region:data.region});
    if(loadout == "An error occured") return res.send({msg: "An error occured"});

    const { PlayerTitleID, PlayerCardID } = loadout.Identity;
    const { Sprays, Guns } = loadout;

    const filteredSprays = await spraysconverter(Sprays);
    const filteredGuns = await skinsconverter(Guns);
    const playerCard = (await getPlayerCards(PlayerCardID)) as playerCard;
    if(!playerCard || typeof playerCard == "string") return res.send({msg: "An error occured"});
    const playerTitle: String = await getPlayerTitles(PlayerTitleID);

    res.send({msg: "Match History Fetched Successfully", sprays: filteredSprays, skins: filteredGuns, playerTitle, PlayerCard:playerCard});

    const loadoutData = await (loadoutSchema as any).findOne({accID: accID});
    if(!loadoutData) {
        const newLoadout = new loadout({
            accID: accID,
            sprays: filteredSprays,
            equippedSkins: filteredGuns,
            
            playerTitle: playerTitle,
            playerCard: playerCard,
        });
        await newLoadout.save();
    } else {
        loadoutData.sprays = filteredSprays;
        loadoutData.equippedSkins = filteredGuns;
        loadoutData.playerTitle = playerTitle;
        loadoutData.playerCard = playerCard;
        await loadoutData.save();
    }
    
});
export default router;