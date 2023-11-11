import { Hono, Next, Context } from "hono";
import config from "./constants/config.json";
import contactWebsite from "./utils/misc/contactWebsite";
import database from "./database/connect";
import routes from "./constants/routes.json";
import { prettyJSON } from 'hono/pretty-json'
import { timing } from 'hono/timing'

const { port, websiteUrl, AuthKey } = config;

const token = AuthKey;
const app: Hono = new Hono({ strict: false });

database();

app.use('*', prettyJSON())
app.use('*', timing())

setTimeout(async () => {
  global.checkAuth = async function(c:Context,next:Next) {
    if(!c.req.header('authorization')) return c.json({msg:"Authorization header not provided"});
    const auth = c.req.header('authorization').split(" ")[1];
    if(auth !== token) return c.json({msg:"Invalid token"});
    await next();
  }
  for (const property in routes) {
    let route = routes[property];
    const routeModule = await import(`./routes/${route.file as string}`);
    app.route(property, routeModule.default); 
    //console.log(`Loaded ${property} route`);
  }
  const routesCount = Object.keys(routes).length;
  
  app.notFound((c) => {
    return c.text(' 404 Route Not Found', 404)
  })

  console.log("List of loaded Routes: ")
  app.showRoutes();
  console.log("Loaded " + routesCount + " routes");
  

  contactWebsite(websiteUrl);
}, 1300);


const cachedTime: Number = Date.now();

export default { time :cachedTime, port,
  fetch: app.fetch, app:app } ;
