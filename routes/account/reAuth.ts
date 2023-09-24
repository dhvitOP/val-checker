import { Hono, Context } from "hono";
const router = new Hono();
import reAuth from '../../functions/auth/getReAuth';
import { save, findAndUpdate, findOne } from '../../database/utils';
import getEntToken from '../../functions/auth/getEntToken';
import checkUpdated from '../../utils/misc/checkUpdated';
import { startTime, endTime } from "hono/timing";

interface ReAuthData {
    access_token: string | string[] | undefined;
    id_token: string | string[] | undefined;
    expires_in: any;
  }
  

router.get("/:accID", global.checkAuth, async(c:Context) => {
    const accID = c.req.param("accID");
    
    const data = await findOne("account",{accID:accID});
    if(!data) return c.json({msg:"Account not found"});
    const updated = await checkUpdated(data.lastUpdated);
    if(updated == false) {
        return c.json({msg:"Cookie Expired, Go to /acc/:id/:password to reAuth", err: "cookie_expired"});
    }
    startTime(c, "Re-Authenticating");
    const reAuthData = (await reAuth(data.cookieString)) as ReAuthData;
    if (
        !reAuthData ||
        typeof reAuthData !== 'object' ||
        !('access_token' in reAuthData)
      ) {
        console.log(reAuthData + "0")
        return c.json({ msg: 'An error occurred' });
      }
    const entData = await getEntToken(reAuthData.access_token as string);
    if(entData == "An error occured") return c.json({msg: "An error occured"});
    data.lastUpdated = Date.now();
    data.token = reAuthData.access_token;
    data.ent_token = entData.entitlements_token;
    await data.save();
    endTime(c, "Re-Authenticating");
    return c.json({msg: "ReAuthed successfully", data: {token: reAuthData.access_token, ent_token: entData.entitlements_token}});
});
export default router;