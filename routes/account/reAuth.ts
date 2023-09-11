import { Router, Request, Response } from "express";
const router = Router();
import reAuth from '../../functions/auth/getReAuth';
import accSchema from '../../database/schemas/account';
import getEntToken from '../../functions/auth/getEntToken';
import checkUpdated from '../../utils/misc/checkUpdated';

interface ReAuthData {
    access_token: string | string[] | undefined;
    id_token: string | string[] | undefined;
    expires_in: any;
  }
  

router.get("/", async(req: Request, res: Response) => {
    const accID = req.query.accID;
    const data = await (accSchema as any).findOne({accID:accID});
    if(!data) return res.send({msg:"Account not found"});
    const updated = await checkUpdated(data.lastUpdated);
    if(updated == false) {
        return res.send({msg:"Cookie Expired, Go to /acc/:id/:password to reAuth", err: "cookie_expired"});
    }
    data.lastUpdated = Date.now();
    await data.save();
    const reAuthData = (await reAuth(data.cookieString)) as ReAuthData;
    if (
        !reAuthData ||
        typeof reAuthData !== 'object' ||
        !('access_token' in reAuthData)
      ) {
        return res.send({ msg: 'An error occurred' });
      }
    const entData = await getEntToken(data.access_token);
    if(entData == "An error occured") return res.send({msg: "An error occured"});
    data.token = reAuthData.access_token;
    res.send({msg: "ReAuthed successfully", data: {token: reAuthData.access_token, ent_token: entData.entitlements_token}});
});
module.exports = router;