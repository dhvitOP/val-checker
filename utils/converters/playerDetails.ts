const valorant_api = "https://valorant-api.com/v1/";
import axios from 'axios';

async function getPlayerTitles(titleuid: string) {
    try {
    const { data } = await axios.get(valorant_api + "playerTitles/"+ titleuid);
    return data.data.displayName;
    } catch (error) {
        return "An error occured";
    }
}
async function getPlayerCards(carduid: string) {
    try {
    const { data } = await axios.get(valorant_api + "playercards/"+ carduid);
    return {
        displayName: data.data.displayName,
        displayIcon: data.data.displayIcon,
        wideArt: data.data.wideArt,
        largeArt: data.data.largeArt
    };
} catch (error) {
    return "An error occured";
}
}
export {
    getPlayerTitles,
    getPlayerCards
}