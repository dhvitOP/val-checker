import { Router, Request, Response } from "express";
const router = Router();
import auth from '../../functions/auth/readyToken';
import getToken from '../../functions/auth/getAccToken';
import getEntToken from '../../functions/auth/getEntToken';
import getUserInfo from '../../functions/info/getUserInfo';
import accSchema from '../../database/schemas/account';
import getRegion from '../../utils/converters/regionConverter';
import genToken from '../../utils/api/genToken';
import encrypt from '../../utils/api/encrypt';
import multiauth from '../../functions/auth/sendMultiAuth';

interface Access_Token {
    access_token: string | string[] | undefined;
    id_token: string | string[] | undefined;
    expires_in: any;
    cookies: string;
    msg: string;
}

router.get("/:username/:password", async(req: Request, res:Response) => {
    const username = req.params.username;
    const password = req.params.password;
    //const multiAuth = req.query.multiauth;
    await auth();
    /*let data: Access_Token;
    if(multiAuth == "true") {
        const code = req.query.code as any;
        if(!code) return res.send({msg: "Code not provided"});
        data = (await multiauth(username,password,code)) as Access_Token;
        if (!data || typeof data !== 'object' || !('access_token' in data)) {
            return res.send({ msg: 'An error occurred' });
          }
    } else { */
    
    const data = (await getToken(username,password)) as Access_Token;
    if(data.msg == "multifactor") {
        return res.send({msg: "Multifactor Authentication is not supported yet"});
    }

    const entData = await getEntToken(data.access_token as string);

    const userInfo = await getUserInfo(entData.entitlements_token);

    if (!data || typeof data !== 'object' || !('access_token' in data)) {
        return res.send({ msg: 'An error occurred' });
      }

    if(userInfo == "An error occured" || entData == "An error occured") return res.send({msg: "An error occured"});

    
    let accID;

    const region = await getRegion(userInfo.country);

    const check = await (accSchema as any).findOne({id:username,region:region});

    if(!check) {
    accID = genToken(12);
    const acc = new accSchema({
        id:username,
        email_verified:userInfo.email_verified,
        phone_verified:userInfo.phone_number_verified,
        puuid:userInfo.sub,
        country:userInfo.country,
        region:region,
        username:userInfo.acct.game_name,
        tag:userInfo.acct.tag_line,
        ent_token: entData.entitlements_token,
        accID: accID,
        token: await encrypt(username + ":" + password),
        cookieString: data.cookies,
        lastUpdated: Date.now()
        });
    await acc.save();
    } else {
    accID = check.accID;
    await accSchema.findOneAndUpdate({accID:accID},{
        id:username,
        email_verified:userInfo.email_verified,
        phone_verified:userInfo.phone_number_verified,
        puuid:userInfo.sub,
        country:userInfo.country,
        region:region,
        username:userInfo.acct.game_name,
        tag:userInfo.acct.tag_line,
        ent_token: entData.entitlements_token,
        token: await encrypt(username + ":" + password),
        cookieString: data.cookies,
        lastUpdated: Date.now()
    });
}

    return res.send({token: data.access_token, entitlements_token: entData.entitlements_token, userInfo: userInfo, accID: accID});

});
export default router;