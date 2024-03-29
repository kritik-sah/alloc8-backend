import bcrypt from "bcryptjs";
import User from "../models/user.models.js";
import { generateUniqueReferralCode } from "../utils/generateReferalCode.js";
import generateTokenAndSetCookie from "../utils/grnerateJWT.js";

export const signIn = async (req, res) => {
  try {
    const { address, password, referredBy } = req.body;

    const referralCode = await generateUniqueReferralCode();

    const user = await User.findOne({ address });
    const referredByUser = await User.findOne({ referralCode: referredBy });

    if (user) {
      const isPasswordCorrect = await bcrypt.compare(
        password,
        user.password || ""
      );
      if (!isPasswordCorrect) {
        res.status(400).json({ error: "Invalid credentials" });
        return;
      }
      generateTokenAndSetCookie(user._id, res);
      const { password: userPassword, ...userDetails } = user._doc;
      res.status(201).json({
        error: null,
        message: "logged in successfully",
        detail: userDetails,
      });
      return;
    }

    // for new users
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      address,
      password: hashedPassword,
      referralCode,
      referredBy: referredByUser?.address || "",
    });

    // Update referredByUser's referredUsers array
    if (referredByUser) {
      await User.updateOne(
        { address: referredByUser.address },
        { $push: { referredUsers: address } }
      );
    }

    await newUser.save(); // its not working how can we fix that
    console.log("newUser", newUser._id);
    generateTokenAndSetCookie(newUser._id, res);

    const { password: userPassword, ...userDetails } = newUser._doc;
    res.status(201).json({
      error: null,
      message: "User created successfully",
      detail: userDetails,
    });
    // for new users
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ error: error });
  }
};

export const logout = (req, res) => {
  try {
    res.clearCookie("jwt");
    res.status(200).json({ error: null, message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: error, message: "Unable to logout user!" });
  }
};
