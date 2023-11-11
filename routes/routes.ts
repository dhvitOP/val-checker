import { Hono,Context } from "hono";
import routes from "../constants/routes.json";

const router = new Hono();

router.get("/", (c:Context) => {
    return c.json({routes: routes});
});
export default router;