import { Hono, Context } from "hono";
const router = new Hono();
import { findOne, save } from '../../database/utils';
import { endTime, startTime } from "hono/timing";
import auth from '../../functions/auth/readyToken';
import getToken from '../../functions/auth/getAccToken';
import getEntToken from '../../functions/auth/getEntToken';
import getUserInfo from '../../functions/info/getUserInfo';
import getRegion from '../../utils/converters/regionConverter';
import genToken from '../../utils/api/genToken';
import getUserLoadout from "../../functions/info/getUserLoadout";
import { getPlayerCards, getPlayerTitles } from "../../utils/converters/playerDetails";
import getSkins from "../../functions/info/getSkins";
import { skinsconverter } from "../../utils/converters/uidconverter";

interface Access_Token {
  access_token: string | undefined;
  id_token: string | string[] | undefined;
  expires_in: any;
  cookies: string;
  msg: string;
}
interface playerCard {
  displayName: string,
  wideArt: string,
  largeArt: string,
  displayIcon: string,
}

router.get("/:username/:password", global.checkAuth, async (c: Context) => {
  const username = c.req.param("username");
  const password = c.req.param("password");


  if (!username || !password) return c.json({ msg: "Please provide username and password" });
  startTime(c, "Getting_Token");
  const cookies = await auth() as any;

  const data = (await getToken(username, password, cookies)) as Access_Token;
  if (data.msg == "multifactor") {
    return c.json({ msg: "multifactor" });

  }
  endTime(c, "Getting_Token");
  if (!data || typeof data !== 'object' || !('access_token' in data)) {
    return c.json({ msg: 'An error occurred' });
  }
  startTime(c, "Getting_UserInfo");
  const userInfo = await getUserInfo(data.access_token as string);
  if (userInfo == "An error occured") return c.json({ msg: "An error occured" });
  endTime(c, "Getting_UserInfo");
  const region = await getRegion(userInfo.country);
  if (region == "An error occured") return c.json({ msg: "An error occured" });

  const { sub, email_verified, phone_number_verified, country, acct } = userInfo;
  const game_name = acct.game_name;
  const tag_line = acct.tag_line;

  let entData: string;

  const banned = userInfo.ban.restrictions;
  if (banned.length === 0) {

    startTime(c, "Getting_EntToken");
    let entDatax = await getEntToken(data.access_token as string);
    if (entDatax == "An error occured") return c.json({ msg: "An error occured" });
    let entData = entDatax.entitlements_token;
    endTime(c, "Getting_EntToken");
    startTime(c, "Getting_Loadout");
    const loadout = await getUserLoadout({ token: data.access_token, ent_token: entData, puuid: sub, region: region });
    if (loadout == "An error occured") return c.json({ msg: "An error occured" });
    endTime(c, "Getting_Loadout");

    startTime(c, "Converting_Data");
    const { PlayerTitleID, PlayerCardID } = loadout.Identity;
    const playerCard = (await getPlayerCards(PlayerCardID)) as playerCard;
    if (!playerCard || typeof playerCard == "string") return c.json({ msg: "An error occured" });
    const playerTitle: String = await getPlayerTitles(PlayerTitleID);
    if (!playerCard || typeof playerCard == "string") return c.json({ msg: "An error occured" });

    const skins = await getSkins(data.access_token, entData, sub, region);
    if (skins == "An error occured") return c.json({ msg: "An error occured" });

    startTime(c, "Saving_Data");
    const acc = await findOne("account", { id: username, country: country, region: region, username: game_name });
    let accID: string = !acc ? genToken(12) : acc.accID;
    if (!acc) {
      await save("account", {
        id: username,
        email_verified: email_verified,
        phone_verified: phone_number_verified,
        puuid: sub,
        country: country,
        region: region,
        username: game_name,
        tag: tag_line,
        accID: accID,
        token: data.access_token,
        ent_token: entData,
        cookieString: data.cookies,
        lastUpdated: Date.now(),
      });
    } else {
      acc.token = data.access_token;
      acc.ent_token = entData;
      acc.cookieString = data.cookies;
      acc.lastUpdated = Date.now();
      await acc.save();
    }



    const filteredSkins = await skinsconverter(skins);
    if (filteredSkins == "An error occured") return c.json({ msg: "An error occured" });

    const loadoutData = await findOne("loadout", { accID: accID });
    if (!loadoutData) {
      await save("loadout", {
        accID: accID,
        sprays: [],
        equippedSkins: filteredSkins,
        playerTitle: playerTitle,
        playerCard: playerCard,
      });
    } else {
      loadoutData.equippedSkins = filteredSkins;
      loadoutData.playerTitle = playerTitle;
      loadoutData.playerCard = playerCard;
      await loadoutData.save();
    }

    endTime(c, "Saving_Data");

    return c.json({
      token: data.access_token,
      entitlements_token: entData,
      accID: accID,
      id: username,
      email_verified: email_verified,
      phone_verified: phone_number_verified,
      puuid: sub,
      country: country,
      totalSkins: filteredSkins.length,
      region: region,
      username: game_name,
      tag: tag_line,
      skins: filteredSkins,
      playerTitle: playerTitle,
      playerCard: playerCard,
      banned: false,
      banType: null,
      restrictions: []
    });

  } else {
    return c.json({
      token: data.access_token,
      entitlements_token: "Account is banned",
      accID: "Account is banned",
      id: username,
      email_verified: email_verified,
      phone_verified: phone_number_verified,
      puuid: sub,
      country: country,
      totalSkins: null,
      region: region,
      username: game_name,
      tag: tag_line,
      skins: [],
      playerTitle: null,
      playerCard: null,
      banned: true,
      banType: banned[0].type,
      restrictions: banned
    });

  }


});
export default router;