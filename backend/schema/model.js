import { model } from "mongoose";
import messageSchema from "./messageSchema.js";
import userSchema from "./userSchema.js";
import roomSchema from "./roomSchema.js";

export let Message = model("Message", messageSchema);
export let User = model("User", userSchema);
export let Room = model("Room", roomSchema);
