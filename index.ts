import express, { Express } from "express";
import { port,websiteUrl } from "./constants/config.json";
import contactWebsite from "./utils/misc/contactWebsite";
import database from "./database/connect";
import routes from "./constants/routes.json";

const app: Express = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

database();

setTimeout(async () => {
  for (const property in routes) {
    const routeModule = await import(`./routes/${routes[property] as string}`);
    app.use(property, routeModule.default); // Use the exported default handler
    console.log(`Loaded ${property} route`);
  }

  app.listen(port, () => {
    console.log('App running on port ' + port);
  });

  contactWebsite(websiteUrl);
}, 1300);

const cachedTime: Number = Date.now();
export default cachedTime;