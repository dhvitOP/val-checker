const storedSkins = require("../../constants/skins.json").data;
async function converter(skins) {
    if(!skins) return "An error occured";
    const data = [];
    storedSkins.forEach(storedSkinData => {
        skins.forEach(skinData => {
            if (storedSkinData.uuid == skinData.ItemID || storedSkinData.levels[0].uuid == skinData.ItemID) {
                data.push({uuid: storedSkinData.uuid, name: storedSkinData.displayName, image: storedSkinData.displayIcon})
            }
        });
    });
    return data;
}
module.exports = converter;