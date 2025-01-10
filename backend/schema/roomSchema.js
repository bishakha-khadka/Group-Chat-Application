import { Schema } from "mongoose";

let roomSchema = Schema({
  name: String,
  members: [{ type: Schema.ObjectId, ref: "User" }],
});

export default roomSchema;
