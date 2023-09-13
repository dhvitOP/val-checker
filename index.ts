import express, { Express, Request, Response, NextFunction } from "express";
import { port,websiteUrl } from "./constants/config.json";
import contactWebsite from "./utils/misc/contactWebsite";
import database from "./database/connect";
import routes from "./constants/routes.json";

const token = "vedant_ki_mkc"
const app: Express = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

database();

setTimeout(async () => {
  global.checkAuth = async function(req:Request,res:Response,next:NextFunction) {
    if(!req.headers.authorization) return res.send({msg:"No token provided"});
    const auth = req.headers.authorization.split(" ")[1];
    if(auth !== token) return res.send({msg:"Invalid token"});
    next();
  }
  for (const property in routes) {
    const routeModule = await import(`./routes/${routes[property] as string}`);
    app.use(property, routeModule.default); 
    console.log(`Loaded ${property} route`);
  }

  app.listen(port, () => {
    console.log('App running on port ' + port);
  });

  contactWebsite(websiteUrl);
}, 1300);

const cachedTime: Number = Date.now();
export default cachedTime;
