import countries from '../../constants/countries.json';
import lettersUpdate from '../../constants/letter_change.json';
async function getRegion(country:string) {
    return countries[lettersUpdate[`${country}`.toUpperCase() as string] as string];
}
export default getRegion;