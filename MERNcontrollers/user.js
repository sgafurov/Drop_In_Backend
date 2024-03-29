// controller has all the handlers/logic for our routes

import User from "../MERNmodels/user.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  console.log("inside register route", req.body);
  try {
    const user = await User.findOne({ username: req.body.username }); //find the user where the username in the DB is req.body.username
    if (user) {
      throw {
        status: 400,
        message: "An account with this username already exists.",
      };
    }
    const newUser = await User.create(req.body);
    res.status(200).json(newUser);
  } catch (error) {
    console.log(error);
    if (error.status == 400) {
      res.status(400).json(error);
    } else {
      res.status(500).json(error);
    }
  }
};

export const login = async (req, res) => {
  console.log("inside login route ", req.body);
  try {
    const userInfo = await User.findOne({ username: req.body.username });
    console.log("userInfo: ", userInfo);

    if (!userInfo) {
      res.status(400);
      throw { status: 400, message: "This user does not exist." };
    }
    if (userInfo.password != req.body.password) {
      res.status(400);
      throw { status: 400, message: "The password does not match." };
    }
    // create web token
    const token = jwt.sign(userInfo.toJSON(), process.env.JWT_SECRET);

    // res.status(200).json({userInfo, token});
    const userWithToken = {
      _id: userInfo._id,
      username: userInfo.username,
      email: userInfo.email,
      firstname: userInfo.firstname,
      lastname: userInfo.lastname,
      address: userInfo.address,
      user_type: userInfo.user_type,
      createdAt: userInfo.createdAt,
      token,
    };
    console.log("userWithToken: ", userWithToken);
    res.status(200).json(userWithToken);
  } catch (error) {
    if (res.statusCode == 400) {
      res.status(400).json(error);
    } else {
      res.status(500).json(error);
      console.log(error);
    }
  }
};

export const getUserInfo = async (req, res) => {
  console.log("inside getUserInfo route ", req.body);
  try {
    if (!req.user) {
      res.status(403);
      throw { status: 403, message: "Unauthorized" };
      return;
    }
    const userInfo = await User.findById(req.user._id);
    if (!userInfo) {
      res.status(400);
      throw { status: 400, message: "This user does not exist" };
      return;
    }
    res.status(200).json(req.user);
  } catch (error) {
    if (res.statusCode == 400) {
      res.status(400).json(error);
    } else {
      res.status(500).json(error);
    }
  }
};
