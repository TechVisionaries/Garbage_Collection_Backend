import asyncHandler from "express-async-handler";
import Reward from "../models/rewardModel.js";
import User from "../models/userModel.js";

//User can add a review for a relevant driver
const addReview = asyncHandler(async (req, res) => {
  const { driverId, rating, comment } = req.body;
  const userId = req.user._id;

  const reward = await Reward.findOne({ driverId });

  if (reward) {
    reward.reviews.push({ userId, rating, comment });
    reward.calculateTotalPoints();
    await reward.save();
    res.status(201).json({ message: "Review added successfully" });
  } else {
    res.status(404).json({ message: "Driver not found" });
  }
});


export { addReview };
