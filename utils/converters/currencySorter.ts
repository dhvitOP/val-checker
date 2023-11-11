import currency from '../../constants/currencies.json';

async function sortKeys(bal: object) {
    const currencies = [];
    currency.data.forEach(data => {
        for (const key in bal) {
            if (data.uuid == key) {
                currencies.push({
                    name: data.displayName,
                    image: data.displayIcon,
                    amount: bal[key]
                })
            }
        }
    });
    return currencies;
}
export default sortKeys;