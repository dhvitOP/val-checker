import mongoose from "mongoose";
import config from "../constants/config.json";
import fs from "fs";
import path from "path"

async function connectDB() {
  try {
    await mongoose
      .connect(config.mongoUrl, {
      })
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(error)
  }

  const directoryPath = path.join(__dirname, 'schemas');

  fs.readdirSync(directoryPath).forEach(async(file) => {
    const filePath = path.join(directoryPath, file);
    await import(filePath);
    // Do something with the file module
  });

  /*applySpeedGooseCacheLayer(mongoose, {
    redisUri: config.REDIS_URL,
    defaultTtl: 120
  });*/
}
export default connectDB; 
