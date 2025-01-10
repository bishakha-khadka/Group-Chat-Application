import { Router } from "express";
import {
  createRoom,
  getAllRooms,
  getMessagesForRoom,
  getRoomDetails,
} from "../controller/roomController.js";

let roomRouter = Router();

roomRouter.post("/", createRoom);
roomRouter.get("/", getAllRooms);
roomRouter.get("/:roomId/messages", getMessagesForRoom);
roomRouter.get("/:roomId", getRoomDetails);

export default roomRouter;
