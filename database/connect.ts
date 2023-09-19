import mongoose from "mongoose";
import config from "../constants/config.json";
import { applySpeedGooseCacheLayer } from 'speedgoose';


async function connectDB() {
  try {
    await mongoose
  .connect(config.mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: false,
    useCreateIndex: true,
  })
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(error)
  }

  applySpeedGooseCacheLayer(mongoose, {
    redisUri: config.REDIS_URL,
    defaultTtl: 120
});
}
export default connectDB; 