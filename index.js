const express = require("express");
const routes = require("./constants/routes.json")
const database = require("./database/connect");
const { port, websiteUrl } = require("./constants/config.json");
const contact = require("./utils/misc/contactWebsite");
const fetchClientVersion = require("./utils/misc/fetchClientVersion");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

database();

setTimeout(async () => {


  for (const property in routes) {
    app.use(property, require(`./routes/${routes[property]}`))
    console.log(`Loaded ${property} route`);
  }

  app.listen(port, () => {
    console.log('App running on port ' + port);
  });

  contact(websiteUrl);
}, 1300);

fetchClientVersion().then((ClientVersion) => {


  console.log("Riot Client Version: " + ClientVersion);

  const cachedTime = Date.now();

  module.exports = {
    ClientVersion,
    cachedTime
  };
})

