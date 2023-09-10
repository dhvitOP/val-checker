const { Router } = require("express");
const router = Router();
const decrypt = require("../../utils/api/decrypt.js");
const { apiUrl } = require("../../constants/config.json");
const accSchema = require("../../database/schemas/account");
const getSkins = require("../../functions/info/getSkins.js");
const uidconverter = require("../../utils/converters/uidconverter.js");
const axios = require("axios");

router.get("/:accID", async(req, res) => {
    const check = await accSchema.findOne({accID:req.params.accID});
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