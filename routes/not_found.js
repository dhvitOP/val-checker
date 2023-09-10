const { Router } = require("express");
const router = Router();
router.get("*", (req, res) => {
    res.send({ errCode: 404, message: "Route Not Found" });
});
router.post("*", (req, res) => {
    res.send({ errCode: 404, message: "Route Not Found" });
});
module.exports = router;