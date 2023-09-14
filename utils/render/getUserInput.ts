import fs from 'fs';
async function getScript(token: string, cookies:string) {
    console.log(token)
    let script = fs.readFileSync("./utils/render/userInputScript.html","utf-8");
    script = script.replace(/\{token\}/g,token);
    script = script.replace(/\{cookies\}/g,cookies);
    return script;
}
export default getScript;