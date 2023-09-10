const { Router } = require('express');
const router = Router();
const accSchema = require('../../database/schemas/account');
const { apiUrl } = require('../../constants/config.json');
const axios = require('axios');
const getMatchHistory = require('../../functions/info/getMatchHistory');
router.get('/', async (req, res) => {
    const accID = req.query.accID;
    const data = await accSchema.findOne({ accID: accID });
    if (!data) return res.send({ msg: 'Account not found' });
    const auth = await axios.get(apiUrl + "/acc/reAuth?accID=" + accID);
    if(auth.data.err == "cookie_expired") return res.send({msg: "Cookie Expired, Go to /acc/:id/:password to reAuth", err: "cookie_expired"});
    if(!auth.data.data) return res.send({msg: "ID PASS Invalid, maybe password is changed"});
    const { token,ent_token } = auth.data.data;
    const history = await getMatchHistory({token:token,ent_token:ent_token,puuid:data.puuid,region:data.region});
    if(history == "An error occured") return res.send({msg: "An error occured"});
    res.send({msg: "Match History Fetched Successfully", history: history});
});
module.exports = router;