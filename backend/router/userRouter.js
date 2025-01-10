import { Router } from "express";
import {
  createUser,
  loginUser,
  logoutUser,
  readUserDetails,
} from "../controller/userController.js";

let userRouter = Router();

userRouter.post("/signup", createUser);
userRouter.post("/login", loginUser);
userRouter.get("/logout", logoutUser);
userRouter.get("/:userId", readUserDetails);
export default userRouter;
