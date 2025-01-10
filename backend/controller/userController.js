import bcrypt from "bcrypt";
import { User } from "../schema/model.js";
import jwt from "jsonwebtoken";
import { secretKey } from "../constant.js";

export let createUser = async (req, res) => {
  let userData = req.body;
  let password = userData.password;

  try {
    let hashedpassword = await bcrypt.hash(password, 10);
    userData.password = hashedpassword;
    let users = await User.create(userData);
    res.status(201).json({
      success: true,
      message: "user created successfully",
      result: users,
    });
  } catch (error) {
    res.status(409).json({
      success: false,
      message: error.message,
    });
  }
};

export let readUserDetails = async (req, res) => {
  let userID = req.params.userId;
  try {
    let result = await User.findById(userID);
    res.status(200).json({
      success: true,
      message: "userData read successfully",
      result: {
        ...result._doc,
        fullName: `${result.firstName} ${result.lastName}`,
      },
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export let loginUser = async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  try {
    let user = await User.findOne({ email: email });
    let hashPassword = user.password; //hashed password stored in the database
    if (user === null) {
      res.status(401).json({
        success: false,
        message: "Email or password does not match. ",
      });
    } else {
      let isValidUser = await bcrypt.compare(password, hashPassword);
      if (isValidUser) {
        //generate token

        let infoObj = {
          id: user._id,
        };

        let expiryInfo = {
          expiresIn: "365d",
        };
        let token = jwt.sign(infoObj, secretKey, expiryInfo);

        let { password: pass, ...rest } = user._doc;
        let updatedUser = { ...rest, token };

        res.cookie("access_token", token, { httpOnly: true }).status(201).json({
          success: true,
          message: "user logged in successfully",
          result: updatedUser,
        });
      } else {
        res.status(401).json({
          success: false,
          message: "Email or password does not match.",
        });
      }
    }
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export let logoutUser = async (req, res) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json("User has been logged out.");
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
