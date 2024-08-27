import asyncHandler from "express-async-handler";
import Reward from "../models/rewardModel.js";
import User from "../models/userModel.js";

//User can add a review for a relevant driver
//User can add a review for a relevant driver
const addReview = asyncHandler(async (req, res) => {
  const { driverId, rating, comment } = req.body;
  const userId = req.user._id;

  let reward = await Reward.findOne({ driverId });

  if (!reward) {
    // If no reward entry exists for the driver, create one
    reward = new Reward({
      driverId,
      reviews: [{ userId, rating, comment }],
    });
  } else {
    reward.reviews.push({ userId, rating, comment });
  }

  reward.calculateTotalPoints();
  await reward.save();
  res.status(201).json({ message: "Review added successfully" });
});



export { addReview };
