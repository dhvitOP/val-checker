import mongoose from 'mongoose'
let hm = new mongoose.Schema({
    accID: { type: String, required: true },
    skins: { type: Object, required: false },
    level: { type: Number, required: false },
    xp: { type: Number, required: false },
    history: { type: Array, required: false },
    sprays: { type: Array, required: false },
    equippedSkins: { type: Object, required: false },
});
export default mongoose.model("loadout", hm);