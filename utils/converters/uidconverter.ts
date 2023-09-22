import skinsData from "../../constants/skins.json";
import spraysData from "../../constants/sprays.json";

const storedSprays = spraysData.data;
const storedSkins = skinsData.data;

interface SkinData {
    uuid: string;
    name: string;
    image: string | null;
}
interface SprayData {
    uuid: string;
    name: string;
    image: string | null;
    fullimage: string | null;
    animation: string | null;
}
interface Skins {   
    SprayID: string;    
    SkinID: string;
    ItemID: string;
}
async function skinsconverter(skins: Array<Skins>) {
    if(!skins) return "An error occured";
    const data: SkinData[] = [];
    storedSkins.forEach(storedSkinData => {
        skins.forEach(skinData => {
            if (storedSkinData.uuid == skinData.ItemID || storedSkinData.levels[0].uuid == skinData.ItemID) {
                data.push({uuid: storedSkinData.uuid, name: storedSkinData.displayName, image: storedSkinData.displayIcon})
            } else if(storedSkinData.uuid == skinData.SkinID || storedSkinData.levels[0].uuid == skinData.SkinID) {
                data.push({uuid: storedSkinData.uuid, name: storedSkinData.displayName, image: storedSkinData.displayIcon})
            } else if(storedSkinData.uuid == skinData.ItemID || storedSkinData.levels[0].uuid == skinData.ItemID){

            }
        });
    });
    return data;
}
async function spraysconverter(sprays: Array<Skins>) {
    if(!sprays) return "An error occured";
    const data: SprayData[] = [];
    storedSprays.forEach(storedSkinData => {
        sprays.forEach(skinData => {
            if (storedSkinData.uuid == skinData.SprayID || storedSkinData.levels[0].uuid == skinData.SprayID) {
                data.push({uuid: storedSkinData.uuid, name: storedSkinData.displayName, image: storedSkinData.displayIcon, fullimage: storedSkinData.fullTransparentIcon, animation: storedSkinData.animationGif})
            } else if(storedSkinData.uuid == skinData.SprayID || storedSkinData.levels[0].uuid == skinData.SkinID) {
                data.push({uuid: storedSkinData.uuid, name: storedSkinData.displayName, image: storedSkinData.displayIcon, fullimage: storedSkinData.fullTransparentIcon, animation: storedSkinData.animationGif})
            } else if(storedSkinData.uuid == skinData.SprayID || storedSkinData.levels[0].uuid == skinData.SprayID){

            }
        });
    });
    return data;
}
export {
    skinsconverter,
    spraysconverter
}