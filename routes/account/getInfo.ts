import { Router, Request, Response } from "express";
const router = Router();
import auth from '../../functions/auth/readyToken';
import getToken from '../../functions/auth/getAccToken';
import getEntToken from '../../functions/auth/getEntToken';
import getUserInfo from '../../functions/info/getUserInfo';
import getRegion from '../../utils/converters/regionConverter';
import genToken from '../../utils/api/genToken';
import encrypt from '../../utils/api/encrypt';
import multiauth from '../../functions/auth/sendMultiAuth';
import getUserInput from '../../utils/render/getUserInput';
import decrypt from '../../utils/api/decrypt';
import { save, findAndUpdate, findOne } from '../../database/utils';

interface Access_Token {
    access_token: string | string[] | undefined;
    id_token: string | string[] | undefined;
    expires_in: any;
    cookies: string;
    msg: string;
}

router.get("/:username/:password", global.checkAuth, async (req: Request, res: Response) => {
    const username = req.params.username;
    const password = req.params.password;
    //const multiAuth = req.query.multiauth;
    const { cookies } = await auth() as any;
    /*let data: Access_Token;
    if(multiAuth == "true") {
        const code = req.query.code as any;
        if(!code) return res.send({msg: "Code not provided"});
        data = (await multiauth(username,password,code)) as Access_Token;
        if (!data || typeof data !== 'object' || !('access_token' in data)) {
            return res.send({ msg: 'An error occurred' });
          }
    } else { */

    const data = (await getToken(username, password, cookies)) as Access_Token;
    if (data.msg == "multifactor") {
        //console.log("multifactor");
        const token = await encrypt(username + ":" + password, "multifactor");
        const script = await getUserInput(token, data.cookies);
        return res.send(script);
        //return res.status(204).send(script);

    }
    //res.send(data);
    if (!data || typeof data !== 'object' || !('access_token' in data)) {
        console.log(data)
        return res.send({ msg: 'An error occurred' });
    }
    const entData = await getEntToken(data.access_token as string);

    const userInfo = await getUserInfo(entData.entitlements_token);
    //console.log(userInfo);


    if (userInfo == "An error occured" || entData == "An error occured") return res.send({ msg: "An error occured" });

    const region = await getRegion(userInfo.country);

    const check = await findOne("account", { id: username, region: region });

    let accID: string = !check ? genToken(12) : check.accID;

    res.send({
        token: data.access_token,
        entitlements_token: entData.entitlements_token,
        accID: accID,
        id: username,
        email_verified: userInfo.email_verified,
        phone_verified: userInfo.phone_number_verified,
        puuid: userInfo.sub,
        country: userInfo.country,
        region: region,
        username: userInfo.acct.game_name,
        tag: userInfo.acct.tag_line,
    });

    if (!check) {
        await save("account", {
            id: username,
            email_verified: userInfo.email_verified,
            phone_verified: userInfo.phone_number_verified,
            puuid: userInfo.sub,
            country: userInfo.country,
            region: region,
            username: userInfo.acct.game_name,
            tag: userInfo.acct.tag_line,
            ent_token: entData.entitlements_token,
            accID: accID,
            token: await encrypt(username + ":" + password),
            cookieString: data.cookies,
            lastUpdated: Date.now()
        });
    } else {
        await findAndUpdate("account", { accID: accID }, {
            id: username,
            email_verified: userInfo.email_verified,
            phone_verified: userInfo.phone_number_verified,
            puuid: userInfo.sub,
            country: userInfo.country,
            region: region,
            username: userInfo.acct.game_name,
            tag: userInfo.acct.tag_line,
            ent_token: entData.entitlements_token,
            token: await encrypt(username + ":" + password),
            cookieString: data.cookies,
            lastUpdated: Date.now()
        });
    }

});


router.post("/:username/:password", global.checkAuth, async (req: Request, res: Response) => {
    const username = req.params.username;
    const password = req.params.password;
    console.log(req.body);
    const authToken = req.body['token'];
    const code = req.body.userInput;
    const cookies = req.body.cookies;

    if (!authToken || !username || !password || !code || !cookies) return res.send({ msg: "Please provide all the details" });
    //const encryptedToken = authToken.split(" ")[1];
    const decryptedToken = await decrypt(authToken, "multifactor") as string;
    if (decryptedToken == "An error occured") return res.send({ msg: "An error occured" });
    console.log(decryptedToken)
    const [user, pass] = decryptedToken.split(":");
    console.log(user, pass)
    if (user !== username || pass !== password) return res.send({ msg: "Invalid token" });

    //const multiAuth = req.query.multiauth;
    await auth();
    const data = (await multiauth(username, password, code, cookies)) as Access_Token;
    console.log(data)
    const entData = await getEntToken(data.access_token as string);
    console.log(entData)
    const userInfo = await getUserInfo(entData.entitlements_token);
    console.log(userInfo);


    if (userInfo == "An error occured" || entData == "An error occured") return res.send({ msg: "An error occured" });


    

    const region = await getRegion(userInfo.country);

    const check = await findOne("account",{ id: username, region: region });
    let accID: string = !check ? genToken(12) : check.accID;

    

    res.send({
        token: data.access_token,
        entitlements_token: entData.entitlements_token,
        accID: accID,
        id: username,
        email_verified: userInfo.email_verified,
        phone_verified: userInfo.phone_number_verified,
        puuid: userInfo.sub,
        country: userInfo.country,
        region: region,
        username: userInfo.acct.game_name,
        tag: userInfo.acct.tag_line,
    });
    if (!check) {
        await save("account", {
            id: username,
            email_verified: userInfo.email_verified,
            phone_verified: userInfo.phone_number_verified,
            puuid: userInfo.sub,
            country: userInfo.country,
            region: region,
            username: userInfo.acct.game_name,
            tag: userInfo.acct.tag_line,
            ent_token: entData.entitlements_token,
            accID: accID,
            token: await encrypt(username + ":" + password),
            cookieString: data.cookies,
            lastUpdated: Date.now()
        });
    } else {
        await findAndUpdate("account", { accID: accID }, {
            id: username,
            email_verified: userInfo.email_verified,
            phone_verified: userInfo.phone_number_verified,
            puuid: userInfo.sub,
            country: userInfo.country,
            region: region,
            username: userInfo.acct.game_name,
            tag: userInfo.acct.tag_line,
            ent_token: entData.entitlements_token,
            token: await encrypt(username + ":" + password),
            cookieString: data.cookies,
            lastUpdated: Date.now()
        });
    }
});


export default router;