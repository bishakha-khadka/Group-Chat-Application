import mongoose from "mongoose";
import { database, mongoURI } from "./constant.js";

let connectToMongoDB = async () => {
  try {
    await mongoose.connect(`${mongoURI}`);
    console.log(`application is connected to mongodB database successfully`);
  } catch (error) {
    console.log(error.message);
  }
};

export default connectToMongoDB;
