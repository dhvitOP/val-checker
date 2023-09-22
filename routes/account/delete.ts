import { Hono, Context } from "hono";
const router = new Hono();
import { deleteOne, findOne } from '../../database/utils';
router.delete("/:accID", global.checkAuth, async (c:Context) => {
    const accID = c.req.param('accID');
    if(!accID) return c.json({msg: "Please provide an account ID"});
    const check = await findOne("account", {accID:accID});
    if(!check) return c.json({msg: "Account not found"});
    const acc = await deleteOne("account", {accID:accID});
    if(!acc) return c.json({msg: "Account not found"});
    const loadout = await deleteOne("loadout", {accID:accID});
    if(!loadout) return c.json({msg: "Loadout not found"});
    return c.json({msg: "Account Deleted Successfully"});
});
export default router;