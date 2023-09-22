import { Router, Request, Response } from "express";
const router = Router();
router.get("*", (req: Request, res, Response) => {
    res.send({ errCode: 404, message: "Route Not Found" });
});
router.post("*", (req:Request, res:Response) => {
    //console.log("POST request made to undefined route")
    res.send({ errCode: 404, message: "Route Not Found" });
});
export default router;