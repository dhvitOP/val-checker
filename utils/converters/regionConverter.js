const lettersUpdate = require("../../constants/letter_change.json");
const countries = require("../../constants/countries.json");
async function getRegion(country) {
    return countries[lettersUpdate[`${country}`.toUpperCase()]];
}
module.exports = getRegion;