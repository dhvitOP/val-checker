const { Router } = require("express");
const router = Router();
const auth = require("../../functions/auth/readyToken");
const getToken = require("../../functions/auth/getAccToken");
const getEntToken = require("../../functions/auth/getEntToken");
const getUserInfo = require("../../functions/info/getUserInfo");
const accSchema = require("../../database/schemas/account");
const getRegion = require("../../utils/converters/regionConverter.js");
const genToken = require("../../utils/api/genToken.js");
const encrypt = require("../../utils/api/encrypt.js");  

router.get("/:username/:password", async(req, res) => {
    const username = req.params.username;
    const password = req.params.password;
    const session = req.query.session;

    await auth(username,password);
    const data = await getToken(username,password,session == "keep" ? "keep" : null);
    const entData = await getEntToken(data.access_token);

    const userInfo = await getUserInfo(entData.entitlements_token);

    if(userInfo == "An error occured" || entData == "An error occured"|| data == "An error occured") return res.send({msg: "An error occured"});

    
    let accID;

    const region = await getRegion(userInfo.country);

    const check = await accSchema.findOne({id:username,region:region});

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
module.exports = router;