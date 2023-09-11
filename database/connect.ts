const mongoose = require("mongoose");
const config = require("../constants/config.json");
export default async() => {
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
}