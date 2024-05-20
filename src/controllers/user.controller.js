import User from "../models/user.models.js";

export const getUsers = async (req, res) => {
  try {
    const filteredUsers = await User.find()
      .select("-password") // Exclude password field
      .sort({ points: -1 }) // Sort by points in descending order
      .limit(10); // Limit to 10 results

    res.status(200).json(filteredUsers);
  } catch (error) {
    res.status(500).json({ error, message: "error while getting users" });
  }
};
