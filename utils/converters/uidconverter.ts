import { data } from "../../constants/skins.json" 
const storedSkins = data;
interface SkinData {
    uuid: string;
    name: string;
    image: string | null;
}
interface Skins {   
    ItemID: string;
    TypeID: string;
}
async function converter(skins: Array<Skins>) {
    if(!skins) return "An error occured";
    const data: SkinData[] = [];
    storedSkins.forEach(storedSkinData => {
        skins.forEach(skinData => {
            if (storedSkinData.uuid == skinData.ItemID || storedSkinData.levels[0].uuid == skinData.ItemID) {
                data.push({uuid: storedSkinData.uuid, name: storedSkinData.displayName, image: storedSkinData.displayIcon})
            }
        });
    });
    return data;
}
export default converter;