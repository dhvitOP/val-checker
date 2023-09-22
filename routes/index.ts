import { Hono,Context } from "hono";
const router = new Hono();
router.get("/", (c:Context) => {
    return c.json("Hello World!");
});
export default router;