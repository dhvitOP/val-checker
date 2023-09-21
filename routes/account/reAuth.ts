import { Router, Request, Response } from "express";
const router = Router();
import reAuth from '../../functions/auth/getReAuth';
import { save, findAndUpdate, findOne } from '../../database/utils';
import getEntToken from '../../functions/auth/getEntToken';
import checkUpdated from '../../utils/misc/checkUpdated';

interface ReAuthData {
    access_token: string | string[] | undefined;
    id_token: string | string[] | undefined;
    expires_in: any;
  }
  

router.get("/", global.checkAuth, async(req: Request, res: Response) => {
    const accID = req.query.accID;
    const data = await findOne("account",{accID:accID});
    if(!data) return res.send({msg:"Account not found"});
    const updated = await checkUpdated(data.lastUpdated);
    if(updated == false) {
        return res.send({msg:"Cookie Expired, Go to /acc/:id/:password to reAuth", err: "cookie_expired"});
    }
    
    const reAuthData = (await reAuth(data.cookieString)) as ReAuthData;
    if (
        !reAuthData ||
        typeof reAuthData !== 'object' ||
        !('access_token' in reAuthData)
      ) {
        console.log(reAuthData)
        return res.send({ msg: 'An error occurred' });
      }
    
    const entData = await getEntToken(data.access_token);
    if(entData == "An error occured") return res.send({msg: "An error occured"});
    data.lastUpdated = Date.now();
    data.token = reAuthData.access_token;
    data.ent_token = entData.entitlements_token;
    await data.save();
    res.send({msg: "ReAuthed successfully", data: {token: reAuthData.access_token, ent_token: entData.entitlements_token}});
});
export default router;