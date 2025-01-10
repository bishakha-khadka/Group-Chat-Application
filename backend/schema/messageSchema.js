import { Schema } from "mongoose";

const messageSchema = Schema({
  content: String,
  userId: [
    {
      type: Schema.ObjectId,
      ref: "User",
      default: "",
    },
  ],
  room: [
    {
      type: Schema.ObjectId,
      ref: "Room",
      default: "",
    },
  ],
  timestamp: { type: Date, default: Date.now },
});

export default messageSchema;
