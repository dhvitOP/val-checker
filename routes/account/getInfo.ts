import { Context, Hono, Next } from "hono";
import { endTime, startTime, timing } from 'hono/timing'

const router = new Hono();

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

router.get("/:username/:password", global.checkAuth, async (c: Context, next: Next) => {
    const username = c.req.param("username");
    const password = c.req.param("password");
    //const multiAuth = req.query.multiauth;
    const cookies = await auth() as any;
    /*let data: Access_Token;
    if(multiAuth == "true") {
        const code = req.query.code as any;
        if(!code) return c.json({msg: "Code not provided"});
        data = (await multiauth(username,password,code)) as Access_Token;
        if (!data || typeof data !== 'object' || !('access_token' in data)) {
            return c.json({ msg: 'An error occurred' });
          }
    } else { */
    startTime(c, "Getting_Access_Token");
    const data = (await getToken(username, password, cookies)) as Access_Token;
    if (data.msg == "multifactor") {
        //console.log("multifactor");
        const token = await encrypt(username + ":" + password, "multifactor");
        const script = await getUserInput(token, data.cookies);
        return c.render(script);
        //return res.status(204).send(script);

    }
    endTime(c, "Getting_Access_Token");

    //c.json(data);
    if (!data || typeof data !== 'object' || !('access_token' in data)) {
        console.log(data)
        return c.json({ msg: 'An error occurred' });
    }
    startTime(c, "Getting_Stuff_from_Riot");

    const userInfo = await getUserInfo(data.access_token as string);
    //console.log(userInfo);
    endTime(c, "Getting_Stuff_from_Riot");

    if (userInfo == "An error occured") return c.json({ msg: "An error occured" });

    const region = await getRegion(userInfo.country);

    startTime(c, "Saving_to_Database");


    const banned = userInfo.ban.restrictions;

    let accID: string;
    let entData: string;

    const check = await findOne("account", { id: username, country: userInfo.country, region: region, username: userInfo.acct.game_name });

    if (banned.length === 0) {


        const entDatax = await getEntToken(data.access_token as string);
        if (entDatax == "An error occured") return c.json({ msg: "An error occured" });
        let entData = entDatax.entitlements_token;


        let accID: string = !check ? genToken(12) : check.accID;

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
                ent_token: entData,
                accID: accID,
                cookieString: data.cookies,
                lastUpdated: Date.now(),
                banned:false
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
                ent_token: entData,
                cookieString: data.cookies,
                lastUpdated: Date.now()
            });
        }
    } else {
        entData = "Account is banned";
        accID = "Account is banned";
        if(!check) {
            await save("account", {
                id: username,
                email_verified: userInfo.email_verified,
                phone_verified: userInfo.phone_number_verified,
                puuid: userInfo.sub,
                country: userInfo.country,
                region: region,
                username: userInfo.acct.game_name,
                tag: userInfo.acct.tag_line,
                ent_token: entData,
                accID: accID,
                cookieString: data.cookies,
                lastUpdated: Date.now(),
                banned:true
            });
        } else {
            await findAndUpdate("account", { accID: check.accID }, {
                id: username,
                email_verified: userInfo.email_verified,
                phone_verified: userInfo.phone_number_verified,
                puuid: userInfo.sub,
                country: userInfo.country,
                region: region,
                username: userInfo.acct.game_name,
                tag: userInfo.acct.tag_line,
                ent_token: entData,
                cookieString: data.cookies,
                lastUpdated: Date.now(),
                banned:true
            });
        }
    }
    endTime(c, "Saving_to_Database");
    return c.json({
        token: data.access_token,
        entitlements_token: entData,
        accID: accID,
        id: username,
        email_verified: userInfo.email_verified,
        phone_verified: userInfo.phone_number_verified,
        puuid: userInfo.sub,
        country: userInfo.country,
        region: region,
        username: userInfo.acct.game_name,
        tag: userInfo.acct.tag_line,
        banned: banned.length === 0 ? false : true,
        banType: banned.length === 0 ? null : banned[0].type,
        restrictions: banned.length === 0 ? [] : banned
    });
});


router.post("/:username/:password", global.checkAuth, async (c: Context, next: Next) => {
    const username = c.req.param("username");
    const password = c.req.param("password");

    const body = await c.req.json();
    const authToken = body.authToken;
    const code = body.userInput;
    const cookies = body.cookies;

    if (!authToken || !username || !password || !code || !cookies) return c.json({ msg: "Please provide all the details" });
    //const encryptedToken = authToken.split(" ")[1];
    const decryptedToken = await decrypt(authToken, "multifactor") as string;
    if (decryptedToken == "An error occured") return c.json({ msg: "An error occured" });

    const [user, pass] = decryptedToken.split(":");

    if (user !== username || pass !== password) return c.json({ msg: "Invalid token" });

    //const multiAuth = req.query.multiauth;
    await auth();
    startTime(c, "Getting_Stuff_from_Riot");
    const data = (await multiauth(username, password, code, cookies)) as Access_Token;


    const userInfo = await getUserInfo(data.access_token as string);

    endTime(c, "Getting_Stuff_from_Riot");

    if (userInfo == "An error occured") return c.json({ msg: "An error occured" });




    const region = await getRegion(userInfo.country);


    startTime(c, "Saving_to_Database");





    const banned = userInfo.ban.restrictions;

    let entData: string;
    let accID: string;

    
    const check = await findOne("account", { id: username, region: region });

    if (banned.length === 0) {
        

        const entDatax = await getEntToken(data.access_token as string);
        if (entDatax == "An error occured") return c.json({ msg: "An error occured" });
        let accID: string = !check ? genToken(12) : check.accID;
        let entData = entDatax.entitlements_token;

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
                ent_token: entData,
                accID: accID,
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
                ent_token: entData,
                cookieString: data.cookies,
                lastUpdated: Date.now()
            });
        }
    } else {
        entData = "Account is banned";
        accID = "Account is banned";
        if(!check) {
            await save("account", {
                id: username,
                email_verified: userInfo.email_verified,
                phone_verified: userInfo.phone_number_verified,
                puuid: userInfo.sub,
                country: userInfo.country,
                region: region,
                username: userInfo.acct.game_name,
                tag: userInfo.acct.tag_line,
                ent_token: entData,
                accID: accID,
                cookieString: data.cookies,
                lastUpdated: Date.now(),
                banned:true
            });
        } else {
            await findAndUpdate("account", { accID: check.accID }, {
                id: username,
                email_verified: userInfo.email_verified,
                phone_verified: userInfo.phone_number_verified,
                puuid: userInfo.sub,
                country: userInfo.country,
                region: region,
                username: userInfo.acct.game_name,
                tag: userInfo.acct.tag_line,
                ent_token: entData,
                cookieString: data.cookies,
                lastUpdated: Date.now(),
                banned:true
            });
        }
    }
    endTime(c, "Saving_to_Database");
    return c.json({
        token: data.access_token,
        entitlements_token: entData,
        accID: accID,
        id: username,
        email_verified: userInfo.email_verified,
        phone_verified: userInfo.phone_number_verified,
        puuid: userInfo.sub,
        country: userInfo.country,
        region: region,
        username: userInfo.acct.game_name,
        tag: userInfo.acct.tag_line,
        banned: banned.length === 0 ? false : true,
        banType: banned.length === 0 ? null : banned[0].type,
        restrictions: banned.length === 0 ? [] : banned
    });
});


export default router;