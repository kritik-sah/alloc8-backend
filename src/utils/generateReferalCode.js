import User from "../models/user.models.js"; // Import your User model

async function generateReferralCode() {
  const length = 6;
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let referralCode = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    referralCode += characters.charAt(randomIndex);
  }

  return referralCode;
}

export async function generateUniqueReferralCode() {
  let referralCode;
  let isUnique = false;

  while (!isUnique) {
    referralCode = await generateReferralCode();
    const checkReferralCode = await User.findOne({ referralCode });

    if (!checkReferralCode) {
      isUnique = true;
    }
  }

  return referralCode;
}
