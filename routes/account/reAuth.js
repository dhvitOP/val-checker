const { Router } = require("express");
const router = Router();
const reAuth = require("../../functions/auth/getReAuth.js");
const accSchema = require("../../database/schemas/account.js");
const getEntToken = require("../../functions/auth/getEntToken.js");
const checkUpdated = require("../../utils/misc/checkUpdated.js")
router.get("/", async(req, res) => {
    const accID = req.query.accID;
    const data = await accSchema.findOne({accID:accID});
    if(!data) return res.send({msg:"Account not found"});
    const updated = await checkUpdated(data.lastUpdated);
    if(updated == false) {
        return res.send({msg:"Cookie Expired, Go to /acc/:id/:password to reAuth", err: "cookie_expired"});
    }
    data.lastUpdated = Date.now();
    await data.save();
    const reAuthData = await reAuth(data.cookieString);
    if(reAuthData == "An error occured") return res.send({msg: "An error occured"});
    const entData = await getEntToken(data.access_token);
    if(entData == "An error occured") return res.send({msg: "An error occured"});
    data.token = reAuthData.access_token;
    res.send({msg: "ReAuthed successfully", data: {token: reAuthData.access_token, ent_token: entData.entitlements_token}});
});
module.exports = router;