import mongoose, { Document, Model } from 'mongoose'
//import { SpeedGooseCacheAutoCleaner } from 'speedgoose';

interface Account extends Document {
    id: string;
    username: string;
    tag: string;
    region: string;
    email_verified: boolean;
    country: string;
    puuid: string;
    phone_verified: boolean;
    accID: string;
    ent_token: string;
    token: string;
    cookieString: string;
    lastUpdated: number;
}

let hm = new mongoose.Schema({
    id: { type: String, required: true },
    username: { type: String, required: true },
    tag: { type: String, required: true },
    region: { type: String, required: true },
    email_verified: { type: Boolean, required: true },
    country: { type: String, required: true },
    puuid: { type: String, required: true },
    phone_verified: { type: Boolean, required: true },
    accID: { type: String, required: true },
    ent_token: { type: String, required: true },
    cookieString: { type: String, required: true },
    lastUpdated: { type: Number, required: true },
});

//hm.plugin(SpeedGooseCacheAutoCleaner);


export default mongoose.model("account", hm);