import { Router } from "express";
import { getMessages } from "../controller/messageController.js";

let messageRouter = Router();

messageRouter.get("/", getMessages);

export default messageRouter;
