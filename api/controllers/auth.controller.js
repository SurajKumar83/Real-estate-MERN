import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  //   to encrypt the password
  const hashedPassword = bcryptjs.hashSync(password, 10);

  const newUser = new User({ username, email, password: hashedPassword });
  try {
    await newUser.save();
    res.status(201).json("User Created Successfully!");
  } catch (err) {
    next(err);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body; // get the email and password from the frontend
  try {
    const validUser = await User.findOne({ email });// get the user from the db on the basis of the email
    if (!validUser) {// if user is not found
      return next(errorHandler(404, "User not found"));// call the error handler middleware
    }
    const validPassword = bcryptjs.compareSync(password, validUser.password);// this will check the password against the validuser in decrypted form by bcryptjs
    if (!validPassword) {// check the password against the validuser in decrypted form
      return next(errorHandler(401, "Wrong Credentials!"));// call the error handler middleware
    }
    // this will generate the jwt authentication token for the user in encrypted form
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    // this code will remove the password before sending to the user
    const {password:pass,...rest}=validUser._doc;
    // save this token as cookie in browser
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (err) {
    next(err);
  }
};
