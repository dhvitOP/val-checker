import { Router, Request, Response } from "express";
import sendMultiAuth from "../functions/auth/sendMultiAuth";

const router = Router();
router.get("/", (req:Request, res:Response) => {
    const username = "dhvit";
    const password = "dhvit4811";
    const code = (req.query.code) as  any;
    sendMultiAuth(username, password, code);
});
export default router;