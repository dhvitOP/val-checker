import tiers from '../../constants/tiers.json';

async function getImage(rank: string) {
    const image = tiers.data[0].tiers.filter((tier: any) => tier.tierName.toLowerCase() == rank.toLowerCase() );
    //console.log(image);
    /* tiers.data[0].tiers.forEach((tier: any) => {
        console.log(tier.tierName.toLowerCase());
        if(tier.tierName.toLowerCase() == rank.toLowerCase()) {
            console.log(tier.largeIcon);
            return tier.largeIcon
        }
    }); */
    return image[0].largeIcon;
}
export default getImage;